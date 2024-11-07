import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../Services/apiAuth";

export function useLogin() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: async (response) => {
      if (!response.ok) {
        let responseData = await response.json();
        setErrors(responseData);
      }
      navigate("/home");
    },
    onError: (error) => console.log("Doslo je do greske," + error.response),
  });
  return { login, isLoading, errors };
}
