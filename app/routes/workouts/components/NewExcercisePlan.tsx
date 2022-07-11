import type { DayOfWeek } from "~/utils/utils";

type NewExcercisePlanProps = {
  id: string;
  name: string;
  day: DayOfWeek;
};

export default function NewExcercisePlan(props: NewExcercisePlanProps) {
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
