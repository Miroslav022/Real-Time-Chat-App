import { useNavigate } from "react-router-dom";

function UserDetails() {
  const navigate = useNavigate();
  function submitStep2() {
    navigate("/home");
  }
  return (
    <div className="flex flex-col gap-5 w-full sm:w-1/2 md:w-1/4">
      <div className="flex flex-col items-center gap-5">
        <img
          src="../public/avatar.jpg"
          alt="avatar"
          className="w-1/3 rounded-full"
        />
        <p>Upload profile image</p>

        <input type="file" className="file-input w-full " />
      </div>
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input type="text" className="grow" placeholder="Username" />
      </label>
      <button
        onClick={submitStep2}
        className="btn btn-primary bg-myLightBlue text-xl border-myLightBlue"
      >
        Next
      </button>
    </div>
  );
}

export default UserDetails;
