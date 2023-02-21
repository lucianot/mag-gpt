import Logo from "./Logo"
import Prompt from "./Prompt"

export default function Home() {
  return (
    <main className="bg-blueGray-100 min-h-screen font-sans">
      <div className="flex flex-col justify-center items-center pt-10">
        <Logo />
        <Prompt />
      </div>
    </main>
  )
}
