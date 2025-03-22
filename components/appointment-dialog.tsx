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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Appointment, Customer, Employee, Service } from "@/lib/types"
import { getAvailableTimesForDate } from "@/lib/utils"

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  customers: Customer[]
  employees: Employee[]
  services: Service[]
  onSave: (appointment: Appointment) => void
}

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
  customers,
  employees,
  services,
  onSave,
}: AppointmentDialogProps) {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

  // Reset form when appointment changes
  useEffect(() => {
    if (appointment) {
      setTitle(appointment.title)
      setTime(appointment.time)
      setDescription(appointment.description || "")
      setCustomerId(appointment.customerId || "")
      setEmployeeId(appointment.employeeId || "")
      setServiceId(appointment.serviceId || "")

      // Update available times
      if (appointment.date) {
        const times = getAvailableTimesForDate(
          appointment.date,
          [], // We'll exclude the current appointment from the check
          employees,
          appointment.id, // Current appointment ID to exclude
        )
        setAvailableTimes(times)
      }
    } else {
      setTitle("")
      setTime("")
      setDescription("")
      setCustomerId("")
      setEmployeeId("")
      setServiceId("")
    }
  }, [appointment, employees])

  // Update available times when employee changes
  useEffect(() => {
    if (appointment?.date && employeeId) {
      const times = getAvailableTimesForDate(
        appointment.date,
        [], // We'll exclude the current appointment from the check
        employees.filter((e) => e.id === employeeId),
        appointment.id, // Current appointment ID to exclude
      )
      setAvailableTimes(times)
    }
  }, [employeeId, appointment?.date, employees, appointment?.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!appointment) return

    onSave({
      id: appointment.id,
      title,
      time,
      description,
      date: appointment.date,
      customerId,
      employeeId,
      serviceId,
      userId: appointment.userId,
    })
  }

  const isNewAppointment = appointment && !appointment.id
  const selectedService = services.find((s) => s.id === serviceId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isNewAppointment ? "Yeni Randevu Ekle" : "Randevu Düzenle"}</DialogTitle>
            <DialogDescription>Randevu detaylarını doldurun ve kaydedin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Başlık
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Hizmet
              </Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Hizmet seçin" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {service.price}₺ ({service.duration} dk)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">
                Çalışan
              </Label>
              <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Çalışan seçin" />
                </SelectTrigger>
                <SelectContent>
                  {employees
                    .filter(
                      (employee) =>
                        !serviceId || employee.services.includes(serviceId) || employee.services.length === 0,
                    )
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.role})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Saat
              </Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Saat seçin" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.length > 0 ? (
                    availableTimes.map((timeOption) => (
                      <SelectItem key={timeOption} value={timeOption}>
                        {timeOption}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-time" disabled>
                      Uygun saat bulunamadı
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Müşteri
              </Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Müşteri seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-customer">Müşteri yok</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Notlar
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

