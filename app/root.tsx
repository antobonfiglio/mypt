import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { getUser } from "~/utils/session.server";
import { Navbar } from "./components/navbar";

import styles from "./styles/tailwind.css";
import Logo from "./components/logo";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  const data: LoaderData = {
    user,
  };
  return json(data);
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "My PT",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const data = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100 flex flex-col min-h-screen">
        <Navbar user={data.user} />
        <main>
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function Footer() {
  return (
    <div className="mt-auto">
      <footer className="mt-10 py-16 bg-black text-gray-300">
        <div className="relative mx-auto flex items-center justify-center">
          <Logo className="h-[48px] w-[48px] fill-gray-300" />
          <strong>MyPT</strong> &copy;2022
        </div>
      </footer>
    </div>
  );
}
