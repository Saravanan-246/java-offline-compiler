const Header = ({ status, lastRun }) => {
  const statusLabel =
    status === "running"
      ? "Running"
      : status === "success"
      ? "Success"
      : status === "error"
      ? "Error"
      : "Idle"

  return (
    <header className="app-header">
      {/* Left: App Identity */}
      <div className="header-left">
        <span className="app-title">Java Offline Compiler</span>
        <span className="app-subtitle">Local JDK</span>
      </div>

      {/* Right: Status Info */}
      <div className="header-right">
        <div className={`compiler-status ${status}`}>
          <span className="status-dot" />
          <span className="status-text">{statusLabel}</span>
        </div>

        <div className="last-run">
          Last run: {lastRun || "—"}
        </div>
      </div>
    </header>
  )
}

export default Header
