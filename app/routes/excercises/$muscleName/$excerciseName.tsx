import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  id: number;
  name: String;
  description: String | null;
};

export const loader: LoaderFunction = async ({ params }) => {
  let { excerciseName } = params;
  const excercise = await db.excercise.findFirst({
    where: {
      name: {
        equals: excerciseName,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  if (excercise === null) return json({ status: 401 });

  const data: LoaderData = excercise;

  return json(data);
};

export default function ExcerciseRoute() {
  const data = useLoaderData<LoaderData>();
  const { muscleName } = useParams();
  return (
    <>
      <header className="layout-container">
        {/* <div className="border-2 mx-auto mb-24 grid h-auto grid-cols-4 gap-x-4 pt-24 md:grid-cols-8 lg:relative lg:mb-64 lg:min-h-[40rem] lg:grid-cols-12 lg:gap-x-6 lg:pb-12"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-[100%] gap-4 mb-24 h-auto items-center">
          {/* <!-- hero punchline --> */}
          <div className="flex flex-col items-start">
            <div>
              <Link
                to={"/excercises"}
                className="text-xl font-semibold pb-2 pr-2"
              >
                Excercises
              </Link>
              <span className="font-semibold text-gray-600">&gt;</span>
              <Link
                to={`/excercises/${muscleName}`}
                className="text-xl font-semibold pb-2 capitalize pl-2"
              >
                {muscleName}
              </Link>
            </div>
            <h2>{data.name}</h2>
            <p className="pt-4">{data.description}</p>
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
        <article></article>
      </div>
    </>
  );
}
