import type { ExcercisePlan } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import Modal from "~/components/modal";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

type DayOfWeek = {
  id: string;
  label: string;
};

type ExcerciseListItem = {
  id: number;
  name: string;
};

type NewExcercisePlan = {
    excerciseId: number;
    sets: string;
    reps: string;
    weight: string;
    weightFormat: string;
    userId: string;
    dayOfWeekId: number;
};

let daysOfWeek: Array<DayOfWeek> = [
  { id: "0", label: "Sun" },
  { id: "1", label: "Mon" },
  { id: "2", label: "Tue" },
  { id: "3", label: "Wed" },
  { id: "4", label: "Thu" },
  { id: "5", label: "Fri" },
  { id: "6", label: "Sat" },
];

export const loader: LoaderFunction = ({ request, params }) => {
  return null;
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  let selectedExcercises: Array<NewExcercisePlan> = [];

  for (const pair of formData.entries()) {
    let key = pair[0];
    let value = pair[1];
    // > sets_0_1, 3;
    if (key.startsWith("sets") || key.startsWith("reps")) {
      const keyToArray = key.split("_"); // > Array ["sets", "0", "1"]
      const dayId = parseInt(keyToArray[1]);
      const excerciseId = parseInt(keyToArray[2]);
      const newExcercise = {
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

  const onDaySelected = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedDayValue = e.target.value;
    const selectedDayLabel = e.target.name;
    if (selectedDays.find((d) => d.id === selectedDayValue)) {
      setSelectedDays(
        selectedDays.filter((d: DayOfWeek) => d.id !== selectedDayValue)
      );
    } else {
      setSelectedDays([
        ...selectedDays,
        { id: selectedDayValue, label: selectedDayLabel },
      ]);
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
                    onChange={onDaySelected}
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

/**
 * ExcerciseList component
 *
 *
 */

type NewExcerciseProps = {
  day: DayOfWeek;
  muscleGroups: Array<ExcerciseListItem>;
};

type Excercises = Array<{ id: number; name: string }>;

function ExcerciseList(props: NewExcerciseProps): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [selectedExcercises, setSelectedExcercises] = useState<Excercises>([]);

  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState<ExcerciseListItem>();

  const changeModalState = () => {
    setIsModalVisible(!isModalVisible);
  };

  const onMuscleGroupClick = (excercise: ExcerciseListItem) => {
    setSelectedMuscleGroup(excercise);
  };

  const renderMuscleGroups = () => {
    return props.muscleGroups?.map((muscleGroup, index) => {
      return (
        <div
          key={`muscleGroup_${index}`}
          className="h-40 w-40 border-2"
          onClick={() => onMuscleGroupClick(muscleGroup)}
        >
          {muscleGroup.name}
        </div>
      );
    });
  };

  const onSelectExcercises = (excercises: Array<SelectedEcercise>) => {
    setSelectedExcercises([...excercises]);
  };

  return (
    <div className="grid grid-cols-1 gap-4 border-2 p-4">
      <div className="flex justify-between">
        {props.day.label}
        <div onClick={changeModalState} className="cursor-pointer">
          Add excercise +
        </div>
      </div>
      {
        <>
          {selectedExcercises?.map((excercise, index) => {
            return (
              <NewExcercisePlan
                day={props.day}
                key={excercise.name}
                name={excercise.name}
                id={excercise.id.toString()}
              />
            );
          })}
        </>
      }
      {isModalVisible && (
        <Modal onClose={changeModalState} title={""}>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-1 justify-items-center">
            {selectedMuscleGroup && (
              <SelectableExcerciseList
                muscleGroup={selectedMuscleGroup}
                onSelectExcercises={onSelectExcercises}
              />
            )}
            {!selectedMuscleGroup && renderMuscleGroups()}
          </div>
        </Modal>
      )}
    </div>
  );
}

/**
 *
 * SelectableExcerciseList component
 *
 *
 */

type SelectedEcercise = {
  id: number;
  name: string;
};

type SelectableExcerciseListProps = {
  muscleGroup: ExcerciseListItem | undefined;
  onSelectExcercises: (excercises: Array<SelectedEcercise>) => void;
};

function SelectableExcerciseList(
  props: SelectableExcerciseListProps
): JSX.Element {
  const [selectedExcercises, setSelectedExcercises] = useState<
    Array<SelectedEcercise>
  >([]);

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load(
        `/excercises/${props.muscleGroup?.name.toLowerCase()}?index`
      );
    }
  }, [fetcher, props.muscleGroup?.name]);

  const excercises: Excercises = fetcher.data?.excercises; // the data from the loader

  const addSelectedExcercise = (newExcercise: SelectedEcercise) => {
    let excercises = selectedExcercises;
    if (excercises.find((ex) => ex.id === newExcercise.id)) {
      excercises = excercises.filter((ex) => ex.id !== newExcercise.id);
    } else {
      excercises = [...selectedExcercises, newExcercise];
    }
    setSelectedExcercises(excercises);
    props.onSelectExcercises(excercises);
  };

  return (
    <>
      {fetcher.state === "loading" && <div>loading excercises ...</div>}
      {fetcher.type === "done" &&
        excercises?.map((excercise, index) => {
          const selected = selectedExcercises.find(
            (ex) => ex.id === excercise.id
          )
            ? "border-gray-800"
            : "";
          return (
            <div
              key={`muscleGroup_${index}`}
              className={`h-40 w-40 border-2 ${selected}`}
              onClick={() => addSelectedExcercise(excercise)}
            >
              {excercise.name}
            </div>
          );
        })}
    </>
  );
}

/**
 * NewExcercisePlan component
 * @returns
 *
 */

type NewExcercisePlanType = {
  id: string;
  name: string;
  day: DayOfWeek;
};

function NewExcercisePlan(props: NewExcercisePlanType) {
  return (
    <div className="flex items-center border-2 p-1">
      <div className="h-16 w-16 pt-1 pb-1 m-1 md:p-4 md:m-2 md:h-28 md:w-28 rounded-full bg-gray-400 flex justify-center items-center">
        pic
      </div>
      <div className="grid grid-flow-col grid-rows-2 gap-2 pl-4 pb-8 items-end">
        <span className="text-sm md:text-base col-span-2">{props.name}</span>
        <div className="flex flex-col">
          <label htmlFor="sets" className="text-xs md:text-sm">
            Sets
          </label>
          <input
            type="number"
            name={`sets_${props.day.id}_${props.id}`}
            id={`sets_${props.day.id}_${props.id}`}
            placeholder="eg.3"
            title="How many sets?"
            className="text-xs w-[60px] md:w-[80px] md:text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="reps" className="text-xs md:text-sm">
            Reps
          </label>
          <input
            type="text"
            name={`reps_${props.day.id}_${props.id}`}
            id={`reps_${props.day.id}_${props.id}`}
            placeholder="eg. 8-12"
            title="How many repetitions foreach set"
            className="text-xs w-[100px] md:text-sm md:w-[160px]"
          />
        </div>
      </div>
    </div>
  );
}
