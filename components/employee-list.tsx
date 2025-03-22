"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Employee, Service } from "@/lib/types"
import { Edit, Trash } from "lucide-react"

interface EmployeeListProps {
  employees: Employee[]
  services: Service[]
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
}

export function EmployeeList({ employees, services, onEdit, onDelete }: EmployeeListProps) {
  if (employees.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">Henüz çalışan bulunmuyor.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => {
        const employeeServices = services.filter(
          (s) => employee.services.includes(s.id) || employee.services.length === 0,
        )

        return (
          <Card key={employee.id} className="border border-muted">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-1">{employee.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{employee.role}</p>

              <div className="flex flex-wrap gap-1 mt-2">
                {employeeServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Hizmet bilgisi yok</p>
                ) : employeeServices.length === services.length || employee.services.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Tüm hizmetleri verebilir</p>
                ) : (
                  employeeServices.map((service) => (
                    <Badge key={service.id} variant="outline" className="text-xs">
                      {service.name}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(employee)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Düzenle</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(employee.id)}
                disabled={employees.length <= 1}
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Sil</span>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

