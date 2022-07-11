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
      <div className="md:col-span-4 w-[100%] text-lg">
        <span onClick={props.onMuscleGroupClick} className="cursor-pointer">
          Muscle Groups
        </span>{" "}
        &gt;
        <span>{props.muscleGroup?.name}</span>
      </div>
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
