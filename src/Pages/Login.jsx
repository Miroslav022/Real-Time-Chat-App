import { useForm } from "react-hook-form";
import "react-international-phone/style.css";
import { Link } from "react-router-dom";
import ValidationError from "../Ui/ValidationError";
import { useLogin } from "../features/useLogin";
import { useEffect, useState } from "react";
function Login() {
  // const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const { login, isLoading, errors: errorsApi } = useLogin();
  const [authError, setAuthError] = useState(null);

  async function submitStep1(requestBody) {
    login(requestBody);
  }
  useEffect(() => {
    handleServerErrors(errorsApi);
    function handleServerErrors(serverErrors) {
      if (serverErrors?.errors != null) {
        serverErrors.forEach((err) => {
          setError(err?.code, { type: "server", message: err.message });
        });
      } else {
        setAuthError(serverErrors?.detail);
      }
    }
  }, [errorsApi, setError, errors]);

  return (
    <form onSubmit={handleSubmit(submitStep1)} className="flex flex-col gap-5">
      <h1 className="text-5xl text-center">Hi!</h1>
      <p className="text-xl text-center">
        Type your email and password to log in.
      </p>
      {authError && <ValidationError error={authError} />}
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
        <input
          type="text"
          className="grow"
          placeholder="Email"
          defaultValue={"miroslav@gmail.com"}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email format.",
            },
          })}
        />
      </label>
      {errors?.email && <ValidationError error={errors?.email.message} />}
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="password"
          className="grow"
          placeholder="Password"
          defaultValue={"Miroslav02"}
          {...register("password", {
            required: "Password is required",
          })}
        />
      </label>
      {errors?.password && <ValidationError error={errors?.password.message} />}
      <button className="btn btn-primary bg-myLightBlue text-xl border-myLightBlue">
        Login
      </button>
      <div className="flex gap-1 justify-center">
        {" "}
        <p>Don&apos;t have an account?</p>
        <Link to="/auth/registration" className="text-myLightBlue">
          {isLoading ? "Loading..." : "Sign up"}
        </Link>
      </div>
    </form>
  );
}

export default Login;
