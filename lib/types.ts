export interface User {
  id: string
  name: string
  email: string
  password: string
  publicId: string
  chairCount?: number
}

export interface Employee {
  id: string
  name: string
  role: string
  userId: string
  services: string[] // Hangi hizmetleri verebileceği
}

export interface Service {
  id: string
  name: string
  duration: number // Dakika cinsinden
  price: number
  userId: string
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  notes?: string
}

export interface Appointment {
  id: string
  title: string
  time: string
  description?: string
  date: Date
  customerId?: string
  employeeId?: string
  serviceId?: string
  userId: string
}

