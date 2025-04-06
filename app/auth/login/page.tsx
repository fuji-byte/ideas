"use client"

import type React from "react"

import { useState } from "react"
//import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  //const supabase = createClientComponentClient()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // ログイン処理（講義内で実装）
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log("ログイン成功:");
      if (error) {
        throw error
      }

    router.replace("/");

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("ログインエラー:", error)
        setError(error.message)
      } else {
        console.error("不明なエラー:", error)
        setError("不明なエラーが発生しました")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" py-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">ログイン</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <p className="mt-4 text-center">
        アカウントをお持ちでない方は
        <Link href="/auth/signup" className="text-blue-500 hover:underline ml-1">
          新規登録
        </Link>
      </p>
    </div>
  )
}

