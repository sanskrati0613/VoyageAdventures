const API_BASE_URL = 'http://localhost:5000';
const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {
  window.location.href = "admin-login.html";
}

const destinationsContainer = document.getElementById("destinations-container");

const addDestinationButton = document.getElementById("add-destination-button");

const destinationModal = document.getElementById("destination-modal");

const closeDestinationModal = document.getElementById(
  "close-destination-modal",
);

const destinationForm = document.getElementById("destination-form");

const destinationModalTitle = document.getElementById(
  "destination-modal-title",
);

const destinationId = document.getElementById("destination-id");

const departureModal = document.getElementById("departure-modal");

const closeDepartureModal = document.getElementById("close-departure-modal");

const departureForm = document.getElementById("departure-form");

const departureModalTitle = document.getElementById("departure-modal-title");

const departureDestinationId = document.getElementById(
  "departure-destination-id",
);

const departureId = document.getElementById("departure-id");

const departureStartDate = document.getElementById("departure-start-date");

const departureEndDate = document.getElementById("departure-end-date");

const departureTotalSeats = document.getElementById("departure-total-seats");

const contactMessagesContainer = document.getElementById(
  "contact-messages-container",
);

const refreshContactMessages = document.getElementById(
  "refresh-contact-messages",
);

async function loadContactMessages() {
  contactMessagesContainer.innerHTML = "<p>Loading messages...</p>";

  try {
    const response = await adminFetch("http://localhost:5000/api/contact");

    if (!response.ok) {
      throw new Error("Failed to load contact messages");
    }

    const messages = await response.json();

    renderContactMessages(messages);
  } catch (error) {
    console.error("Failed to load contact messages:", error);

    contactMessagesContainer.innerHTML =
      "<p>Unable to load contact messages.</p>";
  }
}

function renderContactMessages(messages) {
  if (messages.length === 0) {
    contactMessagesContainer.innerHTML = `
            <div class="empty-messages">

                <h3>No Contact Messages</h3>

                <p>
                    You haven't received any messages yet.
                </p>

            </div>
        `;

    return;
  }

  contactMessagesContainer.innerHTML = messages
    .map((message) => {
      const date = new Date(message.createdAt).toLocaleString("en-IN");

      return `

                <div
                    class="contact-message-card
                    ${message.status === "New" ? "message-new" : ""}">

                    <div class="contact-message-header">

                        <div>

                            <h3>
                                ${escapeHtml(message.subject)}
                            </h3>

                            <span class="message-status
                                ${
                                  message.status === "New"
                                    ? "status-new"
                                    : "status-read"
                                }">

                                ${message.status}

                            </span>

                        </div>

                        <small>
                            ${date}
                        </small>

                    </div>


                    <div class="contact-message-info">

                        <strong>
                            ${escapeHtml(message.name)}
                        </strong>

                        <a
                            href="mailto:${escapeHtml(message.email)}">

                            ${escapeHtml(message.email)}

                        </a>

                    </div>


                    <p class="contact-message-body">

                        ${escapeHtml(message.message)}

                    </p>


                    <div class="contact-message-actions">

                        ${
                          message.status === "New"
                            ? `<button
                                class="mark-message-read"
                                data-id="${message._id}">

                                Mark as Read

                            </button>`
                            : `<button
                                class="mark-message-new"
                                data-id="${message._id}">

                                Mark as New

                            </button>`
                        }


                        <button
                            class="delete-contact-message"
                            data-id="${message._id}">

                            Delete

                        </button>

                    </div>

                </div>

            `;
    })
    .join("");

  attachContactMessageEvents();
}

function escapeHtml(value) {
  const div = document.createElement("div");

  div.textContent = value ?? "";

  return div.innerHTML;
}

function attachContactMessageEvents() {
  document.querySelectorAll(".mark-message-read").forEach((button) => {
    button.addEventListener("click", () => {
      updateContactMessageStatus(button.dataset.id, "Read");
    });
  });

  document.querySelectorAll(".mark-message-new").forEach((button) => {
    button.addEventListener("click", () => {
      updateContactMessageStatus(button.dataset.id, "New");
    });
  });

  document.querySelectorAll(".delete-contact-message").forEach((button) => {
    button.addEventListener("click", () => {
      deleteContactMessage(button.dataset.id);
    });
  });
}

