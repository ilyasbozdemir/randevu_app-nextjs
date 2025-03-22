import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Appointment, Employee } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvailableTimesForDate(
  date: Date,
  appointments: Appointment[],
  employees: Employee[],
  excludeAppointmentId = "",
  chairCount = 3,
  serviceDuration = 30,
) {
  // Get appointments for the selected date
  const dateAppointments = appointments.filter((appointment) => {
    // Exclude the current appointment if editing
    if (appointment.id === excludeAppointmentId) return false

    const appointmentDate = new Date(appointment.date)
    return (
      appointmentDate.getDate() === date.getDate() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getFullYear() === date.getFullYear()
    )
  })

  // Generate all possible time slots from 9:00 to 18:00
  const timeSlots = []
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
    }
  }

  // Check each time slot for availability
  return timeSlots.filter((timeSlot) => {
    // Count how many appointments overlap with this time slot
    const overlappingAppointments = dateAppointments.filter((appointment) => {
      // Convert appointment time to minutes since start of day
      const [appointmentHour, appointmentMinute] = appointment.time.split(":").map(Number)
      const appointmentStartMinutes = appointmentHour * 60 + appointmentMinute

      // Convert current time slot to minutes since start of day
      const [slotHour, slotMinute] = timeSlot.split(":").map(Number)
      const slotStartMinutes = slotHour * 60 + slotMinute

      // Get service duration for the appointment
      const appointmentDuration = 30 // Default duration

      // Check if the appointment overlaps with the current time slot
      return (
        (slotStartMinutes >= appointmentStartMinutes &&
          slotStartMinutes < appointmentStartMinutes + appointmentDuration) ||
        (appointmentStartMinutes >= slotStartMinutes && appointmentStartMinutes < slotStartMinutes + serviceDuration)
      )
    })

    // Check if we have enough chairs/employees for this time slot
    return overlappingAppointments.length < chairCount
  })
}

