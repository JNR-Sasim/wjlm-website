// Particle Background Animation
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `rgba(255, ${Math.random() * 50 + 50}, ${Math.random() * 50}, ${Math.random() * 0.5 + 0.2})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particle animation
function initParticles() {
    const canvas = document.getElementById('particles-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const numberOfParticles = 100;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle(canvas));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        // Draw connections between particles
        particles.forEach(particle1 => {
            particles.forEach(particle2 => {
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 0, 0, ${0.2 - distance/500})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle1.x, particle1.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    animate();
}

// Navigation scroll effect
const nav = document.querySelector('.nav');
const navHeight = nav.offsetHeight;
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > navHeight) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Video cards hover effect
const videoCards = document.querySelectorAll('.video-card');
videoCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    try {
        // Add your newsletter subscription logic here
        console.log('Subscribing:', email);
        
        // Show success message
        const button = newsletterForm.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Subscribed!';
        button.style.background = 'var(--secondary)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'var(--gradient)';
        }, 2000);
        
        newsletterForm.reset();
    } catch (error) {
        console.error('Subscription error:', error);
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.video-card, .section-title, .newsletter').forEach(el => {
    observer.observe(el);
});

// YouTube API Configuration
const YOUTUBE_CHANNEL_ID = 'UCW8ZTA1DEzjWG1iDzC4eSZw';
const YOUTUBE_API_KEY = 'AIzaSyCT7-kNixTonMVNSgSYdu7Rjs80VnHOILY';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const AUTO_REFRESH_INTERVAL = 300000; // Check for new content every 5 minutes

// Cache helper functions
const getCache = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
    }
    return data;
};

const setCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
};

// Function to check if content needs updating
const checkForNewContent = async () => {
    try {
        // Check for new videos
        const latestVideoResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=1&type=video`
        );
        const latestVideoData = await latestVideoResponse.json();

        if (latestVideoData.items && latestVideoData.items.length > 0) {
            const cachedVideos = getCache('latest_videos');
            if (cachedVideos && cachedVideos[0] && 
                cachedVideos[0].id.videoId !== latestVideoData.items[0].id.videoId) {
                console.log('New video detected, updating content...');
                fetchLatestVideos();
            }
        }

        // Check for new podcast episodes
        const latestPodcastResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=1&q="What's The Story"&type=video`
        );
        const latestPodcastData = await latestPodcastResponse.json();

        if (latestPodcastData.items && latestPodcastData.items.length > 0) {
            const cachedEpisodes = getCache('podcast_episodes');
            if (cachedEpisodes && cachedEpisodes[0] && 
                cachedEpisodes[0].id !== latestPodcastData.items[0].id.videoId) {
                console.log('New podcast episode detected, updating content...');
                loadPodcastEpisodes();
            }
        }
    } catch (error) {
        console.error('Error checking for new content:', error);
    }
};

// Function to fetch latest videos from YouTube
async function fetchLatestVideos() {
    const videoGrid = document.querySelector('.video-grid');
    if (!videoGrid) {
        console.error('Video grid container not found!');
        return;
    }

    // Show loading state
    videoGrid.innerHTML = '<div class="loading-message">Loading latest videos...</div>';

    try {
        console.log('Starting YouTube API request...');
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=6&type=video`;
        console.log('Using URL:', apiUrl);

        // First, try to fetch without the Referer header
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('API Response:', data);

        if (data.error) {
            console.error('YouTube API Error:', data.error);
            let errorMessage = data.error.message || 'Unable to load videos';
            if (data.error.errors && data.error.errors[0]) {
                errorMessage += `: ${data.error.errors[0].reason}`;
            }
            videoGrid.innerHTML = `
                <div class="error-message">
                    <p>${errorMessage}</p>
                    <p style="font-size: 0.9em; margin-top: 10px;">Please check the console for more details.</p>
                </div>`;
            return;
        }

        if (!data.items || data.items.length === 0) {
            console.log('No videos found in response');
            videoGrid.innerHTML = '<div class="error-message">No videos found for this channel.</div>';
            return;
        }

        // Cache the video data
        setCache('latest_videos', data.items);
        
        console.log(`Found ${data.items.length} videos, rendering...`);
        displayVideos(data.items);
    } catch (error) {
        console.error('Fetch error:', error);
        videoGrid.innerHTML = `
            <div class="error-message">
                <p>Error loading videos: ${error.message}</p>
                <p style="font-size: 0.9em; margin-top: 10px;">Please check your internet connection and try again.</p>
            </div>`;
    }
}

