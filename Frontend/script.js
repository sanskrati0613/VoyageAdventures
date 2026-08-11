/* =========================================================
   VOYAGE ADVENTURES — MAIN SCRIPT
   Sections:
     1. Mobile Menu Toggle
     2. Smooth Anchor Scrolling
     3. Scroll Reveal (Fade-in) Animations
     4. Testimonials Carousel Centering
     5. Destination Explorer (Search / Filter)
     6. Wishlist (Destination Cards)
     7. Destination Details Modal
     8. Booking System
     9. Hero Carousel
    10. Active Navigation on Scroll
    11. Contact Modal
   ========================================================= */

const API_BASE_URL = 'https://voyageadventures-backend.onrender.com';

function getImageUrl(imagePath) {
  if (!imagePath) {
    return "";
  }

  // Already a complete URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    // Fix old database entries that incorrectly
    // point frontend assets to the backend
    if (
      imagePath.includes("localhost:5000/assets/") ||
      imagePath.includes("127.0.0.1:5000/assets/")
    ) {
      return `.${imagePath.substring(imagePath.indexOf("/assets/"))}`;
    }

    return imagePath;
  }

  // Backend uploaded images
  if (imagePath.startsWith("/uploads/")) {
    return `${API_BASE_URL}${imagePath}`;
  }

  if (imagePath.startsWith("uploads/")) {
    return `${API_BASE_URL}/${imagePath}`;
  }

  // Frontend static images
  if (imagePath.startsWith("/assets/")) {
    return `.${imagePath}`;
  }

  if (imagePath.startsWith("assets/")) {
    return `./${imagePath}`;
  }

  return imagePath;
}

/* =========================================================
   1. MOBILE MENU TOGGLE
========================================================= */

const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("is-open");
});

document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
  });
});

function handleResize() {
  if (window.innerWidth >= 768) {
    mobileMenu.classList.remove("is-open");
  }
}

window.addEventListener("resize", handleResize);
window.addEventListener("load", handleResize);

/* =========================================================
   2. SMOOTH ANCHOR SCROLLING
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({ behavior: "smooth" });
  });
});

/* =========================================================
   3. SCROLL REVEAL (FADE-IN) ANIMATIONS
========================================================= */

const faders = document.querySelectorAll(".fade-in");

const appearOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach((fader) => appearOnScroll.observe(fader));

/* =========================================================
   4. TESTIMONIALS CAROUSEL CENTERING
========================================================= */

const testimonialsContainer = document.getElementById("testimonials-container");
const testimonialCards = document.querySelectorAll(".testimonial-card");

function highlightCenterCard() {
  const containerCenter =
    testimonialsContainer.scrollLeft + testimonialsContainer.offsetWidth / 2;

  testimonialCards.forEach((card) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(containerCenter - cardCenter);
    const threshold = testimonialsContainer.offsetWidth / 4;

    card.classList.toggle("is-centered", distance < threshold);
  });
}

async function loadTestimonials() {

    const container =
        document.getElementById(
            'testimonials-container'
        );

    if (!container) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/testimonials`
        );

        if (!response.ok) {
            throw new Error(
                'Failed to fetch testimonials'
            );
        }

        const testimonials =
            await response.json();


        container.innerHTML = '';


        if (
            !testimonials.length
        ) {

            container.innerHTML = `
                <p class="no-testimonials">
                    No testimonials available yet.
                </p>
            `;

            return;
        }


        testimonials.forEach(
            testimonial => {

                const initial =
                    testimonial.name
                        .charAt(0)
                        .toUpperCase();


                const image =
                    testimonial.image ||
                    `https://placehold.co/60x60/d1d5db/374151?text=${initial}`;


                container.innerHTML += `

                    <div class="testimonial-card">

                        <p class="testimonial-text">
                            "${testimonial.review}"
                        </p>

                        <div class="testimonial-author">

                            <img
                                src="${image}"
                                alt="${testimonial.name}"
                                class="testimonial-author-img">

                            <div>

                                <p class="testimonial-author-name">
                                    ${testimonial.name}
                                </p>

                                <p class="testimonial-author-role">
                                    ${testimonial.role}
                                </p>

                            </div>

                        </div>

                    </div>

                `;

            }
        );

        setupTestimonialCarousel();
        setupTestimonialHighlight();


    } catch (error) {

        console.error(
            'Failed to load testimonials:',
            error
        );

        container.innerHTML = `
            <p class="no-testimonials">
                Unable to load testimonials.
            </p>
        `;

    }
}

