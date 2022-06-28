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
    <div className="flex flex-col w-[100%]">
      <div className="flex justify-between pb-4">
        <h1>
          <Link to={"/excercises"}>Excercises</Link>
          &gt;
          <Link to={`/excercises/${muscleName}`}>{muscleName}</Link>
          &gt; {data.name}
        </h1>
      </div>
      <h1>{data.name}</h1>
      <article>{data.description}</article>
    </div>
  );
}
