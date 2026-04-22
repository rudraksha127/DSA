import axios from 'axios'

const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358'
const JUDGE0_AUTH = process.env.JUDGE0_AUTH_TOKEN

const LANGUAGE_IDS = {
  cpp:        54,
  java:       62,
  python:     71,
  javascript: 63,
}

const judge0Client = axios.create({
  baseURL: JUDGE0_URL,
  headers: JUDGE0_AUTH ? { 'X-Auth-Token': JUDGE0_AUTH } : {},
})

export const executeCode = async (code, language, stdin = '') => {
  const languageId = LANGUAGE_IDS[language]
  if (!languageId) throw new Error(`Unsupported language: ${language}`)

  const { data: submission } = await judge0Client.post('/submissions', {
    source_code:   Buffer.from(code).toString('base64'),
    language_id:   languageId,
    stdin:         Buffer.from(stdin).toString('base64'),
    base64_encoded: true,
    wait:          false,
  })

  const token = submission.token

  for (let i = 0; i < 20; i++) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const { data: result } = await judge0Client.get(`/submissions/${token}`, {
      params: { base64_encoded: true, fields: 'status,stdout,stderr,compile_output,time,memory' },
    })

    if (result.status.id > 2) {
      return {
        status:        result.status.description,
        statusId:      result.status.id,
        stdout:        result.stdout        ? Buffer.from(result.stdout, 'base64').toString()         : '',
        stderr:        result.stderr        ? Buffer.from(result.stderr, 'base64').toString()         : '',
        compileOutput: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '',
        runtime:       parseFloat(result.time) * 1000 || 0,
        memory:        result.memory || 0,
      }
    }
  }

  throw new Error('Judge0 timeout: execution took too long')
}

export const runTestCases = async (code, language, testCases) => {
  const results = []
  for (const tc of testCases) {
    try {
      const result = await executeCode(code, language, tc.input)
      const got      = result.stdout.trim()
      const expected = tc.output.trim()
      results.push({
        passed:        got === expected,
        input:         tc.input,
        expected,
        got,
        runtime:       result.runtime,
        stderr:        result.stderr,
        compileOutput: result.compileOutput,
        status:        result.status,
      })
    } catch (err) {
      results.push({
        passed:   false,
        input:    tc.input,
        expected: tc.output.trim(),
        got:      '',
        runtime:  0,
        stderr:   err.message,
        status:   'Error',
      })
    }
  }
  return results
}
