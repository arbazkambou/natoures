import { useMutation } from "@tanstack/react-query";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { loginApi } from "../apis/authApis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";
function Login() {
  const { setUser } = useContext(AuthContext);
  const { handleSubmit, register, reset } = useForm();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,
    mutationKey: ["login"],
    onSuccess: (user) => {
      toast.success(`Welcome ${user.name}!`);
      localStorage.setItem("user", JSON.stringify(user));
      // setIsAuthenticated(true);
      setUser(user);
      navigate("/");
    },
    onError: (err) => toast.error(err.message),
  });
  // const { mutate, isPending } = useMutation({
  //   mutationFn: loginApi,
  //   mutationKey: ["login"],
  //   onSuccess: (user) => {
  //     toast.success(`Welcome ${user.name}!`);
  //     localStorage.setItem("user", JSON.stringify(user));
  //     // setIsAuthenticated(true);
  //     setUser(user);
  //     navigate("/");
  //   },
  //   onError: (err) => toast.error(err.message),
  // });

  function onSubmit(data) {
    data.rating = Number(data.rating);
    mutate(data);

    reset();
  }
  return (
    <div className="login-form">
      <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="form__group flex justify-between">
          <button className="btn btn--green" type="submit" disabled={isPending}>
            {isPending ? "Logging in..." : "login"}
          </button>
          <button
            className="btn btn--green"
            disabled={isPending}
            onClick={() => navigate("/forgotPassword")}
          >
            Forgot?
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
