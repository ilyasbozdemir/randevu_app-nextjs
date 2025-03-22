"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Service } from "@/lib/types"

interface ServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: Service | null
  onSave: (service: Service) => void
}

export function ServiceDialog({ open, onOpenChange, service, onSave }: ServiceDialogProps) {
  const [name, setName] = useState("")
  const [duration, setDuration] = useState(30)
  const [price, setPrice] = useState(0)

  // Reset form when service changes
  useEffect(() => {
    if (service) {
      setName(service.name)
      setDuration(service.duration)
      setPrice(service.price)
    } else {
      setName("")
      setDuration(30)
      setPrice(0)
    }
  }, [service])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!service) return

    onSave({
      id: service.id,
      name,
      duration,
      price,
      userId: service.userId,
    })
  }

  const isNewService = service && !service.id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isNewService ? "Yeni Hizmet Ekle" : "Hizmet Düzenle"}</DialogTitle>
            <DialogDescription>Hizmet bilgilerini doldurun ve kaydedin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Hizmet Adı
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Süre (dk)
              </Label>
              <Input
                id="duration"
                type="number"
                min={5}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number.parseInt(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Fiyat (₺)
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={10}
                value={price}
                onChange={(e) => setPrice(Number.parseInt(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Kaydet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

