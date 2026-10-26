import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { PortalLayout } from '@/layouts/PortalLayout'
import { BackofficeLayout } from '@/layouts/BackofficeLayout'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { RequireBackofficeAuth } from '@/components/auth/RequireBackofficeAuth'
import { BackofficeAuthProvider } from '@/context/BackofficeAuthProvider'
import { LandingPage } from '@/pages/LandingPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { LoginPage } from '@/pages/LoginPage'
import { BackofficeLoginPage } from '@/pages/backoffice/BackofficeLoginPage'
import { BackofficeDashboardPage } from '@/pages/backoffice/DashboardPage'
import { BackofficeOrdersPage } from '@/pages/backoffice/OrdersPage'
import { BackofficeQuotesPage } from '@/pages/backoffice/QuotesPage'
import { BackofficeChatPage } from '@/pages/backoffice/ChatPage'
import { DashboardPage } from '@/pages/portal/DashboardPage'
import { OrdersPage } from '@/pages/portal/OrdersPage'
import { OrderTrackingPage } from '@/pages/portal/OrderTrackingPage'
import { LiveTrackingPage } from '@/pages/portal/LiveTrackingPage'
import { RatingPage } from '@/pages/portal/RatingPage'
import { QuotesPage } from '@/pages/portal/QuotesPage'
import { CreateQuotePage } from '@/pages/portal/CreateQuotePage'
import { ChatPage } from '@/pages/portal/ChatPage'
import { ProfilePage } from '@/pages/portal/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'tienda', Component: () => <Navigate to="/#suministros" replace /> },
      { path: 'checkout', Component: CheckoutPage },
    ],
  },
  { path: 'ingresar', Component: LoginPage },
  {
    path: 'backoffice',
    Component: () => (
      <BackofficeAuthProvider>
        <Outlet />
      </BackofficeAuthProvider>
    ),
    children: [
      {
        Component: AuthLayout,
        children: [{ path: 'ingresar', Component: BackofficeLoginPage }],
      },
      {
        Component: () => (
          <RequireBackofficeAuth>
            <BackofficeLayout />
          </RequireBackofficeAuth>
        ),
        children: [
          { index: true, Component: BackofficeDashboardPage },
          { path: 'pedidos', Component: BackofficeOrdersPage },
          { path: 'cotizaciones', Component: BackofficeQuotesPage },
          { path: 'chat', Component: BackofficeChatPage },
        ],
      },
    ],
  },
  {
    path: 'portal',
    Component: () => (
      <RequireAuth>
        <PortalLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, Component: DashboardPage },
      { path: 'pedidos', Component: OrdersPage },
      { path: 'pedidos/:orderId', Component: OrderTrackingPage },
      { path: 'pedidos/:orderId/envio', Component: LiveTrackingPage },
      { path: 'pedidos/:orderId/calificar', Component: RatingPage },
      { path: 'cotizaciones', Component: QuotesPage },
      { path: 'cotizaciones/crear', Component: CreateQuotePage },
      { path: 'chat', Component: ChatPage },
      { path: 'perfil', Component: ProfilePage },
    ],
  },
])
