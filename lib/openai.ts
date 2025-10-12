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

Sample Data (first 3 rows):
${JSON.stringify(sampleRows.slice(0, 3), null, 2)}

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

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const insights = JSON.parse(content) as AIInsight[];
    return insights;
  } catch (error) {
    console.error('OpenAI API error:', error);
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
