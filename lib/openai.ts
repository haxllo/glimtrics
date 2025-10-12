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
  
  const prompt = `You are an expert data analyst. Analyze this dataset and provide SPECIFIC, ACTIONABLE insights with real numbers.

Dataset: ${datasetName}
Total Rows: ${summary.totalRows}
Total Columns: ${summary.totalColumns}

Numeric Columns & Statistics:
${Object.entries(statistics)
  .map(([col, stats]) => `- ${col}: min=${stats.min.toFixed(2)}, max=${stats.max.toFixed(2)}, avg=${stats.avg.toFixed(2)}, sum=${stats.sum.toFixed(2)}`)
  .join('\n')}

Text/Category Columns:
${summary.textColumns.join(', ') || 'None'}

Sample Data (first 3 rows):
${JSON.stringify(truncatedSamples, null, 2)}

IMPORTANT INSTRUCTIONS:
1. Provide SPECIFIC insights using ACTUAL NUMBERS from the statistics
2. Compare metrics (e.g., "X is 2.5x higher than Y")
3. Identify concrete patterns (e.g., "75% of values are below 100")
4. Give ACTIONABLE recommendations (e.g., "Focus on improving X by 20%")
5. Use domain knowledge based on column names

Return ONLY a JSON object with an "insights" array (no markdown, no explanations):
{
  "insights": [
    {
      "type": "trend|anomaly|recommendation|summary",
      "title": "Specific insight with numbers",
      "description": "Detailed analysis with actual metrics and percentages (2-3 sentences). Include specific values.",
      "confidence": 0.85
    }
  ]
}

Provide exactly 5 insights. Return ONLY the JSON object.`;

  try {
    const openai = getOpenAI();
    console.log('[OpenAI] Sending request to GPT-4o-mini...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a data analysis expert. You MUST respond with ONLY valid JSON. No markdown, no explanations, no code blocks. Return a JSON object with an "insights" array containing exactly 5 insight objects.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5, // Lower temperature for more consistent JSON
      max_tokens: 2000, // More tokens for detailed insights
      response_format: { type: "json_object" }, // Force JSON response
    });

    console.log('[OpenAI] Received response from API');
    const content = completion.choices[0].message.content;
    
    if (!content) {
      console.error('[OpenAI] Empty response content');
      throw new Error('No response from OpenAI');
    }

    console.log('[OpenAI] Response length:', content.length);
    console.log('[OpenAI] Response preview:', content.substring(0, 200));

    // Clean the response - remove markdown code blocks if present
    let cleanedContent = content.trim();
    
    // Remove ```json and ``` markers
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    
    cleanedContent = cleanedContent.trim();
    console.log('[OpenAI] Cleaned content preview:', cleanedContent.substring(0, 200));

    // Parse the JSON response
    let insights: AIInsight[];
    try {
      const parsed = JSON.parse(cleanedContent) as { insights?: AIInsight[] } | AIInsight[];
      
      // Handle both object with "insights" key and direct array
      if (Array.isArray(parsed)) {
        insights = parsed;
      } else if (parsed.insights && Array.isArray(parsed.insights)) {
        insights = parsed.insights;
      } else {
        throw new Error('Response does not contain valid insights array');
      }
    } catch (parseError) {
      console.error('[OpenAI] JSON parse error:', parseError);
      console.error('[OpenAI] Raw content:', content);
      console.error('[OpenAI] Cleaned content:', cleanedContent);
      
      // Try one more time with aggressive cleaning
      try {
        // Find JSON array or object in the response
        const jsonArrayMatch = cleanedContent.match(/\[[\s\S]*\]/);
        const jsonObjectMatch = cleanedContent.match(/\{[\s\S]*\}/);
        
        if (jsonObjectMatch) {
          const parsed = JSON.parse(jsonObjectMatch[0]) as { insights?: AIInsight[] } | AIInsight[];
          if (Array.isArray(parsed)) {
            insights = parsed;
          } else if (parsed.insights && Array.isArray(parsed.insights)) {
            insights = parsed.insights;
          } else {
            throw new Error('No insights array found in object');
          }
          console.log('[OpenAI] Recovered insights from object with regex extraction');
        } else if (jsonArrayMatch) {
          insights = JSON.parse(jsonArrayMatch[0]) as AIInsight[];
          console.log('[OpenAI] Recovered insights from array with regex extraction');
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (secondError) {
        throw new Error('Failed to parse AI response as JSON. The AI returned invalid format.');
      }
    }

    if (!Array.isArray(insights)) {
      console.error('[OpenAI] Response is not an array:', typeof insights);
      throw new Error('AI response is not in the expected format');
    }

    // Validate insights quality
    insights.forEach((insight, idx) => {
      if (!insight.type || !insight.title || !insight.description) {
        console.warn(`[OpenAI] Insight ${idx} missing required fields:`, insight);
      }
      if (!insight.confidence) {
        insight.confidence = 0.7; // Default confidence
      }
    });

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
