import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { BaseLayout } from '../layouts/BaseLayout';
import { WelcomePage } from '../../pages/WelcomePage';
import { AutorisationPage } from '../../pages/AutorisationPage';
import { VerificationPage } from '../../pages/VerificationPage';
import { ProfilePage } from '../../pages/ProfilePage'; // Импорт
import { NotFoundPage } from '../../pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      { path: "/", element: <WelcomePage /> },
      { path: "/auth", element: <AutorisationPage /> },
      { path: "/verify", element: <VerificationPage /> },
      { path: "/profile", element: <ProfilePage /> }, // Новый путь
      { path: "/404", element: <NotFoundPage /> },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};