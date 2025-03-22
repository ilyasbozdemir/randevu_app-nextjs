"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User } from "@/lib/types"

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Get users from localStorage
    const usersJson = localStorage.getItem("users")
    const users: User[] = usersJson ? JSON.parse(usersJson) : []

    // Find user with matching email and password
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      // Store current user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user))
      router.push("/dashboard")
    } else {
      setError("Geçersiz e-posta veya şifre")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password) {
      setError("Lütfen tüm alanları doldurun")
      return
    }

    // Get existing users
    const usersJson = localStorage.getItem("users")
    const users: User[] = usersJson ? JSON.parse(usersJson) : []

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      setError("Bu e-posta adresi zaten kullanılıyor")
      return
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      publicId: Math.random().toString(36).substring(2, 10),
    }

    // Add user to localStorage
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Set as current user and redirect
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    router.push("/dashboard")
  }

  // Initialize default user if no users exist
  useEffect(() => {
    const usersJson = localStorage.getItem("users")
    if (!usersJson || JSON.parse(usersJson).length === 0) {
      const defaultUser: User = {
        id: "1",
        name: "Demo Kullanıcı",
        email: "demo@example.com",
        password: "password",
        publicId: "demo123",
      }
      localStorage.setItem("users", JSON.stringify([defaultUser]))
    }
  }, [])

  return (
    <div className="container flex h-screen items-center justify-center">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Giriş Yap</TabsTrigger>
          <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Giriş Yap</CardTitle>
              <CardDescription>Randevu sisteminize erişmek için giriş yapın.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="text-sm text-muted-foreground">Demo hesabı: demo@example.com / password</div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Giriş Yap
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Kayıt Ol</CardTitle>
              <CardDescription>Yeni bir hesap oluşturun.</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">E-posta</Label>
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="ornek@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Şifre</Label>
                  <Input
                    id="password-register"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Kayıt Ol
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

