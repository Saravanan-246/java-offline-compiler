const express = require("express")
const { runJava } = require("../services/javaRunner")

const router = express.Router()

router.post("/", async (req, res) => {
  const { code, input } = req.body || {}

  // 1️⃣ Validate request
  if (!code || !code.trim()) {
    return res.status(400).json({
      status: "error",
      errorType: "validation",
      output: "No Java code provided"
    })
  }

  try {
    // 2️⃣ Run Java
    const result = await runJava(code, input)

    // 3️⃣ Success response
    return res.status(200).json({
      status: "success",
      output: result.output || ""
    })
  } catch (err) {
    // 4️⃣ Known errors (compile / runtime / timeout)
    const errorType = err.type || "runtime"

    return res.status(200).json({
      status: "error",
      errorType,
      output:
        err.output ||
        (errorType === "compile"
          ? "Compilation failed"
          : "Execution failed")
    })
  }
})

module.exports = router
