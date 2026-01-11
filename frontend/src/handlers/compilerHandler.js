export const runJavaCode = async ({
  code,
  input,
  status,
  setStatus,
  setTerminal,
  setLastRun,
  setInput
}) => {
  if (!code.trim() || status === "running") return

  // Detect programs that need input
  const needsInput =
    code.includes("Scanner") ||
    code.includes("BufferedReader") ||
    code.includes("System.in")

  if (needsInput && !input.trim()) {
    setTerminal(
      "Program expects input.\nEnter input in terminal BEFORE clicking Run.\n"
    )
    setStatus("error")
    return
  }

  setStatus("running")
  setTerminal("Compiling...\n")

  try {
    const res = await fetch("http://localhost:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        input: input.trim()
      })
    })

    if (!res.ok) throw new Error("Server error")

    const data = await res.json()

    setTerminal(prev =>
      prev +
      (data.output && data.output.trim()
        ? data.output
        : "\nProcess finished with no output.")
    )

    setStatus(data.status === "success" ? "success" : "error")
    setLastRun(new Date().toLocaleTimeString())
    setInput("")
  } catch {
    setTerminal(
      "Failed to connect to backend.\nMake sure backend is running.\n"
    )
    setStatus("error")
  }
}

export const handleTerminalCommand = ({
  command,
  status,
  cwd,
  tree,
  setCwd,
  setTerminal,
  setInput
}) => {
  const value = command.trim()
  if (!value) return

  // If program already running → treat as program input (buffered)
  if (status === "running") {
    setInput(prev => (prev ? prev + "\n" + value : value))
    return
  }

  const args = value.split(" ")
  const cmd = args[0]

  if (cmd === "pwd") {
    setTerminal(t => t + `\n${cwd}`)
    return
  }

  if (cmd === "ls") {
    const parts = cwd.split("/").filter(Boolean)
    let node = tree

    for (const p of parts) {
      if (!node[p] || node[p].type !== "folder") {
        setTerminal(t => t + `\nPath not found`)
        return
      }
      node = node[p].children
    }

    setTerminal(t => t + "\n" + Object.keys(node).join("  "))
    return
  }

  if (cmd === "cd") {
    const target = args[1]

    if (!target || target === "/") {
      setCwd("/")
      return
    }

    if (target === "..") {
      setCwd(cwd.split("/").slice(0, -1).join("/") || "/")
      return
    }

    const newPath = target.startsWith("/")
      ? target
      : `${cwd}/${target}`

    const parts = newPath.split("/").filter(Boolean)
    let node = tree

    for (const p of parts) {
      if (!node[p]) {
        setTerminal(
          t => t + `\ncd: no such file or directory: ${target}`
        )
        return
      }

      if (node[p].type === "file") {
        setTerminal(
          t => t + `\ncd: not a directory: ${target}`
        )
        return
      }

      node = node[p].children
    }

    setCwd("/" + parts.join("/"))
    return
  }

  if (cmd === "cls" || cmd === "clear") {
    setTerminal("")
    return
  }

  setTerminal(t => t + `\ncommand not found: ${cmd}`)
}
