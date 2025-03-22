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
import { Textarea } from "@/components/ui/textarea"
import type { Customer } from "@/lib/types"

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
  onSave: (customer: Customer) => void
}

export function CustomerDialog({ open, onOpenChange, customer, onSave }: CustomerDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")

  // Reset form when customer changes
  useEffect(() => {
    if (customer) {
      setName(customer.name)
      setEmail(customer.email || "")
      setPhone(customer.phone || "")
      setNotes(customer.notes || "")
    } else {
      setName("")
      setEmail("")
      setPhone("")
      setNotes("")
    }
  }, [customer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customer) return

    onSave({
      id: customer.id,
      name,
      email,
      phone,
      notes,
    })
  }

  const isNewCustomer = customer && !customer.id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isNewCustomer ? "Yeni Müşteri Ekle" : "Müşteri Düzenle"}</DialogTitle>
            <DialogDescription>Müşteri bilgilerini doldurun ve kaydedin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Ad Soyad
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-posta
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefon
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
                placeholder="+905553332211"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notlar
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
                rows={3}
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

