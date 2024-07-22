import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { createReview } from "../apis/reviewApis";

function CreateReviewForm() {
  const { handleSubmit, register, reset } = useForm();
  const { user } = useContext(AuthContext);
  const { tourId } = useParams();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      toast.success("Review has been submit. Thanks!");
      queryClient.invalidateQueries({ queryKey: ["tour", tourId] });
      queryClient.invalidateQueries({ queryKey: ["reviews", user.id] });
      //   navigate(0);
    },
    onError: (err) => toast.error(err.message),
  });
  function onSubmit(data) {
    mutate({ tourId, data });

    reset();
  }
  return (
    <div className="login-form">
      <h2 className="heading-secondary ma-bt-lg">Write something about tour</h2>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form__group ma-bt-md">
          <textarea
            name="review"
            id="review"
            className="form__input"
            rows={5}
            {...register("review", { required: true })}
            disabled={isPending}
          ></textarea>
        </div>
        <div className="form__group ma-bt-md">
          <label className="form__label" htmlFor="email">
            Give rating
          </label>
          <input
            id="rating"
            className="form__input"
            type="number"
            min={1}
            max={5}
            step={0.1}
            placeholder="between 1 and 5"
            required
            {...register("rating", { required: true })}
            disabled={isPending}
          />
        </div>
        <div className="form__group">
          <button className="btn btn--green" type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateReviewForm;
