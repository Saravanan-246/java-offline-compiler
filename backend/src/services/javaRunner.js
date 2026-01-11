const { exec, spawn } = require("child_process")
const { TEMP_DIR, writeJavaFile, cleanTemp } = require("../utils/fileManager")

const runJava = (code, input = "") => {
  return new Promise((resolve, reject) => {
    writeJavaFile(code)

    // 1️⃣ Compile step
    exec(
      "javac Main.java",
      { cwd: TEMP_DIR, timeout: 5000 },
      (compileErr, _out, compileErrOut) => {
        if (compileErr) {
          setTimeout(cleanTemp, 100)
          return reject({
            type: "compile",
            output: compileErrOut || "Compilation failed"
          })
        }

        // 2️⃣ Run step (spawn → stdin supported)
        const runProcess = spawn("java", ["Main"], {
          cwd: TEMP_DIR,
          stdio: ["pipe", "pipe", "pipe"]
        })

        let stdout = ""
        let stderr = ""

        runProcess.stdout.on("data", data => {
          stdout += data.toString()
        })

        runProcess.stderr.on("data", data => {
          stderr += data.toString()
        })

        // 3️⃣ Timeout protection
        const timer = setTimeout(() => {
          runProcess.kill("SIGKILL")
          cleanTemp()
          reject({
            type: "runtime",
            output: "Time limit exceeded"
          })
        }, 5000)

        // 4️⃣ Handle exit
        runProcess.on("close", code => {
          clearTimeout(timer)
          setTimeout(cleanTemp, 100)

          if (code !== 0) {
            reject({
              type: "runtime",
              output: stderr || "Runtime error"
            })
          } else {
            resolve({
              type: "success",
              output: stdout
            })
          }
        })

        // 5️⃣ Pass input
        if (input && input.trim()) {
          runProcess.stdin.write(input + "\n")
        }
        runProcess.stdin.end()
      }
    )
  })
}

module.exports = { runJava }
