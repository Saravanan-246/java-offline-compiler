import { useEffect, useRef } from "react"

const TerminalBody = ({ logs }) => {
  const endRef = useRef(null)

  // Auto-scroll when logs change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  return (
    <pre className="terminal-output">
      {logs && logs.trim() ? logs : "Ready."}
      <span ref={endRef} />
    </pre>
  )
}

export default TerminalBody
