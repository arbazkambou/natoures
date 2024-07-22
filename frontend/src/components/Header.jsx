import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../apis/authApis";
import { toast } from "react-hot-toast";

function Header() {
  const { isAuthenticated, user, setUser, setIsAuthenticated } =
    useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries();
      toast.success("You have been successfully logged out!");
      setUser("");
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      navigate("/login");
    },
    onError: (err) => toast.error(err.message),
  });
  const { name, imagePath } = user;
  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link to={"/"} className="nav__el">
          All tours
        </Link>
      </nav>
      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        {isAuthenticated ? (
          <>
            <button className="nav__el" onClick={mutate}>
              {isPending ? "Logging out..." : "Logout"}
            </button>
            <Link className="nav__el" to={"account"}>
              <img
                src={imagePath}
                alt={name}
                className="nav__user-img"
                crossOrigin="anonymous"
              />
              <span>{name?.split(" ")[0]}</span>
            </Link>
          </>
        ) : (
          <>
            <Link to={"/login"}>
              <button className="nav__el">Log in</button>
            </Link>
            <Link to={"/signup"}>
              {" "}
              <button className="nav__el nav__el--cta">Sign up</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
