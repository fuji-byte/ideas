"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Share2, Check, X } from "lucide-react"
import DeleteConfirmation from "./delete-confirmation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

interface TaskItemProps {
  task: Task
  onDelete: (id: string) => void
  onEdit: (id: string, name: string, description: string) => void
}

export default function TaskItem({ task, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(task.name)
  const [editedDesc, setEditedDesc] = useState(task.description || "")
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isWriter, setIsWriter] = useState(false)

  const router = useRouter()

    useEffect(() => {
      // ユーザー情報の取得
      const getUser = async () => {
        if (typeof window !== "undefined") {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          setIsWriter(task.user_id == session?.user.id)
        }
      }
      getUser()
    }, [task.user_id])

  const handleEdit = () => {
    onEdit(task.id, editedName,editedDesc)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(task.id)
    setShowDeleteConfirmation(false)
  }
  
  const goToDetail = () => {
  router.push(`/tasks/${task.id}`) // 遷移先パス（調整可）
  }

  const handleShare = async (id: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const shareUrl = `${baseUrl}`+"/tasks/"+`${id}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("リンクをコピーしました！", {
        description: shareUrl,
      })
    } catch (err) {
      console.error("コピーに失敗しました", err)
    }
  }

  const getInputWidth = (text: string) => {
    const isMobile = window.innerWidth <= 640 // Tailwindのsm基準（640px以下）
    const max = isMobile ? 30 : 40
    const fullWidthChars = (text.match(/[^\x00-\x7F]/g) || []).length
    const halfWidthChars = text.length - fullWidthChars
    const width = (halfWidthChars + fullWidthChars * 1.8) + 4 // 余白込み
    return Math.min(width, max)
  }

  return (
    <li className="flex items-center p-3 border rounded-md bg-card">
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <div className="w-90">
            <Input style={{ width: `${getInputWidth(editedName)}ch` }} value={editedName} onChange={(e) => setEditedName(e.target.value)} className="" autoFocus />
            {/* <Input style={{ width: `${getInputWidth(editedDesc)}ch` }} value={editedDesc} onChange={(e) => setEditedDesc(e.target.value)} className="flex-1" /> */}
            <Textarea
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
              rows={1}
              style={{
                width: `${getInputWidth(editedDesc)}ch`,
                resize: "none", // 手動リサイズ無効化
                overflowWrap: "break-word", // 単語途中でも折り返す
                wordBreak: "break-all",     // 長い文字でも改行
              }}
              className="w-full transition-all"
            />
          </div>
          <Button size="icon" variant="ghost" onClick={handleEdit}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span className="flex-1" onClick={goToDetail}>{task.name}</span>
          <div className="flex gap-1">
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
              <Button size="icon" variant="ghost" onClick={() => handleShare(task.id)}>
                <Share2 className="h-4 w-4" />
              </Button>
          </div>
        </>
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation onConfirm={handleDelete} onCancel={() => setShowDeleteConfirmation(false)} />
      )}
    </li>
  )
}