async function updateContactMessageStatus(id, status) {
  try {
    const response = await adminFetch(
      `http://localhost:5000/api/contact/${id}/status`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update message");
    }

    await loadContactMessages();
  } catch (error) {
    console.error("Message status update failed:", error);

    alert(error.message || "Unable to update message.");
  }
}

async function deleteContactMessage(id) {
  const confirmed = confirm("Are you sure you want to delete this message?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await adminFetch(
      `http://localhost:5000/api/contact/${id}`,
      {
        method: "DELETE",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete message");
    }

    await loadContactMessages();

    alert("Message deleted successfully.");
  } catch (error) {
    console.error("Delete contact message failed:", error);

    alert(error.message || "Unable to delete message.");
  }
}

refreshContactMessages.addEventListener("click", loadContactMessages);

function openAddDepartureModal(destinationId) {
  departureForm.reset();

  departureDestinationId.value = destinationId;

  departureId.value = "";

  departureModalTitle.textContent = "Add Departure";

  // Prevent selecting past dates

  const today = new Date().toISOString().split("T")[0];

  departureStartDate.min = today;

  departureEndDate.min = today;

  departureModal.classList.add("active");
}

function openEditDepartureModal(destinationId, departure) {
  departureDestinationId.value = destinationId;

  departureId.value = departure._id;

  const today = new Date().toISOString().split("T")[0];

  // Prevent selecting past dates

  departureStartDate.min = today;

  departureEndDate.min = today;

  departureStartDate.value = departure.startDate.split("T")[0];

  departureEndDate.value = departure.endDate.split("T")[0];

  departureTotalSeats.value = departure.totalSeats;

  departureModalTitle.textContent = "Edit Departure";

  departureModal.classList.add("active");
}

function attachDepartureEvents(destinations) {
  document.querySelectorAll(".add-departure-button").forEach((button) => {
    button.addEventListener("click", () => {
      openAddDepartureModal(button.dataset.destinationId);
    });
  });

  document.querySelectorAll(".edit-departure-button").forEach((button) => {
    button.addEventListener("click", () => {
      const destination = destinations.find(
        (item) => item._id === button.dataset.destinationId,
      );

      const departure = destination.departures.find(
        (item) => item._id === button.dataset.departureId,
      );

      openEditDepartureModal(destination._id, departure);
    });
  });

  document.querySelectorAll(".delete-departure-button").forEach((button) => {
    button.addEventListener("click", () => {
      deleteDeparture(
        button.dataset.destinationId,

        button.dataset.departureId,
      );
    });
  });
}

departureForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const destinationId = departureDestinationId.value;

  const departureIdValue = departureId.value;

  const startDate = departureStartDate.value;

  const endDate = departureEndDate.value;

  const today = new Date().toISOString().split("T")[0];

  if (startDate < today) {
    alert("Start date cannot be in the past.");

    return;
  }

  if (endDate < today) {
    alert("End date cannot be in the past.");

    return;
  }

  const totalSeats = Number(departureTotalSeats.value);

  if (!startDate || !endDate || !totalSeats) {
    alert("Please fill in all departure details.");
    return;
  }

  if (new Date(endDate) < new Date(startDate)) {
    alert("End date cannot be before start date.");
    return;
  }

  try {
    const isEditing = Boolean(departureIdValue);

    const url = isEditing
      ? `http://localhost:5000/api/destinations/${destinationId}/departures/${departureIdValue}`
      : `http://localhost:5000/api/destinations/${destinationId}/departures`;

    const response = await adminFetch(url, {
      method: isEditing ? "PUT" : "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        startDate,
        endDate,
        totalSeats,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save departure");
    }

    // Close and reset the modal first

    departureModal.classList.remove("active");

    departureForm.reset();

    departureId.value = "";

    departureDestinationId.value = "";

    // Refresh the destination list

    await loadDestinations();

    // Show success message

    alert(
      isEditing
        ? "Departure updated successfully."
        : "Departure added successfully.",
    );
  } catch (error) {
    console.error("Departure save failed:", error);

    alert(error.message || "Unable to save departure.");
  }
});

async function deleteDeparture(destinationId, departureId) {
  const confirmed = confirm("Are you sure you want to delete this departure?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await adminFetch(
      `http://localhost:5000/api/destinations/${destinationId}/departures/${departureId}`,

      {
        method: "DELETE",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete departure");
    }

    await loadDestinations();

    alert("Departure deleted successfully.");
  } catch (error) {
    console.error("Delete departure failed:", error);

    alert(error.message || "Unable to delete departure.");
  }
}

