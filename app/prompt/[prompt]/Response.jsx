import getGPTResponse from "../../../api/gpt"

export default async function Response({ prompt }) {
  const response = await getGPTResponse(prompt)

  return (
    <div className="mt-10 w-full max-w-[650px]">
      <div className="font-bold text-2xl text-blue-600 mb-2">Mag-GPT:</div>
      <p className="text-lg">{response}</p>
    </div>
  )
}
