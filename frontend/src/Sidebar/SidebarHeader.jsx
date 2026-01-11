import { memo, useCallback } from "react"
import { VscNewFile, VscNewFolder, VscFiles } from "react-icons/vsc"
import { addItem } from "./useFileTree"

const isValidName = (name) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(name)

const SidebarHeader = ({ setTree, currentPath, onFileCreated }) => {

  const newFile = useCallback(() => {
    let name = prompt("File name (Ex: Test.java)")
    if (!name) return

    if (!name.endsWith(".java")) name += ".java"

    const className = name.replace(".java", "")
    if (!isValidName(className)) {
      alert("Invalid Java class name")
      return
    }

    // ✅ ONLY update tree here
    setTree(prev => addItem(prev, currentPath, name, "file"))

    // ✅ notify parent AFTER tree update
    onFileCreated([...currentPath, name].join("/"))
  }, [setTree, currentPath, onFileCreated])

  const newFolder = useCallback(() => {
    const name = prompt("Folder name")
    if (!name) return
    if (!isValidName(name)) {
      alert("Invalid folder name")
      return
    }

    setTree(prev => addItem(prev, currentPath, name, "folder"))
  }, [setTree, currentPath])

  return (
    <div className="explorer-header">
      <div className="explorer-title">
        <VscFiles />
        <span>Code</span>
      </div>

      <div className="explorer-actions">
        <button type="button" title="New File" onClick={newFile}>
          <VscNewFile />
        </button>
        <button type="button" title="New Folder" onClick={newFolder}>
          <VscNewFolder />
        </button>
      </div>
    </div>
  )
}

export default memo(SidebarHeader)
