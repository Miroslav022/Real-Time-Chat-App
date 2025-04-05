import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserProfileImage } from "../../Services/apiUser";
import toast from "react-hot-toast";

export function useUpdateProfileImage() {
  const queryClient = useQueryClient();
  const { mutate: updateProfileImage, isPending: isUpdating } = useMutation({
    mutationFn: UpdateUserProfileImage,
    onSuccess: () => {
      toast.success("Image has been updated");
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
    onError: () => toast.error("Something went wrong"),
  });

  return { updateProfileImage, isUpdating };
}
