import { Link } from "@remix-run/react";

export default function WorkoutIndexRoute() {
  return (
    <div className="flex justify-between pb-4 items-baseline">
        <h1>
          Pick a workout or create your own
        </h1>
        <Link to={`/workouts/new`}>Add New +</Link>
      </div>
  )
}
