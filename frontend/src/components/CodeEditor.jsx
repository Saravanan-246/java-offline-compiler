import { useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"

const CodeEditor = ({ code, setCode, status, onRun, theme }) => {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const themesLoaded = useRef(false)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // ===== DEFINE THEMES ONLY ONCE =====
    if (!themesLoaded.current) {
      /* ===== LITE DARK THEME (SOFT, NO BLUE) ===== */
      monaco.editor.defineTheme("gpt-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "9aa4b2" },
          { token: "keyword", foreground: "34d399" },
          { token: "string", foreground: "86efac" },
          { token: "number", foreground: "7dd3fc" },
          { token: "type", foreground: "5eead4" }
        ],
        colors: {
          /* Backgrounds */
          "editor.background": "#0b1220",
          "editor.foreground": "#e5e7eb",

          /* Line numbers */
          "editorLineNumber.foreground": "#64748b",
          "editorLineNumber.activeForeground": "#e5e7eb",

          /* Cursor */
          "editorCursor.foreground": "#34d399",

          /* Selection */
          "editor.selectionBackground": "#0f766e",
          "editor.inactiveSelectionBackground": "#134e4a",

          /* Line highlight */
          "editor.lineHighlightBackground": "#0f172a",

          /* Scrollbar */
          "scrollbarSlider.background": "#1f2937",
          "scrollbarSlider.hoverBackground": "#374151",
          "scrollbarSlider.activeBackground": "#4b5563",

          /* Gutter & ruler */
          "editorGutter.background": "#0b1220",
          "editorOverviewRuler.background": "#0b1220"
        }
      })

      /* ===== LIGHT THEME ===== */
      monaco.editor.defineTheme("gpt-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "comment", foreground: "64748b" },
          { token: "keyword", foreground: "15803d" },
          { token: "string", foreground: "166534" },
          { token: "number", foreground: "0369a1" }
        ],
        colors: {
          "editor.background": "#ffffff",
          "editor.foreground": "#0f172a",
          "editorLineNumber.foreground": "#94a3b8",
          "editorCursor.foreground": "#16a34a",
          "editor.selectionBackground": "#bbf7d0",
          "editor.lineHighlightBackground": "#f8fafc"
        }
      })

      themesLoaded.current = true
    }

    // ===== APPLY THEME =====
    monaco.editor.setTheme(theme === "dark" ? "gpt-dark" : "gpt-light")

    // ===== CTRL / CMD + ENTER TO RUN =====
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => onRun()
    )
  }

  // ===== HANDLE THEME SWITCH =====
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(
        theme === "dark" ? "gpt-dark" : "gpt-light"
      )
    }
  }, [theme])

  return (
    <div className={`editor-container ${status === "running" ? "disabled" : ""}`}>
      <Editor
        height="100%"
        language="java"
        value={code}
        onChange={(value) => setCode(value ?? "")}
        onMount={handleEditorDidMount}
        theme={theme === "dark" ? "gpt-dark" : "gpt-light"}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: status === "running",
          tabSize: 2,
          renderLineHighlight: "line"
        }}
      />
    </div>
  )
}

export default CodeEditor