departureStartDate.addEventListener("change", () => {
  if (!departureStartDate.value) {
    return;
  }

  departureEndDate.min = departureStartDate.value;

  if (
    departureEndDate.value &&
    departureEndDate.value < departureStartDate.value
  ) {
    departureEndDate.value = "";
  }
});

async function adminFetch(url, options = {}) {
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${adminToken}`,
  };

  const response = await fetch(url, options);

  if (response.status === 401) {
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
  }

  return response;
}

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
});

const bookingsContainer = document.getElementById("bookings-container");

const refreshButton = document.getElementById("refresh-bookings");

const totalBookings = document.getElementById("total-bookings");

const pendingBookings = document.getElementById("pending-bookings");

const confirmedBookings = document.getElementById("confirmed-bookings");

const cancelledBookings = document.getElementById("cancelled-bookings");

const bookingSearch = document.getElementById("booking-search");

const statusFilter = document.getElementById("status-filter");

const destinationFilter = document.getElementById("destination-filter");

const clearFilters = document.getElementById("clear-filters");

const destinationImage = document.getElementById("destination-image");

const destinationImagePreview = document.getElementById(
  "destination-image-preview",
);

const destinationImagePreviewImg = document.getElementById(
  "destination-image-preview-img",
);

let allBookings = [];

async function loadDestinations() {
  try {
    const response = await fetch("http://localhost:5000/api/destinations");

    if (!response.ok) {
      throw new Error("Failed to load destinations");
    }

    const destinations = await response.json();

    renderDestinations(destinations);
  } catch (error) {
    console.error(error);

    destinationsContainer.innerHTML = "<p>Unable to load destinations.</p>";
  }
}

function renderDestinations(destinations) {
  if (destinations.length === 0) {
    destinationsContainer.innerHTML = "<p>No destinations available.</p>";

    return;
  }

  destinationsContainer.innerHTML = "";

  destinations.forEach((destination) => {
    const card = document.createElement("div");

    card.className = "destination-admin-card";

    const departures = destination.departures || [];

    let departuresHTML = "";

    if (departures.length === 0) {
      departuresHTML = `
                <p class="no-departures">
                    No departures added yet.
                </p>
            `;
    } else {
      departuresHTML = departures
        .map((departure) => {
          const totalSeats = departure.totalSeats || 0;

          const bookedSeats = departure.bookedSeats || 0;

          const availableSeats = totalSeats - bookedSeats;

          const startDate = formatAdminDate(departure.startDate);

          const endDate = formatAdminDate(departure.endDate);

          const duration = calculateDuration(
            departure.startDate,
            departure.endDate,
          );

          return `
    <div
        class="departure-admin-card"
        data-destination-id="${destination._id}"
        data-departure-id="${departure._id}">

        <div
            class="departure-admin-main">

            <strong>
                ${startDate}
                →
                ${endDate}
            </strong>

            <span>
                ${duration}
            </span>

        </div>


        <div
            class="departure-seat-info">

            <div>
                <span>Total</span>
                <strong>
                    ${totalSeats}
                </strong>
            </div>

            <div>
                <span>Booked</span>
                <strong>
                    ${bookedSeats}
                </strong>
            </div>

            <div>
                <span>Available</span>

                <strong
                    class="${availableSeats === 0 ? "sold-out" : ""}">

                    ${availableSeats === 0 ? "Sold Out" : availableSeats}

                </strong>
            </div>

        </div>


        <div
            class="departure-admin-actions">

            <button
                type="button"
                class="edit-departure-button"
                data-destination-id="${destination._id}"
                data-departure-id="${departure._id}">

                Edit

            </button>

            <button
                type="button"
                class="delete-departure-button"
                data-destination-id="${destination._id}"
                data-departure-id="${departure._id}">

                Delete

            </button>

        </div>

    </div>
`;
        })
        .join("");
    }

    card.innerHTML = `

    <div class="destination-admin-top">

        <img
            class="destination-admin-image"
            src="${getDestinationImageUrl(destination.image)}"
            alt="${destination.name}">

        <div class="destination-admin-info">

            <div class="destination-admin-heading">

                <div>

                    <h3>
                        ${destination.name}
                    </h3>

                    <p>
                        ${destination.location}
                    </p>

                </div>


                <div class="destination-admin-actions">

                    <button
                        type="button"
                        class="edit-destination-button"
                        data-id="${destination._id}">

                        Edit

                    </button>

                    <button
                        type="button"
                        class="delete-destination-button"
                        data-id="${destination._id}">

                        Delete

                    </button>

                </div>

            </div>

            <p>
                <strong>
                    ₹${Number(destination.price).toLocaleString("en-IN")}
                </strong>
                per person
            </p>

            <p>
                ⭐ ${destination.rating}
            </p>
                <div
                    class="destination-departures">

                    <h4>
                        Available Departures
                    </h4>

                    ${departuresHTML}

                    <button
    type="button"
    class="add-departure-button"
    data-destination-id="${destination._id}">

    + Add Departure

</button>

                </div>

            </div>

        `;

    destinationsContainer.appendChild(card);
  });

  attachDestinationEvents();
  attachDepartureEvents(destinations);
}

destinationImage.addEventListener("change", () => {
  const file = destinationImage.files[0];

  if (!file) {
    destinationImagePreview.style.display = "none";

    return;
  }

  const imageUrl = URL.createObjectURL(file);

  destinationImagePreviewImg.src = imageUrl;

  destinationImagePreview.style.display = "block";
});

function formatAdminDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);

  const end = new Date(endDate);

  const difference = end.getTime() - start.getTime();

  const days = Math.round(difference / (1000 * 60 * 60 * 24)) + 1;

  const nights = days - 1;

  return `${days} Days / ${nights} Nights`;
}

function attachDestinationEvents() {
  document.querySelectorAll(".edit-destination-button").forEach((button) => {
    button.addEventListener("click", () => {
      editDestination(button.dataset.id);
    });
  });

  document.querySelectorAll(".delete-destination-button").forEach((button) => {
    button.addEventListener("click", () => {
      deleteDestination(button.dataset.id);
    });
  });
}

async function editDestination(id) {
  try {
    const response = await adminFetch(
      `http://localhost:5000/api/destinations/${id}`,
    );

    if (!response.ok) {
      throw new Error("Failed to load destination");
    }

    const destination = await response.json();

    destinationId.value = destination._id;

    destinationImage.value = "";

    destinationImagePreviewImg.src = getDestinationImageUrl(destination.image);

    destinationImagePreview.style.display = "block";

    document.getElementById("destination-name").value = destination.name;

    document.getElementById("destination-location").value =
      destination.location;

    document.getElementById("destination-price").value = destination.price;

    document.getElementById("destination-rating").value = destination.rating;

    document.getElementById("destination-best-time").value =
      destination.bestTime;

    document.getElementById("destination-type").value = destination.type;

    document.getElementById("destination-description").value =
      destination.description;

    document.getElementById("destination-highlights").value = (
      destination.highlights || []
    ).join(", ");

    destinationModalTitle.textContent = "Edit Destination";

    destinationModal.classList.add("active");
  } catch (error) {
    console.error("Failed to load destination:", error);

    alert("Unable to load destination.");
  }
}

