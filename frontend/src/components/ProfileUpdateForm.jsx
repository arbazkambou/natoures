import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { updateMe } from "../apis/userApis";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { usersImages } from "@/apis/baseApiURL";

function ProfileUpdateForm() {
  const [fileName, setFilName] = useState("Choose new photo");
  const { user, setUser } = useContext(AuthContext);
  const { name, email, photo } = user;
  const { handleSubmit, register } = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      toast.success("Settings updated successfully!");
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    },
    onError: (error) => toast.error(error.message),
  });

  function onSubmit(data) {
    const formData = new FormData();
    data.name && formData.append("name", data.name);
    data.email && formData.append("email", data.email);
    data.photo && formData.append("photo", data.photo[0]);
    mutate(formData);
  }

  function handleChange(e) {
    setFilName(e.target.files[0].name);
  }

  return (
    <div className="user-view__form-container">
      <h2 className="heading-secondary ma-bt-md">Your account settings</h2>
      <form className="form form-user-data" onSubmit={handleSubmit(onSubmit)}>
        <div className="form__group">
          <label className="form__label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="form__input"
            type="text"
            defaultValue={name}
            required
            {...register("name")}
            disabled={isPending}
          />
        </div>
        <div className="form__group ma-bt-md">
          <label className="form__label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            className="form__input"
            type="email"
            defaultValue={email}
            required
            {...register("email")}
            disabled={isPending}
          />
        </div>
        <div className="form__group form__photo-upload">
          <img
            className="form__user-photo"
            src={`${usersImages}/${photo}`}
            alt="User photo"
            crossOrigin="anonymous"
          />
          <input
            className="form__upload"
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            {...register("photo")}
            onChange={handleChange}
          />
          <label htmlFor="photo">{fileName}</label>
        </div>
        <div className="form__group right">
          <button
            className="btn btn--small btn--green"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save setting"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileUpdateForm;
