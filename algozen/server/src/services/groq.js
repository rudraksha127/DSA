import Groq from 'groq-sdk'

const groqApiKey = process.env.GROQ_API_KEY
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null

export const getHint = async (problem, code, userMessage = '') => {
  if (!groq) {
    return 'AI hints are currently unavailable (missing GROQ_API_KEY).'
  }
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

export const getReview = async (problem, code) => {
  if (!groq) {
    return 'AI reviews are currently unavailable (missing GROQ_API_KEY).'
  }
  const systemPrompt = `You are AlgoZen AI, an expert code reviewer.
Review the student's code for correctness, efficiency, style, and best practices.
Be constructive, specific, and concise. Highlight both strengths and areas for improvement.`

  const userPrompt = `Problem: ${problem.title}
Description: ${problem.description}

Student's code (${code.language}):
\`\`\`
${code.content}
\`\`\`

Please review this code and provide actionable feedback.`

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    model: 'llama3-8b-8192',
    max_tokens: 600,
  })

  return completion.choices[0]?.message?.content || 'Sorry, I could not generate a review.'
}
