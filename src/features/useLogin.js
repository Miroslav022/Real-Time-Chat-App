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
    onSuccess: async (response) => {
      if (!response.ok) {
        let responseData = await response.json();
        setErrors(responseData);
      }
      if (!response) throw new Error("There is a problem with response data");
      const result = await response.text();
      loginUser(result);
      navigate("/home");
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log("Error message:" + error.response);
    },
  });
  return { login, isLoading, errors };
}
