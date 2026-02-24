import React from "react";
import NeumorphButton from "@/components/commons/neumorph-button";
import { useAuth } from "@/contexts/AuthContext";
import { UserInfo, UserUpdateRequest } from "@/services/auth";
import { useForm } from "react-hook-form";
import { useServices } from "@/contexts/ServicesContext";

const EditProfileForm = ({
  handleCloseDialog,
}: {
  handleCloseDialog: () => void;
}) => {
  const { user, setUser } = useAuth();
  const { authService } = useServices();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm<UserInfo>({
    defaultValues: user!,
  });

  const onSubmit = async (data: UserUpdateRequest) => {
    setIsLoading(true);
    try {
      const changedData: Partial<UserUpdateRequest> = {};
      Object.keys(dirtyFields).forEach((key) => {
        const typedKey = key as keyof UserUpdateRequest;
        changedData[typedKey] = data[typedKey];
      });

      if (Object.keys(changedData).length === 0) {
        return;
      }
      const updateResponse = await authService.updateMe(changedData);
      setUser(updateResponse);
      handleCloseDialog();
    } catch {
      // TODO: Add a valid toast message/indicator.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6">
      <h1 className="text-2xl font-bold text-left text-gray-700">
        Edit your profile
      </h1>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-2 items-start text-start gap-4">
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register("firstname")}
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register("lastname")}
              disabled={isLoading}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            {...register("username")}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <textarea
            id="bio"
            rows={5}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
            {...register("bio")}
            disabled={isLoading}
          />
        </div>
        <NeumorphButton fullWidth className="mt-8" loading={isLoading}>
          Save
        </NeumorphButton>
      </form>
    </div>
  );
};

export default EditProfileForm;
