const TerminalHeader = ({ status }) => {
  const label =
    status === "running"
      ? "Running"
      : status === "success"
      ? "Success"
      : status === "error"
      ? "Error"
      : "Idle"

  return (
    <div className="terminal-header">
      <span className="terminal-title">TERMINAL</span>

      <span className={`terminal-status ${status}`}>
        {label}
      </span>
    </div>
  )
}

export default TerminalHeader
