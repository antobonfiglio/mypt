import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getDay, groupBy } from "~/utils/utils";

type LoaderData = {
  id: number;
  name: String;
  creator: any;
  createdAt: any;
  description: String | null;
  excercises: Array<any>;
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
      createdAt: true,
      creator: {
        select: {
          username: true,
        },
      },
      excercises: {
        select: {
          sets: true,
          reps: true,
          dayOfWeekId: true,
          excercise: {
            select: {
              name: true,
              images: true,
              muscleGroup: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (workout === null) return json({ status: 401 });

  const data: LoaderData = workout;

  return json(data);
};

export default function WorkoutRoute() {
  const data = useLoaderData<LoaderData>();
  const groupedExcercises = groupBy(data.excercises, "dayOfWeekId");

  return (
    <>
      <header className="layout-container">
        {/* <div className="border-2 mx-auto mb-24 grid h-auto grid-cols-4 gap-x-4 pt-24 md:grid-cols-8 lg:relative lg:mb-64 lg:min-h-[40rem] lg:grid-cols-12 lg:gap-x-6 lg:pb-12"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-[100%] gap-4 mb-24 h-auto">
          {/* <!-- hero punchline --> */}
          <div className="flex flex-col items-start">
            <Link
              to={"/workouts"}
              className="text-xl font-semibold text-gray-600 pb-2"
            >
              Workouts
            </Link>
            <h2>{data.name}</h2>
            <div className="flex items-center text-gray-700">
              <div className="h-10 w-10 rounded-full bg-black my-4 mr-2"></div>
              <div className="flex flex-col">
                <div>
                  Created by
                  <span className="font-semibold">
                    &nbsp;{data.creator.username}
                  </span>
                </div>
                <div>{new Date(data.createdAt).toDateString()}</div>
              </div>
            </div>
            <p className="pt-6">{data.description}</p>
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
        <h3 className="py-4">THE PLAN</h3>
        {Object.keys(groupedExcercises).map((dayId) => {
          const excercises: Array<any> = groupedExcercises[dayId];
          const muscleGroups: Array<string> = excercises.reduce(
            (prev, current) => {
              let muscleGroup = current.excercise.muscleGroup.name;
              if (prev.indexOf(muscleGroup) === -1) {
                prev.push(muscleGroup);
              }
              return prev;
            },
            []
          );

          return (
            <div key={`day_${dayId}`}>
              <h4 className="pt-4">
                <span>{getDay(dayId)} - </span>
                <span>{muscleGroups.join(", ")} </span>
              </h4>
              <ul className="my-2">
                <li>
                  <ul className="pb-4 grid grid-cols-3">
                    <li className="bg-black text-white py-4 pl-4">Excercise</li>
                    <li className="bg-black text-white py-4">Sets</li>
                    <li className="bg-black text-white py-4">Reps</li>
                    {excercises.map((excercisePlan, index) => {
                      let isEven = index % 2 == 0;
                      let style = !isEven
                        ? "bg-gray-300 py-4"
                        : "bg-gray-200 py-4";
                      return (
                        <ExcerciseListItem
                          key={`excercise_${index}`}
                          name={excercisePlan.excercise.name}
                          reps={excercisePlan.reps}
                          sets={excercisePlan.sets}
                          style={style}
                        />
                      );
                    })}
                  </ul>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}

type ExcerciseListItemProp = {
  name: string;
  sets: string;
  reps: string;
  style: string;
};

function ExcerciseListItem(props: ExcerciseListItemProp) {
  return (
    <>
      <li className={`px-4 ${props.style}`}>{props.name}</li>
      <li className={props.style}>{props.sets}</li>
      <li className={props.style}>{props.reps}</li>
    </>
  );
}