// Function to display videos in the grid
function displayVideos(videos) {
    console.log('Starting to display videos...');
    const videoGrid = document.querySelector('.video-grid');
    videoGrid.innerHTML = '';

    videos.forEach((video, index) => {
        console.log(`Processing video ${index + 1}:`, video);
        if (!video.id || !video.id.videoId || !video.snippet) {
            console.error('Invalid video data for index', index, video);
            return;
        }

        const videoId = video.id.videoId; // Store videoId for use in event listeners
        const videoCard = `
            <div class="video-card">
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="video-link">
                    <div class="video-thumbnail">
                        <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}" class="thumbnail-img">
                        <div class="video-preview">
                            <iframe 
                                src="https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&controls=0&start=0&modestbranding=1" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen
                                loading="lazy"
                            ></iframe>
                        </div>
                        <div class="play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="preview-controls">
                            <button class="sound-toggle" title="Toggle sound">
                                <i class="fas fa-volume-mute"></i>
                            </button>
                        </div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">${video.snippet.title}</h3>
                        <p class="video-date">${new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
                    </div>
                </a>
            </div>
        `;
        videoGrid.innerHTML += videoCard;
    });

    // Add preview functionality
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        const preview = card.querySelector('.video-preview');
        const iframe = preview.querySelector('iframe');
        const soundToggle = card.querySelector('.sound-toggle');
        const videoId = card.querySelector('.video-link').href.split('v=')[1]; // Get videoId from the link
        let timeoutId;
        let previewEndTimeout;
        let isMuted = true;

        // Prevent link click when clicking sound toggle
        soundToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isMuted = !isMuted;
            
            // Update button icon
            const icon = soundToggle.querySelector('i');
            icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            
            // Update iframe src
            if (preview.style.opacity === '1') {
                iframe.src = iframe.src.replace(isMuted ? 'mute=0' : 'mute=1', isMuted ? 'mute=1' : 'mute=0');
            }
        });

        card.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            clearTimeout(previewEndTimeout);
            
            timeoutId = setTimeout(() => {
                preview.style.opacity = '1';
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&start=0&modestbranding=1`;
                
                // End preview after one minute
                previewEndTimeout = setTimeout(() => {
                    preview.style.opacity = '0';
                    iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
                }, 60000); // 60 seconds (1 minute) preview
            }, 500);
        });

        card.addEventListener('mouseleave', () => {
            clearTimeout(timeoutId);
            clearTimeout(previewEndTimeout);
            preview.style.opacity = '0';
            iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
        });
    });

    console.log('Finished displaying videos');
}

// Load latest podcast episodes with caching
const loadPodcastEpisodes = async () => {
    try {
        // Check cache first
        const cachedEpisodes = getCache('podcast_episodes');
        if (cachedEpisodes) {
            const episodesGrid = document.querySelector('.episodes-grid');
            episodesGrid.innerHTML = '';
            cachedEpisodes.forEach(episode => {
                const card = createEpisodeCard(episode);
                episodesGrid.appendChild(card);
            });
            return;
        }

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=3&q="What's The Story"&type=video`
        );
        const data = await response.json();
        
        // Check if data.items exists and is an array
        if (!data.items || !Array.isArray(data.items)) {
            console.log('No podcast episodes data available, using fallback');
            return;
        }
        
        const episodes = data.items.map((item, index) => ({
            id: item.id.videoId,
            number: `Episode #${index + 1}`,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            description: item.snippet.description,
            date: new Date(item.snippet.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        }));

        // Cache the results
        setCache('podcast_episodes', episodes);
        
        const episodesGrid = document.querySelector('.episodes-grid');
        episodesGrid.innerHTML = '';
        
        episodes.forEach(episode => {
            const card = createEpisodeCard(episode);
            episodesGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading podcast episodes:', error);
        // Try to load from cache even if expired
        const cachedEpisodes = getCache('podcast_episodes');
        if (cachedEpisodes) {
            const episodesGrid = document.querySelector('.episodes-grid');
            episodesGrid.innerHTML = '';
            cachedEpisodes.forEach(episode => {
                const card = createEpisodeCard(episode);
                episodesGrid.appendChild(card);
            });
        }
    }
};

const createEpisodeCard = (episode) => {
    const card = document.createElement('div');
    card.className = 'episode-card';
    card.innerHTML = `
        <div class="episode-image">
            <img src="${episode.thumbnail}" alt="${episode.title}" class="thumbnail-img">
            <div class="video-preview">
                <iframe 
                    src="https://www.youtube.com/embed/${episode.id}?autoplay=0&mute=1&controls=0&start=0&modestbranding=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    loading="lazy"
                ></iframe>
            </div>
            <div class="preview-controls">
                <button class="sound-toggle" title="Toggle sound">
                    <i class="fas fa-volume-mute"></i>
                </button>
            </div>
        </div>
        <div class="episode-info">
            <span class="episode-number">${episode.number}</span>
            <h3 class="episode-title">${episode.title}</h3>
            <div class="episode-meta">
                <span><i class="far fa-calendar"></i> ${episode.date}</span>
            </div>
            <p class="episode-description">${episode.description}</p>
            <a href="https://www.youtube.com/watch?v=${episode.id}" target="_blank" class="play-btn">
                <i class="fas fa-play"></i>
                Watch Episode
            </a>
        </div>
    `;

    // Add preview functionality
    const preview = card.querySelector('.video-preview');
    const iframe = preview.querySelector('iframe');
    const soundToggle = card.querySelector('.sound-toggle');
    let timeoutId;
    let previewEndTimeout;
    let isMuted = true;

    // Prevent click propagation for sound toggle
    soundToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        isMuted = !isMuted;
        
        // Update button icon
        const icon = soundToggle.querySelector('i');
        icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        
        // Update iframe src if preview is active
        if (preview.style.opacity === '1') {
            iframe.src = iframe.src.replace(isMuted ? 'mute=0' : 'mute=1', isMuted ? 'mute=1' : 'mute=0');
        }
    });

    card.querySelector('.episode-image').addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
        clearTimeout(previewEndTimeout);
        
        timeoutId = setTimeout(() => {
            preview.style.opacity = '1';
            iframe.src = `https://www.youtube.com/embed/${episode.id}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&start=0&modestbranding=1`;
            
            // End preview after one minute
            previewEndTimeout = setTimeout(() => {
                preview.style.opacity = '0';
                iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
            }, 60000); // 60 seconds (1 minute) preview
        }, 500);
    });

    card.querySelector('.episode-image').addEventListener('mouseleave', () => {
        clearTimeout(timeoutId);
        clearTimeout(previewEndTimeout);
        preview.style.opacity = '0';
        iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
    });

    return card;
};

