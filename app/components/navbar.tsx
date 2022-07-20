import { Link, useLocation } from "@remix-run/react";
import Logo from "./logo";

const LINKS = [
  { name: "Workouts", to: "/workouts" },
  { name: "Excercises", to: "/excercises" },
  { name: "Nutrition", to: "/nutrition" },
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
      <nav className="mx-auto flex max-w-[96rem] items-center justify-between">
        <div className="flex items-center">
          <Link to={"/"} className="flex items-center">
            <Logo className="h-[48px] w-[48px]" />
            <h3 className="pr-24 text-black">MyPT</h3>
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
            <div className="hidden md:block">
              Hi&nbsp;
              <span className="first-letter:uppercase">{`${user.username}`}</span>
              !
            </div>
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
  const isSelected = to === location.pathname || location.pathname.startsWith(`${to}/`);
  const style = isSelected ? 'text-black' : '';
  return (
    <li>
      <Link
        prefetch="intent"
        className={`focus:outline-none block whitespace-nowrap text-lg font-medium hover:text-team-current focus:text-team-current ${style}`}
        to={to}
        {...rest}
      />
    </li>
  );
}
