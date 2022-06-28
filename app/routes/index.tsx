import { Link } from "@remix-run/react";

export default function IndexRoute() {
  return (
    <header className="relative mx-[10vw]">
      <div className="mx-auto mb-24 grid h-auto max-w-6xl grid-cols-4 gap-x-4 pt-24 md:grid-cols-8 lg:relative lg:mb-64 lg:min-h-[40rem] lg:grid-cols-12 lg:gap-x-6 lg:pb-12">
        {/* <!-- hero image --> */}
        <div className="lg:-mr-5vw col-span-full mb-12 flex items-center justify-center lg:col-span-7 lg:col-start-6 lg:mb-0 lg:-mt-24 lg:px-0">
          <img
            srcSet="https://via.placeholder.com/480 480w, https://via.placeholder.com/800 800w"
            sizes="(max-width: 600px) 480px,800px"
            src="https://via.placeholder.com/480"
            alt="Illustration"
          />
        </div>
        {/* <!-- hero punchline --> */}
        <div className="col-span-full grid h-fit grid-rows-3 gap-5 pt-6 lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <h2 className="leading-tight text-3xl md:text-4xl text-black">
            Training Harder To Gain A Healthy And Fit Body
          </h2>
          <p>
            We are always there to help you to make a healthy body which can
            healp to head.
          </p>
          <Link to={"/signup"}>
            <button className="button-primary">Get Started</button>
          </Link>
        </div>
      </div>
    </header>
  );
}
