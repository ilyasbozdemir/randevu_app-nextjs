"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Appointment, Customer, Employee, Service } from "@/lib/types"
import { Clock, Edit, Scissors, Trash, User } from "lucide-react"

interface AppointmentListProps {
  appointments: Appointment[]
  customers?: Customer[]
  employees?: Employee[]
  services?: Service[]
  onEdit: (appointment: Appointment) => void
  onDelete: (id: string) => void
}

export function AppointmentList({
  appointments,
  customers = [],
  employees = [],
  services = [],
  onEdit,
  onDelete,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">Bu tarihte randevu bulunmuyor.</div>
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const customer = customers.find((c) => c.id === appointment.customerId)
        const employee = employees.find((e) => e.id === appointment.employeeId)
        const service = services.find((s) => s.id === appointment.serviceId)

        return (
          <Card key={appointment.id} className="border border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{appointment.title}</CardTitle>
              <CardDescription className="flex items-center flex-wrap gap-2">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {appointment.time}
                </span>
                {customer && (
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {customer.name}
                  </span>
                )}
                {service && (
                  <span className="flex items-center">
                    <Scissors className="h-3 w-3 mr-1" />
                    {service.name}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              {employee && (
                <p className="text-sm">
                  <span className="font-medium">Çalışan:</span> {employee.name}
                </p>
              )}
              {appointment.description && (
                <p className="text-sm text-muted-foreground mt-1">{appointment.description}</p>
              )}
            </CardContent>
            <CardFooter className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(appointment)}>
                <Edit className="h-4 w-4 mr-1" />
                Düzenle
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(appointment.id)}>
                <Trash className="h-4 w-4 mr-1" />
                Sil
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

