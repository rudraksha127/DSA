import Groq from 'groq-sdk'
import dotenv from 'dotenv'
dotenv.config()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const getHint = async (problem, code, userMessage = '') => {
  const systemPrompt = `You are AlgoZen AI, an expert DSA tutor. 
Help students understand and solve coding problems without giving direct answers.
Give hints, point out logical issues, and guide them step by step.
Be encouraging and concise.`

  const userPrompt = `Problem: ${problem.title}
Description: ${problem.description}

Student's current code (${code.language}):
\`\`\`
${code.content}
\`\`\`

Student's question: ${userMessage || 'I need a hint'}

Give a helpful hint without revealing the complete solution.`

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    model: 'llama3-8b-8192',
    max_tokens: 500,
  })

  return completion.choices[0]?.message?.content || 'Sorry, I could not generate a hint.'
}
