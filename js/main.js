/**
 * Main JavaScript functionality for academic website
 */

// Navigation configuration - update contact info here
const NAV_CONFIG = {
    brandName: 'Nikolaj Thams',
    email: 'thams@math.ku.dk',
    location: 'London, UK',
    menuItems: [
        { href: 'index.html', label: 'Home' },
        { href: 'publications.html', label: 'Papers' },
        { href: 'cv.html', label: 'CV' },
        { href: 'news.html', label: 'News' }
    ],
    socialLinks: [
        {
            url: 'https://scholar.google.com/citations?user=rVH3NqYAAAAJ',
            title: 'Google Scholar',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z"/></svg>'
        },
        {
            url: 'https://linkedin.com',
            title: 'LinkedIn',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>'
        },
        {
            url: 'https://github.com/nikolajthams',
            title: 'GitHub',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
        }
    ]
};

// Render navigation bar
function renderNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const menuItemsHtml = NAV_CONFIG.menuItems.map(item => {
        const active = item.href === currentPage ? ' class="active"' : '';
        return `<li><a href="${item.href}"${active}>${item.label}</a></li>`;
    }).join('\n                ');

    const socialLinksHtml = NAV_CONFIG.socialLinks.map(link => {
        return `<a href="${link.url}" target="_blank" title="${link.title}">${link.icon}</a>`;
    }).join('\n                    ');

    return `
    <nav class="navbar">
        <div class="container">
            <a href="index.html" class="nav-brand">${NAV_CONFIG.brandName}</a>
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links">
                ${menuItemsHtml}
                <li class="menu-contact">
                    <a href="mailto:${NAV_CONFIG.email}">${NAV_CONFIG.email}</a><br>
                    ${NAV_CONFIG.location}
                    <div class="social-links">
                    ${socialLinksHtml}
                    </div>
                </li>
            </ul>
        </div>
    </nav>`;
}

// Initialize navigation and menu toggle
function initializeNavigation() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = renderNavigation();
    }

    // Setup mobile menu toggle after navigation is rendered
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const body = document.body;

    if (menuToggle && navLinks && navbar) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            navbar.classList.toggle('menu-open');

            // Prevent scrolling when menu is open
            if (isActive) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close menu when clicking on the overlay (nav-links itself)
        navLinks.addEventListener('click', (e) => {
            if (e.target === navLinks) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                navbar.classList.remove('menu-open');
                body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                navbar.classList.remove('menu-open');
                body.style.overflow = '';
            });
        });
    }
}

// Load navigation on page load
document.addEventListener('DOMContentLoaded', initializeNavigation);

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Load and display publications
async function loadPublications() {
    const container = document.getElementById('publications-container');

    if (!container) return;

    try {
        // Fetch the BibTeX file
        const response = await fetch('data/publications.bib');

        if (!response.ok) {
            throw new Error(`Failed to load publications: ${response.status}`);
        }

        const bibText = await response.text();

        // Parse BibTeX
        const publications = parseBibTeX(bibText);

        if (publications.length === 0) {
            container.innerHTML = '<p class="loading">No publications found.</p>';
            return;
        }

        // Group by year
        const groupedPubs = groupByYear(publications);

        // Render publications
        const html = renderPublications(groupedPubs);
        container.innerHTML = html;

        // Add click handlers to titles for abstract toggling
        addTitleClickHandlers();

    } catch (error) {
        console.error('Error loading publications:', error);
        container.innerHTML = `
            <div class="loading">
                <p>Error loading publications.</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">
                    Make sure the file <code>data/publications.bib</code> exists and is properly formatted.
                </p>
            </div>
        `;
    }
}

// Add click handlers to publication titles for toggling abstracts
function addTitleClickHandlers() {
    const titles = document.querySelectorAll('.pub-title');

    titles.forEach(title => {
        title.addEventListener('click', (e) => {
            // Find the abstract toggle button in the same publication
            const publication = title.closest('.publication');
            const abstractToggle = publication.querySelector('.pub-abstract-toggle');

            if (abstractToggle) {
                abstractToggle.click();
            }
        });
    });
}

// Navigation highlighting is now handled in renderNavigation()

// Add fade-in animation on scroll (optional enhancement)
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    const elements = document.querySelectorAll('.publication, .news-item, .cv-item');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Uncomment to enable scroll animations
// document.addEventListener('DOMContentLoaded', addScrollAnimations);

// Utility: Copy citation to clipboard
function copyCitation(citekey) {
    navigator.clipboard.writeText(`@${citekey}`)
        .then(() => {
            showNotification('Citation key copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy citation:', err);
        });
}

// Show temporary notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
