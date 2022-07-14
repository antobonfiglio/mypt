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
      <header className="layout-container">
        {/* <div className="border-2 mx-auto mb-24 grid h-auto grid-cols-4 gap-x-4 pt-24 md:grid-cols-8 lg:relative lg:mb-64 lg:min-h-[40rem] lg:grid-cols-12 lg:gap-x-6 lg:pb-12"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-[100%] gap-4 mb-24 h-auto items-center">
          {/* <!-- hero punchline --> */}
          <div className="flex flex-col">
            <h2>
              Workout Routines
              {/* <text className="font-extrabold">best version</text> of yourself */}
            </h2>
            <h4>Choose a workout from the list or create a new one.</h4>
            <Link to={"/workouts/new"} className="pt-6">
              <button className="button-primary">New Workout</button>
            </Link>
          </div>
          {/* <!-- hero image --> */}
          <figure className="relative">
            <img
              srcSet="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80 600w"
              sizes="(max-width: 600px) 480px,800px"
              src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Illustration"
            />
            <div className="w-full h-full bg-lime-400 absolute top-[10px] left-[10px] z-[-1]"></div>
          </figure>
        </div>
      </header>
      <div className="layout-container">
        <div className="grid justify-center pt-4">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.workouts.map((workout, index) => (
              <Link key={index} to={workout.name.toLowerCase()}>
                <li
                  key={workout.id}
                  className="h-40 w-60 border-1 p-4 border-black rounded-md bg-white shadow-md hover:shadow-lg"
                >
                  {workout.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
