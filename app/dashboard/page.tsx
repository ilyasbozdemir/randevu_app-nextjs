"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppointmentDialog } from "@/components/appointment-dialog";
import { AppointmentList } from "@/components/appointment-list";
import { CustomerDialog } from "@/components/customer-dialog";
import { CustomerList } from "@/components/customer-list";
import { EmployeeDialog } from "@/components/employee-dialog";
import { EmployeeList } from "@/components/employee-list";
import { ServiceDialog } from "@/components/service-dialog";
import { ServiceList } from "@/components/service-list";
import { SettingsForm } from "@/components/settings-form";
import type {
  Appointment,
  Customer,
  Employee,
  Service,
  User,
} from "@/lib/types";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Copy, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointment | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);

  // Check if user is logged in
  useEffect(() => {
    const userJson = localStorage.getItem("currentUser");
    if (!userJson) {
      router.push("/");
      return;
    }

    setCurrentUser(JSON.parse(userJson));

    // Load user's data
    loadUserData(JSON.parse(userJson).id);
  }, [router]);

  // Load user's data (appointments, customers, employees, services)
  const loadUserData = (userId: string) => {
    // Load appointments
    const appointmentsJson = localStorage.getItem(`appointments_${userId}`);
    if (appointmentsJson) {
      try {
        const parsed = JSON.parse(appointmentsJson);
        const appointmentsWithDates = parsed.map((app: any) => ({
          ...app,
          date: new Date(app.date),
        }));
        setAppointments(appointmentsWithDates);

        // Set upcoming appointments
        const now = new Date();
        const upcoming = appointmentsWithDates
          .filter((app: Appointment) => app.date >= now)
          .sort(
            (a: Appointment, b: Appointment) =>
              a.date.getTime() - b.date.getTime()
          )
          .slice(0, 5);

        setUpcomingAppointments(upcoming);
      } catch (error) {
        console.error("Error parsing appointments:", error);
      }
    }

    // Load customers
    const customersJson = localStorage.getItem(`customers_${userId}`);
    if (customersJson) {
      try {
        setCustomers(JSON.parse(customersJson));
      } catch (error) {
        console.error("Error parsing customers:", error);
      }
    }

    // Load employees
    const employeesJson = localStorage.getItem(`employees_${userId}`);
    if (employeesJson) {
      try {
        setEmployees(JSON.parse(employeesJson));
      } catch (error) {
        console.error("Error parsing employees:", error);
      }
    } else {
      // Initialize with default employee if none exist
      const defaultEmployee: Employee = {
        id: "1",
        name: "Varsayılan Çalışan",
        role: "Berber",
        userId: userId,
        services: [],
      };
      setEmployees([defaultEmployee]);
      localStorage.setItem(
        `employees_${userId}`,
        JSON.stringify([defaultEmployee])
      );
    }

    // Load services
    const servicesJson = localStorage.getItem(`services_${userId}`);
    if (servicesJson) {
      try {
        setServices(JSON.parse(servicesJson));
      } catch (error) {
        console.error("Error parsing services:", error);
      }
    } else {
      // Initialize with default services if none exist
      const defaultServices: Service[] = [
        {
          id: "1",
          name: "Saç Kesimi",
          duration: 30,
          price: 100,
          userId: userId,
        },
        {
          id: "2",
          name: "Sakal Tıraşı",
          duration: 20,
          price: 50,
          userId: userId,
        },
        {
          id: "3",
          name: "Saç & Sakal",
          duration: 45,
          price: 130,
          userId: userId,
        },
      ];
      setServices(defaultServices);
      localStorage.setItem(
        `services_${userId}`,
        JSON.stringify(defaultServices)
      );
    }
  };

  // Save appointments to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `appointments_${currentUser.id}`,
        JSON.stringify(appointments)
      );
    }
  }, [appointments, currentUser]);

  // Save customers to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `customers_${currentUser.id}`,
        JSON.stringify(customers)
      );
    }
  }, [customers, currentUser]);

  // Save employees to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `employees_${currentUser.id}`,
        JSON.stringify(employees)
      );
    }
  }, [employees, currentUser]);

  // Save services to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `services_${currentUser.id}`,
        JSON.stringify(services)
      );
    }
  }, [services, currentUser]);

  // Get appointments for the selected date
  const getAppointmentsForDate = (date: Date | undefined) => {
    if (!date) return [];

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Add or update an appointment
  const saveAppointment = (appointment: Appointment) => {
    if (!currentUser) return;

    const appointmentWithUserId = {
      ...appointment,
      userId: currentUser.id,
    };

    if (appointment.id) {
      // Update existing appointment
      setAppointments(
        appointments.map((app) =>
          app.id === appointment.id ? appointmentWithUserId : app
        )
      );
    } else {
      // Add new appointment with a unique ID
      const newAppointment = {
        ...appointmentWithUserId,
        id: Date.now().toString(),
      };
      setAppointments([...appointments, newAppointment]);
    }
    setIsAppointmentDialogOpen(false);
    setCurrentAppointment(null);
  };

  // Delete an appointment
  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((app) => app.id !== id));
  };

  // Edit an appointment
  const editAppointment = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsAppointmentDialogOpen(true);
  };

  // Add a new appointment
  const addNewAppointment = (customerId?: string) => {
    if (!date || !currentUser) return;

    setCurrentAppointment({
      id: "",
      title: "",
      time: "",
      description: "",
      date: date,
      customerId: customerId || "",
      employeeId: employees.length > 0 ? employees[0].id : "",
      serviceId: services.length > 0 ? services[0].id : "",
      userId: currentUser.id,
    });
    setIsAppointmentDialogOpen(true);
  };

  // Add or update a customer
  const saveCustomer = (customer: Customer) => {
    if (customer.id) {
      // Update existing customer
      setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
    } else {
      // Add new customer with a unique ID
      const newCustomer = {
        ...customer,
        id: Date.now().toString(),
      };
      setCustomers([...customers, newCustomer]);
    }
    setIsCustomerDialogOpen(false);
    setCurrentCustomer(null);
  };

  // Delete a customer
  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
    // Also delete all appointments for this customer
    setAppointments(appointments.filter((app) => app.customerId !== id));
  };

  // Edit a customer
  const editCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsCustomerDialogOpen(true);
  };

  // Add a new customer
  const addNewCustomer = () => {
    setCurrentCustomer({
      id: "",
      name: "",
      email: "",
      phone: "",
      notes: "",
    });
    setIsCustomerDialogOpen(true);
  };

  // Add or update an employee
  const saveEmployee = (employee: Employee) => {
    if (!currentUser) return;

    const employeeWithUserId = {
      ...employee,
      userId: currentUser.id,
    };

    if (employee.id) {
      // Update existing employee
      setEmployees(
        employees.map((e) => (e.id === employee.id ? employeeWithUserId : e))
      );
    } else {
      // Add new employee with a unique ID
      const newEmployee = {
        ...employeeWithUserId,
        id: Date.now().toString(),
      };
      setEmployees([...employees, newEmployee]);
    }
    setIsEmployeeDialogOpen(false);
    setCurrentEmployee(null);
  };

  // Delete an employee
  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id));
    // Also update all appointments for this employee
    setAppointments(
      appointments.map((app) =>
        app.employeeId === id ? { ...app, employeeId: "" } : app
      )
    );
  };

  // Edit an employee
  const editEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsEmployeeDialogOpen(true);
  };

  // Add a new employee
  const addNewEmployee = () => {
    if (!currentUser) return;

    setCurrentEmployee({
      id: "",
      name: "",
      role: "Berber",
      userId: currentUser.id,
      services: [],
    });
    setIsEmployeeDialogOpen(true);
  };

  // Add or update a service
  const saveService = (service: Service) => {
    if (!currentUser) return;

    const serviceWithUserId = {
      ...service,
      userId: currentUser.id,
    };

    if (service.id) {
      // Update existing service
      setServices(
        services.map((s) => (s.id === service.id ? serviceWithUserId : s))
      );
    } else {
      // Add new service with a unique ID
      const newService = {
        ...serviceWithUserId,
        id: Date.now().toString(),
      };
      setServices([...services, newService]);
    }
    setIsServiceDialogOpen(false);
    setCurrentService(null);
  };

  // Delete a service
  const deleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
    // Also update all appointments for this service
    setAppointments(
      appointments.map((app) =>
        app.serviceId === id ? { ...app, serviceId: "" } : app
      )
    );
  };

  // Edit a service
  const editService = (service: Service) => {
    setCurrentService(service);
    setIsServiceDialogOpen(true);
  };

  // Add a new service
  const addNewService = () => {
    if (!currentUser) return;

    setCurrentService({
      id: "",
      name: "",
      duration: 30,
      price: 0,
      userId: currentUser.id,
    });
    setIsServiceDialogOpen(true);
  };

  // Update user settings
  const updateUserSettings = (updatedUser: User) => {
    if (!currentUser) return;

    // Update current user
    const newUser = { ...currentUser, ...updatedUser };
    setCurrentUser(newUser);

    // Update in localStorage
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    // Update in users array
    const usersJson = localStorage.getItem("users");
    if (usersJson) {
      const users: User[] = JSON.parse(usersJson);
      const updatedUsers = users.map((u) =>
        u.id === currentUser.id ? newUser : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }

    toast({
      title: "Ayarlar güncellendi",
      description: "İşletme ayarlarınız başarıyla güncellendi.",
    });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  // Copy public booking link
  const copyPublicLink = () => {
    if (!currentUser) return;

    const link = `${window.location.origin}/book/${currentUser.publicId}`;
    navigator.clipboard.writeText(link);

    toast({
      title: "Bağlantı kopyalandı",
      description: "Randevu bağlantısı panoya kopyalandı.",
    });
  };

  const selectedDateAppointments = getAppointmentsForDate(date);
  const formattedDate = date
    ? format(date, "dd MMMM yyyy", { locale: tr })
    : "";

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-2 md:py-6 md:px-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Randevu Sistemi</h1>
          <p className="text-muted-foreground">
            Hoş geldiniz, {currentUser.name}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={copyPublicLink}
            className="flex-1 md:flex-none"
          >
            <Copy className="h-4 w-4 mr-1" />
            Randevu Bağlantısı
          </Button>
       
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex-1 md:flex-none"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Çıkış Yap
          </Button>
        </div>
      </header>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="w-full md:w-auto overflow-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="appointments">Randevular</TabsTrigger>
          <TabsTrigger value="customers">Müşteriler</TabsTrigger>
          <TabsTrigger value="employees">Çalışanlar</TabsTrigger>
          <TabsTrigger value="services">Hizmetler</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Yaklaşan Randevular</CardTitle>
                <CardDescription>Önümüzdeki 5 randevunuz</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <p className="text-muted-foreground">
                    Yaklaşan randevunuz bulunmuyor.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => {
                      const customer = customers.find(
                        (c) => c.id === appointment.customerId
                      );
                      const employee = employees.find(
                        (e) => e.id === appointment.employeeId
                      );
                      const service = services.find(
                        (s) => s.id === appointment.serviceId
                      );

                      return (
                        <div
                          key={appointment.id}
                          className="flex justify-between items-start border-b pb-3"
                        >
                          <div>
                            <p className="font-medium">{appointment.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(appointment.date, "dd MMM yyyy", {
                                locale: tr,
                              })}{" "}
                              - {appointment.time}
                            </p>
                            {customer && (
                              <p className="text-sm">
                                Müşteri: {customer.name}
                              </p>
                            )}
                            {employee && (
                              <p className="text-sm">
                                Çalışan: {employee.name}
                              </p>
                            )}
                            {service && (
                              <p className="text-sm">Hizmet: {service.name}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editAppointment(appointment)}
                          >
                            Düzenle
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
                <CardDescription>Sık kullanılan işlemler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={() => addNewAppointment()}>
                  Yeni Randevu Ekle
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={addNewCustomer}
                >
                  Yeni Müşteri Ekle
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={addNewEmployee}
                >
                  Yeni Çalışan Ekle
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Takvim</CardTitle>
                <CardDescription>
                  Randevu eklemek için bir tarih seçin
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={tr}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Randevular: {formattedDate}</CardTitle>
                <CardDescription>
                  {selectedDateAppointments.length === 0
                    ? "Bu tarihte randevu bulunmuyor"
                    : `${selectedDateAppointments.length} randevu bulunuyor`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => addNewAppointment()} className="mb-4">
                  Yeni Randevu Ekle
                </Button>

                <AppointmentList
                  appointments={selectedDateAppointments}
                  customers={customers}
                  employees={employees}
                  services={services}
                  onEdit={editAppointment}
                  onDelete={deleteAppointment}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Müşteriler</CardTitle>
                <CardDescription>
                  Müşteri listesi ve iletişim bilgileri
                </CardDescription>
              </div>
              <Button onClick={addNewCustomer}>Yeni Müşteri</Button>
            </CardHeader>
            <CardContent>
              <CustomerList
                customers={customers}
                onEdit={editCustomer}
                onDelete={deleteCustomer}
                onAddAppointment={(customerId) => addNewAppointment(customerId)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Çalışanlar</CardTitle>
                <CardDescription>Çalışan listesi ve görevleri</CardDescription>
              </div>
              <Button onClick={addNewEmployee}>Yeni Çalışan</Button>
            </CardHeader>
            <CardContent>
              <EmployeeList
                employees={employees}
                services={services}
                onEdit={editEmployee}
                onDelete={deleteEmployee}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Hizmetler</CardTitle>
                <CardDescription>
                  Sunulan hizmetler ve fiyatları
                </CardDescription>
              </div>
              <Button onClick={addNewService}>Yeni Hizmet</Button>
            </CardHeader>
            <CardContent>
              <ServiceList
                services={services}
                onEdit={editService}
                onDelete={deleteService}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>İşletme Ayarları</CardTitle>
              <CardDescription>
                İşletme bilgilerinizi ve ayarlarınızı düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm user={currentUser} onSave={updateUserSettings} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AppointmentDialog
        open={isAppointmentDialogOpen}
        onOpenChange={setIsAppointmentDialogOpen}
        appointment={currentAppointment}
        customers={customers}
        employees={employees}
        services={services}
        onSave={saveAppointment}
      />

      <CustomerDialog
        open={isCustomerDialogOpen}
        onOpenChange={setIsCustomerDialogOpen}
        customer={currentCustomer}
        onSave={saveCustomer}
      />

      <EmployeeDialog
        open={isEmployeeDialogOpen}
        onOpenChange={setIsEmployeeDialogOpen}
        employee={currentEmployee}
        services={services}
        onSave={saveEmployee}
      />

      <ServiceDialog
        open={isServiceDialogOpen}
        onOpenChange={setIsServiceDialogOpen}
        service={currentService}
        onSave={saveService}
      />
    </div>
  );
}
