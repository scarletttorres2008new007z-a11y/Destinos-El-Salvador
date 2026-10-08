// Global variables
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTestimonials();
    initializeAnimations();
    initializeForms();
    initializeFloatingActionButton();
    initializeScrollEffects();
    initializeExperienceModal();
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.innerHTML = mobileMenu.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '☰';
                }
            }
        });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

// Testimonials functionality
function initializeTestimonials() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', previousTestimonial);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestimonial);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });

    // Auto-play testimonials
    setInterval(nextTestimonial, 5000);

    // Initialize first testimonial
    showTestimonial(0);
}

function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });

    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // Show current testimonial
    if (testimonials[index]) {
        testimonials[index].classList.add('active');
    }

    // Activate current dot
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

function previousTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
}

// Animation functionality
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.place-card, .package-card, .stat-item, .action-btn');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Floating animation for action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach((btn, index) => {
        btn.style.animationDelay = `${index * 0.1}s`;
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Experiencias Imperdibles: modal de detalles
const experiencias = {
    tunco: {
        nombre: 'Playa El Tunco',
        imagen: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1200&auto=format&fit=crop',
        alt: 'Playa El Tunco',
        ubicacion: '📍 La Libertad',
        descripcion: 'Pequeño pueblo de playa famoso por la gran roca que le da nombre y por sus olas constantes durante todo el año. De día reúne a surfistas de todo el mundo y, al caer la tarde, se llena de vida con restaurantes, música y uno de los atardeceres más bonitos del Pacífico.',
        actividades: [
            'Tomar clases de surf o alquilar una tabla.',
            'Ver el atardecer junto a la roca de El Tunco.',
            'Probar mariscos y pupusas frente al mar.',
            'Disfrutar la vida nocturna del pueblo.'
        ],
        info: [
            'Mejor época: de noviembre a abril (temporada seca).',
            'Presupuesto aproximado: $25-40 por día.',
            'A unos 45 minutos de San Salvador.'
        ]
    },
    santaana: {
        nombre: 'Volcán de Santa Ana',
        imagen: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
        alt: 'Volcán de Santa Ana',
        ubicacion: '📍 Parque Nacional Los Volcanes, Santa Ana',
        descripcion: 'También llamado Ilamatepec, es el volcán más alto de El Salvador. Su cráter guarda una laguna color turquesa con fumarolas, y desde la cima se ven el Lago de Coatepeque, el volcán de Izalco y, en días despejados, el océano Pacífico.',
        actividades: [
            'Hacer la caminata guiada hasta el cráter.',
            'Asomarte a la laguna turquesa del volcán.',
            'Visitar el Cerro Verde y el volcán de Izalco.'
        ],
        info: [
            'Las caminatas salen con guía por la mañana.',
            'Lleva agua, protector solar y un abrigo ligero.',
            'Presupuesto aproximado: $15-25 por día.'
        ]
    },
    ceren: {
        nombre: 'Joya de Cerén',
        imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
        alt: 'Joya de Cerén',
        ubicacion: '📍 San Juan Opico, La Libertad',
        descripcion: 'Conocida como la Pompeya de América, es una aldea maya que quedó sepultada por la ceniza de una erupción volcánica hace unos 1,400 años. Gracias a eso se conservaron casas, objetos y cultivos de la vida cotidiana, y por eso fue declarada Patrimonio de la Humanidad por la UNESCO.',
        actividades: [
            'Recorrer las estructuras de la antigua aldea maya.',
            'Visitar el museo del sitio y sus piezas originales.',
            'Conocer cómo vivían las familias mayas del lugar.'
        ],
        info: [
            'A unos 40 minutos de San Salvador.',
            'Presupuesto aproximado: $5-15 por día.',
            'Lleva sombrero y agua: parte del recorrido es al sol.'
        ]
    },
    coatepeque: {
        nombre: 'Lago de Coatepeque',
        imagen: 'https://images.unsplash.com/photo-1698615195164-61794e24fd84?auto=format&fit=crop&w=1200&q=80',
        alt: 'Muelle en el Lago de Coatepeque',
        ubicacion: '📍 Santa Ana',
        descripcion: 'Formado dentro de una antigua caldera volcánica, el lago es famoso por su agua azul intenso, que en algunas épocas del año cambia a turquesa. Está rodeado de colinas verdes, muelles y restaurantes con vista.',
        actividades: [
            'Pasear en lancha o en kayak.',
            'Nadar desde los muelles.',
            'Comer en un restaurante con vista al lago.'
        ],
        info: [
            'Queda cerca del Volcán de Santa Ana: se pueden visitar el mismo día.',
            'Presupuesto aproximado: $20-35 por día.',
            'Por la mañana el agua suele verse más azul.'
        ]
    },
    suchitoto: {
        nombre: 'Suchitoto',
        imagen: 'https://images.unsplash.com/photo-1680374635221-aca00abf60f5?auto=format&fit=crop&w=1200&q=80',
        alt: 'Calle empedrada frente a la iglesia de Suchitoto',
        ubicacion: '📍 Cuscatlán',
        descripcion: 'Pueblo colonial de casas blancas y calles empedradas, considerado la capital cultural de El Salvador. Tiene galerías, talleres de añil, festivales de arte y miradores hacia el lago Suchitlán.',
        actividades: [
            'Caminar por el centro histórico y la iglesia Santa Lucía.',
            'Participar en un taller de teñido con añil.',
            'Pasear en lancha por el lago Suchitlán.'
        ],
        info: [
            'A aproximadamente una hora de San Salvador.',
            'Los fines de semana hay más actividades culturales.',
            'Presupuesto aproximado: $20-30 por día.'
        ]
    },
    flores: {
        nombre: 'Ruta de las Flores',
        imagen: 'https://images.unsplash.com/photo-1694842492258-deb917102d57?auto=format&fit=crop&w=1200&q=80',
        alt: 'Sombrillas de colores en Concepción de Ataco',
        ubicacion: '📍 Sonsonate y Ahuachapán',
        descripcion: 'Recorrido por pueblos de montaña como Nahuizalco, Juayúa, Apaneca y Concepción de Ataco, conocidos por sus murales, cafetales, artesanías y clima fresco.',
        actividades: [
            'Visitar la feria gastronómica de Juayúa los fines de semana.',
            'Hacer un tour de café en una finca local.',
            'Recorrer los murales y tiendas de Ataco.'
        ],
        info: [
            'Mejor época: de noviembre a febrero, cuando florece la ruta.',
            'Lleva un suéter: en la montaña hace más fresco.',
            'Presupuesto aproximado: $20-35 por día.'
        ]
    }
};

