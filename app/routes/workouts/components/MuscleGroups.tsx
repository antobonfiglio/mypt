import type { ExcerciseListItem } from "../new";

type MuscleGroupProps = {
  muscleGroups: Array<ExcerciseListItem>;
  onMuscleGroupClick: (muscleGroup: ExcerciseListItem) => void;
};

export default function MuscleGroups(props: MuscleGroupProps) {
  return (
    <>
      <div className="md:col-span-4 w-full pb-2">
        <h3>Muscle Groups</h3>
      </div>
      {props.muscleGroups?.map((muscleGroup, index) => {
        return (
          <div
            key={`muscleGroup_${index}`}
            className="h-48 w-48 cursor-pointer bg-gray-200 hover:bg-black text-gray-700  hover:text-gray-100 rounded-sm flex flex-col items-center justify-between"
            onClick={() => props.onMuscleGroupClick(muscleGroup)}
          >
            <div className="mt-4 h-28 w-28 bg-white rounded-full shadow-sm"></div>
            <div className="mb-4 px-2 text-base text-center">
              {muscleGroup.name.toUpperCase()}
            </div>
          </div>
        );
      })}
    </>
  );
}
