import { createBrowserRouter } from 'react-router'
import { RootLayout } from './RootLayout'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ServicesPage } from './pages/ServicesPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ClientsPage } from './pages/ClientsPage'
import { ContactPage } from './pages/ContactPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'nosotros', Component: AboutPage },
      { path: 'servicios', Component: ServicesPage },
      { path: 'servicios/:slug', Component: ProductDetailPage },
      { path: 'proyectos', Component: ProjectsPage },
      { path: 'proyectos/:slug', Component: ProjectDetailPage },
      { path: 'clientes', Component: ClientsPage },
      { path: 'contacto', Component: ContactPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
