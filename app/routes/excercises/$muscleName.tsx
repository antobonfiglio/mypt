import { Outlet } from "@remix-run/react";

export default function ExcerciseRoute() {
  return (
    <div className="layout-container">
      <Outlet />
    </div>
  );
}
