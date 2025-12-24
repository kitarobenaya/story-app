import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import App from './pages/App.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import getAnonId from './utils/getAnonId.js'
import './styles/index.css'

// Generate and store anonId when app loads
getAnonId();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)