import { useEffect, useRef } from "react"

const Terminal = ({ logs, input, setInput, onEnter, status, cwd }) => {
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  useEffect(() => {
    inputRef.current?.focus()
  }, [status])

  return (
    <div className="vscode-terminal">
      <div className="terminal-tabbar">
        <span className="tab active">Terminal</span>
      </div>

      <div className="terminal-body">
        <pre className="terminal-output">
          {logs || "Ready."}
        </pre>

        <div className="terminal-prompt">
          <span className="prompt-symbol">
            {status === "running" ? ">" : `${cwd} $`}
          </span>

          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault()
                onEnter()
              }
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        <div ref={endRef} />
      </div>
    </div>
  )
}

export default Terminal