async function deleteDestination(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this destination?",
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await adminFetch(
      `http://localhost:5000/api/destinations/${id}`,
      {
        method: "DELETE",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete destination");
    }

    alert("Destination deleted successfully.");

    loadDestinations();
  } catch (error) {
    console.error("Delete destination failed:", error);

    alert(error.message || "Unable to delete destination.");
  }
}

addDestinationButton.addEventListener("click", () => {
  destinationForm.reset();

  destinationId.value = "";
  destinationImagePreview.style.display = "none";

  destinationModalTitle.textContent = "Add Destination";

  destinationModal.classList.add("active");
});

closeDestinationModal.addEventListener("click", () => {
  destinationModal.classList.remove("active");
});

closeDepartureModal.addEventListener("click", () => {
  departureModal.classList.remove("active");

  departureForm.reset();

  departureId.value = "";

  departureDestinationId.value = "";
});

destinationModal.addEventListener("click", (event) => {
  if (event.target === destinationModal) {
    destinationModal.classList.remove("active");
  }
});

destinationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = destinationId.value;

  const isEditing = Boolean(id);

  const formData = new FormData();

  formData.append("name", document.getElementById("destination-name").value);

  formData.append(
    "location",
    document.getElementById("destination-location").value,
  );

  formData.append("price", document.getElementById("destination-price").value);

  formData.append(
    "rating",
    document.getElementById("destination-rating").value,
  );

  formData.append(
    "bestTime",
    document.getElementById("destination-best-time").value,
  );

  formData.append("type", document.getElementById("destination-type").value);

  formData.append(
    "description",
    document.getElementById("destination-description").value,
  );

  formData.append(
    "highlights",
    document.getElementById("destination-highlights").value,
  );

  const imageFile = document.getElementById("destination-image").files[0];

  // Image is required only when adding

  if (!isEditing && !imageFile) {
    alert("Please select a destination image.");

    return;
  }

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const url = isEditing
    ? `http://localhost:5000/api/destinations/${id}`
    : `http://localhost:5000/api/destinations`;

  try {
    const response = await adminFetch(url, {
      method: isEditing ? "PUT" : "POST",

      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save destination");
    }

    destinationModal.classList.remove("active");

    destinationForm.reset();

    destinationId.value = "";

    await loadDestinations();

    alert(
      isEditing
        ? "Destination updated successfully."
        : "Destination added successfully.",
    );
  } catch (error) {
    console.error("Destination save failed:", error);

    alert(error.message || "Unable to save destination.");
  }
});

