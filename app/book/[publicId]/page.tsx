"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Appointment, Customer, Employee, Service, User } from "@/lib/types"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { getAvailableTimesForDate } from "@/lib/utils"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get the public ID from the URL
  const publicId = params.publicId as string

  // Find the user with the matching public ID
  useEffect(() => {
    const usersJson = localStorage.getItem("users")
    if (usersJson) {
      const users: User[] = JSON.parse(usersJson)
      const matchedUser = users.find((u) => u.publicId === publicId)

      if (matchedUser) {
        setUser(matchedUser)

        // Load user's data
        loadUserData(matchedUser.id)
      } else {
        // User not found, redirect to home
        router.push("/")
      }
    }
  }, [publicId, router])

  // Load user's data (appointments, employees, services)
  const loadUserData = (userId: string) => {
    // Load appointments
    const appointmentsJson = localStorage.getItem(`appointments_${userId}`)
    if (appointmentsJson) {
      try {
        const parsed = JSON.parse(appointmentsJson)
        const appointmentsWithDates = parsed.map((app: any) => ({
          ...app,
          date: new Date(app.date),
        }))
        setAppointments(appointmentsWithDates)
      } catch (error) {
        console.error("Error parsing appointments:", error)
      }
    }

    // Load employees
    const employeesJson = localStorage.getItem(`employees_${userId}`)
    if (employeesJson) {
      try {
        setEmployees(JSON.parse(employeesJson))
      } catch (error) {
        console.error("Error parsing employees:", error)
      }
    }

    // Load services
    const servicesJson = localStorage.getItem(`services_${userId}`)
    if (servicesJson) {
      try {
        setServices(JSON.parse(servicesJson))
      } catch (error) {
        console.error("Error parsing services:", error)
      }
    }
  }

  // Update available times when date, employee, or service changes
  useEffect(() => {
    if (date && user) {
      const selectedEmployees = employeeId ? employees.filter((e) => e.id === employeeId) : employees

      const times = getAvailableTimesForDate(
        date,
        appointments,
        selectedEmployees,
        "",
        user.chairCount || 3,
        serviceId ? services.find((s) => s.id === serviceId)?.duration : undefined,
      )

      setAvailableTimes(times)

      // Reset time if current selection is no longer available
      if (time && !times.includes(time)) {
        setTime("")
      }
    }
  }, [date, employeeId, serviceId, appointments, employees, services, user, time])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !date || !time || !serviceId) return

    setIsSubmitting(true)

    // Create new customer
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      notes,
    }

    // Get existing customers
    const customersJson = localStorage.getItem(`customers_${user.id}`)
    const customers: Customer[] = customersJson ? JSON.parse(customersJson) : []

    // Add customer
    customers.push(newCustomer)
    localStorage.setItem(`customers_${user.id}`, JSON.stringify(customers))

    // Get selected service
    const service = services.find((s) => s.id === serviceId)

    // Create new appointment
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      title: `${service?.name || "Randevu"}: ${name}`,
      time,
      description: notes,
      date: date,
      customerId: newCustomer.id,
      employeeId: employeeId || (employees.length > 0 ? employees[0].id : ""),
      serviceId,
      userId: user.id,
    }

    // Add appointment
    const updatedAppointments = [...appointments, newAppointment]
    localStorage.setItem(`appointments_${user.id}`, JSON.stringify(updatedAppointments))

    // Show success message
    toast({
      title: "Randevu oluşturuldu",
      description: "Randevunuz başarıyla oluşturuldu.",
    })

    // Reset form
    setName("")
    setEmail("")
    setPhone("")
    setNotes("")
    setTime("")
    setServiceId("")
    setEmployeeId("")
    setIsSubmitting(false)
  }

  const formattedDate = date ? format(date, "dd MMMM yyyy", { locale: tr }) : ""

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Yükleniyor...</div>
  }

  return (
    <div className="container mx-auto py-4 px-2 md:py-8 md:px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">{user.name} - Randevu Oluştur</CardTitle>
          <CardDescription>Randevu oluşturmak için aşağıdaki formu doldurun</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Tarih ve Hizmet Seçin</h3>
                <div className="mb-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={tr}
                    className="rounded-md border mx-auto"
                    disabled={(date) => {
                      // Disable past dates and weekends
                      const now = new Date()
                      now.setHours(0, 0, 0, 0)
                      return date < now
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="service">Hizmet Seçin</Label>
                    <Select value={serviceId} onValueChange={setServiceId}>
                      <SelectTrigger>
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

                  <div className="space-y-2">
                    <Label htmlFor="employee">Çalışan Seçin (Opsiyonel)</Label>
                    <Select value={employeeId} onValueChange={setEmployeeId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Çalışan seçin (opsiyonel)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_applicable">Fark etmez</SelectItem>
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

                  <div className="space-y-2">
                    <Label htmlFor="time">Saat Seçin</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.length > 0 ? (
                        availableTimes.map((t) => (
                          <Button
                            key={t}
                            type="button"
                            variant={time === t ? "default" : "outline"}
                            onClick={() => setTime(t)}
                            className="w-full"
                          >
                            {t}
                          </Button>
                        ))
                      ) : (
                        <p className="col-span-3 text-center text-muted-foreground">
                          {serviceId ? "Bu tarihte uygun saat bulunmuyor." : "Lütfen önce bir hizmet seçin."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Kişisel Bilgileriniz</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+905553332211"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notlar</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Randevu hakkında eklemek istediğiniz notlar..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="w-full max-w-md"
                disabled={!date || !time || !name || !phone || !serviceId || isSubmitting}
              >
                {isSubmitting ? "Randevu Oluşturuluyor..." : "Randevu Oluştur"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

