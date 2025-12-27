/**
 * News parser - loads and renders news from YAML
 * Handles YAML parsing and markdown formatting in news content
 * Supports: bold (**text**), italic (*text*), bold+italic (__*text*__), links [[text]](url)
 */

function parseYAML(yamlText) {
    const lines = yamlText.split('\n');
    const items = [];
    let currentItem = null;
    let inMultilineValue = false;
    let multilineKey = '';
    let multilineValue = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip empty lines and comments
        if (!line.trim() || line.trim().startsWith('#')) {
            continue;
        }

        // Check for new list item
        if (line.match(/^-\s+\w+:/)) {
            // Save previous item if exists
            if (currentItem) {
                if (inMultilineValue) {
                    currentItem[multilineKey] = multilineValue.join('\n').trim();
                    inMultilineValue = false;
                }
                items.push(currentItem);
            }

            currentItem = {};

            // Parse the first key-value on the same line as the dash
            const match = line.match(/^-\s+(\w+):\s*(.*)$/);
            if (match) {
                const key = match[1];
                const value = match[2].trim();

                if (value === '|') {
                    inMultilineValue = true;
                    multilineKey = key;
                    multilineValue = [];
                } else {
                    currentItem[key] = value;
                }
            }
        }
        // Check for continuation of current item
        else if (line.match(/^\s+\w+:/) && currentItem) {
            // Save previous multiline value if exists
            if (inMultilineValue) {
                currentItem[multilineKey] = multilineValue.join('\n').trim();
                inMultilineValue = false;
            }

            const match = line.match(/^\s+(\w+):\s*(.*)$/);
            if (match) {
                const key = match[1];
                const value = match[2].trim();

                if (value === '|') {
                    inMultilineValue = true;
                    multilineKey = key;
                    multilineValue = [];
                } else if (value === 'true' || value === 'True') {
                    currentItem[key] = true;
                } else if (value === 'false' || value === 'False') {
                    currentItem[key] = false;
                } else {
                    currentItem[key] = value;
                }
            }
        }
        // Multiline value content
        else if (inMultilineValue && line.match(/^\s+\S/)) {
            multilineValue.push(line.replace(/^\s{4}/, '')); // Remove 4-space indent
        }
    }

    // Don't forget the last item
    if (currentItem) {
        if (inMultilineValue) {
            currentItem[multilineKey] = multilineValue.join('\n').trim();
        }
        items.push(currentItem);
    }

    return items;
}

/**
 * Load and parse news from YAML file
 */
async function loadNewsFromYAML() {
    try {
        const response = await fetch('data/news.yaml');
        if (!response.ok) {
            throw new Error(`Failed to load news: ${response.status}`);
        }

        const yamlText = await response.text();
        const newsItems = parseYAML(yamlText);

        return newsItems;
    } catch (error) {
        console.error('Error loading news:', error);
        return [];
    }
}

/**
 * Get news for front page (first 5 + any pinned)
 */
function getFrontPageNews(newsItems) {
    // Sort by date descending
    const sorted = [...newsItems].sort((a, b) => {
        // Simple date comparison (YYYY-MM format)
        return b.date.localeCompare(a.date);
    });

    // Get pinned items
    const pinned = sorted.filter(item => item.pinned === true);

    // Get first 5 items
    const firstFive = sorted.slice(0, 5);

    // Combine, removing duplicates
    const combined = [...firstFive];
    pinned.forEach(item => {
        if (!combined.find(i => i.date === item.date && i.title === item.title)) {
            combined.push(item);
        }
    });

    // Sort combined list by date
    return combined.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Convert markdown-style formatting to HTML
 * Supports: bold (**text**), italic (*text*), bold+italic (__*text*__), code (`text`), links [text](url) or [[text]](url)
 */
function parseMarkdown(text) {
    if (!text) return '';

    // Handle code: `text` (do this first to avoid conflicts with other formatting)
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Handle bold+italic: __*text*__
    text = text.replace(/__\*([^*]+)\*__/g, '<strong><em>$1</em></strong>');

    // Handle bold: **text**
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Handle italic: *text* (but not if it's part of bold)
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Handle italic with underscore: _text_
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Handle links: [[text]](url) renders as [text] with link, [text](url) renders as text with link
    text = text.replace(/\[\[([^\]]+)\]\]\(([^)]+)\)/g, '<a href="$2" target="_blank">[$1]</a>');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    return text;
}

/**
 * Create pin icon SVG - stylish outlined version
 */
function createPinIcon() {
    return `<svg class="pin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 17v5"/>
        <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
    </svg>`;
}

/**
 * Render news list for front page
 */
function renderFrontPageNews(newsItems) {
    return newsItems.map(item => `
        <li>
            <div class="news-header">
                <span class="news-date">${item.date}</span>
                <span class="news-title">
                    ${item.pinned ? createPinIcon() : ''}
                    ${item.title}
                </span>
            </div>
            <div class="news-content">${parseMarkdown(item.text)}</div>
        </li>
    `).join('');
}

/**
 * Render full news timeline for news page
 */
function renderNewsTimeline(newsItems) {
    // Sort by date descending
    const sorted = [...newsItems].sort((a, b) => b.date.localeCompare(a.date));

    return sorted.map(item => {
        // Format date for display
        const dateDisplay = formatNewsDate(item.date);

        return `
        <div class="news-item">
            <div class="news-date-large">${dateDisplay}</div>
            <div class="news-content-large">
                <h3>
                    ${item.pinned ? createPinIcon() : ''}
                    ${item.title}
                </h3>
                <p>${parseMarkdown(item.text)}</p>
            </div>
        </div>
    `;
    }).join('');
}

/**
 * Format date from YYYY-MM-DD to "Month Day, YYYY"
 */
function formatNewsDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];

    if (month && day) {
        const monthIndex = parseInt(month, 10) - 1;
        const dayNum = parseInt(day, 10);
        return `${months[monthIndex]} ${dayNum}, ${year}`;
    } else if (month) {
        const monthIndex = parseInt(month, 10) - 1;
        return `${months[monthIndex]} ${year}`;
    }

    return year;
}
