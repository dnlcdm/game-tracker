import { createBrowserRouter, RouterProvider as RP } from "react-router";

export const RouterProvider = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <p>home</p>,
    },
    {
      path: "/browser",
      element: <p>lista de pesquisa</p>,
    },
  ]);

  return <RP router={router} />;
};