// Merch functionality
const initMerch = () => {
    const merchCards = document.querySelectorAll('.merch-card');
    const cart = {
        items: [],
        total: 0
    };

    merchCards.forEach(card => {
        const addToCartBtn = card.querySelector('.merch-btn');
        
        addToCartBtn.addEventListener('click', () => {
            const title = card.querySelector('.merch-title').textContent;
            const price = parseFloat(card.querySelector('.merch-price').textContent.replace('$', ''));
            
            // Add to cart animation
            addToCartBtn.textContent = 'Added to Cart!';
            addToCartBtn.style.background = 'var(--secondary)';
            
            // Reset button after animation
            setTimeout(() => {
                addToCartBtn.textContent = 'Add to Cart';
                addToCartBtn.style.background = 'var(--gradient)';
            }, 2000);
            
            // Add to cart logic
            cart.items.push({ title, price });
            cart.total += price;
            
            // You can implement further cart functionality here
            console.log('Cart:', cart);
        });
    });
};

// Podcast functionality
const initPodcast = () => {
    const playButtons = document.querySelectorAll('.play-btn');
    let currentlyPlaying = null;

    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const episodeCard = button.closest('.episode-card');
            const episodeTitle = episodeCard.querySelector('.episode-title').textContent;
            
            if (currentlyPlaying === button) {
                // Pause current episode
                button.innerHTML = '<i class="fas fa-play"></i> Play Episode';
                currentlyPlaying = null;
            } else {
                // Reset previous playing button if exists
                if (currentlyPlaying) {
                    currentlyPlaying.innerHTML = '<i class="fas fa-play"></i> Play Episode';
                }
                
                // Play new episode
                button.innerHTML = '<i class="fas fa-pause"></i> Playing...';
                currentlyPlaying = button;
                
                // You can implement actual audio playing functionality here
                console.log('Playing episode:', episodeTitle);
            }
        });
    });

    // Add hover effect for platform links
    const platformLinks = document.querySelectorAll('.platform-link');
    platformLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });

    // Add intersection observer for podcast cards
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const episodeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                episodeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.episode-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        episodeObserver.observe(card);
    });
};

