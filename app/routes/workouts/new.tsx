import { ActionFunction, redirect } from "@remix-run/node";
import type { ChangeEvent} from "react";
import { useState } from "react";

type DayOfWeek = {
  id: string;
  label: string;
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

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const name = form.get("name");
  const description = form.get("description");


  return redirect(`/workouts}`);
};

export default function NewWorkoutRoute() {

    const [ selectedDays, setSelectedDays ] = useState<Array<DayOfWeek>>([]);

    const onDaySelected = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedDayValue = e.target.value;
        const selectedDayLabel = e.target.name;
        if(selectedDays.find(d => d.id === selectedDayValue)){
            setSelectedDays(selectedDays.filter((d: DayOfWeek) => d.id !== selectedDayValue));
        }else{

            setSelectedDays([
              ...selectedDays,
              { id: selectedDayValue, label: selectedDayLabel },
            ]);
        }
    };

    return (
      <>
        <h1>New Workout</h1>
        <form method="post" className="grid grid-cols-1 gap-4 pt-4">
          <input type="text" name="name" placeholder="eg. 3 days workout" />
          <textarea
            name="description"
            placeholder="eg. Workout for beginners"
          ></textarea>
          <fieldset className="grid grid-cols-7 gap-4">
            {daysOfWeek.map((day, index) => {
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
            {selectedDays.map((day, index) => {
              return (
                <div key={`sd_${index}`} className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between">
                    {day.label} <button>Add excercise +</button>
                  </div>
                  <div className="flex items-center border-2 p-1">
                    <div className="h-16 w-16 pt-1 pb-1 m-1 md:p-4 md:m-2 md:h-28 md:w-28 rounded-full bg-gray-400 flex justify-center items-center">
                      pic
                    </div>
                    <div className="grid grid-cols-2 gap-1 pl-4">
                      <span className="text-sm md:text-base col-span-2">
                        Overhead Dumbbell Extensions
                      </span>
                      <div className="flex flex-col">
                        <text className="text-xs md:text-sm">Sets</text>
                        <input
                          type="number"
                          name="sets"
                          id="sets"
                          placeholder="eg.3"
                          className="text-xs w-[60px] md:w-[80px] md:text-sm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <text className="text-xs md:text-sm">Reps</text>
                        <input
                          type="text"
                          name="reps"
                          id="reps"
                          placeholder="eg. 8-12"
                          className="text-xs w-[100px] md:text-sm md:w-[160px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </form>
      </>
    );
}
