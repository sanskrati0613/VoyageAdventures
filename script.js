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

/* =========================================================
   1. MOBILE MENU TOGGLE
========================================================= */

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-open');
});

document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
    });
});

function handleResize() {
    if (window.innerWidth >= 768) {
        mobileMenu.classList.remove('is-open');
    }
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);

/* =========================================================
   2. SMOOTH ANCHOR SCROLLING
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

/* =========================================================
   3. SCROLL REVEAL (FADE-IN) ANIMATIONS
========================================================= */

const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

/* =========================================================
   4. TESTIMONIALS CAROUSEL CENTERING
========================================================= */

const testimonialsContainer = document.getElementById('testimonials-container');
const testimonialCards = document.querySelectorAll('.testimonial-card');

function highlightCenterCard() {
    const containerCenter = testimonialsContainer.scrollLeft + testimonialsContainer.offsetWidth / 2;

    testimonialCards.forEach(card => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        const threshold = testimonialsContainer.offsetWidth / 4;

        card.classList.toggle('is-centered', distance < threshold);
    });
}

testimonialsContainer.addEventListener('scroll', highlightCenterCard);
window.addEventListener('load', highlightCenterCard);

/* =========================================================
   5. DESTINATION EXPLORER (SEARCH / FILTER)
========================================================= */

const destinationSearch = document.getElementById('destination-search');
const filterButtons = document.querySelectorAll('.filter-button');
const destinationCards = document.querySelectorAll('.destination-card');
const clearSearch = document.getElementById('clear-search');
const noDestinations = document.getElementById('no-destinations');

let selectedCategory = 'all';

function filterDestinations() {
    const searchTerm = destinationSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    destinationCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const categories = card.dataset.category.toLowerCase();

        const matchesSearch = name.includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || categories.includes(selectedCategory);

        if (matchesSearch && matchesCategory) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    noDestinations.hidden = visibleCount !== 0;
    clearSearch.style.display = searchTerm ? 'block' : 'none';
}

// Search
destinationSearch.addEventListener('input', filterDestinations);

// Clear search
clearSearch.addEventListener('click', () => {
    destinationSearch.value = '';
    filterDestinations();
    destinationSearch.focus();
});

// Category filters
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedCategory = button.dataset.category;
        filterDestinations();
    });
});

/* =========================================================
   6. WISHLIST (DESTINATION CARDS) — FRONTEND VERSION
========================================================= */

const wishlistButtons = document.querySelectorAll('.wishlist-button');
let wishlist = new Set();

wishlistButtons.forEach(button => {
    button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const card = button.closest('.destination-card');
        const destinationId = card.querySelector('.explore-button').dataset.destination;

        if (wishlist.has(destinationId)) {
            wishlist.delete(destinationId);
        } else {
            wishlist.add(destinationId);
        }

        updateWishlistUI();
    });
});

/* =========================================================
   7. DESTINATION DETAILS MODAL
========================================================= */

const destinationData = {
    kashmir: {
        name: "Kashmir",
        location: "📍 Kashmir, India",
        image: "assets/KASHMIR.jpg",
        rating: "4.8",
        price: "₹12,999",
        duration: "5 Days / 4 Nights",
        bestTime: "April – October",
        type: "Mountain Adventure",
        description: "Discover the breathtaking beauty of Kashmir through peaceful lakes, snow-capped mountains, beautiful valleys and unforgettable Himalayan experiences.",
        highlights: [
            "Dal Lake Shikara Ride",
            "Gulmarg Exploration",
            "Pahalgam Valley",
            "Sonamarg Visit",
            "Local Kashmiri Cuisine",
            "Scenic Mountain Trails"
        ]
    },

    varanasi: {
        name: "Varanasi",
        location: "📍 Varanasi, India",
        image: "assets/varanasi.jpg",
        rating: "4.7",
        price: "₹8,999",
        duration: "4 Days / 3 Nights",
        bestTime: "October – March",
        type: "Cultural Experience",
        description: "Experience the spiritual heart of India through ancient ghats, mesmerizing Ganga Aarti ceremonies, historic temples and the vibrant streets of Varanasi.",
        highlights: [
            "Ganga Aarti",
            "Sunrise Boat Ride",
            "Kashi Vishwanath Temple",
            "Historic Ghats",
            "Local Food Walk",
            "Cultural Experiences"
        ]
    },

    manali: {
        name: "Manali",
        location: "📍 Manali, Himachal Pradesh",
        image: "assets/mountain.jpg",
        rating: "4.9",
        price: "₹10,999",
        duration: "5 Days / 4 Nights",
        bestTime: "March – June",
        type: "Adventure",
        description: "Escape into the Himalayas and experience spectacular mountain scenery, adventurous activities, peaceful valleys and the unique charm of Manali.",
        highlights: [
            "Solang Valley",
            "Rohtang Pass",
            "River Rafting",
            "Mountain Trekking",
            "Old Manali",
            "Local Himalayan Cuisine"
        ]
    }
};

