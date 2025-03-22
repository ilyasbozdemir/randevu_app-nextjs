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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Employee, Service } from "@/lib/types"

interface EmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  services: Service[]
  onSave: (employee: Employee) => void
}

export function EmployeeDialog({ open, onOpenChange, employee, services, onSave }: EmployeeDialogProps) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // Reset form when employee changes
  useEffect(() => {
    if (employee) {
      setName(employee.name)
      setRole(employee.role || "Berber")
      setSelectedServices(employee.services || [])
    } else {
      setName("")
      setRole("Berber")
      setSelectedServices([])
    }
  }, [employee])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!employee) return

    onSave({
      id: employee.id,
      name,
      role,
      services: selectedServices,
      userId: employee.userId,
    })
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const isNewEmployee = employee && !employee.id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isNewEmployee ? "Yeni Çalışan Ekle" : "Çalışan Düzenle"}</DialogTitle>
            <DialogDescription>Çalışan bilgilerini doldurun ve kaydedin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Ad Soyad
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Görev
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Görev seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Berber">Berber</SelectItem>
                  <SelectItem value="Çırak">Çırak</SelectItem>
                  <SelectItem value="Usta">Usta</SelectItem>
                  <SelectItem value="Yönetici">Yönetici</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Hizmetler</Label>
              <div className="col-span-3 space-y-2">
                {services.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Henüz hizmet bulunmuyor.</p>
                ) : (
                  services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                      <Label htmlFor={`service-${service.id}`} className="text-sm font-normal">
                        {service.name}
                      </Label>
                    </div>
                  ))
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Çalışanın verebileceği hizmetleri seçin. Hiçbir hizmet seçilmezse, tüm hizmetleri verebilir.
                </p>
              </div>
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

