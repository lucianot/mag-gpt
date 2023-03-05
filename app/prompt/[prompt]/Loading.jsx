export default function Loading() {
  return (
    <div className="mt-10 w-full max-w-[650px]">
      <div className="font-bold text-2xl text-blue-600 mb-2">Mag-GPT:</div>
      <div className="animate-pulse mt-2">
        <div className="h-4 bg-gray-300 rounded mt-3"></div>
        <div className="h-4 bg-gray-300 rounded mt-3"></div>
        <div className="h-4 bg-gray-300 rounded mt-3"></div>
        <div className="h-4 bg-gray-300 rounded mt-3"></div>
      </div>
    </div>
  )
}