async function loadBookings() {
  bookingsContainer.innerHTML = "<p>Loading bookings...</p>";

  try {
    const response = await adminFetch("http://localhost:5000/api/bookings");

    if (!response.ok) {
      throw new Error("Failed to load bookings");
    }

    const bookings = await response.json();

    allBookings = bookings;

    updateDashboardStats(bookings);
    populateDestinationFilter(bookings);
    renderBookings(bookings);

    const pending = bookings.filter(
      (booking) => booking.status === "Pending",
    ).length;

    const confirmed = bookings.filter(
      (booking) => booking.status === "Confirmed",
    ).length;

    const cancelled = bookings.filter(
      (booking) => booking.status === "Cancelled",
    ).length;

    totalBookings.textContent = bookings.length;
    pendingBookings.textContent = pending;
    confirmedBookings.textContent = confirmed;
    cancelledBookings.textContent = cancelled;
  } catch (error) {
    console.error(error);

    bookingsContainer.innerHTML = "<p>Unable to load bookings.</p>";
  }
}

function updateDashboardStats(bookings) {
  const pending = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const confirmed = bookings.filter(
    (booking) => booking.status === "Confirmed",
  ).length;

  const cancelled = bookings.filter(
    (booking) => booking.status === "Cancelled",
  ).length;

  totalBookings.textContent = bookings.length;
  pendingBookings.textContent = pending;
  confirmedBookings.textContent = confirmed;
  cancelledBookings.textContent = cancelled;
}

function populateDestinationFilter(bookings) {
  const destinations = [
    ...new Set(bookings.map((booking) => booking.destination)),
  ];

  destinationFilter.innerHTML = '<option value="all">All Destinations</option>';

  destinations.forEach((destination) => {
    const option = document.createElement("option");

    option.value = destination;
    option.textContent = destination;

    destinationFilter.appendChild(option);
  });
}

function applyFilters() {
  const searchTerm = bookingSearch.value.trim().toLowerCase();

  const selectedStatus = statusFilter.value;

  const selectedDestination = destinationFilter.value;

  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch =
      booking.bookingReference.toLowerCase().includes(searchTerm) ||
      booking.customerName.toLowerCase().includes(searchTerm) ||
      booking.customerEmail.toLowerCase().includes(searchTerm);

    const matchesStatus =
      selectedStatus === "all" || booking.status === selectedStatus;

    const matchesDestination =
      selectedDestination === "all" ||
      booking.destination === selectedDestination;

    return matchesSearch && matchesStatus && matchesDestination;
  });

  renderBookings(filteredBookings);
}

function getDestinationImageUrl(image) {
  if (!image) {
    return "";
  }

  // Already a complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // New images uploaded to backend
  if (image.startsWith("/uploads/")) {
    return `http://localhost:5000${image}`;
  }

  // Existing frontend assets
  return image;
}

