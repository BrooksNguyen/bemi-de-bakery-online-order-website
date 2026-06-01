// --- Google Apps Script Web App URL ---
const scriptURL = 'https://script.google.com/macros/s/AKfycbwx2NS95PpO0fAn0FSHWqn0sl3fanf7FhqF5PjpbJwZHz8XZAGeS_ZCDsvzs55fwl5S/exec';

// --- Navbar Scroll Effect & Active Section Indicator ---
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    // Scrolled floating bar state
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Active section highlight detection
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 240)) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
            a.classList.add('active');
        }
    });
});

// --- Scroll Fade-In Animations (Intersection Observer) ---
const fadeSections = document.querySelectorAll('.fade-in-section');
if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Trigger animation once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeSections.forEach(section => {
        sectionObserver.observe(section);
    });
} else {
    // Fallback for older browsers
    fadeSections.forEach(section => {
        section.classList.add('is-visible');
    });
}

// --- Mobile Hamburger Menu ---
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
    });
}

// --- Dynamic Flavor Selection for Ordering ---
const quantityInput = document.getElementById('quantity');
const flavorContainer = document.getElementById('flavor-container');

function renderFlavorSelectors(count) {
    if (!flavorContainer) return;
    flavorContainer.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        const item = document.createElement('div');
        item.className = 'flavor-item';
        item.innerHTML = `
            <label>Box ${i}</label>
            <select class="form-control flavor-select" required>
                <option value="" disabled selected>Select flavor</option>
                <option value="Pistachio">Pistachio</option>
                <option value="Cream Cheese">Cream Cheese</option>
                <option value="Biscoff">Biscoff</option>
            </select>
        `;
        flavorContainer.appendChild(item);
    }
}

// Initial render for 1 box on load
if (flavorContainer) {
    renderFlavorSelectors(1);

    quantityInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) {
            // Wait for valid input
        } else {
            if (val > 100) val = 100; // Sane max limit
            renderFlavorSelectors(val);
        }
    });
}

// --- Google Sheets Order Form Submission ---
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect all selected flavors
        const flavorSelects = document.querySelectorAll('.flavor-select');
        const flavors = Array.from(flavorSelects).map((select, index) => `Box ${index + 1}: ${select.value}`).join(' | ');

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            flavor: flavors,
            quantity: document.getElementById('quantity').value,
            pickup: document.getElementById('pickup').value,
            notes: document.getElementById('notes').value
        };

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const formData = new URLSearchParams();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' })
            .then(() => {
                // Play sweet pop chime sound
                playSweetSound();
                
                // Show Custom Success Modal
                const successModal = document.getElementById('successModal');
                if (successModal) {
                    successModal.classList.add('active');
                } else {
                    alert('Thank you! Your order has been successfully placed.');
                }
                
                orderForm.reset();
                renderFlavorSelectors(1);
                btn.textContent = originalText;
                btn.disabled = false;
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('An error occurred. Please try again later.');
                btn.textContent = originalText;
                btn.disabled = false;
            });
    });
}

// --- Interactive 5-Star Feedback Rating ---
const stars = document.querySelectorAll('.star-rating .star');
const ratingValueInput = document.getElementById('ratingValue');

if (stars.length > 0) {
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const val = parseInt(this.getAttribute('data-value'));
            highlightStars(val);
        });

        star.addEventListener('mouseout', function() {
            const currentVal = parseInt(ratingValueInput.value);
            highlightStars(currentVal);
        });

        star.addEventListener('click', function() {
            const val = parseInt(this.getAttribute('data-value'));
            ratingValueInput.value = val;
            highlightStars(val);
        });
    });
}

function highlightStars(count) {
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// --- Feedback Name/Anonymous Toggling ---
const anonymousCheckbox = document.getElementById('anonymous');
const feedbackNameInput = document.getElementById('feedbackName');
const nameGroup = document.getElementById('nameGroup');

if (anonymousCheckbox && feedbackNameInput) {
    anonymousCheckbox.addEventListener('change', function() {
        if (this.checked) {
            feedbackNameInput.value = 'Anonymous';
            feedbackNameInput.disabled = true;
            nameGroup.style.opacity = '0.5';
        } else {
            feedbackNameInput.value = '';
            feedbackNameInput.disabled = false;
            nameGroup.style.opacity = '1';
        }
    });
}

// --- Feedback Photo Upload & Client-Side Compression ---
const uploadZone = document.getElementById('uploadZone');
const feedbackImageFile = document.getElementById('feedbackImage');
const uploadPrompt = document.getElementById('uploadPrompt');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImageBtn');
let compressedImageBase64 = '';

if (uploadZone && feedbackImageFile) {
    // Click to upload
    uploadZone.addEventListener('click', () => {
        feedbackImageFile.click();
    });

    // Prevent default drag & drop behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Drag-over highlights
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.style.borderColor = 'var(--color-accent)';
            uploadZone.style.background = 'rgba(179, 142, 93, 0.05)';
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.style.borderColor = 'rgba(179, 142, 93, 0.3)';
            uploadZone.style.background = 'var(--color-bg)';
        }, false);
    });

    // Handle dropped files
    uploadZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            processFeedbackImage(files[0]);
        }
    });

    // Handle file selection
    feedbackImageFile.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            processFeedbackImage(this.files[0]);
        }
    });

    // Remove selected image
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering uploadZone click
            resetImageUpload();
        });
    }
}

function processFeedbackImage(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, JPEG).');
        return;
    }
    
    // Canvas Compression to prevent massive Base64 strings (max 400x400px, 0.7 quality)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 400;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Compress as JPEG
            compressedImageBase64 = canvas.toDataURL('image/jpeg', 0.7);
            
            // Show preview
            imagePreview.src = compressedImageBase64;
            uploadPrompt.style.display = 'none';
            imagePreviewContainer.style.display = 'block';
        };
    };
}

