// import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { updateMe } from "../apis/userApis";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { toast } from "react-hot-toast";
function UpdatePasswordForm() {
  const { setUser } = useContext(AuthContext);
  const { handleSubmit, reset, register } = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      toast.success("Settings updated successfully!");
      setUser(data);
    },
    onError: (error) => toast.error(error.message),
  });
  function onSubmit(data) {
    mutate(data);
    reset();
  }
  return (
    <div className="user-view__form-container">
      <h2 className="heading-secondary ma-bt-md">Password change</h2>
      <form
        className="form form-user-settings"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form__group">
          <label className="form__label" htmlFor="password-current">
            Current password
          </label>
          <input
            id="password-current"
            className="form__input"
            type="password"
            placeholder="••••••••"
            required
            minLength="8"
            {...register("password")}
            disabled={isPending}
          />
        </div>
        <div className="form__group">
          <label className="form__label" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            className="form__input"
            type="password"
            placeholder="••••••••"
            required
            minLength="8"
            {...register("newPassword")}
            disabled={isPending}
          />
        </div>
        <div className="form__group ma-bt-lg">
          <label className="form__label" htmlFor="password-confirm">
            Confirm password
          </label>
          <input
            id="password-confirm"
            className="form__input"
            type="password"
            placeholder="••••••••"
            required
            minLength="8"
            {...register("newPasswordConfirm")}
            disabled={isPending}
          />
        </div>
        <div className="form__group right">
          <button
            className="btn btn--small btn--green"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdatePasswordForm;