function setupTestimonialCarousel() {

    const container =
        document.getElementById(
            'testimonials-container'
        );

    if (!container) return;


    const cards =
        container.querySelectorAll(
            '.testimonial-card'
        );


    if (!cards.length) return;


    function updateActiveCard() {

        const containerRect =
            container.getBoundingClientRect();

        const center =
            containerRect.left +
            containerRect.width / 2;


        let closestCard = null;

        let closestDistance =
            Infinity;


        cards.forEach(card => {

            const rect =
                card.getBoundingClientRect();

            const cardCenter =
                rect.left +
                rect.width / 2;

            const distance =
                Math.abs(
                    center - cardCenter
                );


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closestCard =
                    card;

            }

        });


        cards.forEach(card => {

            card.classList.remove(
                'active'
            );

        });


        if (closestCard) {

            closestCard.classList.add(
                'active'
            );

        }

    }


    container.addEventListener(
        'scroll',
        updateActiveCard,
        {
            passive: true
        }
    );


    window.addEventListener(
        'resize',
        updateActiveCard
    );


    updateActiveCard();
}

testimonialsContainer.addEventListener("scroll", highlightCenterCard);
window.addEventListener("load", highlightCenterCard);

/* =========================================================
   5. DESTINATION EXPLORER (SEARCH / FILTER)
========================================================= */

const destinationSearch = document.getElementById("destination-search");
const filterButtons = document.querySelectorAll(".filter-button");
const clearSearch = document.getElementById("clear-search");
const noDestinations = document.getElementById("no-destinations");

let selectedCategory = "all";

function filterDestinations() {
  const searchTerm = destinationSearch.value.trim().toLowerCase();

  const destinationCards = document.querySelectorAll(".destination-card");

  let visibleCount = 0;

  destinationCards.forEach((card) => {
    const name = card.dataset.name.toLowerCase();

    const categories = card.dataset.category.toLowerCase();

    const matchesSearch = name.includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" || categories.includes(selectedCategory);

    if (matchesSearch && matchesCategory) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  noDestinations.hidden = visibleCount !== 0;

  clearSearch.style.display = searchTerm ? "block" : "none";
}
// Search
destinationSearch.addEventListener("input", filterDestinations);

// Clear search
clearSearch.addEventListener("click", () => {
  destinationSearch.value = "";
  filterDestinations();
  destinationSearch.focus();
});

// Category filters
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    selectedCategory = button.dataset.category;
    filterDestinations();
  });
});

/* =========================================================
   6. WISHLIST (DESTINATION CARDS) — FRONTEND VERSION
========================================================= */

let wishlist = new Set(
  JSON.parse(localStorage.getItem("voyageWishlist") || "[]"),
);

/* =========================================================
   7. DESTINATION DETAILS MODAL
========================================================= */

const destinationData = {};

// =========================================
// PAGE LOADER
// =========================================

function hidePageLoader() {

  const pageLoader =
    document.getElementById("page-loader");

  if (pageLoader) {
    pageLoader.classList.add("hidden");
  }
}

