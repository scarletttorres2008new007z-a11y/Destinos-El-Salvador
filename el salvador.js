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
    initializeDestinationModal();
    initializeExpedientes();
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
            this.style.transform = 'translateY(-4px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
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

// Destinos: modal con fotografía y toda la información de cada tarjeta
function initializeDestinationModal() {
    const modal = document.getElementById('dest-modal');
    const buttons = document.querySelectorAll('.destination-card .details-btn, .gem-card .details-btn');

    if (!modal || buttons.length === 0) return;

    const figure = modal.querySelector('.dest-modal-figure');
    const img = modal.querySelector('.dest-modal-img');
    const credit = modal.querySelector('.dest-modal-credit');
    const content = modal.querySelector('.dest-modal-content');
    const closeBtn = modal.querySelector('.exp-modal-close');
    let lastFocused = null;

    function link(text, href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        a.target = '_blank';
        a.rel = 'noopener';
        return a;
    }

    function openModal(card) {
        const photo = card.querySelector('.dest-img');

        if (photo) {
            img.src = photo.dataset.full || photo.src;
            img.alt = photo.alt;
            credit.textContent = 'Foto: ';
            credit.append(
                link(photo.dataset.author, photo.dataset.source), ' · ',
                link(photo.dataset.license, photo.dataset.licenseUrl), ' · Wikimedia Commons'
            );
            figure.classList.remove('is-hidden');
        } else {
            img.removeAttribute('src');
            img.alt = '';
            credit.textContent = '';
            figure.classList.add('is-hidden');
        }

        const info = card.querySelector('.card-content').cloneNode(true);
        info.querySelectorAll('.details-btn').forEach(btn => btn.remove());
        const heading = info.querySelector('h3, h4');
        if (heading) heading.id = 'dest-modal-title';
        content.replaceChildren(...info.childNodes);

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
        btn.addEventListener('click', () => openModal(btn.closest('.destination-card, .gem-card')));
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
        { icon: 'whatsapp', text: 'WhatsApp', detail: 'Escríbenos al +503 1234-5678', action: () => window.open('https://wa.me/50312345678', '_blank') },
        { icon: 'email', text: 'Email', detail: 'info@svelsalvador.com', action: () => window.location.href = 'mailto:info@svelsalvador.com' },
        { icon: 'phone', text: 'Llamar', detail: '+503 1234-5678', action: () => window.location.href = 'tel:+50312345678' }
    ];

    const modal = createModal('Contáctanos', options);
    document.body.appendChild(modal);
}

const modalIcons = {
    whatsapp: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    email: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
};

function createModal(title, options) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
            <div class="modal-header">
                <div>
                    <h3 id="contact-modal-title">${title}</h3>
                    <p class="modal-subtitle">Elige cómo prefieres comunicarte con nosotros</p>
                </div>
                <button class="modal-close" aria-label="Cerrar">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="modal-body">
                ${options.map(option => `
                    <button class="contact-option" data-action="${option.text}">
                        <span class="option-icon">${modalIcons[option.icon]}</span>
                        <span class="option-label">
                            <span class="option-text">${option.text}</span>
                            <span class="option-detail">${option.detail}</span>
                        </span>
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
            background: rgba(0, 0, 0, 0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }

        .modal-overlay.closing {
            animation: fadeOut 0.25s ease forwards;
        }

        .modal-overlay .modal-content {
            background: #ffffff;
            border-radius: 1rem;
            max-width: 420px;
            width: 100%;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            animation: scaleIn 0.3s ease;
        }

        .modal-overlay.closing .modal-content {
            animation: scaleOut 0.25s ease forwards;
        }

        .modal-overlay .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
            padding: 1.5rem;
            background: #0057a6;
            color: #ffffff;
        }

        .modal-overlay .modal-header h3 {
            color: #ffffff;
            font-size: 1.4rem;
            margin: 0 0 0.25rem;
        }

        .modal-overlay .modal-subtitle {
            color: rgba(255, 255, 255, 0.85);
            font-size: 0.95rem;
            margin: 0;
        }

        .modal-overlay .modal-close {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.15);
            border: none;
            color: #ffffff;
            cursor: pointer;
            border-radius: 50%;
            transition: background 0.3s ease, transform 0.3s ease;
        }

        .modal-overlay .modal-close:hover,
        .modal-overlay .modal-close:focus-visible {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
            outline: none;
        }

        .modal-overlay .modal-body {
            padding: 1.5rem;
        }

        .contact-option {
            display: flex;
            align-items: center;
            gap: 1rem;
            width: 100%;
            padding: 1rem;
            background: #ffffff;
            border: 1px solid #dbe3ec;
            border-radius: 0.75rem;
            color: #1f2937;
            font-size: 1rem;
            text-align: left;
            cursor: pointer;
            transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
            margin-bottom: 0.75rem;
        }

        .contact-option:last-child {
            margin-bottom: 0;
        }

        .contact-option:hover,
        .contact-option:focus-visible {
            border-color: #00a3da;
            background: #f0f9fd;
            transform: translateY(-2px);
            outline: none;
        }

        .option-icon {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #00a3da;
            color: #ffffff;
        }

        .option-label {
            display: flex;
            flex-direction: column;
        }

        .option-text {
            font-weight: 600;
            color: #0057a6;
        }

        .option-detail {
            font-size: 0.875rem;
            color: #6b7280;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        @keyframes scaleOut {
            from { transform: scale(1); opacity: 1; }
            to { transform: scale(0.9); opacity: 0; }
        }
    `;

    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }

    // Close with a short fade-out
    const closeModal = () => {
        if (modal.classList.contains('closing')) return;
        document.removeEventListener('keydown', onKeydown);
        modal.classList.add('closing');
        setTimeout(() => modal.remove(), 250);
    };

    const onKeydown = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };

    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', onKeydown);

    modal.querySelectorAll('.contact-option').forEach((option, index) => {
        option.addEventListener('click', () => {
            options[index].action();
            closeModal();
        });
    });

    setTimeout(() => modal.querySelector('.modal-close').focus(), 0);

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
    scrollToTopBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    scrollToTopBtn.setAttribute('aria-label', 'Subir');
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
        display: flex;
        align-items: center;
        justify-content: center;
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
    // La Galería tiene su propio filtrado en galeria.js
    const filterBtns = document.querySelectorAll('.filter-btn:not(.gallery-filters .filter-btn)');
    const cards = document.querySelectorAll('.destination-card');

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

