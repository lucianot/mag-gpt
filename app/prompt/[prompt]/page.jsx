import Question from "../../Question"
import Response from "./Response"
import Loading from "./Loading"
import { Suspense } from "react"

export default function GPTResponse({ params }) {
  const { prompt } = params
  const decodedPrompt = decodeURIComponent(prompt)
  const key = Math.floor(Math.random() * 1000000 + 1)

  return (
    <>
      <Question question={decodedPrompt} />
      <Suspense fallback={<Loading />}>
        <Response key={key} prompt={decodedPrompt} />
      </Suspense>
    </>
  )
}
