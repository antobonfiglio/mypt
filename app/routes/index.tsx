import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  workouts: Array<{ id: number; name: string }>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const data: LoaderData = {
    workouts: await db.workout.findMany({
      take: 30,
      select: { id: true, name: true },
      orderBy: { name: "desc" },
    }),
  };
  return json(data);
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <header className="layout-container">
        {/* <div className="border-2 mx-auto mb-24 grid h-auto grid-cols-4 gap-x-4 pt-24 md:grid-cols-8 lg:relative lg:mb-64 lg:min-h-[40rem] lg:grid-cols-12 lg:gap-x-6 lg:pb-12"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-[100%] gap-4 mb-24 h-auto items-center">
          {/* <!-- hero punchline --> */}
          <div className="flex flex-col">
            <h2>
              Start building the{" "}
              <text className="font-extrabold">best version</text> of yourself
            </h2>
            <h4>
              <b>Healthier. Stronger. Happier.</b>
            </h4>
            <Link to={"/signup"} className="pt-6">
              <button className="button-primary">Get Started</button>
            </Link>
          </div>
          {/* <!-- hero image --> */}
          <figure className="relative">
            <img
              srcSet="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3269&q=80 480w, https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3269&q=80 800w"
              sizes="(max-width: 600px) 480px,800px"
              src="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3269&q=80"
              alt="Illustration"
            />
            <div className="w-full h-full bg-lime-400 absolute top-[10px] left-[10px] z-[-1]"></div>
          </figure>
        </div>
      </header>
      <section className="flex flex-col text-center mb-24">
        <h3>
          Chose a <text className="font-extrabold">workout plan</text> or create
          your own
        </h3>
        <p>
          Pick a workout that best satisfies your goals. Track your progress and keep pushing!
        </p>
        <ul className="flex mt-16 p-2 overflow-x-scroll no-scrollbar">
          {data.workouts.map((workout, index) => (
            <Link key={index} to={`/workouts/${workout.name.toLowerCase()}`}>
              <li
                key={workout.id}
                className="relative overflow-hidden h-60 w-80 border-1 p-4 border-black rounded-md bg-gray-800 text-white hover:text-lime-400 ml-4"
              >
                <div className="absolute bottom-[-210px] md:opacity-30 text-[450px] text-gray-600">
                  W
                </div>
                <span className="absolute z-1 left-0 bottom-0 p-4 text-2xl text-left">
                  {workout.name}
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </section>
      <section className="layout-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24">
          <figure className="relative">
            <img
              srcSet="https://images.unsplash.com/photo-1605296867424-35fc25c9212a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80"
              sizes="(max-width: 600px) 480px,800px"
              src="https://images.unsplash.com/photo-1605296867424-35fc25c9212a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80"
              alt="Illustration 2"
            />
            <div className="w-full h-full bg-lime-400 absolute top-[10px] right-[10px] z-[-1]"></div>
          </figure>
          {/* <!-- hero punchline --> */}
          <div className="flex flex-col md:pl-16">
            <h3>Create your own workout routine</h3>
            <p>
              Get access to the most comprehensive catalogue of free excercises
              and start creating your personalised workout planes.
            </p>
            <Link to={"/excercises"} className="pt-6">
              <button className="button-primary">Excercises</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
