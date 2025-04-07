"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"

const TodoApp = dynamic(() => import("@/components/todo-app"), { ssr: false })

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <p className="p-6">読み込み中...</p>
  return (
    <>
      <meta name="google-site-verification" content="9-X1gLMXYMyz6nNUw_DDpPMBYvG74zZeivdWWM2QXsk" />
      <main className="container mx-auto px-4 py-8">
        <TodoApp />
      </main>
    </>
  )
}

