import { useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#121212]">
      <h1 className="text-9xl font-extrabold ignielTextGradient">{error.status}</h1>
      <p className="text-6xl font-extrabold ignielTextGradient">
        {error.statusText}
      </p>
    </div>
  );
};

export default ErrorPage;
