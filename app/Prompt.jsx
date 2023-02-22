"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Prompt({ question }) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const placeholder = question ? question : "Me pergunte qualquer coisa."

  const handleChange = (e) => {
    if (e.target.value === prompt) return
    setPrompt(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (prompt === "") {
      router.push(`/`)
    } else {
      setIsLoading(true)
      router.push(`/prompt/${encodeURIComponent(prompt)}`)
    }
  }

  return (
    <header className="flex flex-col justify-center items-center w-full mt-20 mb-8">
      <form onSubmit={handleSubmit} className="w-full max-w-screen-md flex flex-col items-center">
        <div className="relative w-full">
          <label htmlFor="prompt" className="sr-only">
            Me pergunte qualquer coisa.
          </label>
          <input
            type="text"
            id="prompt"
            value={prompt}
            placeholder={placeholder}
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl"
            onChange={handleChange}
          />
          <button
            type="submit"
            className={`absolute top-0 right-0 h-full px-4 rounded-r-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white ${
              isLoading ? "bg-gray-300 text-blueGray-600" : ""
            }`}
            style={{ width: "110px" }}
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Enviar"}
          </button>
        </div>
      </form>
    </header>
  )
}
