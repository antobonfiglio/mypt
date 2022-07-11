import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  workouts: Array<{ id: number; name: string }>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
   const data: LoaderData = {
     workouts: await db.workout.findMany({
       take: 30,
       select: { id: true, name: true },
       orderBy: { name: "desc" },
     }),
   };
   return json(data);
};

export default function WorkoutIndexRoute() {
  const data = useLoaderData<LoaderData>()
  return (
    <>
      <div className="flex justify-between">
        <p> Pick a workout or create your own </p>
        <Link to={`/workouts/new`}>Create new +</Link>
      </div>
      <div className="grid justify-center pt-4">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.workouts.map((workout, index) => (
            <Link key={index} to={workout.name.toLowerCase()}>
              <li key={workout.id} className="h-40 w-60 border-2 p-4">
                {workout.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}