// Typing Animation
function initTypingAnimation() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;

    const text = "Welcome to the Biggest Tub Tub Channel's official website. Fresh content, real vibes, and the WJLM lifestyle — all in one place.";
    let index = 0;
    const typingSpeed = 50;

    function typeText() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, typingSpeed);
        }
    }

    // Start typing animation after a short delay
    setTimeout(typeText, 1000);
}

// TrueFocus Animation
function initTrueFocus() {
    const focusContainer = document.querySelector('.focus-container');
    if (!focusContainer) return;

    const words = focusContainer.querySelectorAll('.focus-word');
    const focusFrame = focusContainer.querySelector('.focus-frame');
    let currentIndex = 0;
    let animationInterval;

    function updateFocus() {
        // Remove active class from all words
        words.forEach(word => word.classList.remove('active'));
        
        // Add active class to current word
        if (words[currentIndex]) {
            words[currentIndex].classList.add('active');
            
            // Update focus frame position
            const wordRect = words[currentIndex].getBoundingClientRect();
            const containerRect = focusContainer.getBoundingClientRect();
            
            focusFrame.style.left = (wordRect.left - containerRect.left - 10) + 'px';
            focusFrame.style.top = (wordRect.top - containerRect.top - 10) + 'px';
            focusFrame.style.width = (wordRect.width + 20) + 'px';
            focusFrame.style.height = (wordRect.height + 20) + 'px';
            focusFrame.classList.add('visible');
        }
    }

    function startAnimation() {
        updateFocus();
        animationInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % words.length;
            updateFocus();
        }, 2000); // Change focus every 2 seconds
    }

    // Add hover functionality
    words.forEach((word, index) => {
        word.addEventListener('mouseenter', () => {
            clearInterval(animationInterval);
            currentIndex = index;
            updateFocus();
        });

        word.addEventListener('mouseleave', () => {
            startAnimation();
        });
    });

    // Start the animation
    setTimeout(startAnimation, 1000);
}

