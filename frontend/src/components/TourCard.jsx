import { toursImages } from "@/apis/baseApiURL";
import { parseISO, formatDate } from "date-fns";
import { Link } from "react-router-dom";
function TourCard({ tour }) {
  const {
    name,
    imageCover,
    difficulty,
    duration,
    summary,
    startLocation,
    startDates,
    locations,
    maxGroupSize,
    price,
    ratingsAverage,
    ratingsQuantity,
    id,
  } = tour;

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__picture">
          <div className="card__picture-overlay">&nbsp;</div>
          <img
            src={`${toursImages}/${imageCover}`}
            alt={name}
            className="card__picture-img"
            crossOrigin="anonymous"
          />
        </div>

        <h3 className="heading-tertirary">
          <span>{name}</span>
        </h3>
      </div>

      <div className="card__details">
        <h4 className="card__sub-heading">{`${difficulty} ${duration}-day tour`}</h4>
        <p className="card__text">{summary}</p>
        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="img/icons.svg#icon-map-pin"></use>
          </svg>
          <span>{startLocation.description}</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="img/icons.svg#icon-calendar"></use>
          </svg>
          <span>{formatDate(parseISO(startDates[0]), "MMM yyy")}</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="img/icons.svg#icon-flag"></use>
          </svg>
          <span>{locations.length}</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="img/icons.svg#icon-user"></use>
          </svg>
          <span>{maxGroupSize}</span>
        </div>
      </div>

      <div className="card__footer">
        <p>
          <span className="card__footer-value">${price} </span>
          <span className="card__footer-text">per person</span>
        </p>
        <p className="card__ratings">
          <span className="card__footer-value">{ratingsAverage} </span>
          <span className="card__footer-text">rating ({ratingsQuantity})</span>
        </p>
        <Link to={`/tour-detail/${id}`} className="btn btn--green btn--small">
          Detail
        </Link>
        {/* <a href={`/tour-detail/${id}`} className="btn btn--green btn--small">
          Details
        </a> */}
      </div>
    </div>
  );
}

export default TourCard;
