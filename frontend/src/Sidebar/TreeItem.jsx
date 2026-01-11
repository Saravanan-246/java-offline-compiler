import React, { memo } from "react"
import {
  VscChevronDown,
  VscChevronRight,
  VscFile,
  VscFolder,
  VscTrash
} from "react-icons/vsc"
import { DiJava } from "react-icons/di"
import { toggleFolder, deleteItem } from "./useFileTree"

const TreeItem = ({
  name,
  node,
  path,
  setTree,
  activeFile,
  setActiveFile,
  setCurrentPath
}) => {
  if (!node) return null

  const isFolder = node.type === "folder"
  const fullPath = path.join("/")
  const children = node.children || {}

  const handleDelete = () => {
    if (!confirm(`Delete "${name}" ?`)) return

    setTree(prev => deleteItem(prev, path))

    // if deleted file was open → reset editor
    if (activeFile === fullPath) {
      setActiveFile(null)
    }
  }

  if (isFolder) {
    return (
      <>
        <div className="folder">
          <span onClick={() => {
            setCurrentPath(path)
            setTree(prev => toggleFolder(prev, path))
          }}>
            {node.open ? <VscChevronDown /> : <VscChevronRight />}
            <VscFolder />
            {name}
          </span>

          <button className="delete-btn" onClick={handleDelete}>
            <VscTrash />
          </button>
        </div>

        {node.open &&
          Object.entries(children).map(([child, childNode]) => (
            <TreeItem
              key={child}
              name={child}
              node={childNode}
              path={[...path, child]}
              setTree={setTree}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              setCurrentPath={setCurrentPath}
            />
          ))}
      </>
    )
  }

  return (
    <div className={`file ${activeFile === fullPath ? "active" : ""}`}>
      <span onClick={() => setActiveFile(fullPath)}>
        {name.endsWith(".java")
          ? <DiJava color="#f89820" />
          : <VscFile />}
        {name}
      </span>

      <button className="delete-btn" onClick={handleDelete}>
        <VscTrash />
      </button>
    </div>
  )
}

export default memo(TreeItem)
