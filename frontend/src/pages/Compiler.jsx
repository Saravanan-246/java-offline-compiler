import { useState, useEffect } from "react"

import Header from "../components/Header"
import Sidebar from "../Sidebar/Sidebar"
import CodeEditor from "../components/CodeEditor"
import Terminal from "../terminal/Terminal"

import {
  createInitialTree,
  generateJavaTemplate
} from "../Sidebar/useFileTree"

import {
  runJavaCode,
  handleTerminalCommand
} from "../handlers/compilerHandler"

const Compiler = () => {
  const [theme, setTheme] = useState("dark")
  const toggleTheme = () =>
    setTheme(t => (t === "dark" ? "light" : "dark"))

  const [tree, setTree] = useState(() => {
    const t = createInitialTree()
    t.src.children["Main.java"] = {
      type: "file",
      content: generateJavaTemplate("Main.java", ["src"])
    }
    return t
  })

  const [activeFile, setActiveFile] = useState("src/Main.java")
  const [code, setCode] = useState("")

  useEffect(() => {
    if (!activeFile) return

    const parts = activeFile.split("/")
    let node = tree

    for (const part of parts) {
      if (!node[part]) return
      node = node[part]
      if (node.type === "folder") node = node.children
    }

    if (node.type === "file") setCode(node.content || "")
  }, [activeFile, tree])

  const updateCode = (value) => {
    setCode(value)

    setTree(prev => {
      const copy = structuredClone(prev)
      const parts = activeFile.split("/")
      let node = copy

      for (let i = 0; i < parts.length; i++) {
        const key = parts[i]
        if (!node[key]) return copy

        if (i === parts.length - 1) {
          node[key].content = value
        } else {
          node = node[key].children
        }
      }

      return copy
    })
  }

  const [terminal, setTerminal] = useState("")
  const [status, setStatus] = useState("idle")
  const [lastRun, setLastRun] = useState(null)
  const [input, setInput] = useState("")
  const [cwd, setCwd] = useState("/src")

  const runCode = () => {
    runJavaCode({
      code,
      input,
      status,
      setStatus,
      setTerminal,
      setLastRun,
      setInput
    })
  }

  const handleEnter = () => {
    const value = input.trim()
    if (!value) return

    if (status === "running") {
      setTerminal(t => t + `\n${value}`)
      setInput("")
      return
    }

    setTerminal(t => t + `\n${cwd} $ ${value}`)

    handleTerminalCommand({
      command: value,
      status,
      cwd,
      tree,
      setCwd,
      setTerminal,
      setInput
    })

    setInput("")
  }

  return (
    <div className={`compiler-app ${theme}`}>
      <Header status={status} lastRun={lastRun} />

      <div className="action-bar">
        <button
          className="run-btn"
          onClick={runCode}
          disabled={status === "running"}
        >
          ▶ Run
        </button>

        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>

      <div className="main-section">
        <Sidebar
          tree={tree}
          setTree={setTree}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
        />

        <div className="editor-wrapper">
          <CodeEditor
            code={code}
            setCode={updateCode}
            status={status}
            onRun={runCode}
            theme={theme}
          />
        </div>
      </div>

      <Terminal
        logs={terminal}
        status={status}
        input={input}
        setInput={setInput}
        onEnter={handleEnter}
        cwd={cwd}
      />
    </div>
  )
}

export default Compiler
