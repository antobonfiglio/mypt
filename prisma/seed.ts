import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  var user = await db.user.create({
    data: {
      username: "antonio",
      email: "antobonfiglio@gmail.com",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
      roles: {
        create: [
          {
            name: "admin",
          },
          {
            name: "user.base",
          },
          {
            name: "user.pt",
          },
        ],
      },
    },
  });
  await Promise.all([
    getWorkouts().map(async (workout) => {
      return await db.workout.create({
        data: {
          name: workout.name,
          creatorId: user.id,
          description: workout.description!,
          level:'beginner'
        },
      });
    }),
    getMuscleGroups().map(async (muscle) => {
      return await db.muscleGroup.create({
        data: {
          name: muscle.name,
          excercises: {
            create: getExcercises(muscle.name),
          },
        },
      });
    }),
    getDays().map(async (day) => {
      return await db.dayOfWeek.create({
        data: {
          day,
        },
      });
    }),
  ]);
}

seed();

function getDays() {
  return [0, 1, 2, 3, 4, 5, 6];
}

function getWorkouts() {
  return [
    {
      name: "Fitness",
      description: "Fitness workout",
    },
    {
      name: "Bodybuilding",
      description: "Bodybuilding workout",
    },
    {
      name: "Powerlifting",
      description: "Powerlifting workout",
    },
    {
      name: "3 Day Gym workout plan",
      description: "3 Day Gym workout",
    },
    {
      name: "3 Day Home workout plan",
      description: "3 Day Home workout",
    },
    {
      name: "Fat burner routine",
      description: "Fat burner workout",
    },
    {
      name: "Abs burner",
      description: "Abs workout",
    },
    {
      name: "Chest power workout plan",
      description: "Chest workout",
    },
    {
      name: "Arms power workout plan",
      description: "Arms workout",
    },
    {
      name: "Legs power workout plan",
      description: "Legs workout",
    },
    {
      name: "Shoulders power workout plan",
      description: "Shoulders workout",
    },
    {
      name: "Back power workout plan",
      description: "Back workout",
    },
    {
      name: "Full body strech plan",
      description: "Full body strech workout",
    },
  ];
}

function getMuscleGroups() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Abs",
    },
    {
      name: "Back",
    },
    {
      name: "Biceps",
    },
    {
      name: "Calf",
    },
    {
      name: "Chest",
    },
    {
      name: "ForeArms",
    },
    {
      name: "Legs",
    },
    {
      name: "Shoulders",
    },
    {
      name: "Triceps",
    },
  ];
}

function getExcercises(muscle: String) {
  if (muscle === "Triceps") {
    return [
      {
        name: "Push-downs",
        description:
          "Push down until your elbows are fully extended but not yet in the straight, locked position. Keep your elbows close to your body and bend your knees slightly on the pushdown. Resist bending forward. Try to keep your back as straight as possible as you push down.",
      },
    ];
  }
}
