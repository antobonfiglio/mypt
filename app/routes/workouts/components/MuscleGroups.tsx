import type { ExcerciseListItem } from "../new";

type MuscleGroupProps = {
  muscleGroups: Array<ExcerciseListItem>;
  onMuscleGroupClick: (muscleGroup: ExcerciseListItem) => void;
};

export default function MuscleGroups(props: MuscleGroupProps) {
  return (
    <>
      <div className="md:col-span-4 w-[100%] text-lg">Muscle Groups</div>
      {props.muscleGroups?.map((muscleGroup, index) => {
        return (
          <div
            key={`muscleGroup_${index}`}
            className="h-40 w-40 border-2 cursor-pointer"
            onClick={() => props.onMuscleGroupClick(muscleGroup)}
          >
            {muscleGroup.name}
          </div>
        );
      })}
    </>
  );
}
