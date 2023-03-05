"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconArrowRight, IconSearch, IconLoaderQuarter } from "@tabler/icons-react"

export default function Question({ question }) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const placeholder = question ? question : "Me pergunte qualquer coisa sobre Magnetis."

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e)
    }
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
    <>
      <div className="relative w-full mt-10">
        <IconSearch className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />

        <input
          className="h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
          type="text"
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={handleSubmit} disabled={isLoading}>
          <IconArrowRight className="absolute right-2 top-2.5 h-7 w-7 rounded-full p-1 hover:cursor-pointer sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white bg-blue-600 hover:bg-blue-700" />
          {/* {isLoading ? (
            <IconLoaderQuarter className="absolute right-2 top-2.5 h-7 w-7 rounded-full p-1 hover:cursor-pointer sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white bg-gray-400" />
          ) : (
            <IconArrowRight className="absolute right-2 top-2.5 h-7 w-7 rounded-full p-1 hover:cursor-pointer sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white bg-blue-600 hover:bg-blue-700" />
          )} */}
        </button>
      </div>
    </>
  )
}