const destinationModal = document.getElementById('destination-modal');
const modalDestinationImage = document.getElementById('modal-destination-image');
const modalDestinationName = document.getElementById('modal-destination-name');
const modalDestinationLocation = document.getElementById('modal-destination-location');
const modalRating = document.getElementById('modal-rating');
const modalPrice = document.getElementById('modal-price');
const modalDuration = document.getElementById('modal-duration');
const modalBestTime = document.getElementById('modal-best-time');
const modalTripType = document.getElementById('modal-trip-type');
const modalDescription = document.getElementById('modal-destination-description');
const modalHighlightsList = document.getElementById('modal-highlights-list');
const closeDestinationModal = document.getElementById('close-destination-modal');
const modalOverlay = document.querySelector('.destination-modal-overlay');
const modalWishlistButton = document.getElementById('modal-wishlist-button');
const bookDestinationButton = document.getElementById('book-destination-button');

let currentDestination = null;

function updateWishlistUI() {
    // Update destination cards
    document.querySelectorAll('.wishlist-button').forEach(button => {
        const card = button.closest('.destination-card');
        const destinationId = card.querySelector('.explore-button').dataset.destination;

        if (wishlist.has(destinationId)) {
            button.classList.add('saved');
            button.textContent = '♥';
        } else {
            button.classList.remove('saved');
            button.textContent = '♡';
        }
    });

    // Update modal
    if (currentDestination && wishlist.has(currentDestination)) {
        modalWishlistButton.classList.add('saved');
        modalWishlistButton.textContent = '♥ Saved to Wishlist';
    } else {
        modalWishlistButton.classList.remove('saved');
        modalWishlistButton.textContent = '♡ Save to Wishlist';
    }
}

function openDestinationModal(destinationId) {
    const destination = destinationData[destinationId];
    if (!destination) return;

    currentDestination = destinationId;

    modalDestinationImage.src = destination.image;
    modalDestinationImage.alt = destination.name;
    modalDestinationName.textContent = destination.name;
    modalDestinationLocation.textContent = destination.location;
    modalRating.textContent = destination.rating;
    modalPrice.textContent = destination.price;
    modalDuration.textContent = destination.duration;
    modalBestTime.textContent = destination.bestTime;
    modalTripType.textContent = destination.type;
    modalDescription.textContent = destination.description;

    // Highlights
    modalHighlightsList.innerHTML = '';
    destination.highlights.forEach(highlight => {
        const li = document.createElement('li');
        li.textContent = highlight;
        modalHighlightsList.appendChild(li);
    });

    updateWishlistUI();

    // Open
    destinationModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

document.querySelectorAll('.explore-button').forEach(button => {
    button.addEventListener('click', () => {
        const destinationId = button.dataset.destination;
        openDestinationModal(destinationId);
    });
});

function closeDestinationDetails() {
    destinationModal.classList.remove('is-open');
    document.body.style.overflow = '';
}

closeDestinationModal.addEventListener('click', closeDestinationDetails);
modalOverlay.addEventListener('click', closeDestinationDetails);

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && destinationModal.classList.contains('is-open')) {
        closeDestinationDetails();
    }
});

modalWishlistButton.addEventListener('click', () => {
    if (!currentDestination) return;

    if (wishlist.has(currentDestination)) {
        wishlist.delete(currentDestination);
    } else {
        wishlist.add(currentDestination);
    }

    updateWishlistUI();
});

/* =========================================================
   8. BOOKING SYSTEM
========================================================= */

const bookingModal = document.getElementById('booking-modal');
const closeBookingModal = document.getElementById('close-booking-modal');
const bookingModalOverlay = document.querySelector('.booking-modal-overlay');
const bookingForm = document.getElementById('booking-form');
const bookingDestinationImage = document.getElementById('booking-destination-image');
const bookingDestinationName = document.getElementById('booking-destination-name');
const bookingDestinationPrice = document.getElementById('booking-destination-price');
const tripPackage = document.getElementById('trip-package');
const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');
const decreaseTravelers = document.getElementById('decrease-travelers');
const increaseTravelers = document.getElementById('increase-travelers');
const travelerCount = document.getElementById('traveler-count');
const summaryPrice = document.getElementById('summary-price');
const summaryTravelers = document.getElementById('summary-travelers');
const summaryPackage = document.getElementById('summary-package');
const summaryTotal = document.getElementById('summary-total');
const bookingSuccess = document.getElementById('booking-success');
const bookingReferenceNumber = document.getElementById('booking-reference-number');
const closeSuccess = document.getElementById('close-success');

let bookingTravelers = 1;

const today = new Date().toISOString().split('T')[0];
startDate.min = today;
endDate.min = today;

