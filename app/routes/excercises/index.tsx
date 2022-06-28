import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  excerciseListItems: Array<{ id: number; name: string }>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    excerciseListItems: await db.muscleGroup.findMany({
      take: 30,
      select: { id: true, name: true },
      orderBy: { name: "desc" },
    }),
  };
  return json(data);
};

export default function ExcercixesIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="relative mx-auto max-w-6xl text-left">
      <p>What muscle do you want to train?</p>
      <div className="grid justify-center pt-4">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.excerciseListItems.map((excercise, index) => (
            <Link key={index} to={excercise.name.toLowerCase()}>
              <li key={excercise.id} className="h-40 w-60 border-2 p-4">
                {excercise.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