// Fuzzy Text Animation
function initFuzzyText() {
    const canvas = document.getElementById('fuzzy-text-canvas');
    if (!canvas) return;

    let animationFrameId;
    let isHovering = false;
    const text = "What's The Story";
    const baseIntensity = 0.2;
    const hoverIntensity = 0.5;
    const fuzzRange = 30;

    const init = async () => {
        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const fontSize = 'clamp(2.5rem, 6vw, 4rem)';
        const fontWeight = '800';
        const fontFamily = 'Inter, sans-serif';
        const color = '#ff3b3b';

        // Create temporary element to get computed font size
        const temp = document.createElement('span');
        temp.style.fontSize = fontSize;
        temp.style.fontWeight = fontWeight;
        temp.style.fontFamily = fontFamily;
        temp.style.position = 'absolute';
        temp.style.visibility = 'hidden';
        document.body.appendChild(temp);
        const computedSize = window.getComputedStyle(temp).fontSize;
        const numericFontSize = parseFloat(computedSize);
        document.body.removeChild(temp);

        // Create offscreen canvas for text rendering
        const offscreen = document.createElement('canvas');
        const offCtx = offscreen.getContext('2d');
        if (!offCtx) return;

        offCtx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
        offCtx.textBaseline = 'alphabetic';
        const metrics = offCtx.measureText(text);

        const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
        const actualRight = metrics.actualBoundingBoxRight ?? metrics.width;
        const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
        const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

        const textBoundingWidth = Math.ceil(actualLeft + actualRight);
        const tightHeight = Math.ceil(actualAscent + actualDescent);

        const extraWidthBuffer = 10;
        const offscreenWidth = textBoundingWidth + extraWidthBuffer;

        offscreen.width = offscreenWidth;
        offscreen.height = tightHeight;

        const xOffset = extraWidthBuffer / 2;
        offCtx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
        offCtx.textBaseline = 'alphabetic';
        offCtx.fillStyle = color;
        offCtx.fillText(text, xOffset - actualLeft, actualAscent);

        const horizontalMargin = 50;
        const verticalMargin = 0;
        canvas.width = offscreenWidth + horizontalMargin * 2;
        canvas.height = tightHeight + verticalMargin * 2;
        ctx.translate(horizontalMargin, verticalMargin);

        const interactiveLeft = horizontalMargin + xOffset;
        const interactiveTop = verticalMargin;
        const interactiveRight = interactiveLeft + textBoundingWidth;
        const interactiveBottom = interactiveTop + tightHeight;

        const run = () => {
            ctx.clearRect(
                -fuzzRange,
                -fuzzRange,
                offscreenWidth + 2 * fuzzRange,
                tightHeight + 2 * fuzzRange
            );
            const intensity = isHovering ? hoverIntensity : baseIntensity;
            for (let j = 0; j < tightHeight; j++) {
                const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
                ctx.drawImage(
                    offscreen,
                    0,
                    j,
                    offscreenWidth,
                    1,
                    dx,
                    j,
                    offscreenWidth,
                    1
                );
            }
            animationFrameId = window.requestAnimationFrame(run);
        };

        run();

        const isInsideTextArea = (x, y) => {
            return (
                x >= interactiveLeft &&
                x <= interactiveRight &&
                y >= interactiveTop &&
                y <= interactiveBottom
            );
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            isHovering = isInsideTextArea(x, y);
        };

        const handleMouseLeave = () => {
            isHovering = false;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup function
        canvas.cleanupFuzzyText = () => {
            window.cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    };

    init();

    // Return cleanup function
    return () => {
        window.cancelAnimationFrame(animationFrameId);
        if (canvas && canvas.cleanupFuzzyText) {
            canvas.cleanupFuzzyText();
        }
    };
}

// Blur Text Animation
function initBlurText() {
    const container = document.getElementById('blur-text-container');
    if (!container) return;

    const delay = 150;
    const stepDuration = 350;

    // Get existing word elements
    const wordElements = container.querySelectorAll('.blur-text-word');

    // Intersection Observer for animation trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateWords();
            }
        });
    }, { threshold: 0.1, rootMargin: '0px' });

    observer.observe(container);

    function animateWords() {
        // Reset all words to initial state first
        wordElements.forEach(word => {
            word.classList.remove('animate');
            word.style.filter = 'blur(10px)';
            word.style.opacity = '0';
            word.style.transform = 'translateY(-50px)';
        });
        
        // Then animate them with stagger
        wordElements.forEach((word, index) => {
            setTimeout(() => {
                // Step 1: Partial blur
                setTimeout(() => {
                    word.style.filter = 'blur(5px)';
                    word.style.opacity = '0.5';
                    word.style.transform = 'translateY(5px)';
                }, stepDuration);
                
                // Step 2: Full animation
                setTimeout(() => {
                    word.classList.add('animate');
                }, stepDuration * 2);
                
            }, index * delay);
        });
    }

    // Cleanup function
    return () => {
        observer.disconnect();
    };
}

