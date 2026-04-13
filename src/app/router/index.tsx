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
        path: 'batch',
        lazy: () =>
          import('@/pages/batch/BatchPage').then((m) => ({
            Component: m.BatchPage,
          })),
      },
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
      {
        path: 'news/clusters',
        lazy: () =>
          import('@/pages/cluster/ClusterListPage').then((m) => ({
            Component: m.ClusterListPage,
          })),
      },
      {
        path: 'news/clusters/:clusterId',
        lazy: () =>
          import('@/pages/cluster/ClusterDetailPage').then((m) => ({
            Component: m.ClusterDetailPage,
          })),
      },
    ],
  },
])
