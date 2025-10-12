import OpenAI from 'openai';

// Initialize OpenAI client lazily to avoid build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing OPENAI_API_KEY environment variable. Please add it to your .env file.');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export interface AIInsight {
  type: 'trend' | 'anomaly' | 'recommendation' | 'summary';
  title: string;
  description: string;
  confidence: number;
  data?: Record<string, unknown>;
}

// Helper to truncate long text values for AI processing
function truncateRowValues(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map(row => {
    const truncatedRow: Record<string, unknown> = {};
    Object.entries(row).forEach(([key, value]) => {
      if (typeof value === 'string' && value.length > 200) {
        truncatedRow[key] = value.substring(0, 200) + '... [truncated]';
      } else {
        truncatedRow[key] = value;
      }
    });
    return truncatedRow;
  });
}

export async function generateDatasetInsights(
  datasetName: string,
  summary: {
    totalRows: number;
    totalColumns: number;
    numericColumns: string[];
    textColumns: string[];
  },
  statistics: Record<string, { min: number; max: number; avg: number; sum: number }>,
  sampleRows: Record<string, unknown>[]
): Promise<AIInsight[]> {
  // Truncate long text values to prevent token overflow
  const truncatedSamples = truncateRowValues(sampleRows.slice(0, 3));
  
  const prompt = `You are a data analyst AI. Analyze this dataset and provide actionable insights.

Dataset: ${datasetName}
Total Rows: ${summary.totalRows}
Total Columns: ${summary.totalColumns}

Numeric Columns & Statistics:
${Object.entries(statistics)
  .map(([col, stats]) => `- ${col}: min=${stats.min.toFixed(2)}, max=${stats.max.toFixed(2)}, avg=${stats.avg.toFixed(2)}`)
  .join('\n')}

Text/Category Columns:
${summary.textColumns.join(', ') || 'None'}

Sample Data (first 3 rows, long text truncated):
${JSON.stringify(truncatedSamples, null, 2)}

Please provide 4-6 insights in the following JSON format:
[
  {
    "type": "trend|anomaly|recommendation|summary",
    "title": "Brief title",
    "description": "Detailed explanation (2-3 sentences)",
    "confidence": 0.0-1.0
  }
]

Focus on:
1. Key trends in the data
2. Notable anomalies or outliers
3. Actionable recommendations
4. Overall data quality assessment

Return ONLY the JSON array, no additional text.`;

  try {
    const openai = getOpenAI();
    console.log('[OpenAI] Sending request to GPT-4o-mini...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a data analysis expert. Provide insights in JSON format only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    console.log('[OpenAI] Received response from API');
    const content = completion.choices[0].message.content;
    
    if (!content) {
      console.error('[OpenAI] Empty response content');
      throw new Error('No response from OpenAI');
    }

    console.log('[OpenAI] Response length:', content.length);
    console.log('[OpenAI] Response preview:', content.substring(0, 200));

    // Parse the JSON response
    let insights: AIInsight[];
    try {
      insights = JSON.parse(content) as AIInsight[];
    } catch (parseError) {
      console.error('[OpenAI] JSON parse error:', parseError);
      console.error('[OpenAI] Raw content:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    if (!Array.isArray(insights)) {
      console.error('[OpenAI] Response is not an array:', typeof insights);
      throw new Error('AI response is not in the expected format');
    }

    console.log('[OpenAI] Successfully parsed', insights.length, 'insights');
    return insights;
  } catch (error) {
    console.error('[OpenAI] Full error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate insights');
  }
}

export async function generateChatResponse(
  message: string,
  datasetContext: {
    name: string;
    summary: Record<string, unknown>;
    statistics: Record<string, unknown>;
  }
): Promise<string> {
  const prompt = `You are an AI assistant helping analyze a dataset called "${datasetContext.name}".

Dataset Summary:
${JSON.stringify(datasetContext.summary, null, 2)}

Key Statistics:
${JSON.stringify(datasetContext.statistics, null, 2)}

User Question: ${message}

Provide a helpful, concise answer based on the dataset context. If the question is unclear or not related to the dataset, politely guide the user.`;

  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant specializing in data analysis. Provide clear, actionable answers.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content || 'I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate chat response');
  }
}
