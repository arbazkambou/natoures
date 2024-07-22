import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { resetPasswordApi } from "../apis/authApis";
import toast from "react-hot-toast";
import { useParams } from "react-router";

function ResetPassword() {
  const { resetToken } = useParams();
  const { handleSubmit, register, reset } = useForm();
  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: resetPasswordApi,
    mutationKey: ["resetPassword"],
    onSuccess: (message) => {
      toast.success(message);
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    resetPassword({ resetToken, data });

    reset();
  }
  return (
    <div className="login-form">
      <h2 className="heading-secondary ma-bt-lg">Reset account password</h2>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form__group ma-bt-md">
          <label className="form__label" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            className="form__input"
            type="password"
            placeholder="••••••••"
            required
            minLength="8"
            {...register("password", { required: true })}
          />
        </div>
        <div className="form__group ma-bt-md">
          <label className="form__label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            className="form__input"
            type="password"
            placeholder="••••••••"
            required
            minLength="8"
            {...register("passwordConfirm", { required: true })}
          />
        </div>
        <div className="form__group flex justify-between">
          <button className="btn btn--green" type="submit" disabled={isPending}>
            {isPending ? "Reseting..." : "Reset"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
