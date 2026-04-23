import Editor from '@monaco-editor/react'

const defaultCode = {
  javascript: '// Write your solution here\nfunction solution(input) {\n  \n}\n',
  python: '# Write your solution here\ndef solution(input):\n    pass\n',
  cpp: '// Write your solution here\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  \n  return 0;\n}\n',
  java: '// Write your solution here\npublic class Solution {\n  public static void main(String[] args) {\n    \n  }\n}\n',
}

export default function CodeEditor({ language, value, onChange }) {
  return (
    <div className="h-full rounded-lg overflow-hidden border border-slate-700">
      <Editor
        height="100%"
        language={language === 'cpp' ? 'cpp' : language}
        value={value || defaultCode[language] || ''}
        onChange={onChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
        }}
      />
    </div>
  )
}
