import { formatDate } from "date-fns";
import { useContext } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { AuthContext } from "../context/AuthProvider";
import { Link, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { bookTour } from "../apis/bookingApis";
import { toast } from "react-hot-toast";
import CreateReviewForm from "./CreateReviewForm";

function Tour({ tour }) {
  const {
    name,
    difficulty,
    duration,
    imageCoverPath,
    startLocation,
    startDates,
    locations,
    maxGroupSize,
    ratingsAverage,
    guides,
    description,
    imagesPath,
    reviews,
  } = tour;
  document.title = `Natours | ${tour.name}`;
  const { isAuthenticated, user } = useContext(AuthContext);
  const { mutate, isPending } = useMutation({
    mutationFn: bookTour,
    onError: (err) => toast.error(err.message),
  });

  const { tourId } = useParams();
  let isBooked = false;
  if (user.bookedTours.length > 0) {
    isBooked = user.bookedTours.some((el) => el.tour.id === tourId);
  }

  const isReviewed = reviews.some((el) => el.user.id === user.id);

  return (
    <>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            className="header__hero-img"
            src={imageCoverPath}
            alt={`${name}`}
            crossOrigin="anonymous"
          />
        </div>
        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{name}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-clock"></use>
              </svg>
              <span className="heading-box__text">{duration} days</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
              </svg>
              <span className="heading-box__text">
                {startLocation.description}
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-calendar"></use>
                </svg>
                <span className="overview-box__label">Next date</span>
                <span className="overview-box__text">
                  {formatDate(startDates[0], "MMM yyy")}
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-trending-up"></use>
                </svg>
                <span className="overview-box__label">Difficulty</span>
                <span className="overview-box__text">{difficulty}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-user"></use>
                </svg>
                <span className="overview-box__label">Participants</span>
                <span className="overview-box__text">{maxGroupSize}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-star"></use>
                </svg>
                <span className="overview-box__label">Rating</span>
                <span className="overview-box__text">{ratingsAverage} / 5</span>
              </div>
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {guides.map((guide) => (
                <div className="overview-box__detail" key={guide.id}>
                  <img
                    src={guide.imagePath}
                    alt={guide.name}
                    className="overview-box__img"
                    crossOrigin="anonymous"
                  />
                  <span className="overview-box__label">
                    {guide.role === "lead-guide" ? "Lead Guide" : "Tour Guide"}
                  </span>
                  <span className="overview-box__text">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">About {name} tour</h2>
          {description.split("\n").map((text, i) => (
            <p className="description__text" key={i}>
              {text}
            </p>
          ))}
        </div>
      </section>

      <section className="section-pictures">
        {imagesPath.map((img, i) => (
          <div className="picture-box" key={i}>
            <img
              className={`picture-box__img picture-box__img--${i + 1}`}
              src={img}
              alt="The Park Camper Tour 1"
              crossOrigin="anonymous"
            />
          </div>
        ))}
      </section>

      <section className="section-map">
        <div id="map">
          <MapContainer
            center={[locations[0].coordinates[1], locations[0].coordinates[0]]}
            zoom={6}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc, i) => (
              <Marker
                position={[loc.coordinates[1], loc.coordinates[0]]}
                key={i}
              >
                <Popup>
                  Day {loc.day}: {loc.description}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      <section className="section-reviews">
        <div className="reviews">
          {reviews.map((review, i) => (
            <div className="reviews__card" key={i}>
              <div className="reviews__avatar">
                <img
                  src={review.user.imagePath}
                  alt={review.user.name}
                  className="reviews__avatar-img"
                  crossOrigin="anonymous"
                />
                <h6 className="reviews__user">{review.user.name}</h6>
              </div>
              <p className="reviews__text">{review.review}</p>
              <div className="reviews__rating">
                {[1, 2, 3, 4, 5].map((el) => (
                  <svg
                    className={`reviews__star reviews__star--${
                      el <= review.rating ? "active" : "inactive"
                    }`}
                    key={el}
                  >
                    <use xlinkHref="/img/icons.svg#icon-star"></use>
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {!isBooked && (
        <section className="section-cta">
          <div className="cta">
            <div className="cta__img cta__img--logo">
              <img src="/img/logo-white.png" alt="Natours logo" className="" />
            </div>
            <img
              src={imagesPath[1]}
              alt=""
              className="cta__img cta__img--1"
              crossOrigin="anonymous"
            />
            <img
              src={imagesPath[0]}
              alt=""
              className="cta__img cta__img--2"
              crossOrigin="anonymous"
            />

            <div className="cta__content">
              <h2 className="heading-secondary">What are you waiting for?</h2>
              <p className="cta__text">
                {duration} days. 1 adventure. Infinite memories. Make it yours
                today!
              </p>
              {isAuthenticated && !isBooked ? (
                <button
                  className="btn btn--green span-all-rows"
                  onClick={() => mutate(tourId)}
                >
                  {isPending ? "Processing..." : "Book tour now!"}
                </button>
              ) : (
                <Link to="/login">
                  <button className="btn btn--green span-all-rows">
                    Login To Book Tour!
                  </button>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
      {isBooked && !isReviewed && <CreateReviewForm />}
    </>
  );
}

export default Tour;
