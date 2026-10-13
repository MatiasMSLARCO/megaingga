import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { LandingPage } from '@/pages/LandingPage'
import { StorePage } from '@/pages/StorePage'
import { CheckoutPage } from '@/pages/CheckoutPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'tienda', Component: StorePage },
      { path: 'checkout', Component: CheckoutPage },
    ],
  },
])

