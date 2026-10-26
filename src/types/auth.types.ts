export interface ClientUser {
  id: string
  fullName: string
  companyName: string
  email: string
  phone: string
  avatarInitials: string
}

export interface Session {
  user: ClientUser
  loggedInAt: string
}

export interface AdminUser {
  id: string
  fullName: string
  role: 'admin' | 'agente'
  avatarInitials: string
}

export interface AdminSession {
  user: AdminUser
  loggedInAt: string
}
