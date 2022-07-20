import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { ExcerciseListItem } from "../new";

export type SelectableExcercise = {
  id: number;
  name: string;
};

type SelectableExcercisesProps = {
  selectedExcercises: Array<SelectableExcercise>;
  muscleGroup: ExcerciseListItem | undefined;
  onSelectExcercises: (excercises: Array<SelectableExcercise>) => void;
  onMuscleGroupClick: () => void;
};

export default function SelectableExcercises(
  props: SelectableExcercisesProps
): JSX.Element {
  const [selectedExcercises, setSelectedExcercises] = useState<
    Array<SelectableExcercise>
  >(props.selectedExcercises);

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load(
        `/excercises/${props.muscleGroup?.name.toLowerCase()}?index`
      );
    }
  }, [fetcher, props.muscleGroup?.name]);

  const excercises: Array<SelectableExcercise> = fetcher.data?.excercises;

  const addSelectedExcercise = (newExcercise: SelectableExcercise) => {
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
      <div className="md:col-span-4 w-[100%] pb-2">
        <div className="flex w-full">
          <h3
            onClick={props.onMuscleGroupClick}
            className="cursor-pointer pr-2"
          >
            &larr;
          </h3>
          <h3>{props.muscleGroup?.name}</h3>
        </div>
      </div>
      {fetcher.state === "loading" && <div>loading excercises ...</div>}
      {fetcher.type === "done" &&
        excercises?.map((excercise, index) => {
          const selected = selectedExcercises.find(
            (ex) => ex.id === excercise.id
          )
            ? "bg-black text-gray-100"
            : "bg-gray-200";
          return (
            <div
              key={`muscleGroup_${index}`}
              className={`${selected} h-48 w-48 cursor-pointer hover:bg-black text-gray-700  hover:text-gray-100 rounded-sm flex flex-col items-center justify-between`}
              onClick={() => addSelectedExcercise(excercise)}
            >
              <div className="mt-4 h-28 w-28 bg-white rounded-full shadow-sm"></div>
              <div className="mb-4 px-2 text-sm text-center">{excercise.name.toUpperCase()}</div>
            </div>
          );
        })}
      {fetcher.type === "done" && (!excercises || excercises.length === 0) && (
        <div className="md:col-span-4 w-[100%] pb-2 text-center">
          <p>No excercise found</p>
        </div>
      )}
    </>
  );
}
