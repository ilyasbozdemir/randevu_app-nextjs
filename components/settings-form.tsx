"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/lib/types"

interface SettingsFormProps {
  user: User
  onSave: (user: User) => void
}

export function SettingsForm({ user, onSave }: SettingsFormProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [chairCount, setChairCount] = useState(user.chairCount || 3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSave({
      ...user,
      name,
      email,
      chairCount,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="md:text-right">
            İşletme Adı
          </Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="md:col-span-3" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="md:text-right">
            E-posta
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="md:col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <Label htmlFor="chairCount" className="md:text-right">
            Koltuk Sayısı
          </Label>
          <Input
            id="chairCount"
            type="number"
            min={1}
            max={10}
            value={chairCount}
            onChange={(e) => setChairCount(Number.parseInt(e.target.value))}
            className="md:col-span-3"
            required
          />
          <div className="md:col-span-3 md:col-start-2">
            <p className="text-sm text-muted-foreground">Aynı anda kaç müşteriye hizmet verebileceğinizi belirler.</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Ayarları Kaydet</Button>
      </div>
    </form>
  )
}

