import { Link, useLocation } from "@remix-run/react";
import clsx from "clsx";
import Logo from "./logo";

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
    <div className="px-[2vw] py-9 lg:py-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <Link to={"/"} className="flex items-center">
            <Logo className="h-[48px] w-[48px]" />
            <h2 className="pr-24 text-3xl md:text-4xl">
              MyPT  
            </h2>
          </Link>
          <ul className="grid-cols-4 gap-8 md:grid hidden text-center">
            {LINKS.map((link, index) => (
              <NavLink key={index} to={link.to}>
                {link.name}
              </NavLink>
            ))}
          </ul>
        </div>
        {user ? (
          <div className="flex items-baseline">
            Hi&nbsp;
            <span className="hidden md:block first-letter:uppercase">{`${user.username}`}</span>
            !
            <form action="/logout" method="post" className="pl-4">
              <button type="submit" className="button">
                Logout
              </button>
            </form>
          </div>
        ) : (
          <div>
            <Link to={"/login"}>
              <button className="button">Sign In</button>
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