async function loadDestinations() {

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/api/destinations`
      );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch destinations"
      );
    }

    const destinations =
      await response.json();

    destinations.forEach((destination) => {

      const id =
        destination.name.toLowerCase();

      destinationData[id] = {

        _id: destination._id,

        name: destination.name,

        location:
          `📍 ${destination.location}`,

        image:
          getImageUrl(destination.image),

        rating:
          String(destination.rating),

        price:
          `₹${destination.price.toLocaleString("en-IN")}`,

        duration:
          destination.duration,

        bestTime:
          destination.bestTime,

        type:
          destination.type,

        description:
          destination.description,

        highlights:
          destination.highlights,

        departures:
          destination.departures || []
      };

    });

    // Render all destinations
    renderDestinations(destinations);

    console.log(
      "Destinations loaded from MongoDB"
    );

  } catch (error) {

    console.error(
      "Failed to load destinations:",
      error
    );

    // Show a user-friendly message
    const container =
      document.getElementById(
        "destinations-grid"
      );

    if (container) {

      container.innerHTML = `
        <div class="destination-load-error">
          <div class="destination-load-error-icon">
            ⚠️
          </div>

          <h3>
            Unable to load destinations
          </h3>

          <p>
            We couldn't load the destinations
            right now. Please refresh the page
            and try again.
          </p>
        </div>
      `;

    }

  } finally {

    // Remove loading screen whether
    // the request succeeds or fails
    hidePageLoader();

  }
}

function renderDestinations(destinations) {
  const container = document.getElementById("destinations-grid");

  container.innerHTML = "";

  destinations.forEach((destination) => {
    const id = destination.name.toLowerCase();

    const card = document.createElement("article");
    card.className = "destination-card";
    card.dataset.name = destination.name;
    card.dataset.category = destination.type.toLowerCase();

    card.innerHTML = `
            <div class="destination-image-wrapper">
                <img
                    src="${getImageUrl(destination.image)}"
                    alt="${destination.name}"
                >

                <span class="destination-badge">
                    ${destination.type}
                </span>

                <button
                    class="wishlist-button"
                    aria-label="Add ${destination.name} to wishlist">
                    ♡
                </button>
            </div>

            <div class="destination-card-content">

                <div class="destination-location">
                    📍 ${destination.location}
                </div>

                <h3 class="destination-card-title">
                    ${destination.name}
                </h3>

                <p class="destination-card-description">
                    ${destination.description}
                </p>

                <div class="destination-card-footer">

                    <div>
                        <span class="price-label">
                            Starting from
                        </span>

                        <strong class="destination-price">
                            ₹${destination.price.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <button
                        class="explore-button"
                        data-destination="${id}">
                        Explore →
                    </button>

                </div>
            </div>
        `;

    container.appendChild(card);
  });

  attachDestinationEvents();
}

loadDestinations();

const destinationModal = document.getElementById("destination-modal");
const modalDestinationImage = document.getElementById(
  "modal-destination-image",
);
const modalDestinationName = document.getElementById("modal-destination-name");
const modalDestinationLocation = document.getElementById(
  "modal-destination-location",
);
const modalRating = document.getElementById("modal-rating");
const modalPrice = document.getElementById("modal-price");
const modalDuration = document.getElementById("modal-duration");
const modalBestTime = document.getElementById("modal-best-time");
const modalTripType = document.getElementById("modal-trip-type");
const modalGroupSize = document.getElementById("modal-group-size");
const modalDescription = document.getElementById(
  "modal-destination-description",
);
const modalHighlightsList = document.getElementById("modal-highlights-list");
const closeDestinationModal = document.getElementById(
  "close-destination-modal",
);
const modalOverlay = document.querySelector(".destination-modal-overlay");
const modalWishlistButton = document.getElementById("modal-wishlist-button");
const bookDestinationButton = document.getElementById(
  "book-destination-button",
);

let currentDestination = null;

function updateWishlistUI() {
  // Update destination cards
  document.querySelectorAll(".wishlist-button").forEach((button) => {
    const card = button.closest(".destination-card");
    const destinationId =
      card.querySelector(".explore-button").dataset.destination;

    if (wishlist.has(destinationId)) {
      button.classList.add("saved");
      button.textContent = "♥";
    } else {
      button.classList.remove("saved");
      button.textContent = "♡";
    }
  });

  // Update modal
  if (currentDestination && wishlist.has(currentDestination)) {
    modalWishlistButton.classList.add("saved");
    modalWishlistButton.textContent = "♥ Saved to Wishlist";
  } else {
    modalWishlistButton.classList.remove("saved");
    modalWishlistButton.textContent = "♡ Save to Wishlist";
  }
}

function openDestinationModal(destinationId) {
  const destination = destinationData[destinationId];
  if (!destination) return;

  currentDestination = destinationId;

  modalDestinationImage.src = getImageUrl(destination.image);
  modalDestinationImage.alt = destination.name;
  modalDestinationName.textContent = destination.name;
  modalDestinationLocation.textContent = destination.location;
  modalRating.textContent = destination.rating;
  modalPrice.textContent = destination.price;
  modalDuration.textContent =
    destination.departures && destination.departures.length > 0
      ? "Varies by departure"
      : "No departures available";

  modalBestTime.textContent = destination.bestTime;

  modalTripType.textContent = destination.type;

  modalDescription.textContent = destination.description;

  // Calculate maximum group size from all departures
  if (destination.departures && destination.departures.length > 0) {
    const maxSeats = Math.max(
      ...destination.departures.map(
        (departure) => Number(departure.totalSeats) || 0,
      ),
    );

    modalGroupSize.textContent =
      maxSeats > 0 ? `Up to ${maxSeats} people` : "No seats available";
  } else {
    modalGroupSize.textContent = "No departures available";
  }

  // Highlights
  modalHighlightsList.innerHTML = "";
  destination.highlights.forEach((highlight) => {
    const li = document.createElement("li");
    li.textContent = highlight;
    modalHighlightsList.appendChild(li);
  });

  updateWishlistUI();

  // Open
  destinationModal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function attachDestinationEvents() {
  document.querySelectorAll(".explore-button").forEach((button) => {
    button.addEventListener("click", () => {
      const destinationId = button.dataset.destination;
      openDestinationModal(destinationId);
    });
  });

  document.querySelectorAll(".wishlist-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const card = button.closest(".destination-card");
      const destinationId =
        card.querySelector(".explore-button").dataset.destination;

      if (wishlist.has(destinationId)) {
        wishlist.delete(destinationId);
      } else {
        wishlist.add(destinationId);
      }

      localStorage.setItem("voyageWishlist", JSON.stringify([...wishlist]));

      updateWishlistUI();
    });
  });

  updateWishlistUI();
}

function closeDestinationDetails() {
  destinationModal.classList.remove("is-open");
  document.body.style.overflow = "";
}

closeDestinationModal.addEventListener("click", closeDestinationDetails);
modalOverlay.addEventListener("click", closeDestinationDetails);

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    destinationModal.classList.contains("is-open")
  ) {
    closeDestinationDetails();
  }
});

modalWishlistButton.addEventListener("click", () => {
  if (!currentDestination) return;

  if (wishlist.has(currentDestination)) {
    wishlist.delete(currentDestination);
  } else {
    wishlist.add(currentDestination);
  }

  localStorage.setItem("voyageWishlist", JSON.stringify([...wishlist]));

  updateWishlistUI();
});

/* =========================================================
   8. BOOKING SYSTEM
========================================================= */

const bookingModal = document.getElementById("booking-modal");
const closeBookingModal = document.getElementById("close-booking-modal");
const bookingModalOverlay = document.querySelector(".booking-modal-overlay");
const bookingForm = document.getElementById("booking-form");
const bookingDestinationImage = document.getElementById(
  "booking-destination-image",
);
const bookingDestinationName = document.getElementById(
  "booking-destination-name",
);
const bookingDestinationPrice = document.getElementById(
  "booking-destination-price",
);
const tripPackage = document.getElementById("trip-package");
const tripDeparture = document.getElementById("trip-departure");
const departureAvailability = document.getElementById("departure-availability");
const decreaseTravelers = document.getElementById("decrease-travelers");
const increaseTravelers = document.getElementById("increase-travelers");
const travelerCount = document.getElementById("traveler-count");
const summaryPrice = document.getElementById("summary-price");
const summaryTravelers = document.getElementById("summary-travelers");
const summaryPackage = document.getElementById("summary-package");
const summaryTotal = document.getElementById("summary-total");
const bookingSuccess = document.getElementById("booking-success");
const bookingReferenceNumber = document.getElementById(
  "booking-reference-number",
);
const closeSuccess = document.getElementById("close-success");
const travelerName = document.getElementById("traveler-name");
const travelerEmail = document.getElementById("traveler-email");
const travelerPhone = document.getElementById("traveler-phone");
const specialRequest = document.getElementById("special-request");
const viewMyBooking = document.getElementById("view-my-booking");

let bookingTravelers = 1;
let selectedDeparture = null;

function openBookingModal() {
  if (!currentDestination) return;

  const destination = destinationData[currentDestination];

  selectedDeparture = null;

  tripDeparture.innerHTML = `
    <option value="">
        Select a departure date
    </option>
`;

  departureAvailability.textContent = "";

  if (destination.departures && destination.departures.length > 0) {
    destination.departures.forEach((departure) => {
      const start = new Date(departure.startDate);

      const end = new Date(departure.endDate);

      const availableSeats = departure.totalSeats - departure.bookedSeats;

      const option = document.createElement("option");

      option.value = departure._id;

      option.textContent = `${formatDepartureDate(start)} → ${formatDepartureDate(end)} (${availableSeats} seats available)`;

      option.disabled = availableSeats <= 0;

      tripDeparture.appendChild(option);
    });
  } else {
    tripDeparture.innerHTML = `
        <option value="">
            No departures available
        </option>
    `;
  }

  bookingDestinationImage.src = getImageUrl(destination.image);
  bookingDestinationImage.alt = destination.name;
  bookingDestinationName.textContent = destination.name;
  bookingDestinationPrice.textContent = `${destination.price} per person`;

  bookingTravelers = 1;
  travelerCount.textContent = "1";
  tripPackage.value = "standard";

  updateBookingSummary();

  destinationModal.classList.remove("is-open");
  bookingModal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

bookDestinationButton.addEventListener("click", openBookingModal);

function formatDepartureDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

tripDeparture.addEventListener("change", () => {
  const destination = destinationData[currentDestination];

  const departure = destination.departures.find(
    (item) => item._id === tripDeparture.value,
  );

  selectedDeparture = departure || null;

  if (!selectedDeparture) {
    departureAvailability.textContent = "";

    return;
  }

  const availableSeats =
    selectedDeparture.totalSeats - selectedDeparture.bookedSeats;

  departureAvailability.textContent = `${availableSeats} seat${
    availableSeats === 1 ? "" : "s"
  } available`;

  // Make sure current traveler count
  // doesn't exceed available seats.

  if (bookingTravelers > availableSeats) {
    bookingTravelers = Math.max(1, availableSeats);

    travelerCount.textContent = bookingTravelers;
  }

  updateBookingSummary();
});

function closeBookingDetails() {
  bookingModal.classList.remove("is-open");
  document.body.style.overflow = "";
}

closeBookingModal.addEventListener("click", closeBookingDetails);
bookingModalOverlay.addEventListener("click", closeBookingDetails);

decreaseTravelers.addEventListener("click", () => {
  if (bookingTravelers > 1) {
    bookingTravelers--;
    travelerCount.textContent = bookingTravelers;
    updateBookingSummary();
  }
});

increaseTravelers.addEventListener("click", () => {
  if (!selectedDeparture) {
    alert("Please select a departure first.");

    return;
  }

  const availableSeats =
    selectedDeparture.totalSeats - selectedDeparture.bookedSeats;

  if (bookingTravelers < Math.min(12, availableSeats)) {
    bookingTravelers++;

    travelerCount.textContent = bookingTravelers;

    updateBookingSummary();
  } else {
    alert(`Only ${availableSeats} seats are available for this departure.`);
  }
});

function getPackageExtra() {
  switch (tripPackage.value) {
    case "comfort":
      return 4000;
    case "premium":
      return 8000;
    default:
      return 0;
  }
}

function updateBookingSummary() {
  if (!currentDestination) return;

  const destination = destinationData[currentDestination];
  const basePrice = Number(destination.price.replace(/[₹,]/g, ""));
  const packageExtra = getPackageExtra();
  const pricePerPerson = basePrice + packageExtra;
  const total = pricePerPerson * bookingTravelers;

  summaryPrice.textContent = `₹${pricePerPerson.toLocaleString("en-IN")}`;
  summaryTravelers.textContent = bookingTravelers;
  summaryTotal.textContent = `₹${total.toLocaleString("en-IN")}`;

  const packageNames = {
    standard: "Standard",
    comfort: "Comfort",
    premium: "Premium",
  };

  summaryPackage.textContent = packageNames[tripPackage.value];
}

tripPackage.addEventListener("change", updateBookingSummary);

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!selectedDeparture) {
    alert("Please select a departure date.");

    return;
  }

  const availableSeats =
    selectedDeparture.totalSeats - selectedDeparture.bookedSeats;

  if (bookingTravelers > availableSeats) {
    alert(`Only ${availableSeats} seats are available for this departure.`);

    return;
  }

  const destination = destinationData[currentDestination];

  const basePrice = Number(destination.price.replace(/[₹,]/g, ""));

  const packageExtra = getPackageExtra();
  const pricePerPerson = basePrice + packageExtra;
  const totalPrice = pricePerPerson * bookingTravelers;

  const bookingReference = "VA" + Date.now().toString().slice(-6);

  const bookingData = {
    customerName: travelerName.value.trim(),
    customerEmail: travelerEmail.value.trim(),
    customerPhone: travelerPhone.value.trim(),
    specialRequest: specialRequest.value.trim(),

    bookingReference,
    destination: destination.name,
    travelers: bookingTravelers,
    package: tripPackage.value,
    destinationId: destinationData[currentDestination]._id,

    departureId: selectedDeparture._id,
    pricePerPerson,
    totalPrice,
  };

  // Show loading state
  const confirmBookingButton = bookingForm.querySelector(
    'button[type="submit"]',
  );

  confirmBookingButton.disabled = true;
  confirmBookingButton.textContent = "Confirming...";

  const userToken = localStorage.getItem("userToken");

const headers = {
    "Content-Type": "application/json",
};

if (userToken) {
    headers.Authorization = `Bearer ${userToken}`;
}

  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();

    if (!response.ok) {
      if (result.availableSeats !== undefined) {
        selectedDeparture.bookedSeats =
          selectedDeparture.totalSeats - result.availableSeats;

        departureAvailability.textContent = `${result.availableSeats} seat${
          result.availableSeats === 1 ? "" : "s"
        } available`;
      }

      throw new Error(result.message || "Booking could not be saved");
    }

    console.log("Booking saved successfully:", result);

    bookingReferenceNumber.textContent = bookingReference;

    bookingModal.classList.remove("is-open");
    bookingSuccess.classList.add("is-open");
  } catch (error) {
    console.error("Booking failed:", error);

    alert(
      error.message || "Unable to complete your booking. Please try again.",
    );
  } finally {
    confirmBookingButton.disabled = false;

    confirmBookingButton.textContent = "Confirm Booking →";
  }
});

closeSuccess.addEventListener("click", () => {
  bookingSuccess.classList.remove("is-open");
  document.body.style.overflow = "";

  bookingForm.reset();
  bookingTravelers = 1;
  travelerCount.textContent = "1";
  tripPackage.value = "standard";

  updateBookingSummary();
});

viewMyBooking.addEventListener("click", () => {
  const bookingReference = bookingReferenceNumber.textContent.trim();

  sessionStorage.setItem("latestBookingReference", bookingReference);

  bookingSuccess.classList.remove("is-open");
  document.body.style.overflow = "";

  window.location.href = "my-bookings.html";
});

/* =========================================================
   9. HERO CAROUSEL
========================================================= */

const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dot");
const heroPrev = document.getElementById("hero-prev");
const heroNext = document.getElementById("hero-next");
const heroLocationName = document.getElementById("hero-location-name");

const heroLocations = [
  "Kashmir, India",
  "Varanasi, India",
  "Rajasthan, India",
  "Himachal Pradesh, India",
  "Manali, India",
];

let currentHeroSlide = 0;
let heroInterval;

function showHeroSlide(index) {
  currentHeroSlide = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentHeroSlide);
  });

  heroDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentHeroSlide);
  });

  heroLocationName.textContent = heroLocations[currentHeroSlide];
}

function nextHeroSlide() {
  showHeroSlide(currentHeroSlide + 1);
}

function previousHeroSlide() {
  showHeroSlide(currentHeroSlide - 1);
}

// Buttons
heroNext.addEventListener("click", () => {
  nextHeroSlide();
  restartHeroInterval();
});

heroPrev.addEventListener("click", () => {
  previousHeroSlide();
  restartHeroInterval();
});

// Dots
heroDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showHeroSlide(index);
    restartHeroInterval();
  });
});

// Automatic slideshow
function startHeroInterval() {
  heroInterval = setInterval(nextHeroSlide, 5000);
}

function restartHeroInterval() {
  clearInterval(heroInterval);
  startHeroInterval();
}

startHeroInterval();

/* =========================================================
   10. ACTIVE NAVIGATION ON SCROLL
========================================================= */

const navigationLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll("section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentSection = entry.target.id;

        navigationLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentSection}`,
          );
        });
      }
    });
  },
  {
    threshold: 0,
    rootMargin: "-15% 0px -55% 0px",
  },
);