function renderBookings(bookings) {
  if (bookings.length === 0) {
    bookingsContainer.innerHTML = "<p>No bookings found.</p>";
    return;
  }

  bookingsContainer.innerHTML = "";

  bookings.forEach((booking) => {
    const bookingCard = document.createElement("div");

    bookingCard.className = "booking-card";

    bookingCard.innerHTML = `
            <div>
                <h3>${booking.bookingReference}</h3>
                <p><strong>Customer:</strong> ${booking.customerName}</p>
                <p><strong>Email:</strong> ${booking.customerEmail}</p>
                <p><strong>Phone:</strong> ${booking.customerPhone}</p>
            </div>

            <div>
                <p><strong>Destination:</strong> ${booking.destination}</p>
                <p><strong>Travelers:</strong> ${booking.travelers}</p>
                <p><strong>Package:</strong> ${booking.package}</p>
                <p><strong>Total:</strong> ₹${booking.totalPrice.toLocaleString("en-IN")}</p>
            </div>

            <div class="booking-actions">

                <select
                    class="status-select"
                    data-id="${booking._id}">

                    <option value="Pending"
                        ${booking.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="Confirmed"
                        ${booking.status === "Confirmed" ? "selected" : ""}>
                        Confirmed
                    </option>

                    <option value="Cancelled"
                        ${booking.status === "Cancelled" ? "selected" : ""}>
                        Cancelled
                    </option>

                </select>

                <button
                    class="details-button"
                    data-id="${booking._id}">
                    View Details
                </button>

            </div>
        `;

    bookingsContainer.appendChild(bookingCard);
  });

  attachStatusEvents();
}

async function cancelBooking(id) {
  const confirmed = confirm("Are you sure you want to cancel this booking?");

  if (!confirmed) return;

  try {
    const response = await adminFetch(
      `http://localhost:5000/api/bookings/${id}/cancel`,
      {
        method: "PUT",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to cancel booking");
    }

    console.log("Booking cancelled:", result);

    bookingModal.classList.remove("active");

    // Refresh the booking list
    loadBookings();
  } catch (error) {
    console.error("Cancellation failed:", error);
    alert("Unable to cancel this booking.");
  }
}

async function updateBookingStatus(id, status) {
  try {
    const response = await adminFetch(
      `http://localhost:5000/api/bookings/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    console.log("Booking status updated");
  } catch (error) {
    console.error(error);
    alert("Unable to update booking status.");
  }
}

async function viewBookingDetails(id) {
  try {
    const response = await adminFetch(
      `http://localhost:5000/api/bookings/${id}`,
    );

    if (!response.ok) {
      throw new Error("Failed to load booking");
    }

    const booking = await response.json();

    const details = document.getElementById("booking-details");

    details.innerHTML = `
            <div class="detail-section">
                <h3>${booking.bookingReference}</h3>

                <p>
                    <strong>Status:</strong>
                    ${booking.status}
                </p>
            </div>

            <div class="detail-section">
                <h4>Customer Information</h4>

                <p>
                    <strong>Name:</strong>
                    ${booking.customerName}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${booking.customerEmail}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${booking.customerPhone}
                </p>
            </div>

            <div class="detail-section">
                <h4>Trip Information</h4>

                <p>
                    <strong>Destination:</strong>
                    ${booking.destination}
                </p>

                <p>
                    <strong>Travelers:</strong>
                    ${booking.travelers}
                </p>

                <p>
                    <strong>Package:</strong>
                    ${booking.package}
                </p>

                <p>
                    <strong>Start Date:</strong>
                    ${booking.startDate}
                </p>

                <p>
                    <strong>End Date:</strong>
                    ${booking.endDate}
                </p>
            </div>

            <div class="detail-section">
                <h4>Payment Information</h4>

                <p>
                    <strong>Price Per Person:</strong>
                    ₹${booking.pricePerPerson.toLocaleString("en-IN")}
                </p>

                <p>
                    <strong>Total:</strong>
                    ₹${booking.totalPrice.toLocaleString("en-IN")}
                </p>
            </div>

            <div class="detail-section">
                <h4>Special Request</h4>

                <p>
                    ${booking.specialRequest || "None"}
                </p>
            </div>

            <div class="detail-actions">

                ${
                  booking.status !== "Cancelled"
                    ? `
                            <button
                                class="cancel-booking-button"
                                data-id="${booking._id}">
                                Cancel Booking
                            </button>
                        `
                    : `
                            <p class="cancelled-message">
                                This booking has been cancelled.
                            </p>
                        `
                }

            </div>
        `;

    document.getElementById("booking-modal").classList.add("active");

    const cancelButton = document.querySelector(".cancel-booking-button");

    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        cancelBooking(cancelButton.dataset.id);
      });
    }
  } catch (error) {
    console.error(error);
    alert("Unable to load booking details.");
  }
}

