const fs = require("fs")
const path = require("path")

const TEMP_DIR = path.join(__dirname, "../temp")
const JAVA_FILE = path.join(TEMP_DIR, "Main.java")

/**
 * Ensure temp directory exists
 */
const ensureTemp = () => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true })
  }
}

/**
 * Write Java source file safely
 */
const writeJavaFile = (code = "") => {
  ensureTemp()
  fs.writeFileSync(JAVA_FILE, code, { encoding: "utf8" })
}

/**
 * Clean temp directory (only files we create)
 */
const cleanTemp = () => {
  if (!fs.existsSync(TEMP_DIR)) return

  try {
    for (const file of fs.readdirSync(TEMP_DIR)) {
      const filePath = path.join(TEMP_DIR, file)

      // Extra safety: delete only files, not folders
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath)
      }
    }
  } catch (err) {
    console.warn("Temp cleanup skipped:", err.message)
  }
}

module.exports = {
  TEMP_DIR,
  JAVA_FILE,
  writeJavaFile,
  cleanTemp
}
