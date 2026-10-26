import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  Package,
  FileText,
  MessageCircle,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import { NotificationBell } from '@/components/portal/NotificationBell'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { useAuth } from '@/context/AuthContext'

const SIDEBAR_COLLAPSED_KEY = 'megaingga_portal_sidebar_collapsed'

const NAV_ITEMS = [
  { to: '/portal', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/portal/pedidos', label: 'Pedidos', icon: Package, end: false },
  { to: '/portal/cotizaciones', label: 'Cotizaciones', icon: FileText, end: false },
  { to: '/portal/chat', label: 'Chat', icon: MessageCircle, end: false },
  { to: '/portal/perfil', label: 'Mi Perfil', icon: User, end: false },
]

export function PortalLayout() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  const handleLogout = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">
      {/* Sidebar desktop */}
      <aside
        className={cn(
          'hidden shrink-0 flex-col border-r border-brand-border-soft bg-white transition-[width] duration-200 lg:flex',
          collapsed ? 'w-18' : 'w-64'
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b border-brand-border-soft',
            collapsed ? 'justify-center px-2' : 'justify-between px-6'
          )}
        >
          {!collapsed && <Logo className="h-8 w-auto" />}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-brand-gray transition-colors hover:bg-black/5 hover:text-brand-dark cursor-pointer"
          >
            {collapsed ? <PanelLeftOpen className="h-4.5 w-4.5" /> : <PanelLeftClose className="h-4.5 w-4.5" />}
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors',
                  collapsed && 'justify-center px-0',
                  isActive ? 'bg-brand-dark text-white' : 'text-brand-dark hover:bg-black/5'
                )
              }
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-brand-border-soft p-4">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            title={collapsed ? 'Cerrar sesión' : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-brand-gray transition-colors hover:bg-black/5 hover:text-brand-red cursor-pointer',
              collapsed && 'justify-center px-0'
            )}
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && 'Cerrar sesión'}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-brand-border-soft bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Logo className="h-7 w-auto" />
            <span className="rounded-full bg-brand-dark/5 px-2 py-0.5 text-[11px] font-semibold text-brand-gray">
              Portal Clientes
            </span>
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-bold text-brand-dark">Bienvenido, {session?.user.fullName}</p>
            <p className="text-xs text-brand-gray">{session?.user.companyName}</p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            
            {/* User Avatar Menu Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-brand-border-soft p-1 transition-colors hover:bg-black/5 cursor-pointer"
                aria-label="Menú de usuario"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white">
                  {session?.user.avatarInitials}
                </span>
                <span className="hidden text-xs font-semibold text-brand-dark sm:inline pr-1">
                  {session?.user.fullName.split(' ')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-brand-border-soft bg-white py-2 shadow-xl"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="border-b border-brand-border-soft px-4 py-2">
                    <p className="text-xs font-bold text-brand-dark">{session?.user.fullName}</p>
                    <p className="text-[11px] text-brand-gray">{session?.user.companyName}</p>
                  </div>
                  <NavLink
                    to="/portal/perfil"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-dark transition-colors hover:bg-black/5"
                  >
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false)
                      setShowLogoutModal(true)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-brand-gray transition-colors hover:bg-black/5 hover:text-brand-red cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 pb-24 sm:p-6 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav mobile unificada y moderna */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-around border-t border-brand-border-soft bg-white/95 py-2 px-2 shadow-lg backdrop-blur-md lg:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors',
                isActive ? 'text-brand-red bg-brand-red/10' : 'text-brand-gray hover:text-brand-dark'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Modal de confirmación para cerrar sesión */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="¿Cerrar sesión?"
        description="¿Estás seguro de que deseas salir del portal de clientes? Deberás iniciar sesión nuevamente para acceder al seguimiento de tus pedidos y cotizaciones."
        confirmText="Cerrar sesión"
        cancelText="Permanecer aquí"
        variant="danger"
      />
    </div>
  )
}
