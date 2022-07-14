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
    <>
      <header className="layout-container">
        {/* <div className="border-2 mx-auto mb-24 grid h-auto grid-cols-4 gap-x-4 pt-24 md:grid-cols-8 lg:relative lg:mb-64 lg:min-h-[40rem] lg:grid-cols-12 lg:gap-x-6 lg:pb-12"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-[100%] gap-4 mb-24 h-auto items-center">
          {/* <!-- hero punchline --> */}
          <div className="flex flex-col items-start">
            <div className="text-xl font-semibold">
              <Link to={"/excercises"} className="underline pr-2">
                Excercises
              </Link>
              <h2 className="capitalize">{muscleName}</h2>
            </div>
            <h4>Choose an excercise from the list or create a new one.</h4>
            <Link to={`/excercises/${muscleName}/new`} className="pt-6">
              <button className="button-primary">New Excercixe</button>
            </Link>
          </div>
          {/* <!-- hero image --> */}
          <figure className="relative">
            <img
              srcSet="https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1474&q=80 600w"
              sizes="(max-width: 600px) 480px,800px"
              src="https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1474&q=80"
              alt="Illustration"
            />
            <div className="w-full h-full bg-lime-400 absolute top-[10px] left-[10px] z-[-1]"></div>
          </figure>
        </div>
      </header>
      <div className="layout-container">
        <div className="grid gap-4 justify-center">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.excercises.map((excercise, index) => {
              return (
                <Link key={index} to={excercise.name.toLowerCase()}>
                  <li
                    key={excercise.id}
                    className="h-40 w-60 border-1 p-4 border-black rounded-md bg-white shadow-md hover:shadow-lg"
                  >
                    {excercise.name}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