sections.forEach((section) => sectionObserver.observe(section));

/* =========================================================
   11. CONTACT MODAL
========================================================= */

const contactModal = document.getElementById("contact-modal");
const openContactPopup = document.getElementById("open-contact-popup");
const closeContactModal = document.getElementById("close-contact-modal");
const contactModalOverlay = document.querySelector(".contact-modal-overlay");
const contactForm = document.getElementById("contact-form");

function openContactModal() {
  contactModal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeContactModalFunction() {
  contactModal.classList.remove("is-open");
  document.body.style.overflow = "";
}

openContactPopup.addEventListener("click", openContactModal);
closeContactModal.addEventListener("click", closeContactModalFunction);
contactModalOverlay.addEventListener("click", closeContactModalFunction);

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("contact-name").value.trim();

  const email = document.getElementById("contact-email").value.trim();

  const subject = document.getElementById("contact-subject").value.trim();

  const message = document.getElementById("contact-message").value.trim();

  if (!name || !email || !subject || !message) {
    alert("Please fill in all fields.");

    return;
  }

  const submitButton = contactForm.querySelector(".contact-submit-button");

  submitButton.disabled = true;

  submitButton.textContent = "Sending...";

  try {
    const response = await fetch("http://localhost:5000/api/contact", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        subject,
        message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to send message");
    }

    alert("Thank you! Your message has been sent successfully.");

    contactForm.reset();

    closeContactModalFunction();
  } catch (error) {
    console.error("Contact form error:", error);

    alert(error.message || "Unable to send your message. Please try again.");
  } finally {
    submitButton.disabled = false;

    submitButton.textContent = "Send Message →";
  }
});

