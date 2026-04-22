import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const getHint = async (problem, code, hintLevel = 1) => {
  const prompt = hintLevel === 1
    ? `Give a very brief conceptual hint (1-2 sentences, NO code) for this problem without revealing the solution:\n\nProblem: ${problem.title}\n${problem.description}\n\nUser's code:\n${code || 'Not written yet'}`
    : `Give a more detailed algorithmic hint with approach but NO direct solution code for:\n\nProblem: ${problem.title}\n${problem.description}\n\nUser's code:\n${code}`

  const completion = await groq.chat.completions.create({
    model:    'llama3-8b-8192',
    messages: [
      { role: 'system', content: 'You are AlgoGuru, an expert DSA tutor. Be concise, encouraging, and never give away the full solution directly. Always end with a motivating line.' },
      { role: 'user',   content: prompt },
    ],
    max_tokens:  300,
    temperature: 0.7,
  })

  return completion.choices[0].message.content
}

export const reviewCode = async (problem, code, language) => {
  const completion = await groq.chat.completions.create({
    model:    'llama3-8b-8192',
    messages: [
      { role: 'system', content: 'You are AlgoGuru, an expert code reviewer. Review code for correctness, time/space complexity, and suggest improvements. Be concise and structured.' },
      { role: 'user',   content: `Review this ${language} solution for "${problem.title}":\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide: 1) Correctness analysis 2) Time/Space complexity 3) Improvements` },
    ],
    max_tokens:  500,
    temperature: 0.3,
  })

  return completion.choices[0].message.content
}

export const explainSolution = async (problem, code, language) => {
  const completion = await groq.chat.completions.create({
    model:    'llama3-8b-8192',
    messages: [
      { role: 'system', content: 'You are AlgoGuru. Explain the solution approach clearly for a student.' },
      { role: 'user',   content: `Explain this solution to "${problem.title}" in simple terms:\n\n\`\`\`${language}\n${code}\n\`\`\`` },
    ],
    max_tokens:  400,
    temperature: 0.5,
  })

  return completion.choices[0].message.content
}
