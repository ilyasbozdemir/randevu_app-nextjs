"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Customer } from "@/lib/types"
import { Calendar, Edit, Mail, Phone, Trash } from "lucide-react"

interface CustomerListProps {
  customers: Customer[]
  onEdit: (customer: Customer) => void
  onDelete: (id: string) => void
  onAddAppointment: (customerId: string) => void
}

export function CustomerList({ customers, onEdit, onDelete, onAddAppointment }: CustomerListProps) {
  if (customers.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">Henüz müşteri bulunmuyor.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <Card key={customer.id} className="border border-muted">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">{customer.name}</h3>

            {customer.email && (
              <div className="flex items-center text-sm mb-1">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                  {customer.email}
                </a>
              </div>
            )}

            {customer.phone && (
              <div className="flex items-center text-sm mb-1">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                  {customer.phone}
                </a>
                {customer.phone.startsWith("+90") && (
                  <a
                    href={`https://wa.me/${customer.phone.replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-green-600 hover:text-green-700"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            )}

            {customer.notes && <p className="text-sm text-muted-foreground mt-2">{customer.notes}</p>}
          </CardContent>
          <CardFooter className="flex justify-between gap-2">
            <Button variant="outline" size="sm" onClick={() => onAddAppointment(customer.id)}>
              <Calendar className="h-4 w-4 mr-1" />
              Randevu
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(customer)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Düzenle</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(customer.id)}
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Sil</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