function resetImageUpload() {
    feedbackImageFile.value = '';
    compressedImageBase64 = '';
    imagePreview.src = '';
    imagePreviewContainer.style.display = 'none';
    uploadPrompt.style.display = 'flex';
}

// --- Submit Feedback ---
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Submitting feedback...';
        btn.disabled = true;

        const isAnonymous = document.getElementById('anonymous').checked;
        const nameVal = isAnonymous ? 'Anonymous' : (document.getElementById('feedbackName').value.trim() || 'Anonymous');

        // Form URL parameters
        const params = new URLSearchParams();
        params.append('action', 'feedback');
        params.append('name', nameVal);
        params.append('anonymous', isAnonymous.toString());
        params.append('rating', document.getElementById('ratingValue').value);
        params.append('comment', document.getElementById('comment').value.trim());
        params.append('image', compressedImageBase64); // Sent as a compressed string

        fetch(scriptURL, {
            method: 'POST',
            body: params
        })
        .then(response => response.text())
        .then(() => {
            alert('Thank you for your wonderful feedback! ❤️');
            feedbackForm.reset();
            resetImageUpload();
            highlightStars(5);
            document.getElementById('ratingValue').value = '5';
            
            // If anonymous check was on, reset styles
            if (feedbackNameInput) {
                feedbackNameInput.disabled = false;
                nameGroup.style.opacity = '1';
            }
            
            btn.textContent = originalText;
            btn.disabled = false;
            
            // Re-fetch and update testimonials immediately
            loadReviews();
        })
        .catch(error => {
            console.error('Error!', error);
            alert('An error occurred while submitting feedback. Please try again.');
            btn.textContent = originalText;
            btn.disabled = false;
        });
    });
}

// --- Load Testimonial Reviews in Real-Time ---
const reviewsContainer = document.getElementById('reviews-container');

function loadReviews() {
    if (!reviewsContainer) return;

    fetch(scriptURL)
        .then(response => response.json())
        .then(reviews => {
            // Remove previous dynamically loaded reviews only, keeping HTML default ones
            const dynamicCards = reviewsContainer.querySelectorAll('.dynamic-review-card');
            dynamicCards.forEach(card => card.remove());
            
            reviews.forEach(review => {
                const card = document.createElement('div');
                card.className = 'review-card dynamic-review-card';
                
                // Stars rendering
                const starVal = parseInt(review.rating) || 5;
                const starsHtml = '★'.repeat(starVal) + '☆'.repeat(5 - starVal);
                
                // Attachment rendering
                let imgHtml = '';
                if (review.image && review.image.trim() !== '') {
                    imgHtml = `<img src="${review.image}" class="review-image-attachment" alt="User feedback photo">`;
                }

                card.innerHTML = `
                    <div>
                        <div class="review-header">
                            <span class="reviewer-name">${review.name}</span>
                            <span class="review-stars">${starsHtml}</span>
                        </div>
                        <p class="review-comment">"${review.comment}"</p>
                    </div>
                    <div>
                        ${imgHtml}
                        <div class="review-footer">
                            <span>Bemi de Bakery Client</span>
                            <span>${review.time || ''}</span>
                        </div>
                    </div>
                `;
                // Prepend so latest reviews show up on top of default ones
                reviewsContainer.insertBefore(card, reviewsContainer.firstChild);
            });
        })
        .catch(error => {
            console.error('Error loading reviews:', error);
            // Let the default fallback reviews in HTML display perfectly on fetch failures
        });
}

// Trigger review loading on page ready
if (reviewsContainer) {
    loadReviews();
}

// --- Close Custom Modal ---
const closeModalBtn = document.getElementById('closeModalBtn');
const successModal = document.getElementById('successModal');
if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
}

// --- Synthesized Sweet Web Audio Pop Sound ---
function playSweetSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        // Beautiful quick high-pitched water bubble drop sound
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
    } catch (e) {
        // Fallback silently if blocked
    }
}

// Bind playSweetSound globally so button clicks trigger it
window.playSweetSound = playSweetSound;

// --- Mouse-Follow Glow Overlay (Desktop only) ---
const glowEl = document.getElementById('mouseGlow');
if (glowEl) {
    window.addEventListener('mousemove', (e) => {
        glowEl.style.opacity = '1';
        glowEl.style.left = e.clientX + 'px';
        glowEl.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => {
        glowEl.style.opacity = '0';
    });
}

// --- Flour Particles Floating Animation ---
const canvas = document.getElementById('flourCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles = [];
    const maxParticles = 40; // subtle, not overwhelming
    
    class FlourParticle {
        constructor() {
            this.reset();
            this.y = Math.random() * height; // initial random scatter
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = -10;
            this.size = Math.random() * 2 + 1; // 1 to 3px
            this.speedY = Math.random() * 0.4 + 0.15; // slow drift
            this.speedX = Math.random() * 0.15 - 0.075; // light drift side to side
            this.opacity = Math.random() * 0.4 + 0.2;
            this.sinVal = Math.random() * 100;
        }
        
        update() {
            this.y += this.speedY;
            this.sinVal += 0.005;
            this.x += this.speedX + Math.sin(this.sinVal) * 0.15; // sinusoidal side sway
            
            // Loop back to top
            if (this.y > height || this.x < 0 || this.x > width) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(179, 142, 93, ${this.opacity})`; // Warm caramel-dust particles
            ctx.fill();
        }
    }
    
    // Create initial particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new FlourParticle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    animateParticles();
}
