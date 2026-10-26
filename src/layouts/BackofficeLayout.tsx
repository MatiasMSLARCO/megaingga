import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  Package,
  FileText,
  MessageCircle,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import { NotificationBell } from '@/components/portal/NotificationBell'
import { useBackofficeAuth } from '@/context/BackofficeAuthContext'

const SIDEBAR_COLLAPSED_KEY = 'megaingga_backoffice_sidebar_collapsed'

const NAV_ITEMS = [
  { to: '/backoffice', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/backoffice/pedidos', label: 'Pedidos', icon: Package, end: false },
  { to: '/backoffice/cotizaciones', label: 'Cotizaciones', icon: FileText, end: false },
  { to: '/backoffice/chat', label: 'Comunicación', icon: MessageCircle, end: false },
]

export function BackofficeLayout() {
  const { session, logout } = useBackofficeAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1')

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  const handleLogout = () => {
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
            onClick={handleLogout}
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
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Abrir menú"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-dark hover:bg-black/5 cursor-pointer"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Logo className="h-7 w-auto" />
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-bold text-brand-dark">Panel de Operaciones</p>
            <p className="text-xs text-brand-gray">{session?.user.fullName}</p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="hidden items-center gap-2 border-l border-brand-border-soft pl-3 sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white">
                {session?.user.avatarInitials}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile nav drawer */}
        <div
          className={cn(
            'overflow-hidden border-b border-brand-border-soft bg-white transition-all lg:hidden',
            mobileOpen ? 'max-h-96' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col gap-1 p-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors',
                    isActive ? 'bg-brand-dark text-white' : 'text-brand-dark hover:bg-black/5'
                  )
                }
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-brand-gray hover:bg-black/5 hover:text-brand-red cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
              Cerrar sesión
            </button>
          </nav>
        </div>

        <main className="flex-1 p-4 pb-24 sm:p-6 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-around border-t border-brand-border-soft bg-white py-2 lg:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[10px] font-semibold',
                isActive ? 'text-brand-red' : 'text-brand-gray'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
