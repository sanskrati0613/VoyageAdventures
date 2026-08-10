const bookingResult =
    document.getElementById("booking-result");

const bookingsMessage =
    document.getElementById("bookings-message");

const API_BASE_URL =
    "https://voyageadventures-backend.onrender.com";


async function loadMyBookings() {

    const userToken =
        localStorage.getItem("userToken");


    // User is not logged in
    if (!userToken) {

        bookingsMessage.textContent =
            "Please login to view your bookings.";

        bookingResult.innerHTML = `
            <div class="booking-result-card">

                <p>
                    Please login to view your bookings.
                </p>

                <button
                    onclick="window.location.href='login.html'">
                    Login
                </button>

            </div>
        `;

        return;
    }


    try {

        bookingsMessage.textContent =
            "Loading your bookings...";


        const response = await fetch(
            `${API_BASE_URL}/api/bookings/my`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${userToken}`
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load your bookings."
            );

        }


        // No bookings
        if (!data || data.length === 0) {

            bookingsMessage.textContent =
                "You don't have any bookings yet.";

            bookingResult.innerHTML = `
                <div class="booking-result-card">

                    <p>
                        You haven't booked any trips yet.
                    </p>

                </div>
            `;

            return;
        }


        bookingsMessage.textContent =
            `You have ${data.length} booking${
                data.length > 1 ? "s" : ""
            }.`;



        bookingResult.innerHTML =
            data.map(booking => `

                <div class="booking-result-card">

                    <div class="booking-result-header">

                        <div>

                            <span>
                                Booking Reference
                            </span>

                            <h2>
                                ${booking.bookingReference}
                            </h2>

                        </div>


                        <span class="booking-status">
                            ${booking.status}
                        </span>

                    </div>



                    <div class="booking-result-grid">

                        <p>
                            <strong>
                                Destination
                            </strong>

                            ${booking.destination}
                        </p>


                        <p>
                            <strong>
                                Travelers
                            </strong>

                            ${booking.travelers}
                        </p>


                        <p>
                            <strong>
                                Package
                            </strong>

                            ${booking.package}
                        </p>


                        <p>
                            <strong>
                                Start Date
                            </strong>

                            ${new Date(
                                booking.startDate
                            ).toLocaleDateString("en-IN")}
                        </p>


                        <p>
                            <strong>
                                End Date
                            </strong>

                            ${new Date(
                                booking.endDate
                            ).toLocaleDateString("en-IN")}
                        </p>


                        <p>
                            <strong>
                                Total Price
                            </strong>

                            ₹${Number(
                                booking.totalPrice
                            ).toLocaleString("en-IN")}
                        </p>

                    </div>



                    <div class="booking-request">

                        <strong>
                            Special Request
                        </strong>

                        <p>
                            ${
                                booking.specialRequest ||
                                "None"
                            }
                        </p>

                    </div>

                </div>

            `).join("");


    } catch (error) {

        console.error(
            "Failed to load bookings:",
            error
        );


        bookingsMessage.textContent =
            "Unable to load your bookings.";


        bookingResult.innerHTML = `
            <div class="booking-result-card">

                <p>
                    ${
                        error.message ||
                        "Unable to load your bookings."
                    }
                </p>

            </div>
        `;
    }
}


loadMyBookings();