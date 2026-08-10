const lookupForm = document.getElementById("booking-lookup-form");

const lookupError = document.getElementById("lookup-error");

const bookingResult = document.getElementById("booking-result");

lookupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  lookupError.textContent = "";
  bookingResult.innerHTML = "";

  const bookingReference = document
    .getElementById("booking-reference")
    .value.trim()
    .toUpperCase();

  const email = document
    .getElementById("booking-email")
    .value.trim()
    .toLowerCase();

  try {
    const response = await fetch("http://localhost:5000/api/bookings/lookup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingReference,
        email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Booking not found");
    }

    bookingResult.innerHTML = `
            <div class="booking-result-card">

                <div class="booking-result-header">
                    <div>
                        <span>Booking Reference</span>
                        <h2>${data.bookingReference}</h2>
                    </div>

                    <span class="booking-status">
                        ${data.status}
                    </span>
                </div>

                <div class="booking-result-grid">

                    <p>
                        <strong>Destination</strong>
                        ${data.destination}
                    </p>

                    <p>
                        <strong>Travelers</strong>
                        ${data.travelers}
                    </p>

                    <p>
                        <strong>Package</strong>
                        ${data.package}
                    </p>

                    <p>
                        <strong>Start Date</strong>
                        ${data.startDate}
                    </p>

                    <p>
                        <strong>End Date</strong>
                        ${data.endDate}
                    </p>

                    <p>
                        <strong>Total Price</strong>
                        ₹${data.totalPrice.toLocaleString("en-IN")}
                    </p>

                </div>

                <div class="booking-request">

                    <strong>Special Request</strong>

                    <p>
                        ${data.specialRequest || "None"}
                    </p>

                </div>

            </div>
        `;
  } catch (error) {
    console.error("Booking lookup failed:", error);

    lookupError.textContent = error.message || "Unable to find booking.";
  }
});

const latestBookingReference = sessionStorage.getItem("latestBookingReference");

if (latestBookingReference) {
  document.getElementById("booking-reference").value = latestBookingReference;
}
