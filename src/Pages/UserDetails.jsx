import { Controller, useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import { useNavigate } from "react-router-dom";
import ValidationError from "../Ui/ValidationError";

function UserDetails() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  async function submitStep2(requestBody) {
    const data = await fetch("https://localhost:7257/Api/Auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    let response = await data.json();
    if (response?.isSuccess) {
      navigate("/home");
    } else {
      handleServerErrors(response?.errors);
    }
  }

  function handleServerErrors(serverErrors) {
    serverErrors.forEach((err) => {
      setError(err?.code, { type: "server", message: err.message });
    });
  }

  return (
    <form
      onSubmit={handleSubmit(submitStep2)}
      className="flex flex-col gap-5 w-full sm:w-1/2 md:w-1/4"
    >
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
        <input
          type="text"
          className="grow"
          placeholder="Username"
          {...register("username", {
            required: "Username is required",
          })}
        />
      </label>
      {errors?.username && <ValidationError error={errors?.username.message} />}
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
          {...register("password", {
            required: "Password is required",
          })}
        />
      </label>

      {errors?.password && <ValidationError error={errors?.password.message} />}

      <Controller
        name="phoneNumber"
        control={control}
        rules={{ required: "Phone number is required" }}
        render={({ field }) => (
          <PhoneInput
            {...field}
            containerClassName="custom-phone-input-container"
            inputClassName="custom-phone-input"
            defaultCountry="rs"
          />
        )}
      />
      {errors?.phoneNumber && (
        <ValidationError error={errors?.phoneNumber.message} />
      )}
      <button className="btn btn-primary bg-myLightBlue text-xl border-myLightBlue">
        Next
      </button>
    </form>
  );
}

export default UserDetails;
