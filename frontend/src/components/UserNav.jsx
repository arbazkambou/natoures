import { Link, NavLink } from "react-router-dom";

function UserNav() {
  return (
    <ul className="side-nav">
      <li className="side-nav">
        <NavLink to="/account">
          <svg>
            <use xlinkHref="img/icons.svg#icon-settings"></use>
          </svg>
          Settings
        </NavLink>
      </li>
      <li>
        <Link to="myBookings">
          <svg>
            <use xlinkHref="img/icons.svg#icon-briefcase"></use>
          </svg>
          My bookings
        </Link>
      </li>
      <li>
        <Link to="myReviews">
          <svg>
            <use xlinkHref="img/icons.svg#icon-star"></use>
          </svg>
          My reviews
        </Link>
      </li>
      <li>
        <Link to={"/account"}>
          <svg>
            <use xlinkHref="img/icons.svg#icon-credit-card"></use>
          </svg>
          Billing
        </Link>
      </li>
    </ul>
  );
}

export default UserNav;