// CountUp Animation
function initCountUp() {
    const countUpElements = document.querySelectorAll('.count-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const from = parseInt(element.dataset.from) || 0;
                const to = parseInt(element.dataset.to) || 0;
                const suffix = element.dataset.suffix || '';
                
                animateCountUp(element, from, to, suffix);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px' });
    
    countUpElements.forEach(element => {
        observer.observe(element);
    });
}

function animateCountUp(element, from, to, suffix) {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(from + (to - from) * easeOutQuart);
        
        // Format the number with commas
        const formattedValue = currentValue.toLocaleString();
        element.textContent = formattedValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        }
    }
    
    requestAnimationFrame(updateCount);
}

// ScrollFloat Animation
function initScrollFloat() {
    const scrollFloatElement = document.getElementById('upcoming-events-title');
    if (!scrollFloatElement) return;
    
    const textElement = scrollFloatElement.querySelector('.scroll-float-text');
    if (!textElement) return;
    
    // Split text into characters
    const text = textElement.textContent;
    textElement.innerHTML = '';
    
    text.split('').forEach((char, index) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        charSpan.textContent = char === ' ' ? '\u00A0' : char;
        textElement.appendChild(charSpan);
    });
    
    const charElements = textElement.querySelectorAll('.char');
    
    // Set initial hidden state
    charElements.forEach(char => {
        char.style.opacity = '0';
        char.style.transform = 'translateY(120%) scaleY(2.3) scaleX(0.7)';
    });
    
    // Create intersection observer for scroll trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateScrollFloat(charElements);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px'
    });
    
    observer.observe(scrollFloatElement);
}

function animateScrollFloat(charElements) {
    const stagger = 30; // 30ms between each character
    
    // Reset all characters to initial state first
    charElements.forEach(char => {
        char.style.opacity = '0';
        char.style.transform = 'translateY(120%) scaleY(2.3) scaleX(0.7)';
    });
    
    // Then animate them with stagger
    charElements.forEach((char, index) => {
        const delay = index * stagger;
        
        setTimeout(() => {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0%) scaleY(1) scaleX(1)';
        }, delay);
    });
}

