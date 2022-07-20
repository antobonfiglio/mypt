export type DayOfWeek = {
  id: string;
  label: string;
};

export const daysOfWeek: Array<DayOfWeek> = [
  { id: "0", label: "Sun" },
  { id: "1", label: "Mon" },
  { id: "2", label: "Tue" },
  { id: "3", label: "Wed" },
  { id: "4", label: "Thu" },
  { id: "5", label: "Fri" },
  { id: "6", label: "Sat" },
];

export function getDay(dayId: string) {
  return daysOfWeek.find((d) => d.id === dayId)?.label;
}

export function groupBy(objectArray: Array<any>, property: string) {
  return objectArray.reduce(function (acc, obj) {
    let key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

export type TrainingLevel = {
  value:string;
}

export const trainingLevel: Array<TrainingLevel> = [
  { value: "Beginner" },
  { value: "Intermediate" },
  { value: "Advanced" },
];