import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordApi } from "../apis/authApis";
import toast from "react-hot-toast";

function ForgotPassword() {
  const { handleSubmit, register, reset } = useForm();
  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: forgotPasswordApi,
    mutationKey: ["forgotPassword"],
    onSuccess: (message) => {
      toast.success(message);
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    forgotPassword(data);

    reset();
  }
  return (
    <div className="login-form">
      <h2 className="heading-secondary ma-bt-lg">Forgot password</h2>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form__group">
          <label className="form__label" htmlFor="email">
            Enter your email address
          </label>
          <input
            id="email"
            className="form__input"
            type="email"
            placeholder="you@example.com"
            required
            {...register("email", { required: "true" })}
          />
        </div>

        <div className="form__group flex justify-between">
          <button className="btn btn--green" type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
