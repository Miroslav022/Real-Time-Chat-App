import { Outlet } from "react-router-dom";

function Auth() {
  return (
    <div className="w-[80%] m-auto h-screen flex flex-col gap-5 justify-center items-center">
      <Outlet />
    </div>
  );
}

export default Auth;