function initializeExperienceModal() {
    const modal = document.getElementById('exp-modal');
    const buttons = document.querySelectorAll('.exp-btn[data-exp]');

    if (!modal || buttons.length === 0) return;

    const img = modal.querySelector('.exp-modal-img');
    const title = modal.querySelector('.exp-modal-title');
    const location = modal.querySelector('.exp-modal-location');
    const desc = modal.querySelector('.exp-modal-desc');
    const activities = modal.querySelector('.exp-modal-activities');
    const info = modal.querySelector('.exp-modal-info');
    const closeBtn = modal.querySelector('.exp-modal-close');
    let lastFocused = null;

    function fillList(list, items) {
        list.innerHTML = '';
        items.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            list.appendChild(li);
        });
    }

    function openModal(key) {
        const exp = experiencias[key];
        if (!exp) return;

        img.src = exp.imagen;
        img.alt = exp.alt;
        title.textContent = exp.nombre;
        location.textContent = exp.ubicacion;
        desc.textContent = exp.descripcion;
        fillList(activities, exp.actividades);
        fillList(info, exp.info);

        lastFocused = document.activeElement;
        modal.querySelector('.exp-modal-dialog').scrollTop = 0;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('exp-modal-open');
        closeBtn.focus();
    }

    function closeModal() {
        if (!modal.classList.contains('is-open')) return;

        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('exp-modal-open');
        if (lastFocused) lastFocused.focus();
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.exp));
    });

    modal.querySelectorAll('.exp-modal-close, .exp-modal-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Cerrar al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Form functionality
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });

    // Input validation and styling
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });

        input.addEventListener('input', function() {
            validateField(this);
        });
    });
}

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn, .reserve-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            message = 'Por favor ingresa un email válido';
            break;
        case 'tel':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            isValid = phoneRegex.test(value) && value.length >= 8;
            message = 'Por favor ingresa un teléfono válido';
            break;
        default:
            isValid = value.length > 0;
            message = 'Este campo es requerido';
    }

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'Este campo es requerido';
    }

    // Update field styling
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
    }

    return isValid;
}

// Floating Action Button
function initializeFloatingActionButton() {
    const fabBtn = document.querySelector('.fab-btn');
    
    if (fabBtn) {
        fabBtn.addEventListener('click', function() {
            showContactOptions();
        });
    }
}

function showContactOptions() {
    const options = [
        { icon: '📱', text: 'WhatsApp', action: () => window.open('https://wa.me/50312345678', '_blank') },
        { icon: '✉️', text: 'Email', action: () => window.location.href = 'mailto:info@svelsalvador.com' },
        { icon: '📞', text: 'Llamar', action: () => window.location.href = 'tel:+50312345678' }
    ];

    const modal = createModal('Contáctanos', options);
    document.body.appendChild(modal);
}

function createModal(title, options) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">✕</button>
            </div>
            <div class="modal-body">
                ${options.map(option => `
                    <button class="contact-option" data-action="${option.text}">
                        <span class="option-icon">${option.icon}</span>
                        <span class="option-text">${option.text}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    // Add modal styles
    const modalStyles = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: rgba(30, 58, 138, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 1rem;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            animation: scaleIn 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .modal-header h3 {
            color: white;
            font-size: 1.5rem;
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .contact-option {
            display: flex;
            align-items: center;
            gap: 1rem;
            width: 100%;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.75rem;
            color: white;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 0.75rem;
        }
        
        .contact-option:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
        
        .option-icon {
            font-size: 1.5rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;

    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }

    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    modal.querySelectorAll('.contact-option').forEach((option, index) => {
        option.addEventListener('click', () => {
            options[index].action();
            modal.remove();
        });
    });

    return modal;
}

// Scroll effects
function initializeScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'var(--secondary-blue)';
        } else {
            navbar.style.background = 'var(--secondary-blue)';
        }
    });

    // Scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #f97316;
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 2rem;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            color: white;
            font-weight: 500;
            z-index: 2000;
            animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 3s;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .notification.success {
            background: #059669;
        }
        
        .notification.error {
            background: #dc2626;
        }
        
        .notification.info {
            background: #0057a6;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;

    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3500);
}

// Filter functionality for destination pages
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.destination-card, .gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const cards = document.querySelectorAll('.destination-card, .place-card');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            cards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const description = card.querySelector('.description, p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Image lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeSearch();
    initializeLazyLoading();
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export functions for global use
window.nextTestimonial = nextTestimonial;
window.previousTestimonial = previousTestimonial;
window.showNotification = showNotification;
