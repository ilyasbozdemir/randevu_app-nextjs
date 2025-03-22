"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Service } from "@/lib/types"
import { Clock, Edit, Trash } from "lucide-react"

interface ServiceListProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

export function ServiceList({ services, onEdit, onDelete }: ServiceListProps) {
  if (services.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">Henüz hizmet bulunmuyor.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <Card key={service.id} className="border border-muted">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-1">{service.name}</h3>
            <div className="flex items-center text-sm mb-1">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{service.duration} dakika</span>
            </div>
            <p className="text-lg font-bold mt-2">{service.price} ₺</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(service)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Düzenle</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(service.id)}
              disabled={services.length <= 1}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Sil</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

