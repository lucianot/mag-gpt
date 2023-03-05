import "../styles/globals.css"
import Logo from "./Logo"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <main>
          <div className="flex flex-col h-screen">
            <Logo />
            <div className="flex-1 overflow-auto">
              <div className="mx-auto flex h-full w-full max-w-[800px] flex-col items-center px-3 pt-4 sm:pt-8  text-left">
                {children}
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
