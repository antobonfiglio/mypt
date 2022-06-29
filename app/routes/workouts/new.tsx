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
        <form action="" className="grid grid-cols-1 gap-4 pt-4">
          <input type="text" name="name" placeholder="eg. 3 days workout" />
          <textarea
            name="description"
            placeholder="eg. Workout for begineers"
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
              return <div key={`sd_${index}`}>{day.label}</div>;
            })}
          </div>
        </form>
      </>
    );
}
