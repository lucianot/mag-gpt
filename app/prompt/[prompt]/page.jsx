import Logo from "../../Logo"
import Prompt from "../../Prompt"
import Response from "../../Response"
import getGPTResponse from "../../../api/gpt"
import { Suspense } from "react"

async function GPTResponse({ params }) {
  const { prompt } = params
  const decodedPrompt = decodeURIComponent(prompt)
  const response = await getGPTResponse(decodedPrompt)

  return (
    <main className="bg-blueGray-100 min-h-screen font-sans">
      <div className="flex flex-col justify-center items-center pt-10">
        <Logo />
        <Prompt question={decodedPrompt} />
        <Suspense fallback={<p>Loading...</p>}>
          <Response response={response} />
        </Suspense>
      </div>
    </main>
  )
}

export default GPTResponse