// =====================================================================
// El Salvador oculto: expedientes secretos
// Para agregar un expediente nuevo basta con añadir un objeto a
// EXPEDIENTES siguiendo la misma estructura; la portada, las pestañas,
// las pistas, el mapa y el desafío se generan automáticamente.
// Las fotografías se guardan en img/expedientes/ y sus créditos en CREDITOS.md.
// =====================================================================
const EXPEDIENTES_MAPA = {
    src: 'img/expedientes/mapa-relieve-el-salvador.jpg',
    // Límites geográficos del mapa de relieve (grados decimales)
    norte: 14.6, sur: 13.0, oeste: -90.2, este: -87.6,
    credito: 'Mapa: Carport, a partir de datos de NordNordWest (CC BY-SA 3.0), Wikimedia Commons',
    fuente: 'https://commons.wikimedia.org/wiki/File:El_Salvador_relief_location_map.jpg'
};

const EXPEDIENTES = [
    {
        id: 'ceren',
        numero: '001',
        titulo: 'El pueblo que quedó enterrado',
        lugar: 'Joya de Cerén',
        clasificacion: ['Arqueología', 'Vulcanología'],
        portada: {
            src: 'img/expedientes/ceren-portada.jpg',
            alt: 'Estructuras 12 y 10 del sitio arqueológico Joya de Cerén bajo su techo de protección'
        },
        intro: 'Una aldea agrícola quedó sepultada bajo ceniza volcánica hacia el año 600 d. C. y conservó, casi intacta, la vida diaria de sus habitantes.',
        ficha: [
            ['Ubicación', 'San Juan Opico, La Libertad'],
            ['Periodo', 'Clásico, hacia el 600 d. C.'],
            ['Descubrimiento', '1976'],
            ['Protección', 'Patrimonio Mundial de la UNESCO desde 1993']
        ],
        contexto: [
            'Joya de Cerén era una pequeña comunidad agrícola prehispánica del valle de Zapotitán. Hacia el año 600 d. C., la erupción del volcán Loma Caldera, que se abrió a pocos cientos de metros de la aldea, la cubrió con varios metros de ceniza y material volcánico.',
            'En 1976, una máquina que nivelaba el terreno para un proyecto agrícola dejó al descubierto una construcción de tierra. Dos años después, el arqueólogo Payson Sheets, de la Universidad de Colorado, inició las primeras exploraciones, y desde 1988 las investigaciones han continuado casi sin interrupción.',
            'A diferencia de los grandes centros ceremoniales, Joya de Cerén no muestra palacios ni pirámides, sino casas, bodegas, cocinas, cultivos y objetos de uso cotidiano. Por eso la UNESCO la inscribió en 1993 como Patrimonio Mundial: permite conocer cómo vivían las familias campesinas de Centroamérica en esa época.'
        ],
        nota: 'La ceniza no destruyó la aldea: la selló. Gracias a ello se conservaron huellas de plantas, vasijas con alimentos y hasta los surcos de los cultivos.',
        evidencias: [
            {
                src: 'img/expedientes/ceren-estructura-11.jpg',
                alt: 'Estructura 11 de Joya de Cerén con las capas de ceniza visibles en la pared de la excavación',
                titulo: 'Estructura 11 y las capas de ceniza',
                descripcion: 'En las paredes de la excavación se distinguen las capas de material volcánico que cubrieron la aldea.',
                autor: 'Mario Roberto Durán Ortiz (Mariordo)', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:ES_Joya_Ceren_05_2012_Estructura_11_Area_1_1505.jpg'
            },
            {
                src: 'img/expedientes/ceren-temazcal.jpg',
                alt: 'Estructura 9 de Joya de Cerén, un baño de vapor o temazcal con cúpula de tierra',
                titulo: 'Estructura 9: el temazcal',
                descripcion: 'Baño de vapor comunitario con cúpula de tierra, uno de los edificios mejor conservados del sitio.',
                autor: 'Mario Roberto Durán Ortiz (Mariordo)', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:ES_Joya_Ceren_05_2012_Estructura_9_Area_2_Tamazcal_1478.JPG'
            },
            {
                src: 'img/expedientes/ceren-estructura-12.jpg',
                alt: 'Estructura 12 de Joya de Cerén con ventanas de celosía',
                titulo: 'Estructura 12: un edificio especial',
                descripcion: 'Tiene una puerta y ventanas de celosía que controlaban el paso. Los objetos hallados en su interior llevaron a interpretarlo como un lugar de uso ritual.',
                autor: 'Mario Roberto Durán Ortiz (Mariordo)', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:ES_Estructura_12_Area_1_Joya_Ceren_05_2012_1515.jpg'
            },
            {
                src: 'img/expedientes/ceren-estructura-3.jpg',
                alt: 'Estructura 3 del área 3 de Joya de Cerén, una construcción de tierra sobre plataforma',
                titulo: 'Estructura 3: un edificio comunitario',
                descripcion: 'Construcción de tierra sobre plataforma, en el área 3 del sitio.',
                autor: 'Mario Roberto Durán Ortiz (Mariordo)', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:ES_Joya_Ceren_05_2012_Estructura_3_Area_3_1469.jpg'
            }
        ],
        pistas: [
            {
                titulo: 'Ninguna víctima encontrada',
                texto: 'Hasta hoy no se han recuperado restos humanos en el sitio. En un camino de tierra blanca (sacbé) se registraron decenas de huellas, y más de la mitad se dirigen hacia el sur, lejos de la aldea.'
            },
            {
                titulo: 'Una despensa intacta',
                texto: 'Las excavaciones encontraron vasijas con frijoles, petates para dormir, herramientas de jardín, milpas, huertos de hierbas y agave y árboles frutales como guayabo y cacao.'
            },
            {
                titulo: 'Campos de yuca bajo la ceniza',
                texto: 'En 2007 se identificaron camas de cultivo de yuca, cosechadas poco antes de la erupción. Es una de las primeras evidencias arqueológicas de campos de yuca en América.'
            },
            {
                titulo: 'La estación del año',
                texto: 'El estado de las plantas, los frijoles almacenados y el maíz maduro sugieren que la erupción ocurrió entre agosto y septiembre, durante la estación lluviosa.'
            },
            {
                titulo: 'Edificios con funciones distintas',
                texto: 'La UNESCO registra 18 estructuras identificadas, 10 de ellas excavadas total o parcialmente: viviendas, bodegas, cocinas, edificios comunitarios, construcciones religiosas y un temazcal.'
            }
        ],
        sabemos: {
            hechos: [
                'La aldea fue sepultada por la erupción del volcán Loma Caldera, hacia el año 600 d. C.',
                'La ceniza conservó materiales que rara vez sobreviven: plantas, alimentos, petates y herramientas.',
                'No se han encontrado restos humanos en las excavaciones.',
                'Es Patrimonio Mundial de la UNESCO desde 1993.'
            ],
            debate: [
                'La fecha exacta de la erupción varía según el método de datación; la UNESCO la sitúa hacia el año 600 d. C.',
                'La época del año (agosto o septiembre) se deduce del estado de las plantas y los cultivos, no de un registro escrito.'
            ],
            interpretaciones: [
                'Que los habitantes lograron huir se interpreta a partir de la ausencia de restos humanos y de las huellas que se alejan de la aldea.',
                'La función ritual de la Estructura 12 se propone por los objetos encontrados en ella, como figurillas, conchas y astas de venado.'
            ],
            leyendas: [
                'El apodo «la Pompeya de América» es una comparación divulgativa: a diferencia de Pompeya, en Joya de Cerén no se han encontrado víctimas.'
            ]
        },
        fuentes: [
            { texto: 'UNESCO, Centro del Patrimonio Mundial. «Joya de Cerén Archaeological Site» (n.º 675).', url: 'https://whc.unesco.org/es/list/675/' },
            { texto: 'Sheets, P. y Dixon, C. «Joya de Cerén: An Intimate Portrait of the Ancient Maya». Popular Archaeology.', url: 'https://popular-archaeology.com/article/joya-de-ceren-an-intimate-portrait-of-the-ancient-maya/' },
            { texto: 'Sheets, P. (2006). The Cerén Site: An Ancient Village Buried by Volcanic Ash in Central America. 2.ª ed. Thomson Wadsworth.' }
        ],
        ubicacion: {
            lat: 13.8275, lon: -89.3561,
            referencia: 'Cantón Joya de Cerén, San Juan Opico, departamento de La Libertad. A unos 36 km al noroeste de San Salvador.',
            relacionados: [
                { id: 'ilopango', texto: 'Siglos antes, la ceniza de la erupción de Ilopango también cubrió el valle de Zapotitán, donde se encuentra Joya de Cerén.' }
            ]
        },
        desafio: {
            pregunta: '¿Qué evidencia permite pensar que los habitantes de Joya de Cerén alcanzaron a huir de la erupción?',
            opciones: [
                { texto: 'No se han encontrado restos humanos y hay huellas que se alejan de la aldea.', correcta: true,
                  explicacion: 'Correcto. Es una interpretación basada en evidencia: la ausencia de restos humanos y las huellas registradas en el sacbé, que en su mayoría se dirigen hacia el sur.' },
                { texto: 'Documentos escritos de la época describen la evacuación.', correcta: false,
                  explicacion: 'No es así. No existe ningún documento escrito sobre la erupción; todo lo que sabemos proviene de la arqueología y la vulcanología.' },
                { texto: 'La aldea fue reconstruida en el mismo lugar después de la erupción.', correcta: false,
                  explicacion: 'Incorrecto. La aldea quedó sepultada y no fue reconstruida; justamente por eso se conservó hasta su descubrimiento en 1976.' },
                { texto: 'La ceniza era tan fina que no llegó a cubrir las casas.', correcta: false,
                  explicacion: 'Incorrecto. Varias capas de ceniza y material volcánico, de varios metros de espesor, cubrieron por completo las construcciones.' }
            ]
        }
    },
    {
        id: 'ilopango',
        numero: '002',
        titulo: 'El origen de un paisaje',
        lugar: 'Lago de Ilopango',
        clasificacion: ['Geología', 'Vulcanología'],
        portada: {
            src: 'img/expedientes/ilopango-portada.jpg',
            alt: 'Vista de la caldera del lago de Ilopango desde la carretera panorámica'
        },
        intro: 'Este lago ocupa la caldera de un volcán que, en el siglo V, protagonizó una de las mayores erupciones de los últimos milenios en Centroamérica.',
        ficha: [
            ['Ubicación', 'Entre San Salvador, La Paz y Cuscatlán'],
            ['Tipo', 'Lago en una caldera volcánica'],
            ['Superficie', 'Unos 70 km² (8 × 11 km)'],
            ['Última erupción', '1879-1880']
        ],
        contexto: [
            'El lago de Ilopango, al este de San Salvador, no ocupa un valle común: llena una caldera, una gran depresión que se forma cuando el terreno se hunde tras el vaciado de una cámara de magma durante erupciones muy grandes. Sus paredes se elevan entre 100 y 500 metros sobre el agua.',
            'La caldera se formó y se modificó a lo largo de muchas erupciones. La más reciente de gran tamaño es conocida por los geólogos como Tierra Blanca Joven (TBJ), por los depósitos claros que dejó en buena parte del centro de El Salvador.',
            'Mucho después, entre el 31 de diciembre de 1879 y marzo de 1880, el volcán tuvo su única erupción con registro histórico: tras semanas de sismos, un domo de lava emergió en el centro del lago. Sus restos son hoy las Islas Quemadas.'
        ],
        nota: 'La pregunta abierta del caso no es si la erupción TBJ ocurrió, sino cuándo exactamente: dos equipos de investigación proponen fechas distintas.',
        evidencias: [
            {
                src: 'img/expedientes/ilopango-caldera-aerea.jpg',
                alt: 'Vista aérea de la caldera de Ilopango llena por el lago, con depósitos claros en primer plano',
                titulo: 'La caldera desde el aire',
                descripcion: 'La caldera de 8 × 11 km vista desde el este-sureste. En primer plano se ven exposiciones claras de la formación Tierra Blanca Joven.',
                autor: 'Lee Siebert, Smithsonian Institution (Global Volcanism Program)', licencia: 'Dominio público',
                licenciaUrl: '',
                fuente: 'https://commons.wikimedia.org/wiki/File:Ilopango_caldera.jpg'
            },
            {
                src: 'img/expedientes/ilopango-islas-quemadas.jpg',
                alt: 'Islotes rocosos de las Islas Quemadas en el lago de Ilopango',
                titulo: 'Las Islas Quemadas',
                descripcion: 'Islotes que marcan la cima de un domo de lava, en su mayor parte sumergido, formado en la erupción de 1879-1880.',
                autor: 'JMRAFFi', licencia: 'CC BY-SA 4.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:Ilopango_Isla_quemada.jpg'
            },
            {
                src: 'img/expedientes/ilopango-san-vicente.jpg',
                alt: 'Panorámica con el lago de Ilopango y el volcán de San Vicente al fondo',
                titulo: 'Un paisaje volcánico',
                descripcion: 'El lago de Ilopango con el volcán de San Vicente (Chichontepec) al fondo.',
                autor: 'Arne Müseler', licencia: 'CC BY-SA 3.0 DE',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/de/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:El-salvador_san-salvador_Lago_de_Ilopango_volc%C3%A1n_de_San_Vicente_Chichontepec.JPG'
            }
        ],
        pistas: [
            {
                titulo: 'Una fecha escrita en el hielo',
                texto: 'En un núcleo de hielo de Groenlandia (TUNU2013), a más de 7000 km, se hallaron partículas de vidrio volcánico que coinciden con la ceniza de Ilopango. Esa capa permitió fechar la erupción en el año 431 d. C., con un margen de ± 2 años.'
            },
            {
                titulo: 'Los anillos de un árbol',
                texto: 'La datación por radiocarbono de los anillos de un árbol de caoba sepultado por la erupción dio un rango de 425 a 440 d. C., coherente con la fecha del hielo.'
            },
            {
                titulo: 'Ceniza sobre dos millones de km²',
                texto: 'Según el estudio publicado en 2020, cerca de 2 millones de km² recibieron más de medio centímetro de ceniza en pocos días, y la columna eruptiva alcanzó unos 45 km de altura.'
            },
            {
                titulo: 'Un territorio inhabitable',
                texto: 'Las corrientes de material volcánico llegaron a unos 50 km del volcán y dejaron depósitos de hasta 70 m en valles cercanos. Las zonas a menos de unos 80 km quedaron inhabitables durante años o décadas.'
            },
            {
                titulo: 'Islas que nacieron en 1880',
                texto: 'En enero de 1880 el nivel del lago subió y el desagüe por el río Jiboa inundó el valle. El 23 de enero un domo de lava rompió la superficie del agua y llegó a unos 50 m de altura antes de que explosiones posteriores destruyeran gran parte de él.'
            }
        ],
        sabemos: {
            hechos: [
                'El lago ocupa una caldera formada y modificada por varias erupciones de gran tamaño.',
                'La erupción Tierra Blanca Joven fue de índice de explosividad volcánica (VEI) 6, una de las mayores del Holoceno en Centroamérica.',
                'Sus depósitos cubren buena parte del centro y occidente de El Salvador.',
                'La erupción de 1879-1880 formó el domo cuyos restos son las Islas Quemadas.'
            ],
            debate: [
                'Fecha: un estudio de 2019 (Dull y colaboradores) propuso el año 539-540 d. C. y la relacionó con un enfriamiento global de esa época. Un estudio de 2020 (Smith y colaboradores) propone el 431 ± 2 d. C. a partir del hielo de Groenlandia y los anillos de árboles.',
                'El volumen expulsado es una estimación: entre 50 y 95 km³ de magma según el estudio de 2020.'
            ],
            interpretaciones: [
                'El impacto sobre las poblaciones mayas cercanas fue grave en un radio de decenas de kilómetros, pero en las tierras bajas mayas, a más de 450 km, la ceniza fue de apenas milímetros.',
                'La relación de la erupción con cambios sociales de la región se sigue investigando; no hay pruebas de que provocara por sí sola el colapso de ninguna civilización.'
            ],
            leyendas: []
        },
        fuentes: [
            { texto: 'Smith, V. C. et al. (2020). «The magnitude and impact of the 431 CE Tierra Blanca Joven eruption of Ilopango, El Salvador». PNAS 117 (42): 26061-26068.', url: 'https://doi.org/10.1073/pnas.2003008117' },
            { texto: 'Dull, R. A. et al. (2019). «Radiocarbon and geologic evidence reveal Ilopango volcano as source of the colossal "mystery" eruption of 539/40 CE». Quaternary Science Reviews 222: 105855.', url: 'https://doi.org/10.1016/j.quascirev.2019.07.037' },
            { texto: 'Smithsonian Institution, Global Volcanism Program. «Ilopango» (343060).', url: 'https://volcano.si.edu/volcano.cfm?vn=343060' }
        ],
        ubicacion: {
            lat: 13.672, lon: -89.053,
            referencia: 'Al este de San Salvador, entre los departamentos de San Salvador, La Paz y Cuscatlán.',
            relacionados: [
                { id: 'tazumal', texto: 'Bajo la ceniza de esta erupción, en Tazumal y Casa Blanca (Chalchuapa, a unos 75 km), se hallaron objetos con influencia de Teotihuacan.' },
                { id: 'ceren', texto: 'La ceniza también cubrió el valle de Zapotitán, donde siglos después se levantó la aldea de Joya de Cerén.' }
            ]
        },
        desafio: {
            pregunta: '¿Qué son las Islas Quemadas del lago de Ilopango?',
            opciones: [
                { texto: 'La cima de un domo de lava que surgió en la erupción de 1879-1880.', correcta: true,
                  explicacion: 'Correcto. El domo emergió del lago el 23 de enero de 1880; los islotes son la parte que hoy sobresale del agua.' },
                { texto: 'Los restos de una aldea prehispánica incendiada.', correcta: false,
                  explicacion: 'Incorrecto. Su nombre puede sugerirlo, pero son formaciones de roca volcánica, no restos arqueológicos.' },
                { texto: 'Islas formadas por la gran erupción Tierra Blanca Joven del siglo V.', correcta: false,
                  explicacion: 'Incorrecto. Esa erupción formó la caldera, pero las Islas Quemadas se originaron casi 1450 años después, en 1880.' },
                { texto: 'Rocas arrastradas al lago por el río Jiboa.', correcta: false,
                  explicacion: 'Incorrecto. El río Jiboa es el desagüe del lago; las islas se formaron por lava que salió desde el fondo.' }
            ]
        }
    },
    {
        id: 'tazumal',
        numero: '003',
        titulo: 'Las huellas de una civilización',
        lugar: 'Tazumal',
        clasificacion: ['Arqueología'],
        portada: {
            src: 'img/expedientes/tazumal-portada.jpg',
            alt: 'Lado oeste de la pirámide principal de Tazumal, estructura B1-1, en Chalchuapa'
        },
        intro: 'En Chalchuapa, las estructuras de Tazumal guardan siglos de construcción y objetos que conectan a El Salvador con otras regiones de Mesoamérica.',
        ficha: [
            ['Ubicación', 'Chalchuapa, Santa Ana'],
            ['Periodo', 'Clásico y Posclásico temprano'],
            ['Estructura principal', 'B1-1, plataforma de 73 × 87 m'],
            ['Excavación inicial', 'Stanley Boggs, desde 1942']
        ],
        contexto: [
            'Tazumal forma parte de la zona arqueológica de Chalchuapa, en el departamento de Santa Ana, a unos 80 km al oeste de San Salvador. Esta zona tuvo ocupación humana durante unos 3500 años, desde alrededor del 1500 a. C.',
            'El conjunto de Tazumal fue habitado durante el periodo Clásico y el Posclásico temprano. Su secuencia de cerámica continúa sin interrupción hasta cerca del año 1200 d. C. La estructura principal, conocida como B1-1, se levanta sobre una plataforma de unos 73 por 87 metros; junto a ella se construyó la estructura B1-2 en el Posclásico temprano (900-1200 d. C.).',
            'El arqueólogo Stanley Boggs excavó y restauró las estructuras principales a partir de 1942. Las restauraciones con cemento de mediados del siglo XX se convirtieron después en un problema de conservación.'
        ],
        nota: 'El nombre «Tazumal» proviene de la finca donde se encontraron las estructuras principales; no es el nombre que le dieron sus constructores.',
        evidencias: [
            {
                src: 'img/expedientes/tazumal-estructura-1.jpg',
                alt: 'Escalinatas y cuerpos escalonados de la estructura principal de Tazumal',
                titulo: 'La estructura principal',
                descripcion: 'Cuerpos escalonados y escalinatas de la estructura B1-1, el edificio más grande del sitio.',
                autor: 'Cam Ventoza', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:Ruinas_del_Tazumal.JPG'
            },
            {
                src: 'img/expedientes/tazumal-reconstruccion-b1-2.jpg',
                alt: 'Ilustración de cómo pudo verse la estructura B1-2 de Tazumal en el Posclásico temprano',
                titulo: 'Ilustración: la estructura B1-2',
                descripcion: 'Reconstrucción hipotética de la estructura B1-2 en su fase 3B (Posclásico temprano), basada en dibujos y estudios arqueológicos. Es una interpretación, no una fotografía.',
                autor: 'Juan Miguel', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:Tazumal_estructura_B1-2-3B.png'
            },
            {
                src: 'img/expedientes/tazumal-restauracion.jpg',
                alt: 'Personas trabajando sobre la pirámide de Tazumal durante trabajos de restauración en 2005',
                titulo: 'Trabajos de restauración (2005)',
                descripcion: 'Trabajos sobre la pirámide tras el derrumbe de 2004, cuando se revisaron las antiguas restauraciones con cemento.',
                autor: 'Jose Huwaidi', licencia: 'CC BY-SA 4.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:Archeologists_on_a_piramid-Tazumal_restaurando.jpg'
            },
            {
                src: 'img/expedientes/tazumal-museo.jpg',
                alt: 'Sala del museo de sitio de Tazumal con vitrinas y una escultura',
                titulo: 'Museo de sitio',
                descripcion: 'El museo del parque arqueológico exhibe piezas halladas en Tazumal y en la zona de Chalchuapa.',
                autor: 'Orlando Salvador Flores Castaneda', licencia: 'CC BY-SA 3.0',
                licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.es',
                fuente: 'https://commons.wikimedia.org/wiki/File:Interior_del_Museo_del_Tazumal.jpg'
            }
        ],
        pistas: [
            {
                titulo: 'Objetos que viajaron',
                texto: 'Artefactos de obsidiana verde encontrados en Tazumal indican vínculos con el centro de México, y adornos de oro apuntan a contactos con el sur de Centroamérica.'
            },
            {
                titulo: 'Cerámica de Nicoya y primeros metales',
                texto: 'En Tazumal y en la zona de Chalchuapa se han registrado cerámicas de la región de Nicoya y algunos de los trabajos en metal más antiguos del área.'
            },
            {
                titulo: 'Debajo de la ceniza',
                texto: 'Bajo la ceniza de la erupción de Ilopango (siglo V) se hallaron en Tazumal y Casa Blanca objetos con influencia de Teotihuacan, la gran ciudad del centro de México.'
            },
            {
                titulo: 'Construido por etapas',
                texto: 'La estructura B1-2 se añadió en el Posclásico temprano (900-1200 d. C.), cuando la estructura principal ya había dejado de usarse a finales del periodo Clásico.'
            },
            {
                titulo: 'Un derrumbe revelador',
                texto: 'En octubre de 2004 se derrumbó parte de una de las estructuras restauradas con cemento. El cemento había convertido el edificio en una trampa de agua, y las raíces de árboles cercanos aumentaron el daño. Las excavaciones posteriores revelaron características originales.'
            }
        ],
        sabemos: {
            hechos: [
                'Tazumal es parte de la zona arqueológica de Chalchuapa, con una ocupación de miles de años.',
                'Su secuencia de cerámica continúa sin interrupción desde el Clásico hasta cerca del 1200 d. C.',
                'Las restauraciones con cemento de mediados del siglo XX dañaron las estructuras y obligaron a nuevas intervenciones tras 2004.'
            ],
            debate: [
                'La influencia de Teotihuacan y, más tarde, del centro de México se deduce del estilo de los objetos; los investigadores discuten si se debió a comercio, alianzas o presencia de grupos foráneos.'
            ],
            interpretaciones: [
                'Los objetos de otras regiones se interpretan como prueba de redes de intercambio de larga distancia en las que participaba Chalchuapa.',
                'Las ilustraciones de cómo se veían las estructuras son reconstrucciones basadas en evidencia, no imágenes exactas del pasado.'
            ],
            leyendas: [
                'Con frecuencia se repite que «Tazumal» significa en lengua quiché «pirámide donde fueron quemadas las víctimas». No hay fuentes que lo confirmen: el nombre viene de la finca donde se hallaron las estructuras.'
            ]
        },
        fuentes: [
            { texto: 'Erquicia, J. H. (2007). «Los Gavilanes: un sitio del Posclásico temprano en la zona arqueológica de Chalchuapa, El Salvador». XX Simposio de Investigaciones Arqueológicas en Guatemala, pp. 854-867.', url: 'https://www.mesoweb.com/Simposio/pdf/20/Erquicia.2007.pdf' },
            { texto: 'Smith, V. C. et al. (2020). «The magnitude and impact of the 431 CE Tierra Blanca Joven eruption of Ilopango, El Salvador». PNAS 117 (42).', url: 'https://doi.org/10.1073/pnas.2003008117' },
            { texto: 'Wikipedia. «Tazumal» (síntesis con referencias a publicaciones arqueológicas).', url: 'https://es.wikipedia.org/wiki/Tazumal' }
        ],
        ubicacion: {
            lat: 13.9794, lon: -89.6742,
            referencia: 'Chalchuapa, departamento de Santa Ana. A unos 80 km al oeste de San Salvador.',
            relacionados: [
                { id: 'ilopango', texto: 'La ceniza de la erupción de Ilopango llegó hasta Chalchuapa y selló objetos del periodo Clásico temprano.' }
            ]
        },
        desafio: {
            pregunta: '¿Qué sugieren objetos hallados en Tazumal como la obsidiana verde, los adornos de oro y la cerámica de Nicoya?',
            opciones: [
                { texto: 'Que Chalchuapa mantenía contactos e intercambios con otras regiones de Mesoamérica y Centroamérica.', correcta: true,
                  explicacion: 'Correcto. Estos materiales proceden de otras regiones o imitan sus estilos, por lo que se interpretan como evidencia de redes de intercambio de larga distancia.' },
                { texto: 'Que todos los objetos se fabricaban con materiales del lugar.', correcta: false,
                  explicacion: 'Incorrecto. Precisamente su valor como evidencia es que provienen de otras regiones, como el centro de México o el sur de Centroamérica.' },
                { texto: 'Que el sitio estuvo deshabitado durante el periodo Clásico.', correcta: false,
                  explicacion: 'Incorrecto. Tazumal fue habitado durante el Clásico y el Posclásico temprano, con una secuencia de cerámica sin interrupciones.' },
                { texto: 'Que las estructuras se construyeron en el siglo XX.', correcta: false,
                  explicacion: 'Incorrecto. En el siglo XX se excavaron y restauraron, pero fueron construidas hace más de mil años.' }
            ]
        }
    }
];

