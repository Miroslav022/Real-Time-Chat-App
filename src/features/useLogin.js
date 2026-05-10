import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { loginApi } from "../Services/apiAuth";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const { loginUser } = useAuth();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (response) => {
      if (!response) throw new Error("There is a problem with response data");

      if (response.status !== 200) {
        setErrors(response.data);
        return;
      }

      const result = response.data;
      loginUser(result);
      navigate("/home");
    },
    onError: (error) => {
      if (error.response && error.response.data && error.response.data.errors) {
        toast.error(error.response.data.errors[0][0].description);
      } else {
        toast.error("Something went wrong");
      }
      console.error("Error message:", error.response);
    },
  });
  return { login, isLoading, errors };
}