function setupTestimonialHighlight() {

    const container =
        document.getElementById(
            'testimonials-container'
        );

    if (!container) return;

    const cards =
        container.querySelectorAll(
            '.testimonial-card'
        );

    function updateHighlight() {

        const containerRect =
            container.getBoundingClientRect();

        const containerCenter =
            containerRect.left +
            containerRect.width / 2;

        let closestCard = null;
        let closestDistance = Infinity;

        cards.forEach(card => {

            const rect =
                card.getBoundingClientRect();

            const cardCenter =
                rect.left +
                rect.width / 2;

            const distance =
                Math.abs(
                    containerCenter -
                    cardCenter
                );

            if (distance < closestDistance) {

                closestDistance = distance;
                closestCard = card;

            }

        });


        cards.forEach(card => {
            card.classList.remove('active');
        });


        if (closestCard) {
            closestCard.classList.add('active');
        }

    }


    container.addEventListener(
        'scroll',
        updateHighlight
    );

    window.addEventListener(
        'resize',
        updateHighlight
    );

    updateHighlight();
}

// =========================================
// PROFILE MENU
// =========================================

const profileButton = document.getElementById("profile-button");
const profileDropdown = document.getElementById("profile-dropdown");

if (profileButton && profileDropdown) {

    profileButton.addEventListener("click", (event) => {
        event.stopPropagation();
        profileDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
        if (
            !profileDropdown.contains(event.target) &&
            !profileButton.contains(event.target)
        ) {
            profileDropdown.classList.remove("show");
        }
    });
}

