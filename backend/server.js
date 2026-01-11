import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

app.post("/run", (req, res) => {
  const { code } = req.body

  res.json({
    status: "info",
    message: "Java execution runs locally using system JDK",
    receivedLines: code.split("\n").length
  })
})

app.get("/", (req, res) => {
  res.send("Java Offline Compiler Backend is running")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
)
