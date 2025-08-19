// ProfileCard Component
class ProfileCard {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            name: options.name || "Banele WJLM",
            title: options.title || "Content Creator",
            handle: options.handle || "banelewjlm",
            status: options.status || "Online",
            contactText: options.contactText || "Contact Me",
            avatarUrl: options.avatarUrl || "../pics/channels4_profile.jpg",
            showUserInfo: options.showUserInfo !== false,
            enableTilt: options.enableTilt !== false,
            enableMobileTilt: options.enableMobileTilt || false,
            onContactClick: options.onContactClick || (() => console.log('Contact clicked'))
        };
        
        this.init();
    }
    
    init() {
        this.createCard();
        if (this.options.enableTilt) {
            this.initTilt();
        }
    }
    
    createCard() {
        const cardHTML = `
            <div class="pc-card-wrapper">
                <section class="pc-card">
                    <div class="pc-inside">
                        <div class="pc-shine"></div>
                        <div class="pc-glare"></div>
                        <div class="pc-content pc-avatar-content">
                            <img class="avatar" src="${this.options.avatarUrl}" alt="${this.options.name} avatar" loading="lazy">
                            ${this.options.showUserInfo ? `
                                <div class="pc-user-info">
                                    <div class="pc-user-details">
                                        <div class="pc-mini-avatar">
                                            <img src="${this.options.avatarUrl}" alt="${this.options.name} mini avatar" loading="lazy">
                                        </div>
                                        <div class="pc-user-text">
                                            <div class="pc-handle">@${this.options.handle}</div>
                                            <div class="pc-status">${this.options.status}</div>
                                        </div>
                                    </div>
                                    <button class="pc-contact-btn" type="button" aria-label="Contact ${this.options.name}">
                                        ${this.options.contactText}
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                        <div class="pc-content">
                            <div class="pc-details">
                                <h3>${this.options.name}</h3>
                                <p>${this.options.title}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
        
        this.element.innerHTML = cardHTML;
        
        // Add contact button event listener
        const contactBtn = this.element.querySelector('.pc-contact-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', this.options.onContactClick);
        }
    }
    
    initTilt() {
        const card = this.element.querySelector('.pc-card');
        const wrap = this.element.querySelector('.pc-card-wrapper');
        
        if (!card || !wrap) return;
        
        let rafId = null;
        
        const updateCardTransform = (offsetX, offsetY) => {
            const width = card.clientWidth;
            const height = card.clientHeight;
            
            const percentX = Math.min(Math.max((100 / width) * offsetX, 0), 100);
            const percentY = Math.min(Math.max((100 / height) * offsetY, 0), 100);
            
            const centerX = percentX - 50;
            const centerY = percentY - 50;
            
            const properties = {
                '--pointer-x': `${percentX}%`,
                '--pointer-y': `${percentY}%`,
                '--background-x': `${this.adjust(percentX, 0, 100, 35, 65)}%`,
                '--background-y': `${this.adjust(percentY, 0, 100, 35, 65)}%`,
                '--pointer-from-center': `${Math.min(Math.hypot(percentY - 50, percentX - 50) / 50, 1)}`,
                '--pointer-from-top': `${percentY / 100}`,
                '--pointer-from-left': `${percentX / 100}`,
                '--rotate-x': `${this.round(-(centerX / 5))}deg`,
                '--rotate-y': `${this.round(centerY / 4)}deg`,
            };
            
            Object.entries(properties).forEach(([property, value]) => {
                wrap.style.setProperty(property, value);
            });
        };
        
        const handlePointerMove = (event) => {
            const rect = card.getBoundingClientRect();
            updateCardTransform(
                event.clientX - rect.left,
                event.clientY - rect.top
            );
        };
        
        const handlePointerEnter = () => {
            wrap.classList.add('active');
            card.classList.add('active');
        };
        
        const handlePointerLeave = () => {
            wrap.classList.remove('active');
            card.classList.remove('active');
            
            // Reset to center
            const centerX = wrap.clientWidth / 2;
            const centerY = wrap.clientHeight / 2;
            updateCardTransform(centerX, centerY);
        };
        
        card.addEventListener('pointerenter', handlePointerEnter);
        card.addEventListener('pointermove', handlePointerMove);
        card.addEventListener('pointerleave', handlePointerLeave);
        
        // Initial position
        const initialX = wrap.clientWidth - 70;
        const initialY = 60;
        updateCardTransform(initialX, initialY);
        
        // Smooth animation to center
        setTimeout(() => {
            const centerX = wrap.clientWidth / 2;
            const centerY = wrap.clientHeight / 2;
            updateCardTransform(centerX, centerY);
        }, 1500);
    }
    
    adjust(value, fromMin, fromMax, toMin, toMax) {
        return this.round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
    }
    
    round(value, precision = 3) {
        return parseFloat(value.toFixed(precision));
    }
}

// Initialize ProfileCard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const profileCardContainer = document.getElementById('profile-card-container');
    if (profileCardContainer) {
        new ProfileCard(profileCardContainer, {
            name: "Banele WJLM",
            title: "Content Creator & Influencer",
            handle: "banelewjlm",
            status: "Online",
            contactText: "Contact Me",
            avatarUrl: "../pics/channels4_profile.jpg",
            showUserInfo: true,
            enableTilt: true,
            enableMobileTilt: false,
            onContactClick: () => {
                // Handle contact click - could open contact form or social links
                console.log('Contact Banele WJLM clicked');
            }
        });
    }
});
