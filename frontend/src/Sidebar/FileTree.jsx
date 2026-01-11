import React from "react"
import TreeItem from "./TreeItem"

const FileTree = ({
  tree = {},
  setTree,
  activeFile,
  setActiveFile,
  setCurrentPath
}) => {
  const entries = Object.entries(tree)

  if (entries.length === 0) {
    return <div className="file-tree empty">No files</div>
  }

  return (
    <div className="file-tree">
      {entries.map(([name, node]) => (
        <TreeItem
          key={name}
          name={name}
          node={node}
          path={[name]}
          setTree={setTree}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          setCurrentPath={setCurrentPath}
        />
      ))}
    </div>
  )
}

export default FileTree
