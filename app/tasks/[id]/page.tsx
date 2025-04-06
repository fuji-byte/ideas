"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DeleteConfirmation from "@/components/delete-confirmation"
import { Pencil, Trash2, Share2, Check, X } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import TextareaAutosize from "react-textarea-autosize"

export default function TaskDetailPage() {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedDesc, setEditedDesc] = useState("")
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [user, setUser] = useState<unknown>(null)
  const [userId, setUserId] = useState<string>("")
  const [isWriter, setIsWriter] = useState(false) 
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    // ユーザー情報の取得
    const getUser = async () => {
      if (typeof window !== "undefined") {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setIsWriter(userId == session?.user.id)
    }}
    getUser()
  }, [userId])

  useEffect(() => {
    const fetchTask = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", params.id as string)
        .single()

      if (error || !data) {
        router.replace("/not-found")
        return
      }
      setTask(data)
      setEditedName(data.name)
      setEditedDesc(data.description || "")
      setUserId(data.user_id)
      setLoading(false)
    }

    fetchTask()
  }, [params.id, router])

  const handleShare = async () => {
    const url = `${window.location.origin}/tasks/${params.id}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success("リンクをコピーしました！", { description: url })
    } catch {
      toast.error("コピーに失敗しました")
    }
  }

  const handleEditSave = async () => {
    if (!editedName.trim()) {
      toast.error("アイデア名は必須です")
      return
    }

    const { error } = await supabase
      .from("tasks")
      .update({
        name: editedName,
        description: editedDesc,
      })
      .eq("id", params.id as string)

    if (error) {
      toast.error("更新に失敗しました")
      return
    }

    toast.success("更新しました！")
    setTask({ ...(task as Task), name: editedName, description: editedDesc })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", params.id as string)

    if (error) {
      toast.error("削除に失敗しました")
      return
    }

    toast.success("削除しました！")
    setShowDeleteConfirmation(false)
    router.push("/")
  }

  const top = () => {
    router.replace("/");
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsWriter(false)
  }

  if (loading || !task) {
    return (
    <div className="p-10 text-gray-500 flex flex-col items-center">
      <p>読み込み中...</p>
    </div>
    )
  }

  const getInputWidth = (text: string) => {
    const isMobile = window.innerWidth <= 640 // Tailwindのsm基準（640px以下）
    const max = isMobile ? 30 : 100
    const fullWidthChars = (text.match(/[^\x00-\x7F]/g) || []).length
    const halfWidthChars = text.length - fullWidthChars
    const width = (halfWidthChars + fullWidthChars * 1.8) + 4 // 余白込み
    return Math.min(width, max)
  }


  return (
    <div className="flex flex-col items-center">
      <header className="w-full py-5 mb-8 flex flex-col items-center">
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
      <div className="w-9/10">
        <h1 className="text-2xl font-bold">アイデア詳細</h1>
        {isEditing ? (
          <div className="space-y-2">
            <strong>アイデア名:</strong>
            <Input style={{ width: `${getInputWidth(editedName)}ch` }} value={editedName} onChange={(e) => setEditedName(e.target.value)} className="" autoFocus />
            {/* <Input style={{ width: `${getInputWidth(editedDesc)}ch` }} value={editedDesc} onChange={(e) => setEditedDesc(e.target.value)} className="flex-1" /> */}
            <br/>
            <strong>説明:</strong>
            <TextareaAutosize
              value={editedDesc}
              style={{ width: `${getInputWidth(editedDesc)}ch` }}
              onChange={(e) => setEditedDesc(e.target.value)}
              className="resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={handleEditSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p><strong>アイデア名:</strong> {task.name}</p>
            <p><strong>説明:</strong> {task.description || "--"}</p>
            <div className="flex gap-2 mt-4">
              {isWriter && (
                <>
                  <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setShowDeleteConfirmation(true)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
                <Button size="icon" variant="ghost" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
            </div>
          </>
        )}
      {showDeleteConfirmation && (
        <DeleteConfirmation onConfirm={handleDelete} onCancel={() => setShowDeleteConfirmation(false)} />
      )}
      </div>
    </div>
  )
}
