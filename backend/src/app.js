const express = require("express")
const cors = require("cors")
const runRoute = require("./routes/run")

const app = express()

// CORS config (frontend access)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  })
)

// Body parser with size limit (security)
app.use(express.json({ limit: "100kb" }))

// Health check (very useful)
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" })
})

// Java compiler route
app.use("/run", runRoute)

// Global error fallback (safety net)
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({
    status: "error",
    message: "Internal server error"
  })
})

module.exports = app
