import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { DayOfWeek } from "~/utils/utils";
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
  const goal = formData.get("goal") as string;
  const type = formData.get("type") as string;
  const trainingLevel = formData.get("trainingLevel") as string;
  const equipment = formData.get("equipment") as string;
  let selectedExcercises: Array<ExcercisePlanInput> = [];

  const addOrUpdateExcercise = (
    key: string,
    value: string,
    dayId: number,
    excerciseId: number
  ) => {
    const excercise: ExcercisePlanInput | undefined = selectedExcercises.find(
      (e) => e.excerciseId === excerciseId && e.dayOfWeekId === dayId
    );
    if (excercise) {
      const updatedExcercise = { ...excercise, [key]: value };
      selectedExcercises = selectedExcercises.map((excercise) => {
        if (
          excercise.excerciseId === updatedExcercise.excerciseId &&
          excercise.dayOfWeekId === updatedExcercise.dayOfWeekId
        ) {
          return updatedExcercise;
        }
        return excercise;
      });
    } else {
      selectedExcercises.push({
        excerciseId: excerciseId,
        sets: key === "sets" ? value : "",
        reps: key === "reps" ? value : "",
        weight: "",
        weightFormat: "",
        userId: userId,
        dayOfWeekId: dayId,
      });
    }
  };

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
    let value = pair[1] as string;
    if (key.startsWith("sets") || key.startsWith("reps")) {
      const keyToArray = key.split("_"); // result > Array ["sets", "0", "1"]
      const fieldKey = keyToArray[0];
      const dayId = parseInt(keyToArray[1]);
      const excerciseId = parseInt(keyToArray[2]);
      addOrUpdateExcercise(fieldKey, value, dayId, excerciseId);
    }
  }

  console.log(selectedExcercises);

  // await db.workout.create({
  //   data: {
  //     name,
  //     description,
  //     creatorId: userId,
  //     goal: goal,
  //     type: type,
  //     level: trainingLevel,
  //     equipment: equipment,
  //     excercises: {
  //       create: selectedExcercises,
  //     },
  //   },
  // });

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
    <div className="layout-container">
      <h2>New Workout</h2>
      <form
        method="post"
        action="/workouts/new"
        className="grid grid-cols-1 gap-2 md:gap-4 pt-4"
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="eg. 3 days workout"
        />
        <label htmlFor="name">Description</label>
        <textarea
          name="description"
          placeholder="eg. Workout for beginners"
        ></textarea>
        <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="grid grid-cols-1 gap-4">
            <label htmlFor="name">Goal</label>
            <input
              type="text"
              name="goal"
              id="goal"
              placeholder="eg. Strength, Hypertrophy, Fat Loss"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <label htmlFor="name">Type</label>
            <input
              type="text"
              name="type"
              id="type"
              placeholder="eg. Split, Muscle Endurance, Strength Training"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <label htmlFor="name">Training Level</label>
            <input
              type="text"
              name="trainingLevel"
              id="trainingLevel"
              placeholder="eg. Beginner, Intermediate, Advanced"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <label htmlFor="name">Equipment</label>
            <input
              type="text"
              name="equipment"
              id="eqiupment"
              placeholder="eg. Beginner, Intermediate, Advanced"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <label htmlFor="name">Program Duration</label>
            <input type="text" name="duration" id="" placeholder="eg 4 weeks" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <label htmlFor="name">Days Per Week</label>
            <input type="text" name="daysPerWeek" id="" placeholder="eg 3-6" />
          </div>
        </fieldset>
        <fieldset className="grid grid-cols-7 gap-4">
          <legend className="py-4">Day of the week</legend>
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
          {selectedDays.length === 0 && (
            <div className="py-8 w-full text-center">
              <p>Select Day(s) of Workout</p>
            </div>
          )}
        </div>
        <div className="w-full text-right">
          <button className="button-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