// =========================================
// AUTH MODAL
// =========================================

const authModal = document.getElementById("auth-modal");
const authModalOverlay = document.querySelector(".auth-modal-overlay");
const closeAuthModal = document.getElementById("close-auth-modal");

const loginView = document.getElementById("login-view");
const registerView = document.getElementById("register-view");

const loginOption = document.getElementById("login-option");
const registerOption = document.getElementById("register-option");

const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");

function openAuthModal(view = "login") {

    if (!authModal) return;

    authModal.classList.add("show");

    if (view === "register") {
        loginView.style.display = "none";
        registerView.style.display = "block";
    } else {
        loginView.style.display = "block";
        registerView.style.display = "none";
    }
}

function closeAuth() {

    if (!authModal) return;

    authModal.classList.remove("show");
}

if (loginOption) {
    loginOption.addEventListener("click", () => {
        openAuthModal("login");
    });
}

if (registerOption) {
    registerOption.addEventListener("click", () => {
        openAuthModal("register");
    });
}

if (showRegister) {
    showRegister.addEventListener("click", () => {
        openAuthModal("register");
    });
}

if (showLogin) {
    showLogin.addEventListener("click", () => {
        openAuthModal("login");
    });
}

if (closeAuth) {
    closeAuthModal.addEventListener("click", closeAuth);
}

