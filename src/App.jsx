import { createBrowserRouter, RouterProvider } from 'react-router'
import SiteLayout from './layouts/SiteLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'work', lazy: async () => ({ Component: (await import('./pages/WorkPage')).default }) },
      {
        // Case studies are split into their own chunk; the homepage never loads them.
        path: 'work/:slug',
        lazy: async () => ({ Component: (await import('./pages/ProjectPage')).default }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