function openBookingModal() {
    if (!currentDestination) return;

    const destination = destinationData[currentDestination];

    bookingDestinationImage.src = destination.image;
    bookingDestinationImage.alt = destination.name;
    bookingDestinationName.textContent = destination.name;
    bookingDestinationPrice.textContent = `${destination.price} per person`;

    bookingTravelers = 1;
    travelerCount.textContent = '1';
    tripPackage.value = 'standard';

    updateBookingSummary();

    destinationModal.classList.remove('is-open');
    bookingModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

bookDestinationButton.addEventListener('click', openBookingModal);

function closeBookingDetails() {
    bookingModal.classList.remove('is-open');
    document.body.style.overflow = '';
}

closeBookingModal.addEventListener('click', closeBookingDetails);
bookingModalOverlay.addEventListener('click', closeBookingDetails);

decreaseTravelers.addEventListener('click', () => {
    if (bookingTravelers > 1) {
        bookingTravelers--;
        travelerCount.textContent = bookingTravelers;
        updateBookingSummary();
    }
});

increaseTravelers.addEventListener('click', () => {
    if (bookingTravelers < 12) {
        bookingTravelers++;
        travelerCount.textContent = bookingTravelers;
        updateBookingSummary();
    }
});

function getPackageExtra() {
    switch (tripPackage.value) {
        case 'comfort':
            return 4000;
        case 'premium':
            return 8000;
        default:
            return 0;
    }
}

function updateBookingSummary() {
    if (!currentDestination) return;

    const destination = destinationData[currentDestination];
    const basePrice = Number(destination.price.replace(/[₹,]/g, ''));
    const packageExtra = getPackageExtra();
    const pricePerPerson = basePrice + packageExtra;
    const total = pricePerPerson * bookingTravelers;

    summaryPrice.textContent = `₹${pricePerPerson.toLocaleString('en-IN')}`;
    summaryTravelers.textContent = bookingTravelers;
    summaryTotal.textContent = `₹${total.toLocaleString('en-IN')}`;

    const packageNames = {
        standard: 'Standard',
        comfort: 'Comfort',
        premium: 'Premium'
    };

    summaryPackage.textContent = packageNames[tripPackage.value];
}

tripPackage.addEventListener('change', updateBookingSummary);

startDate.addEventListener('change', () => {
    endDate.min = startDate.value;

    if (endDate.value && endDate.value < startDate.value) {
        endDate.value = '';
    }
});

bookingForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!startDate.value || !endDate.value) return;

    if (endDate.value < startDate.value) {
        alert('End date must be after the start date.');
        return;
    }

    const bookingReference = 'VA' + Date.now().toString().slice(-6);
    bookingReferenceNumber.textContent = bookingReference;

    bookingModal.classList.remove('is-open');
    bookingSuccess.classList.add('is-open');
});

closeSuccess.addEventListener('click', () => {
    bookingSuccess.classList.remove('is-open');
    document.body.style.overflow = '';

    bookingForm.reset();
    bookingTravelers = 1;
    travelerCount.textContent = '1';
    tripPackage.value = 'standard';

    updateBookingSummary();
});

/* =========================================================
   9. HERO CAROUSEL
========================================================= */

const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
const heroPrev = document.getElementById('hero-prev');
const heroNext = document.getElementById('hero-next');
const heroLocationName = document.getElementById('hero-location-name');

const heroLocations = [
    'Kashmir, India',
    'Varanasi, India',
    'Rajasthan, India',
    'Himachal Pradesh, India',
    'Manali, India'
];

let currentHeroSlide = 0;
let heroInterval;

function showHeroSlide(index) {
    currentHeroSlide = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentHeroSlide);
    });

    heroDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentHeroSlide);
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
heroNext.addEventListener('click', () => {
    nextHeroSlide();
    restartHeroInterval();
});

heroPrev.addEventListener('click', () => {
    previousHeroSlide();
    restartHeroInterval();
});

// Dots
heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
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
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentSection = entry.target.id;

            navigationLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
            });
        }
    });
}, {
    threshold: 0,
    rootMargin: "-15% 0px -55% 0px"
});

sections.forEach(section => sectionObserver.observe(section));

/* =========================================================
   11. CONTACT MODAL
========================================================= */

const contactModal = document.getElementById('contact-modal');
const openContactPopup = document.getElementById('open-contact-popup');
const closeContactModal = document.getElementById('close-contact-modal');
const contactModalOverlay = document.querySelector('.contact-modal-overlay');
const contactForm = document.getElementById('contact-form');

function openContactModal() {
    contactModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeContactModalFunction() {
    contactModal.classList.remove('is-open');
    document.body.style.overflow = '';
}

openContactPopup.addEventListener('click', openContactModal);
closeContactModal.addEventListener('click', closeContactModalFunction);
contactModalOverlay.addEventListener('click', closeContactModalFunction);

contactForm.addEventListener('submit', event => {
    event.preventDefault();

    alert('Thank you! Your message has been received.');

    contactForm.reset();
    closeContactModalFunction();
});