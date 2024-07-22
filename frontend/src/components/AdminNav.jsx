import { Link } from "react-router-dom";

function AdminNav() {
  return (
    <div className="admin-nav">
      <h5 className="admin-nav__heading">Admin</h5>
      <ul className="side-nav">
        <li>
          <Link to={"tours"}>
            <svg>
              <use xlinkHref="img/icons.svg#icon-map"></use>
            </svg>
            Manage tours
          </Link>
        </li>
        <li>
          <Link to={"users"}>
            <svg>
              <use xlinkHref="img/icons.svg#icon-users"></use>
            </svg>
            Manage users
          </Link>
        </li>
        <li>
          <Link to={"reviews"}>
            <svg>
              <use xlinkHref="img/icons.svg#icon-star"></use>
            </svg>
            Manage reviews
          </Link>
        </li>
        <li>
          <Link to={"bookings"}>
            <svg>
              <use xlinkHref="img/icons.svg#icon-briefcase"></use>
            </svg>
            Manage bookings
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminNav;