// CurvedLoop Animation
function initCurvedLoop() {
    const curvedLoopElement = document.getElementById('lifestyle-collection-title');
    if (!curvedLoopElement) return;
    
    const textPath = curvedLoopElement.querySelector('textPath');
    if (!textPath) return;
    
    let offset = 0;
    const speed = 1; // Speed of animation
    let animationId;
    
    function animate() {
        offset -= speed;
        
        // Reset offset when it goes too far left
        if (offset < -800) {
            offset = 0;
        }
        
        textPath.setAttribute('startOffset', offset + 'px');
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation when element comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(curvedLoopElement);
}

// TextPressure Animation
function initTextPressure() {
    const textPressureElement = document.getElementById('companies-title');
    if (!textPressureElement) return;
    
    const textElement = textPressureElement.querySelector('.text-pressure-text');
    if (!textElement) return;
    
    // Split text into characters
    const text = textElement.textContent;
    textElement.innerHTML = '';
    
    const chars = text.split('');
    const charElements = [];
    
    chars.forEach((char, index) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'text-pressure-char';
        charSpan.textContent = char === ' ' ? '\u00A0' : char;
        textElement.appendChild(charSpan);
        charElements.push(charSpan);
    });
    
    let animationTime = 0;
    let animationId;
    
    // Animation loop
    function animate() {
        animationTime += 0.02; // Animation speed
        
        charElements.forEach((char, index) => {
            // Create a wave effect that moves through the text
            const wavePosition = (animationTime + index * 0.3) % (Math.PI * 2);
            const intensity = Math.sin(wavePosition) * 0.5 + 0.5; // 0 to 1
            
            // Apply pressure effects based on wave intensity
            const scale = 1 + (intensity * 0.4);
            const fontWeight = 800 + Math.floor(intensity * 400);
            const letterSpacing = -0.02 + (intensity * 0.15);
            
            char.style.transform = `scale(${scale})`;
            char.style.fontWeight = fontWeight;
            char.style.letterSpacing = letterSpacing + 'em';
            char.style.color = `hsl(0, 100%, ${50 + intensity * 30}%)`;
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation when element comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start animation
                animate();
            } else {
                // Stop animation
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                
                // Reset characters
                charElements.forEach(char => {
                    char.style.transform = 'scale(1)';
                    char.style.fontWeight = '800';
                    char.style.letterSpacing = '-0.02em';
                    char.style.color = 'var(--primary)';
                });
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(textPressureElement);
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting YouTube API integration...');
    initTypingAnimation();
    initTrueFocus();
    initFuzzyText();
    initBlurText();
    initCountUp();
    initScrollFloat();
    initCurvedLoop();
    initTextPressure();
    fetchLatestVideos();
    initParticles();
    loadPodcastEpisodes();
    initMerch();
    initPodcast();

    // Start periodic content check
    setInterval(checkForNewContent, AUTO_REFRESH_INTERVAL);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Scroll Reveal Animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Add reveal class to sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (hero) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
    
    // Interactive cursor effect
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('button, .nav-link, .social-link, .merch-card, .event-card, .episode-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-expanded');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-expanded');
        });
    });
});

// Call reveal on scroll
window.addEventListener('scroll', reveal);

// Initial reveal call
reveal();

// Add styles
const styles = document.createElement('style');
styles.textContent = `
    .cursor {
        width: 20px;
        height: 20px;
        border: 2px solid var(--accent-color);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.3s ease;
        transform: translate(-50%, -50%);
    }
    
    .cursor-expanded {
        transform: translate(-50%, -50%) scale(1.5);
        background: rgba(var(--accent-color-rgb), 0.1);
    }

    .video-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        padding: 2rem;
    }

    .video-card {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        overflow: hidden;
        transition: transform 0.3s ease;
    }

    .video-card:hover {
        transform: translateY(-5px);
    }

    .video-link {
        text-decoration: none;
        color: inherit;
    }

    .video-thumbnail {
        position: relative;
        aspect-ratio: 16/9;
        overflow: hidden;
        background: #000;
    }

    .thumbnail-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 0.3s ease;
    }

    .video-preview {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    .video-preview iframe {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .video-card:hover .thumbnail-img {
        opacity: 0;
    }

    .play-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.8);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .video-card:hover .play-overlay {
        opacity: 1;
    }

    .play-overlay i {
        color: white;
        font-size: 1.5rem;
    }

    .video-info {
        padding: 1rem;
    }

    .video-title {
        font-size: 1rem;
        margin: 0 0 0.5rem 0;
        color: white;
    }

    .video-date {
        font-size: 0.8rem;
        color: #888;
        margin: 0;
    }

    .error-message {
        text-align: center;
        color: #ff6b6b;
        padding: 2rem;
        font-size: 1.1rem;
    }

    .loading-message {
        text-align: center;
        padding: 2rem;
        color: #fff;
        font-size: 1.1rem;
    }

    .preview-controls {
        position: absolute;
        top: 10px;
        right: 10px;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 10;
    }

    .video-card:hover .preview-controls,
    .episode-card:hover .preview-controls {
        opacity: 1;
    }

    .sound-toggle {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease;
    }

    .sound-toggle:hover {
        background: rgba(255, 0, 0, 0.8);
    }

    .sound-toggle i {
        font-size: 0.9rem;
    }
`;
document.head.appendChild(styles); 