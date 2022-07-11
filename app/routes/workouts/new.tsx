import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { DayOfWeek} from "~/utils/utils";
import { daysOfWeek } from "~/utils/utils";
import { redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

import ExcerciseList from "./components/ExcerciseList";

type ExcercisePlanInput = {
  excerciseId: number;
  sets: string;
  reps: string;
  weight: string;
  weightFormat: string;
  userId: string;
  dayOfWeekId: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    await requireUserId(request);
    return null;
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  let selectedExcercises: Array<ExcercisePlanInput> = [];

  /*
   The excercise list comes in the form of a key value pair:
   eg. key:sets_0_1 value:3
   The key contains 3 value separated by underscore '_'
   The field name: [sets | reps ]
   The dayId: 0 to 6 ( Sun - Fri )
   The excerciseId
  */
  for (const pair of formData.entries()) {
    let key = pair[0];
    let value = pair[1];
    if (key.startsWith("sets") || key.startsWith("reps")) {
      const keyToArray = key.split("_"); // result > Array ["sets", "0", "1"]
      const dayId = parseInt(keyToArray[1]);
      const excerciseId = parseInt(keyToArray[2]);
      const newExcercise: ExcercisePlanInput = {
        excerciseId: excerciseId,
        sets: key.startsWith("sets") ? value.toString() : "",
        reps: key.startsWith("reps") ? value.toString() : "",
        weight: "",
        weightFormat: "",
        userId: userId,
        dayOfWeekId: dayId,
      };

      let selectedExcercise = selectedExcercises.find(
        (exc) => exc.excerciseId === excerciseId && exc.dayOfWeekId === dayId
      );
      if (selectedExcercise) {
        selectedExcercises = [...selectedExcercises, newExcercise];
      } else {
        selectedExcercises.push(newExcercise);
      }
    }
  }

  await db.workout.create({
    data: {
      name,
      description,
      creatorId: userId,
      excercises: {
        create: selectedExcercises,
      },
    },
  });

  return redirect(`/workouts`);
};

export type ExcerciseListItem = {
  id: number;
  name: string;
};

export default function NewWorkoutRoute() {
  const [selectedDays, setSelectedDays] = useState<Array<DayOfWeek>>([]);

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load("/excercises?index");
    }
  }, [fetcher]);

  const muscleGroups: Array<ExcerciseListItem> =
    fetcher.data?.excerciseListItems;

  const onSelectDay = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (selectedDays.find((d) => d.id === value)) {
      setSelectedDays(selectedDays.filter((d: DayOfWeek) => d.id !== value));
    } else {
      setSelectedDays([...selectedDays, { id: value, label: name }]);
    }
  };

  return (
    <>
      <h1>New Workout</h1>
      <form
        method="post"
        action="/workouts/new"
        className="grid grid-cols-1 gap-4 pt-4"
      >
        <input type="text" name="name" placeholder="eg. 3 days workout" />
        <textarea
          name="description"
          placeholder="eg. Workout for beginners"
        ></textarea>
        <fieldset className="grid grid-cols-7 gap-4">
          {fetcher.state === "loading" && <div>loading excercises</div>}
          {fetcher.type === "done" &&
            daysOfWeek.map((day, index) => {
              return (
                <div
                  key={`dow_${index}`}
                  className="grid grid-cols-1 gap-2 justify-items-center"
                >
                  <input
                    type="checkbox"
                    name={day.label}
                    id={day.label}
                    value={day.id}
                    onChange={onSelectDay}
                  />
                  <label htmlFor={day.label}>{day.label}</label>
                </div>
              );
            })}
        </fieldset>
        <div className="grid grid-cols-1 gap-2">
          {selectedDays
            .sort((a, b) => parseInt(a.id) - parseInt(b.id))
            .map((day: DayOfWeek, index) => {
              return (
                <div key={index}>
                  <ExcerciseList day={day} muscleGroups={muscleGroups} />
                </div>
              );
            })}
        </div>
        <button className="button-primary">Save</button>
      </form>
    </>
  );
}