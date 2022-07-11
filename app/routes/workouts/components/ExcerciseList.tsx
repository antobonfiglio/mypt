import { useState } from "react";
import Modal from "~/components/modal";
import type { DayOfWeek } from "~/utils/utils";
import type { ExcerciseListItem } from "../new";
import MuscleGroups from "./MuscleGroups";
import NewExcercisePlan from "./NewExcercisePlan";
import type { SelectableExcercise } from "./SelectableExcercises";
import SelectableExcercises from "./SelectableExcercises";

type ExcerciseListProps = {
  day: DayOfWeek;
  muscleGroups: Array<ExcerciseListItem>;
};

export default function ExcerciseList(props: ExcerciseListProps): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [selectedExcercises, setSelectedExcercises] = useState<
    Array<SelectableExcercise>
  >([]);

  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState<ExcerciseListItem>();

  const changeModalState = () => {
    setIsModalVisible(!isModalVisible);
    setSelectedMuscleGroup(undefined);
  };

  const onMuscleGroupClick = (excercise: ExcerciseListItem) => {
    setSelectedMuscleGroup(excercise);
  };

  const onSelectExcercises = (excercises: Array<SelectableExcercise>) => {
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
          {selectedExcercises?.map((excercise) => {
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
            {(!selectedMuscleGroup && (
              <MuscleGroups
                onMuscleGroupClick={onMuscleGroupClick}
                muscleGroups={props.muscleGroups}
              />
            )) || (
              <SelectableExcercises
                selectedExcercises={selectedExcercises}
                muscleGroup={selectedMuscleGroup}
                onSelectExcercises={onSelectExcercises}
                onMuscleGroupClick={() => setSelectedMuscleGroup(undefined)}
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
