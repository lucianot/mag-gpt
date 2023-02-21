export default function Response({ response }) {
  console.log("Response: ", response.data)

  return (
    <div className="w-full max-w-screen-md mx-auto my-8">
      <p className="text-lg">{response.data.choices[0].text}</p>
    </div>
  )
}
