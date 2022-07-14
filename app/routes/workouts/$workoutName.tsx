import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  id: number;
  name: String;
  description: String | null;
};

export const loader: LoaderFunction = async ({ params }) => {
  let { workoutName } = params;
  const workout = await db.workout.findFirst({
    where: {
      name: {
        equals: workoutName,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  if (workout === null) return json({ status: 401 });

  const data: LoaderData = workout;

  return json(data);
};

export default function WorkoutRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <header className="layout-container">
        {/* <div className="border-2 mx-auto mb-24 grid h-auto grid-cols-4 gap-x-4 pt-24 md:grid-cols-8 lg:relative lg:mb-64 lg:min-h-[40rem] lg:grid-cols-12 lg:gap-x-6 lg:pb-12"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-[100%] gap-4 mb-24 h-auto items-center">
          {/* <!-- hero punchline --> */}
          <div className="flex flex-col items-start">
            <Link to={"/workouts"} className="text-xl font-semibold underline">
              Workouts 
            </Link>
            <h2>{data.name}</h2>
            <p className="pt-10">
              {data.description}
            </p>
          </div>
          {/* <!-- hero image --> */}
          <aside className="relative">
            <ul className="bg-black text-gray-300 p-4">
              <li className="mb-8">
                <span>GOAL</span>
                <p className="font-bold text-white text-xl">
                  Strength, Hypertrophy, Fat Loss
                </p>
              </li>
              <li className="mb-8">
                <span>SKILL LEVEL</span>
                <p className="font-bold text-white text-xl">Beginner</p>
              </li>
              <li className="mb-8">
                <span>DURATION</span>
                <p className="font-bold text-white text-xl">4 weeks</p>
              </li>
              <li className="mb-8">
                <span>DAYS PER WEEK</span>
                <p className="font-bold text-white text-xl">3-6</p>
              </li>
              <li className="mb-8">
                <span>TYPE</span>
                <p className="font-bold text-white text-xl">
                  Muscle Endurance, Strength Training
                </p>
              </li>
            </ul>
            <div className="w-full h-full bg-lime-400 absolute top-[10px] left-[10px] z-[-1]"></div>
          </aside>
        </div>
      </header>
      <div className="layout-container">
        <h2 className="border-b-black border-b-4">
          THE PLAN
        </h2>

      </div>
    </>
  );
}
