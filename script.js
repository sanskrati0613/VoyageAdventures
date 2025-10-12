// --- Mobile Menu Toggle Logic ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

// Add a click event listener to the button
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



document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    
    anchor.addEventListener('click', function (e) {
       
        e.preventDefault();
        
        
        const target = document.querySelector(this.getAttribute('href'));
        
       
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});



const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
  
    threshold: 0.1,
    
    rootMargin: "0px 0px -100px 0px"
};


const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
   
    entries.forEach(entry => {
       
        if (!entry.isIntersecting) {
            return;
        }
        
        
        entry.target.classList.add('is-visible');
        
        
        appearOnScroll.unobserve(entry.target);
    });
}, appearOptions);


faders.forEach(fader => {
    appearOnScroll.observe(fader);
});



const testimonialsContainer = document.getElementById('testimonials-container');
const testimonialCards = document.querySelectorAll('.testimonial-card');

function highlightCenterCard() {
   
    const containerCenter = testimonialsContainer.scrollLeft + testimonialsContainer.offsetWidth / 2;

    testimonialCards.forEach(card => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        
        
        const distance = Math.abs(containerCenter - cardCenter);
        
       
        const threshold = testimonialsContainer.offsetWidth / 4; 

        if (distance < threshold) {
            card.classList.add('is-centered');
        } else {
            card.classList.remove('is-centered');
        }
    });
}


testimonialsContainer.addEventListener('scroll', highlightCenterCard);


window.addEventListener('load', highlightCenterCard);
