import { RouteObject } from "react-router-dom";
import WelcomePage from "@/pages/Welcome/WelcomePage";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/layouts/MainLayout";
import SocialMediaLayout from "@/layouts/SocialMediaLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Feed from "@/pages/Feed/Feed";
import Profile from "@/pages/Profile/Profile";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <WelcomePage /> }],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <SocialMediaLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/home", index: true, element: <Feed /> },
      { path: "/profile", index: true, element: <Profile /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
