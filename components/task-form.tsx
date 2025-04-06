"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


interface TaskFormProps {
  onAddTask: (name: string, description: string) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [taskName, setTaskName] = useState("")
  const [desc, setDesc] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskName.trim()) {
      onAddTask(taskName,desc)
      setTaskName("")
      setDesc("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mb-8 flex gap-2">
      <Input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="新しいを入力アイデア..."
        className="flex-1"
      />
      <Input
        type="text"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="アイデアの詳細を入力..."
        className="flex-1"
      />
      <Button type="submit">追加</Button>
    </form>
  )
}

