export function AppError(err) {
  if (err.response.status === 403) {
    localStorage.removeItem("user");

    // Redirect to login page
    // window.location.href = "/login";
  }
  throw new Error(err.response.data.message);
}
