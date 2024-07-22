import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { signupApi } from "../apis/authApis";
import toast from "react-hot-toast";
function Signup() {
  const { handleSubmit, register, reset } = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: signupApi,
    mutationKey: ["signup"],
    onSuccess: (message) => {
      toast.success(message);
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    mutate(data);

    reset();
  }
  return (
    <div className="login-form">
      <h2 className="heading-secondary ma-bt-lg">Enter your details here</h2>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form__group">
          <label className="form__label" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            className="form__input"
            placeholder="e.g Arbaz Shoukat"
            required
            {...register("name", { required: "true" })}
          />
        </div>
        <div className="form__group">
          <label className="form__label" htmlFor="email">
            Email address
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
        <div className="form__group ma-bt-md">
          <label className="form__label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="form__input"
            type="password"
            placeholder="••••••••"
            required
            minLength="8"
            {...register("password", { required: true })}
          />
        </div>
        <div className="form__group ma-bt-md">
          <label className="form__label" htmlFor="passwordConfirm">
            Confirm password
          </label>
          <input
            id="passwordConfirm"
            className="form__input"
            type="password"
            placeholder="••••••••"
            required
            minLength="8"
            {...register("passwordConfirm", { required: true })}
          />
        </div>
        <div className="form__group">
          <button className="btn btn--green" type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
