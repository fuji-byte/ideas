"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TaskForm from "./task-form"
import TaskList from "./todo-list"
import type { Task } from "../types/task"
import { v4 as uuidv4 } from "uuid"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [user, setUser] = useState<unknown>(null)
  const [userId, setUserId] = useState<string>("")
  const [updateTrigger, setUpdateTrigger] = useState(false)
  const [loading, setLoading] = useState(true)
  const [taskLoading, setTaskLoading] = useState(true)
  //const pathname = usePathname()
  const router = useRouter()
  
  useEffect(() => {
    // ユーザー情報の取得
    const getUser = async () => {
      if (typeof window !== "undefined") {
      const {
        data: { session }, error
      } = await supabase.auth.getSession()
      if (error) {
        return
      }
      setUser(session?.user || null)
      setUserId(session?.user.id || "")
      setLoading(false)
    }
  }
    getUser()
    
  }, [])
  
  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) {
        setTaskLoading(false)
        return
      }
  
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
  
      if (error) {
        console.error("タスク取得エラー", error)
        return
      }

      setTasks(data)
      setTaskLoading(false)
    }
    fetchTasks()
  }, [updateTrigger, userId])

  const addTask = async (name: string, description : string) => {
    if (!name.trim()) {
      toast.error("アイデア名は必須です")
      return
    }
    if(!userId) {
      toast.error("追加にはログインが必要です。")
      return
    }
    const id = uuidv4()
    const completed = false

    const { error } = await supabase
  .from("tasks")
  .insert({ id, name, completed, description,user_id:userId })
  if (error) {
    toast.error("追加に失敗しました")
    return
  }
  toast.success("追加しました！")
  setUpdateTrigger(!updateTrigger)
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id as string)

  if (error) {
    toast.error("削除に失敗しました")
    return
  }
  toast.success("削除しました！")
  setUpdateTrigger(!updateTrigger)
  }

  const editTask = async (id: string, name: string, description: string) => {
    if (!name.trim()) {
      toast.error("アイデア名は必須です")
      return
    }

    const { error } = await supabase
      .from("tasks")
      .update({name,description})
      .eq("id", id as string)

    if (error) {
      toast.error("編集に失敗しました")
      return
    }

    toast.success("編集しました！")
    setUpdateTrigger(!updateTrigger)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setTasks([])
    setUser(null)
    setUserId("")
  }

  const top = () => {
    router.replace("/");
  }
  //const isAuthPage = pathname?.startsWith("/auth")

  return (
    <div className="flex flex-col items-center">
      <header className="w-full max-w-2xl mb-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800" onClick={top}>Ideas</h1>
        <div className="flex gap-4">
          {!loading && (
            <>
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                  >
                  ログイン
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                  >
                  新規登録
                </Link>
              </>
            ):(
              <button onClick={handleLogout}  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
                ログアウト
              </button>
            )}
          </>
        )}
        </div>
      </header>
      <TaskForm onAddTask={addTask} />
      {!taskLoading ? (
        <>
          {!user ? (
              <p>サインアップ、ログインしてアイデアを追加しよう！</p>
          ):(
            <TaskList tasks={tasks} onDeleteTask={deleteTask} onEditTask={editTask} />
          )}
        </>
      ):(
      <p>now loadnig ...</p>)}
    </div>
  )
}