if (authModalOverlay) {
    authModalOverlay.addEventListener("click", closeAuth);
}

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        authModal &&
        authModal.classList.contains("show")
    ) {
        closeAuth();
    }

});

// =========================================
// USER / ADMIN LOGIN
// =========================================

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const username =
            document.getElementById("login-username").value.trim();

        const password =
            document.getElementById("login-password").value;

        const loginError =
            document.getElementById("login-error");

        loginError.textContent = "";

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/users/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed."
                );
            }

            // =========================================
            // ADMIN
            // =========================================

            if (data.role === "admin") {

                localStorage.setItem(
                    "adminToken",
                    data.token
                );

                window.location.href = "admin.html";

                return;
            }

            // =========================================
            // NORMAL USER
            // =========================================

            if (data.role === "user") {

                localStorage.setItem(
                    "userToken",
                    data.token
                );

                localStorage.setItem(
                    "userData",
                    JSON.stringify(data.user)
                );

                closeAuth();

                updateProfileUI();

                return;
            }

            throw new Error("Unknown account type.");

        } catch (error) {

            console.error("Login failed:", error);

            loginError.textContent =
                error.message || "Unable to login.";
        }
    });
}

// =========================================
// USER REGISTRATION
// =========================================

const registerForm = document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.getElementById("register-name").value.trim();

        const username =
            document.getElementById("register-username").value.trim();

        const email =
            document.getElementById("register-email").value.trim();

        const phone =
            document.getElementById("register-phone").value.trim();

        const password =
            document.getElementById("register-password").value;

        const confirmPassword =
            document.getElementById("register-confirm-password").value;

        const registerError =
            document.getElementById("register-error");

        registerError.textContent = "";

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/users/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        username,
                        email,
                        phone,
                        password,
                        confirmPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to create account."
                );
            }

            // Registration successful
            alert("Account created successfully.");

            // Clear form
            registerForm.reset();

            // Open login
            openAuthModal("login");

        } catch (error) {

            console.error(
                "Registration failed:",
                error
            );

            registerError.textContent =
                error.message ||
                "Unable to create account.";
        }
    });
}

