import { Link, useLocation } from "@remix-run/react";
import clsx from "clsx";

const LINKS = [
  { name: "Workouts", to: "/workouts" },
  { name: "Excercises", to: "/excercises" },
  { name: "Nutrition", to: "/nutrition" },
  { name: "PT", to: "/pt" },
];

type NavProps = {
  user: {
    id: String;
    username: String;
  } | null;
};

export function Navbar(props: NavProps) {
  const user = props.user;
  return (
    <div className="px-[5vw] py-9 lg:py-12">
      <nav className="mx-auto flex max-w-7xl items-baseline justify-between">
        <div className="flex items-baseline align-middle">
          <Link to={"/"}>
            <h2 className="pr-24 text-4xl">MyPT</h2>
          </Link>
          <ul className="grid-cols-4 gap-8 md:grid hidden">
            {LINKS.map((link, index) => (
              <NavLink key={index} to={link.to}>
                {link.name}
              </NavLink>
            ))}
          </ul>
        </div>
        {user ? (
          <div className="flex items-baseline">
            <span>{`Hi ${user.username}`}</span>
            <form action="/logout" method="post" className="pl-4">
              <button type="submit" className="button-primary">
                Logout
              </button>
            </form>
          </div>
        ) : (
          <div>
            <Link to={"/login"}>
              <button className="button-primary">Login</button>
            </Link>
            &nbsp;
            <Link to={"/signup"}>
              <button className="button-primary">Sign up</button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}

function NavLink({
  to,
  ...rest
}: Omit<Parameters<typeof Link>["0"], "to"> & { to: string }) {
  const location = useLocation();
  const isSelected =
    to === location.pathname || location.pathname.startsWith(`${to}/`);

  return (
    <li>
      <Link
        prefetch="intent"
        className={clsx(
          "focus:outline-none block whitespace-nowrap text-lg font-medium hover:text-team-current focus:text-team-current",
          {
            underline: isSelected,
          }
        )}
        to={to}
        {...rest}
      />
    </li>
  );
}