function attachStatusEvents() {
  const statusSelects = document.querySelectorAll(".status-select");

  statusSelects.forEach((select) => {
    select.addEventListener("change", () => {
      updateBookingStatus(select.dataset.id, select.value);
    });
  });

  const detailsButtons = document.querySelectorAll(".details-button");

  detailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      viewBookingDetails(button.dataset.id);
    });
  });
}

const bookingModal = document.getElementById("booking-modal");

const closeBookingModal = document.getElementById("close-booking-modal");

closeBookingModal.addEventListener("click", () => {
  bookingModal.classList.remove("active");
});

bookingModal.addEventListener("click", (event) => {
  if (event.target === bookingModal) {
    bookingModal.classList.remove("active");
  }
});

bookingSearch.addEventListener("input", applyFilters);

statusFilter.addEventListener("change", applyFilters);

destinationFilter.addEventListener("change", applyFilters);

clearFilters.addEventListener("click", () => {
  bookingSearch.value = "";
  statusFilter.value = "all";
  destinationFilter.value = "all";

  renderBookings(allBookings);
});

refreshButton.addEventListener("click", loadBookings);

loadBookings();
loadDestinations();
loadContactMessages();

// =========================================================
// TESTIMONIALS
// =========================================================

const testimonialsAdminContainer =
    document.getElementById(
        'testimonials-admin-container'
    );

const addTestimonialButton =
    document.getElementById(
        'add-testimonial-button'
    );

const testimonialModal =
    document.getElementById(
        'testimonial-modal'
    );

const closeTestimonialModal =
    document.getElementById(
        'close-testimonial-modal'
    );

const testimonialForm =
    document.getElementById(
        'testimonial-form'
    );

const testimonialModalTitle =
    document.getElementById(
        'testimonial-modal-title'
    );


// =========================================================
// LOAD TESTIMONIALS
// =========================================================