// =========================================
// PROFILE UI
// =========================================

function updateProfileUI() {

    const profileButton =
        document.getElementById("profile-button");

    const profileDropdown =
        document.getElementById("profile-dropdown");

    if (!profileButton || !profileDropdown) {
        return;
    }

    const userToken =
        localStorage.getItem("userToken");

    const userData =
        localStorage.getItem("userData");

    // =========================================
    // LOGGED OUT
    // =========================================

    if (!userToken || !userData) {

        profileButton.innerHTML = `
            <span class="profile-icon">👤</span>
            <span>Profile</span>
        `;

        profileDropdown.innerHTML = `
            <button id="login-option" type="button">
                Login
            </button>

            <button id="register-option" type="button">
                Create Account
            </button>
        `;

        attachProfileActions();

        return;
    }

    // =========================================
    // LOGGED IN USER
    // =========================================

    const user = JSON.parse(userData);

    profileButton.innerHTML = `
        <span class="profile-icon">👤</span>
        <span>${user.username}</span>
    `;

    profileDropdown.innerHTML = `
        <button id="profile-option" type="button">
            My Profile
        </button>

        <button id="my-bookings-option" type="button">
            My Bookings
        </button>

        <button id="logout-option" type="button">
            Logout
        </button>
    `;

    attachLoggedInProfileActions();
}

function attachProfileActions() {

    const loginOption =
        document.getElementById("login-option");

    const registerOption =
        document.getElementById("register-option");

    if (loginOption) {
        loginOption.addEventListener("click", () => {
            openAuthModal("login");
        });
    }

    if (registerOption) {
        registerOption.addEventListener("click", () => {
            openAuthModal("register");
        });
    }
}

function attachLoggedInProfileActions() {

    const profileOption =
        document.getElementById("profile-option");

    const bookingsOption =
        document.getElementById("my-bookings-option");

    const logoutOption =
        document.getElementById("logout-option");

    if (profileOption) {

    profileOption.addEventListener("click", () => {

        profileDropdown.classList.remove("show");

        openProfileModal();

    });

}

    if (bookingsOption) {

        bookingsOption.addEventListener("click", () => {

            window.location.href = "my-bookings.html";

        });
    }

    if (logoutOption) {

        logoutOption.addEventListener("click", () => {

            localStorage.removeItem("userToken");
            localStorage.removeItem("userData");

            updateProfileUI();

            profileDropdown.classList.remove("show");
        });
    }
}

updateProfileUI();

// =========================================
// USER PROFILE MODAL
// =========================================

const profileModal =
    document.getElementById("profile-modal");

const closeProfileModal =
    document.getElementById("close-profile-modal");

const profileModalOverlay =
    document.querySelector(".profile-modal-overlay");

function openProfileModal() {

    const userData =
        localStorage.getItem("userData");

    if (!userData) {
        return;
    }

    const user = JSON.parse(userData);

    document.getElementById("profile-name").textContent =
        user.name || "Not available";

    document.getElementById("profile-username").textContent =
        user.username || "Not available";

    document.getElementById("profile-email").textContent =
        user.email || "Not available";

    document.getElementById("profile-phone").textContent =
        user.phone || "Not available";

    profileModal.classList.add("show");
}

function closeProfileModalWindow() {

    if (profileModal) {
        profileModal.classList.remove("show");
    }
}

if (closeProfileModal) {

    closeProfileModal.addEventListener(
        "click",
        closeProfileModalWindow
    );
}

if (profileModalOverlay) {

    profileModalOverlay.addEventListener(
        "click",
        closeProfileModalWindow
    );
}

document.addEventListener('DOMContentLoaded', () => {
    loadTestimonials();
});