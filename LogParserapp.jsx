import React, { useState } from "react"
import axios from "axios"

const LogParserApp = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("logFile", file)

      const response = await axios.post(
        "http://localhost:3000/parseLogs",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      const data = response.data
      console.log(data)

      // Handle the downloaded JSON file, e.g., trigger download or further processing.
    } catch (error) {
      console.error("Error uploading file:", error.message)
      alert("An error occurred while uploading the file")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload and Parse"}
      </button>
    </div>
  )
}

export default LogParserApp
