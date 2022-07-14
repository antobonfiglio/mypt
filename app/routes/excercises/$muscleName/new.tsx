import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useParams } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  return null;
};

export const action: ActionFunction = async ({ request, params }) => {
  const { muscleName } = params;
  const form = await request.formData();
  const name = form.get("name");
  const description = form.get("description");
  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (typeof name !== "string" || typeof description !== "string") {
    throw new Error(`Form not submitted correctly.`);
  }

  let muscleGroup = await db.muscleGroup.findFirst({
    where: {
      name: {
        equals: muscleName,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  const muscleGroupId = muscleGroup ? muscleGroup.id : 0;
  await db.excercise.create({
    data: {
      name,
      description,
      muscleGroupId: muscleGroupId,
    },
  });

  return redirect(`/excercises/${muscleName}`);
};

export default function NewExcerciseRoute() {
  const { muscleName } = useParams();
  return (
    <div className="flex m-auto flex-col w-full">
      <div className="flex justify-between pb-8">
        <h1>
          <Link to={"/excercises"}>Excercises</Link>
          &gt;
          <Link to={`/excercises/${muscleName}`}>{muscleName}</Link>
          &gt; New excercise
        </h1>
      </div>
      <div className="grid gap-4 justify-center">
        <p>Add your own excercise</p>
        <form method="post" className="grid gap-4">
          <div className="grid gap-4">
            <label>Name:</label>
            <input type="text" name="name" />
            <label>Description:</label>
            <textarea name="description" rows={5} />
          </div>

          <button type="submit" className="button-primary">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
