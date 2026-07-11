import React from "react";
import { Link } from "react-router";

const Home = () => {

    return (

        <div className="home">

            <section className="hero">

                <h1>Share Rides, Save Money</h1>

                <p>

                    Connect with drivers travelling on the same route,
                    book seats and travel smarter.

                </p>

                <div className="hero-buttons">

                    <Link to="/search">

                        <button>

                            Find a Ride

                        </button>

                    </Link>

                    <Link to="/create-ride">

                        <button>

                            Offer a Ride

                        </button>

                    </Link>

                </div>

            </section>


            <section className="features">

                <div className="feature-card">

                    <h3>Affordable Travel</h3>

                    <p>

                        Share travel costs with fellow passengers.

                    </p>

                </div>

                <div className="feature-card">

                    <h3>Future Ride Booking</h3>

                    <p>

                        Book rides in advance for planned journeys.

                    </p>

                </div>

                <div className="feature-card">

                    <h3>Verified Drivers</h3>

                    <p>

                        Ratings and reviews help build trust.

                    </p>

                </div>

            </section>

        </div>

    );

};

export default Home;