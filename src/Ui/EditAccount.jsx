import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
// import ValidationError from "./ValidationError";
import { useEffect, useState } from "react";
import { useEditUser } from "../features/user/useEditUser";
import { useUpdateProfileImage } from "../features/user/useUpdateProfileImage";
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function EditAccount() {
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState("");
  const { editUserHandler, isLoading } = useEditUser();
  const { updateProfileImage, isUpdating } = useUpdateProfileImage();
  const navigation = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: user.email,
      username: user.username,
    },
  });

  function handleGoBackButton() {
    navigation("/home");
  }

  useEffect(() => {
    setProfilePicture(`https://localhost:7257/Uploads/${user.profilePicture}`);
  }, [setProfilePicture, user.profilePicture]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log({ Id: user.id.toString(), File: formData });
      updateProfileImage({ Id: user.id.toString(), File: formData });
      setProfilePicture(imageUrl);
    }
  };
  return (
    <div className="w-4/5 mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <div
        className="bg-myLightBlue w-9 h-9 flex items-center justify-center rounded-full m-0 p-0 cursor-pointer"
        onClick={handleGoBackButton}
      >
        <MdArrowBackIosNew />
      </div>
      <div className="flex items-center flex-col gap-3 justify-center mb-6">
        <img
          src={profilePicture}
          alt="Profile"
          className="w-[7rem] h-[7rem] rounded-full object-cover"
        />
        <label className="cursor-pointer bg-myLightBlue text-white px-3 py-1 m-0 rounded-lg">
          {isUpdating ? "uploading..." : "Change"}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      </div>
      <form
        className="space-y-5 flex flex-col"
        onSubmit={handleSubmit((data) => {
          console.log({ ...data, id: user.id, image: profilePicture });
          editUserHandler({ ...data, id: user.id, image: profilePicture });
        })}
      >
        <div className="grid gap-3">
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
              // {...register("email", { required: "Email is required" })}
              {...register("email")}
            />
          </label>
          {/* {errors?.email && <ValidationError error={errors?.email.message} />} */}
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
              // {...register("username", { required: "username is required" })}
              {...register("username")}
            />
          </label>
          {/* {errors?.username && (
            <ValidationError error={errors?.username.message} />
          )} */}
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
              {...register("password")}
              // {...register("password", { required: "password is required" })}
            />
          </label>
          {/* {errors?.password && (
            <ValidationError error={errors?.password.message} />
          )} */}
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
              placeholder="Confirm Password"
              // {...register("confirmPassword", {
              //   required: "password is required",
              // })}
            />
          </label>
          {/* {errors?.confirmPassword && (
            <ValidationError error={errors?.confirmPassword.message} />
          )} */}
        </div>
        <button className="w-full bg-myLightBlue font-bold text-lg p-3 rounded-lg">
          {isLoading ? "Saving changes..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default EditAccount;
