import { Outlet } from "react-router-dom";

function Auth() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-5">
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;
