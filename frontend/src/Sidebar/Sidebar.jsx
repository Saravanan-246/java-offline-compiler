import { useState } from "react"
import SidebarHeader from "./SidebarHeader"
import FileTree from "./FileTree"

const Sidebar = ({ tree, setTree, activeFile, setActiveFile }) => {
  const [currentPath, setCurrentPath] = useState(["src"])

  return (
    <aside className="sidebar">
      <SidebarHeader
        setTree={setTree}
        currentPath={currentPath}
        onFileCreated={setActiveFile}   // ✅ callback, not direct state mutation
      />

      <FileTree
        tree={tree}
        setTree={setTree}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        setCurrentPath={setCurrentPath}
      />
    </aside>
  )
}

export default Sidebar
