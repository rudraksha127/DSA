import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const JUDGE0_URL = process.env.JUDGE0_URL
const JUDGE0_AUTH_TOKEN = process.env.JUDGE0_AUTH_TOKEN

const LANGUAGE_IDS = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
}

export const submitCode = async (code, language, testCases) => {
  const languageId = LANGUAGE_IDS[language]
  if (!languageId) throw new Error(`Unsupported language: ${language}`)

  const results = []
  for (const tc of testCases) {
    try {
      const { data } = await axios.post(
        `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: languageId,
          stdin: tc.input,
          expected_output: tc.output,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(JUDGE0_AUTH_TOKEN ? { 'X-Auth-Token': JUDGE0_AUTH_TOKEN } : {}),
          },
          timeout: 10000,
        }
      )

      const passed = data.status?.id === 3 // Accepted
      results.push({
        passed,
        input: tc.input,
        expected: tc.output,
        got: data.stdout?.trim() || data.stderr?.trim() || '',
        runtime: parseFloat(data.time) * 1000 || 0, // ms
        memory: data.memory || 0, // KB
        status: data.status?.description || 'Unknown',
      })
    } catch (err) {
      results.push({
        passed: false,
        input: tc.input,
        expected: tc.output,
        got: '',
        runtime: 0,
        memory: 0,
        status: 'Error',
      })
    }
  }
  return results
}
