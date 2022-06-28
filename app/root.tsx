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
      <body>
        <Navbar user={data.user} />
        <main>
          <div className="relative mx-[10vw] text-center">
            <Outlet />
          </div>
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
    <footer className="pb-16 pt-48">
      <div className="relative mx-[10vw] text-center">
        <strong>MyPT</strong> Copyright 2022
      </div>
    </footer>
  );
}
