"use client"

// This is a simplified version of the toast hook
import { useState } from "react"

type ToastProps = {
  title: string
  description?: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props])

    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== props))
    }, 3000)

    // In a real implementation, we would use a proper toast library
    alert(`${props.title}\n${props.description || ""}`)
  }

  return { toast, toasts }
}