async function loadTestimonialsAdmin() {

    if (!testimonialsAdminContainer) {
        return;
    }

    try {

        const response = await adminFetch(
            `${API_BASE_URL}/api/testimonials`
        );

        const testimonials =
            await response.json();

        if (!response.ok) {

            throw new Error(
                testimonials.message ||
                'Failed to load testimonials'
            );

        }


        testimonialsAdminContainer.innerHTML = '';


        if (!testimonials.length) {

            testimonialsAdminContainer.innerHTML = `
                <p class="empty-state">
                    No testimonials added yet.
                </p>
            `;

            return;
        }


        testimonials.forEach(
            testimonial => {

                const stars =
                    '⭐'.repeat(
                        testimonial.rating || 5
                    );


                const image =
                    testimonial.image ||
                    `https://placehold.co/60x60/d1d5db/374151?text=${
                        testimonial.name
                            .charAt(0)
                            .toUpperCase()
                    }`;


                const card =
                    document.createElement('div');

                card.className =
                    'testimonial-admin-card';


                card.innerHTML = `

                    <div class="testimonial-admin-image">

                        <img
                            src="${image}"
                            alt="${testimonial.name}">

                    </div>

                    <div class="testimonial-admin-content">

                        <div class="testimonial-admin-rating">
                            ${stars}
                        </div>

                        <p class="testimonial-admin-review">
                            "${testimonial.review}"
                        </p>

                        <strong>
                            ${testimonial.name}
                        </strong>

                        <span>
                            ${testimonial.role}
                        </span>

                    </div>

                    <div class="testimonial-admin-actions">

                        <button
                            class="edit-testimonial-button"
                            data-id="${testimonial._id}">
                            Edit
                        </button>

                        <button
                            class="delete-testimonial-button"
                            data-id="${testimonial._id}">
                            Delete
                        </button>

                    </div>

                `;


                testimonialsAdminContainer.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            'Failed to load testimonials:',
            error
        );

        testimonialsAdminContainer.innerHTML = `
            <p>
                Failed to load testimonials.
            </p>
        `;

    }

}

// =========================================================
// OPEN ADD MODAL
// =========================================================

function openAddTestimonialModal() {

    testimonialForm.reset();

    document.getElementById(
        'testimonial-id'
    ).value = '';

    document.getElementById(
        'testimonial-rating'
    ).value = 5;

    testimonialModalTitle.textContent =
        'Add Testimonial';

    testimonialModal.classList.add(
        'active'
    );

}


// =========================================================
// OPEN EDIT MODAL
// =========================================================

async function openEditTestimonialModal(id) {

    try {

        const response = await adminFetch(
            `${API_BASE_URL}/api/testimonials`
        );

        const testimonials =
            await response.json();


        const testimonial =
            testimonials.find(
                item => item._id === id
            );


        if (!testimonial) {

            alert(
                'Testimonial not found.'
            );

            return;

        }


        document.getElementById(
            'testimonial-id'
        ).value = testimonial._id;

        document.getElementById(
            'testimonial-name'
        ).value = testimonial.name;

        document.getElementById(
            'testimonial-role'
        ).value = testimonial.role;

        document.getElementById(
            'testimonial-rating'
        ).value =
            testimonial.rating || 5;

        document.getElementById(
            'testimonial-image'
        ).value =
            testimonial.image || '';

        document.getElementById(
            'testimonial-review'
        ).value =
            testimonial.review;


        testimonialModalTitle.textContent =
            'Edit Testimonial';


        testimonialModal.classList.add(
            'active'
        );


    } catch (error) {

        console.error(
            'Failed to open testimonial:',
            error
        );

        alert(
            'Unable to load testimonial.'
        );

    }

}

// =========================================================
// SAVE TESTIMONIAL
// =========================================================

testimonialForm?.addEventListener(
    'submit',
    async (event) => {

        event.preventDefault();


        const id =
            document.getElementById(
                'testimonial-id'
            ).value;


        const testimonialData = {

            name:
                document.getElementById(
                    'testimonial-name'
                ).value.trim(),

            role:
                document.getElementById(
                    'testimonial-role'
                ).value.trim(),

            rating:
                Number(
                    document.getElementById(
                        'testimonial-rating'
                    ).value
                ),

            image:
                document.getElementById(
                    'testimonial-image'
                ).value.trim(),

            review:
                document.getElementById(
                    'testimonial-review'
                ).value.trim()

        };


        try {

            const url = id
                ? `${API_BASE_URL}/api/testimonials/${id}`
                : `${API_BASE_URL}/api/testimonials`;


            const response = await adminFetch(
                url,
                {

                    method: id
                        ? 'PUT'
                        : 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            testimonialData
                        )

                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    'Failed to save testimonial'
                );

            }


            testimonialModal.classList.remove(
                'active'
            );


            await loadTestimonialsAdmin();


        } catch (error) {

            console.error(
                'Failed to save testimonial:',
                error
            );

            alert(
                error.message ||
                'Failed to save testimonial.'
            );

        }

    }
);

// =========================================================
// TESTIMONIAL ACTIONS
// =========================================================

testimonialsAdminContainer?.addEventListener(
    'click',
    async (event) => {

        const editButton =
            event.target.closest(
                '.edit-testimonial-button'
            );

        const deleteButton =
            event.target.closest(
                '.delete-testimonial-button'
            );


        if (editButton) {

            await openEditTestimonialModal(
                editButton.dataset.id
            );

            return;

        }


        if (deleteButton) {

            const id =
                deleteButton.dataset.id;


            const confirmed =
                confirm(
                    'Are you sure you want to delete this testimonial?'
                );


            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await adminFetch(
                        `${API_BASE_URL}/api/testimonials/${id}`,
                        {
                            method: 'DELETE'
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        'Failed to delete testimonial'
                    );

                }


                await loadTestimonialsAdmin();


            } catch (error) {

                console.error(
                    'Failed to delete testimonial:',
                    error
                );

                alert(
                    error.message ||
                    'Failed to delete testimonial.'
                );

            }

        }

    }
);

// =========================================================
// TESTIMONIAL MODAL CONTROLS
// =========================================================

addTestimonialButton?.addEventListener(
    'click',
    openAddTestimonialModal
);


closeTestimonialModal?.addEventListener(
    'click',
    () => {

        testimonialModal.classList.remove(
            'active'
        );

    }
);


testimonialModal?.addEventListener(
    'click',
    (event) => {

        if (
            event.target ===
            testimonialModal
        ) {

            testimonialModal.classList.remove(
                'active'
            );

        }

    }
);

document.addEventListener(
    'DOMContentLoaded',
    () => {

        loadTestimonialsAdmin();

    }
);