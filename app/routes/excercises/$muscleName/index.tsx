import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  muscleGroup: String;
  excercises: {
    id: number;
    name: string;
  }[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const results = await db.excercise.findMany({
    where: {
      muscleGroup: {
        name: {
          equals: params.muscleName,
          mode: "insensitive",
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const data: LoaderData = {
    muscleGroup: params.muscleName!,
    excercises: results,
  };
  return json(data);
};

export default function ExcercisesByMuscleGroupRoute() {
  const data = useLoaderData<LoaderData>();
  const { muscleName } = useParams();

  return (
    <div className="flex flex-col w-[100%]">
      <div className="flex justify-between pb-4">
        <h1>
          <Link to={"/excercises"}>Excercises</Link>
          &gt;
          {muscleName}
        </h1>
        <Link to={`/excercises/${muscleName}/new`}>Add New +</Link>
      </div>
      <div className="grid gap-4 justify-center">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.excercises.map((excercise, index) => {
            return (
              <Link key={index} to={excercise.name.toLowerCase()}>
                <li key={excercise.id} className="h-40 w-60 border-2 p-4">
                  {excercise.name}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
