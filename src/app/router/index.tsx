import { createBrowserRouter, Navigate } from 'react-router-dom'

import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { AdminLayout } from '@/widgets/layout'

export const router = createBrowserRouter([
  {
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/news/articles" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      {
        path: 'news/articles',
        lazy: () =>
          import('@/pages/news/ArticleListPage').then((m) => ({
            Component: m.ArticleListPage,
          })),
      },
      {
        path: 'news/articles/:articleId',
        lazy: () =>
          import('@/pages/news/ArticleDetailPage').then((m) => ({
            Component: m.ArticleDetailPage,
          })),
      },
    ],
  },
])
