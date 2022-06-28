import { Outlet } from "@remix-run/react";

export default function ExcerciseRoute() {
  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="flex justify-center w-[100%] text-left">
        <Outlet />
      </div>
    </div>
  );
}