const EXPEDIENTE_SECCIONES = [
    { id: 'contexto', titulo: 'Contexto del caso' },
    { id: 'evidencias', titulo: 'Evidencias' },
    { id: 'pistas', titulo: 'Las pistas' },
    { id: 'sabemos', titulo: 'Lo que sabemos' },
    { id: 'ubicacion', titulo: 'Ubicación' },
    { id: 'desafio', titulo: 'Desafío' }
];

function initializeExpedientes() {
    const grid = document.getElementById('expedientes-grid');
    const dossier = document.getElementById('dossier');
    if (!grid || !dossier) return;

    const dialog = dossier.querySelector('.dossier-dialog');
    const tabsList = dossier.querySelector('.dossier-tabs');
    const content = dossier.querySelector('.dossier-content');
    const prevBtn = dossier.querySelector('.dossier-prev');
    const nextBtn = dossier.querySelector('.dossier-next');
    const resueltos = new Set();
    let actual = null;
    let seccionActual = 0;
    let visitadas = new Set();
    let ultimoFoco = null;

    const iconoCheck = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
    const iconoX = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

    function porId(id) {
        return EXPEDIENTES.find(e => e.id === id);
    }

    function posicionMapa(lat, lon) {
        const m = EXPEDIENTES_MAPA;
        return {
            x: ((lon - m.oeste) / (m.este - m.oeste)) * 100,
            y: ((m.norte - lat) / (m.norte - m.sur)) * 100
        };
    }

    function credito(ev) {
        const licencia = ev.licenciaUrl
            ? `<a href="${ev.licenciaUrl}" target="_blank" rel="noopener">${ev.licencia}</a>`
            : ev.licencia;
        return `Foto: ${ev.autor} · ${licencia} · <a href="${ev.fuente}" target="_blank" rel="noopener">Wikimedia Commons</a>`;
    }

    // ---------- Portadas ----------
    function renderPortadas() {
        grid.innerHTML = EXPEDIENTES.map(e => `
<article class="exp-folder${resueltos.has(e.id) ? ' is-solved' : ''}" data-expediente="${e.id}">
<span class="exp-folder-tab">EXP. ${e.numero}</span>
<div class="exp-folder-body">
<div class="exp-folder-sheet">
<div class="exp-folder-photo">
<img src="${e.portada.src}" alt="${e.portada.alt}" loading="lazy">
<span class="exp-folder-clip" aria-hidden="true"></span>
</div>
<div class="exp-folder-tags">${e.clasificacion.map(c => `<span class="exp-tag">${c}</span>`).join('')}</div>
<p class="exp-folder-place">${e.lugar}</p>
<h4 class="exp-folder-title">${e.titulo}</h4>
<p class="exp-folder-intro">${e.intro}</p>
<div class="exp-folder-footer">
<button type="button" class="exp-open-btn" data-expediente="${e.id}">Abrir expediente</button>
<span class="exp-folder-status">${resueltos.has(e.id) ? 'Caso resuelto' : 'Pendiente'}</span>
</div>
<span class="exp-stamp exp-stamp-folder" aria-hidden="true">${resueltos.has(e.id) ? 'Resuelto' : 'Confidencial'}</span>
</div>
</div>
</article>`).join('');

        grid.querySelectorAll('.exp-open-btn').forEach(btn => {
            btn.addEventListener('click', () => abrirExpediente(btn.dataset.expediente, 0));
        });
    }

    // ---------- Secciones del expediente ----------
    function seccionContexto(e) {
        return `
<div class="dossier-doc">
<p class="dossier-doc-label">Documento 1 · Contexto del caso</p>
<div class="dossier-context">
<div class="dossier-context-text">
${e.contexto.map(p => `<p>${p}</p>`).join('')}
<aside class="dossier-note"><span class="dossier-note-label">Nota del investigador</span>${e.nota}</aside>
</div>
<dl class="dossier-ficha">
<div class="dossier-ficha-head">Ficha del caso</div>
${e.ficha.map(([k, v]) => `<div class="dossier-ficha-row"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
</dl>
</div>
</div>`;
    }

    function seccionEvidencias(e) {
        const letras = 'ABCDEFGHIJ';
        return `
<div class="dossier-doc">
<p class="dossier-doc-label">Documento 2 · Evidencias</p>
<div class="evidence-viewer">
<figure class="evidence-main">
<div class="evidence-main-img"><img src="${e.evidencias[0].src}" alt="${e.evidencias[0].alt}"></div>
<figcaption>
<span class="evidence-code">Evidencia ${letras[0]}</span>
<strong class="evidence-title">${e.evidencias[0].titulo}</strong>
<span class="evidence-desc">${e.evidencias[0].descripcion}</span>
<span class="evidence-credit">${credito(e.evidencias[0])}</span>
</figcaption>
</figure>
<div class="evidence-thumbs" role="list">
${e.evidencias.map((ev, i) => `
<button type="button" class="evidence-thumb${i === 0 ? ' is-active' : ''}" data-index="${i}" role="listitem" aria-label="Ver evidencia ${letras[i]}: ${ev.titulo}">
<img src="${ev.src}" alt="" loading="lazy">
<span>Evidencia ${letras[i]}</span>
</button>`).join('')}
</div>
</div>
</div>`;
    }

    function seccionPistas(e) {
        return `
<div class="dossier-doc">
<p class="dossier-doc-label">Documento 3 · Las pistas</p>
<div class="clues-progress">
<span class="clues-count">Pistas reveladas: <strong>0</strong> de ${e.pistas.length}</span>
<span class="clues-bar" aria-hidden="true">${e.pistas.map(() => '<span></span>').join('')}</span>
</div>
<ol class="clues-list">
${e.pistas.map((p, i) => `
<li class="clue">
<button type="button" class="clue-toggle" aria-expanded="false" aria-controls="clue-${e.id}-${i}">
<span class="clue-num">Pista ${String(i + 1).padStart(2, '0')}</span>
<span class="clue-title">${p.titulo}</span>
<span class="clue-icon" aria-hidden="true"></span>
</button>
<div class="clue-panel" id="clue-${e.id}-${i}"><div class="clue-panel-inner"><p>${p.texto}</p></div></div>
</li>`).join('')}
</ol>
</div>`;
    }

    function grupoSabemos(clase, sello, titulo, items) {
        if (!items || items.length === 0) return '';
        return `
<section class="known-group known-${clase}">
<span class="known-stamp">${sello}</span>
<h5>${titulo}</h5>
<ul>${items.map(t => `<li>${t}</li>`).join('')}</ul>
</section>`;
    }

    function seccionSabemos(e) {
        const s = e.sabemos;
        return `
<div class="dossier-doc">
<p class="dossier-doc-label">Documento 4 · Lo que sabemos</p>
<div class="known-grid">
${grupoSabemos('facts', 'Verificado', 'Hechos comprobados', s.hechos)}
${grupoSabemos('debate', 'En debate', 'Hipótesis y debates', s.debate)}
${grupoSabemos('interp', 'Interpretación', 'Interpretaciones de los investigadores', s.interpretaciones)}
${grupoSabemos('legend', 'No comprobado', 'Leyendas y creencias populares', s.leyendas)}
</div>
<div class="dossier-sources">
<h5>Fuentes consultadas</h5>
<ol>${e.fuentes.map(f => `<li>${f.url ? `<a href="${f.url}" target="_blank" rel="noopener">${f.texto}</a>` : f.texto}</li>`).join('')}</ol>
</div>
</div>`;
    }

    function seccionUbicacion(e) {
        const u = e.ubicacion;
        const pos = posicionMapa(u.lat, u.lon);
        const lineas = u.relacionados.map(r => {
            const o = porId(r.id);
            const p = posicionMapa(o.ubicacion.lat, o.ubicacion.lon);
            return `<line x1="${pos.x}" y1="${pos.y}" x2="${p.x}" y2="${p.y}"/>`;
        }).join('');
        const pines = EXPEDIENTES.map(o => {
            const p = posicionMapa(o.ubicacion.lat, o.ubicacion.lon);
            const activo = o.id === e.id;
            return `<button type="button" class="map-pin${activo ? ' is-current' : ''}" style="left:${p.x}%;top:${p.y}%" data-expediente="${o.id}"${activo ? ' tabindex="-1" aria-current="true"' : ''} aria-label="Expediente ${o.numero}: ${o.lugar}"><span class="map-pin-label">${o.numero} · ${o.lugar}</span></button>`;
        }).join('');
        const zoom = 0.06;
        const osm = `https://www.openstreetmap.org/export/embed.html?bbox=${u.lon - zoom}%2C${u.lat - zoom}%2C${u.lon + zoom}%2C${u.lat + zoom}&layer=mapnik&marker=${u.lat}%2C${u.lon}`;
        const osmLink = `https://www.openstreetmap.org/?mlat=${u.lat}&mlon=${u.lon}#map=13/${u.lat}/${u.lon}`;
        return `
<div class="dossier-doc">
<p class="dossier-doc-label">Documento 5 · Ubicación</p>
<div class="location-grid">
<figure class="location-map">
<div class="location-map-frame">
<img src="${EXPEDIENTES_MAPA.src}" alt="Mapa de relieve de El Salvador con la ubicación de los expedientes" loading="lazy">
<svg class="location-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lineas}</svg>
${pines}
</div>
<figcaption><a href="${EXPEDIENTES_MAPA.fuente}" target="_blank" rel="noopener">${EXPEDIENTES_MAPA.credito}</a></figcaption>
</figure>
<div class="location-info">
<p class="location-coords">${Math.abs(u.lat).toFixed(4)}° N · ${Math.abs(u.lon).toFixed(4)}° O</p>
<p class="location-ref">${u.referencia}</p>
<div class="location-osm">
<iframe title="Mapa de ${e.lugar} en OpenStreetMap" data-src="${osm}" loading="lazy"></iframe>
</div>
<a class="location-osm-link" href="${osmLink}" target="_blank" rel="noopener">Ver mapa ampliado en OpenStreetMap</a>
${u.relacionados.length ? `<div class="location-links"><p class="location-links-label">Conexiones con otros expedientes</p>${u.relacionados.map(r => {
            const o = porId(r.id);
            return `<button type="button" class="location-link" data-expediente="${o.id}"><span>EXP. ${o.numero} · ${o.lugar}</span>${r.texto}</button>`;
        }).join('')}</div>` : ''}
</div>
</div>
</div>`;
    }

    function seccionDesafio(e) {
        const d = e.desafio;
        const letras = 'ABCD';
        return `
<div class="dossier-doc dossier-challenge">
<p class="dossier-doc-label">Documento 6 · Desafío final</p>
<p class="challenge-question">${d.pregunta}</p>
<div class="challenge-options">
${d.opciones.map((o, i) => `
<button type="button" class="challenge-option" data-index="${i}">
<span class="challenge-letter">${letras[i]}</span>
<span class="challenge-text">${o.texto}</span>
<span class="challenge-mark" aria-hidden="true"></span>
</button>`).join('')}
</div>
<div class="challenge-result" aria-live="polite"></div>
</div>`;
    }

    const renderSeccion = {
        contexto: seccionContexto,
        evidencias: seccionEvidencias,
        pistas: seccionPistas,
        sabemos: seccionSabemos,
        ubicacion: seccionUbicacion,
        desafio: seccionDesafio
    };

    // ---------- Interacciones de cada sección ----------
    function activarEvidencias(e) {
        const main = content.querySelector('.evidence-main');
        const letras = 'ABCDEFGHIJ';
        content.querySelectorAll('.evidence-thumb').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = Number(btn.dataset.index);
                const ev = e.evidencias[i];
                content.querySelectorAll('.evidence-thumb').forEach(b => b.classList.toggle('is-active', b === btn));
                main.classList.remove('is-changing');
                void main.offsetWidth;
                main.classList.add('is-changing');
                const img = main.querySelector('img');
                img.src = ev.src;
                img.alt = ev.alt;
                main.querySelector('.evidence-code').textContent = 'Evidencia ' + letras[i];
                main.querySelector('.evidence-title').textContent = ev.titulo;
                main.querySelector('.evidence-desc').textContent = ev.descripcion;
                main.querySelector('.evidence-credit').innerHTML = credito(ev);
            });
        });
    }

    function activarPistas() {
        const toggles = content.querySelectorAll('.clue-toggle');
        const contador = content.querySelector('.clues-count strong');
        const barras = content.querySelectorAll('.clues-bar span');
        const reveladas = new Set();
        toggles.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                const abierta = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', String(!abierta));
                btn.closest('.clue').classList.toggle('is-open', !abierta);
                if (!abierta) reveladas.add(i);
                contador.textContent = reveladas.size;
                barras.forEach((b, j) => b.classList.toggle('is-on', j < reveladas.size));
            });
        });
    }

    function activarUbicacion() {
        const iframe = content.querySelector('.location-osm iframe');
        if (iframe && !iframe.src) iframe.src = iframe.dataset.src;
        content.querySelectorAll('.map-pin:not(.is-current), .location-link').forEach(btn => {
            btn.addEventListener('click', () => abrirExpediente(btn.dataset.expediente, 4));
        });
    }

    function activarDesafio(e) {
        const opciones = content.querySelectorAll('.challenge-option');
        const resultado = content.querySelector('.challenge-result');
        opciones.forEach(btn => {
            btn.addEventListener('click', () => {
                const elegida = e.desafio.opciones[Number(btn.dataset.index)];
                const correcta = e.desafio.opciones.find(o => o.correcta);
                opciones.forEach(b => {
                    const o = e.desafio.opciones[Number(b.dataset.index)];
                    b.disabled = true;
                    if (o.correcta) {
                        b.classList.add('is-correct');
                        b.querySelector('.challenge-mark').innerHTML = iconoCheck;
                    }
                });
                if (!elegida.correcta) {
                    btn.classList.add('is-wrong');
                    btn.querySelector('.challenge-mark').innerHTML = iconoX;
                }
                resultado.className = 'challenge-result is-visible ' + (elegida.correcta ? 'is-success' : 'is-error');
                resultado.innerHTML = `
<span class="exp-stamp exp-stamp-result">${elegida.correcta ? 'Caso resuelto' : 'Revisar evidencias'}</span>
<p class="challenge-explanation">${elegida.explicacion}</p>
${elegida.correcta ? '' : `<p class="challenge-explanation challenge-explanation-correct"><strong>Respuesta correcta:</strong> ${correcta.explicacion}</p>`}
<button type="button" class="challenge-retry">Intentar de nuevo</button>`;
                resultado.querySelector('.challenge-retry').addEventListener('click', () => mostrarSeccion(5, true));
                if (elegida.correcta) {
                    resueltos.add(e.id);
                    dossier.querySelector('.dossier-status').textContent = 'Caso resuelto';
                    dossier.classList.add('is-solved');
                    renderPortadas();
                }
            });
        });
    }

    // ---------- Navegación ----------
    function mostrarSeccion(indice, forzar) {
        if (!actual) return;
        if (indice === seccionActual && !forzar && content.childElementCount) return;
        seccionActual = indice;
        visitadas.add(indice);
        const sec = EXPEDIENTE_SECCIONES[indice];

        tabsList.querySelectorAll('.dossier-tab').forEach((tab, i) => {
            const activa = i === indice;
            tab.classList.toggle('is-active', activa);
            tab.classList.toggle('is-visited', visitadas.has(i));
            tab.setAttribute('aria-selected', String(activa));
            tab.tabIndex = activa ? 0 : -1;
            if (activa) {
                tabsList.scrollTo({ left: tab.offsetLeft - (tabsList.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
            }
        });

        content.innerHTML = renderSeccion[sec.id](actual);
        content.setAttribute('aria-labelledby', 'dossier-tab-' + sec.id);
        content.classList.remove('is-entering');
        void content.offsetWidth;
        content.classList.add('is-entering');
        content.scrollTop = 0;

        if (sec.id === 'evidencias') activarEvidencias(actual);
        if (sec.id === 'pistas') activarPistas();
        if (sec.id === 'ubicacion') activarUbicacion();
        if (sec.id === 'desafio') activarDesafio(actual);

        const anterior = EXPEDIENTE_SECCIONES[indice - 1];
        const siguiente = EXPEDIENTE_SECCIONES[indice + 1];
        prevBtn.hidden = !anterior;
        nextBtn.hidden = !siguiente;
        if (anterior) prevBtn.querySelector('.dossier-nav-name').textContent = anterior.titulo;
        if (siguiente) nextBtn.querySelector('.dossier-nav-name').textContent = siguiente.titulo;
    }

    function abrirExpediente(id, indice) {
        const e = porId(id);
        if (!e) return;
        const yaAbierto = dossier.classList.contains('is-open');
        if (!yaAbierto) ultimoFoco = document.activeElement;
        actual = e;
        visitadas = new Set();
        seccionActual = -1;

        dossier.querySelector('.dossier-number').textContent = 'Expediente ' + e.numero;
        dossier.querySelector('.dossier-class').innerHTML = e.clasificacion.map(c => `<span class="exp-tag">${c}</span>`).join('');
        dossier.querySelector('.dossier-title').textContent = e.titulo;
        dossier.querySelector('.dossier-place').textContent = e.lugar;
        dossier.querySelector('.dossier-status').textContent = resueltos.has(e.id) ? 'Caso resuelto' : 'En investigación';
        dossier.classList.toggle('is-solved', resueltos.has(e.id));

        tabsList.innerHTML = EXPEDIENTE_SECCIONES.map((s, i) => `
<button type="button" class="dossier-tab" role="tab" id="dossier-tab-${s.id}" aria-controls="dossier-content" aria-selected="false" data-index="${i}">
<span class="dossier-tab-num">${i + 1}</span>
<span class="dossier-tab-label">${s.titulo}</span>
</button>`).join('');
        tabsList.querySelectorAll('.dossier-tab').forEach(tab => {
            tab.addEventListener('click', () => mostrarSeccion(Number(tab.dataset.index)));
        });

        mostrarSeccion(indice || 0, true);

        if (!yaAbierto) {
            dossier.classList.add('is-open');
            dossier.setAttribute('aria-hidden', 'false');
            document.body.classList.add('dossier-open');
        } else {
            dialog.classList.remove('is-switching');
            void dialog.offsetWidth;
            dialog.classList.add('is-switching');
        }
        dialog.focus();
    }

    function cerrarExpediente() {
        dossier.classList.remove('is-open');
        dossier.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('dossier-open');
        const iframe = content.querySelector('.location-osm iframe');
        if (iframe) iframe.removeAttribute('src');
        actual = null;
        if (ultimoFoco) ultimoFoco.focus();
    }

    prevBtn.addEventListener('click', () => mostrarSeccion(seccionActual - 1));
    nextBtn.addEventListener('click', () => mostrarSeccion(seccionActual + 1));
    dossier.querySelector('.dossier-close').addEventListener('click', cerrarExpediente);
    dossier.addEventListener('click', (ev) => {
        if (ev.target === dossier) cerrarExpediente();
    });

    tabsList.addEventListener('keydown', (ev) => {
        if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
        const total = EXPEDIENTE_SECCIONES.length;
        const nuevo = (seccionActual + (ev.key === 'ArrowRight' ? 1 : -1) + total) % total;
        mostrarSeccion(nuevo);
        tabsList.querySelectorAll('.dossier-tab')[nuevo].focus();
    });

    document.addEventListener('keydown', (ev) => {
        if (!dossier.classList.contains('is-open')) return;
        if (ev.key === 'Escape') cerrarExpediente();
        if (ev.key === 'Tab') {
            const focusables = dialog.querySelectorAll('button:not([disabled]):not([hidden]), a[href], iframe, [tabindex]:not([tabindex="-1"])');
            const visibles = Array.from(focusables).filter(el => el.offsetParent !== null);
            if (visibles.length === 0) return;
            const primero = visibles[0];
            const ultimo = visibles[visibles.length - 1];
            if (ev.shiftKey && (document.activeElement === primero || document.activeElement === dialog)) {
                ev.preventDefault();
                ultimo.focus();
            } else if (!ev.shiftKey && document.activeElement === ultimo) {
                ev.preventDefault();
                primero.focus();
            }
        }
    });

    renderPortadas();
}
