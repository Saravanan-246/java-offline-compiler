export const createInitialTree = () => ({
  src: {
    type: "folder",
    open: true,
    children: {}
  }
})

export const generateJavaTemplate = (fileName, folderPath) => {
  const className = fileName.replace(".java", "")
  const pkgPath = folderPath.slice(1)

  const packageLine =
    pkgPath.length > 0 ? `package ${pkgPath.join(".")};\n\n` : ""

  return `${packageLine}class ${className} {
  public static void main(String[] args) {
    System.out.println("Hello Java");
  }
}`
}

export const addItem = (tree, path, name, type) => {
  const newTree = structuredClone(tree)
  let node = newTree

  for (const p of path) {
    if (!node[p] || node[p].type !== "folder") return newTree
    node = node[p].children
  }

  if (node[name]) return newTree

  if (type === "folder") {
    node[name] = {
      type: "folder",
      open: true,
      children: {}
    }
  }

  if (type === "file") {
    node[name] = {
      type: "file",
      content: generateJavaTemplate(name, path)
    }
  }

  return newTree
}

export const toggleFolder = (tree, path) => {
  const newTree = structuredClone(tree)
  let node = newTree

  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    if (!node[key]) return newTree

    if (i === path.length - 1) {
      if (node[key].type === "folder") {
        node[key].open = !node[key].open
      }
    } else {
      if (node[key].type !== "folder") return newTree
      node = node[key].children
    }
  }

  return newTree
}

// ✅ DELETE FILE OR FOLDER (RECURSIVE)
export const deleteItem = (tree, path) => {
  // ❌ prevent deleting src root
  if (path.length === 1 && path[0] === "src") return tree

  const newTree = structuredClone(tree)
  let node = newTree

  for (let i = 0; i < path.length - 1; i++) {
    if (!node[path[i]] || node[path[i]].type !== "folder") {
      return tree
    }
    node = node[path[i]].children
  }

  delete node[path[path.length - 1]]
  return newTree
}
