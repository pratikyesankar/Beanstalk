import express, { Request, Response } from "express"
import multer from "multer"
import readline from "readline"

const app = express()
const port = 3000

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

interface LogEntry {
  timestamp: number
  loglevel: string
  transactionId: string
  err?: string
}

app.post(
  "/parseLogs",
  upload.single("logFile"),
  (req: Request, res: Response) => {
    const fileBuffer = req.file?.buffer
    if (!fileBuffer) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const logs: LogEntry[] = []

    const lines = readline.createInterface({
      input: Buffer.from(fileBuffer).toString().split("\n"),
      crlfDelay: Infinity,
    })

    lines.on("line", (line) => {
      try {
        const logData = JSON.parse(line.split(" - ")[2])
        const timestamp = new Date(line.split(" - ")[0]).getTime()
        const entry: LogEntry = {
          timestamp,
          loglevel: logData.loglevel,
          transactionId: logData.transactionId,
        }

        if (logData.loglevel === "error" || logData.loglevel === "warn") {
          entry.err = logData.err || ""
        }

        logs.push(entry)
      } catch (error) {
        console.error(`Error parsing line: ${line}`)
      }
    })

    lines.on("close", () => {
      res.json(logs)
    })
  }
)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
