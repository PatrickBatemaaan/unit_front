import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { BaseLayout } from '../layouts/BaseLayout';
import { WelcomePage } from '../../pages/WelcomePage';
import { AutorisationPage } from '../../pages/AutorisationPage';
import { VerificationPage } from '../../pages/VerificationPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { NotFoundPage } from '../../pages/NotFoundPage';
import { UsersPage } from '../../pages/UsersPage'; // <-- ИМПОРТИРУЕМ

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      { path: "/", element: <WelcomePage /> },
      { path: "/auth", element: <AutorisationPage /> },
      { path: "/verify", element: <VerificationPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/users", element: <UsersPage /> }, // <-- ДОБАВЛЯЕМ ПУТЬ
      { path: "/404", element: <NotFoundPage /> },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};