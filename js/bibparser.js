/**
 * BibTeX Parser
 * Parses BibTeX files and extracts publication information
 */

/**
 * Main parsing function
 * @param {string} bibText - The raw BibTeX file content
 * @returns {Array} Array of publication objects
 */
function parseBibTeX(bibText) {
    const publications = [];

    // Split into individual entries using regex
    // Match @type{key, ... }
    const entryRegex = /@(\w+)\s*\{\s*([^,]+)\s*,\s*([\s\S]*?)^\}/gm;
    let match;

    while ((match = entryRegex.exec(bibText)) !== null) {
        const entryType = match[1].toLowerCase();
        const citeKey = match[2].trim();
        const fieldsText = match[3];

        const publication = {
            type: entryType,
            citekey: citeKey
        };

        // Parse fields
        const fields = parseFields(fieldsText);
        Object.assign(publication, fields);

        // Parse authors
        if (publication.author) {
            publication.authors = parseAuthors(publication.author);
        }

        publications.push(publication);
    }

    return publications;
}

/**
 * Parse field-value pairs from BibTeX entry
 * @param {string} fieldsText - The fields section of a BibTeX entry
 * @returns {Object} Object with field names as keys
 */
function parseFields(fieldsText) {
    const fields = {};

    // Match field = {value} or field = "value"
    // Handle multiline values and nested braces
    const fieldRegex = /(\w+)\s*=\s*(?:\{((?:[^{}]|\{[^{}]*\})*)\}|"([^"]*)"|(\d+))/g;
    let match;

    while ((match = fieldRegex.exec(fieldsText)) !== null) {
        const fieldName = match[1].toLowerCase();
        const fieldValue = match[2] || match[3] || match[4];

        if (fieldValue) {
            fields[fieldName] = cleanLatex(fieldValue.trim());
        }
    }

    return fields;
}

/**
 * Parse author string into array of author names
 * @param {string} authorString - The author field value
 * @returns {Array} Array of author names
 */
function parseAuthors(authorString) {
    // Split by "and" (case-insensitive, whole word)
    const authors = authorString.split(/\s+and\s+/i);

    return authors.map(author => {
        author = author.trim();

        // Handle different author formats
        // Format 1: "Last, First Middle"
        // Format 2: "First Middle Last"

        if (author.includes(',')) {
            // "Last, First" format
            const parts = author.split(',').map(p => p.trim());
            return `${parts[1]} ${parts[0]}`;
        } else {
            // Already in "First Last" format
            return author;
        }
    }).filter(a => a.length > 0);
}

/**
 * Clean LaTeX special characters and commands
 * @param {string} text - Text with LaTeX formatting
 * @returns {string} Cleaned text
 */
function cleanLatex(text) {
    // Common LaTeX character replacements
    const replacements = {
        // Accented characters
        "{\\'e}": "é",
        "{\\'a}": "á",
        "{\\'i}": "í",
        "{\\'o}": "ó",
        "{\\'u}": "ú",
        "{\\`e}": "è",
        "{\\`a}": "à",
        "{\\^e}": "ê",
        "{\\^a}": "â",
        "{\\^o}": "ô",
        '{\\"o}': "ö",
        '{\\"a}': "ä",
        '{\\"u}': "ü",
        "{\\~n}": "ñ",
        "{\\o}": "ø",
        "{\\ae}": "æ",
        "{\\ss}": "ß",

        // Special characters
        "\\&": "&",
        "\\%": "%",
        "\\$": "$",
        "\\_": "_",
        "\\#": "#",

        // Common commands
        "\\textit": "",
        "\\textbf": "",
        "\\emph": "",
        "\\url": "",

        // Quotes
        "``": '"',
        "''": '"',
        "`": "'",
        "'": "'"
    };

    let cleaned = text;

    // Apply replacements
    for (const [latex, replacement] of Object.entries(replacements)) {
        cleaned = cleaned.replace(new RegExp(latex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
    }

    // Remove remaining braces that aren't part of commands
    cleaned = cleaned.replace(/\{([^\\}]*)\}/g, '$1');

    // Clean up extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
}

/**
 * Group publications by year
 * @param {Array} publications - Array of publication objects
 * @returns {Object} Object with years as keys, sorted publications as values
 */
function groupByYear(publications) {
    const grouped = {};

    publications.forEach(pub => {
        const year = pub.year || 'Unknown';
        if (!grouped[year]) {
            grouped[year] = [];
        }
        grouped[year].push(pub);
    });

    // Sort publications within each year by first author's last name
    Object.keys(grouped).forEach(year => {
        grouped[year].sort((a, b) => {
            const authorA = getLastName(a.authors?.[0] || '');
            const authorB = getLastName(b.authors?.[0] || '');
            return authorA.localeCompare(authorB);
        });
    });

    return grouped;
}

/**
 * Extract last name from full author name
 * @param {string} fullName - Full author name
 * @returns {string} Last name
 */
function getLastName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    return parts[parts.length - 1] || '';
}

/**
 * Format authors for display, highlighting a specific author
 * @param {Array} authors - Array of author names
 * @param {string} highlightName - Name to highlight (e.g., "Thams")
 * @returns {string} Formatted HTML string
 */
function formatAuthors(authors, highlightName = 'Thams') {
    if (!authors || authors.length === 0) return '';

    return authors.map(author => {
        if (author.includes(highlightName)) {
            return `<span class="author-highlight">${author}</span>`;
        }
        return author;
    }).join(', ');
}

/**
 * Format venue information (journal/conference)
 * @param {Object} pub - Publication object
 * @returns {string} Formatted venue string
 */
function formatVenue(pub) {
    const parts = [];

    // Journal or conference
    if (pub.journal) {
        parts.push(pub.journal);
    } else if (pub.booktitle) {
        parts.push(pub.booktitle);
    } else if (pub.publisher) {
        parts.push(pub.publisher);
    }

    // Volume and number
    if (pub.volume) {
        if (pub.number) {
            parts.push(`${pub.volume}(${pub.number})`);
        } else {
            parts.push(`vol. ${pub.volume}`);
        }
    }

    // Pages
    if (pub.pages) {
        parts.push(`pp. ${pub.pages}`);
    }

    // Year
    if (pub.year) {
        parts.push(pub.year);
    }

    return parts.join(', ');
}

/**
 * Render a single publication as HTML
 * @param {Object} pub - Publication object
 * @returns {string} HTML string
 */
function renderPublication(pub) {
    const title = pub.title || 'Untitled';
    const authors = formatAuthors(pub.authors);
    const venue = formatVenue(pub);

    let html = `
        <div class="publication">
            <div class="pub-title">${title}</div>
            <div class="pub-authors">${authors}</div>
            <div class="pub-venue">${venue}</div>
            <div class="pub-links">
    `;

    // Add links
    if (pub.pdf) {
        html += `<a href="${pub.pdf}" class="pub-link" target="_blank">PDF</a>`;
    }

    if (pub.arxiv) {
        const arxivUrl = pub.arxiv.startsWith('http')
            ? pub.arxiv
            : `https://arxiv.org/abs/${pub.arxiv}`;
        html += `<a href="${arxivUrl}" class="pub-link" target="_blank">arXiv</a>`;
    }

    if (pub.doi) {
        const doiUrl = pub.doi.startsWith('http')
            ? pub.doi
            : `https://doi.org/${pub.doi}`;
        html += `<a href="${doiUrl}" class="pub-link" target="_blank">DOI</a>`;
    }

    if (pub.code) {
        html += `<a href="${pub.code}" class="pub-link" target="_blank">Code</a>`;
    }

    if (pub.website) {
        html += `<a href="${pub.website}" class="pub-link" target="_blank">Website</a>`;
    }

    if (pub.slides) {
        html += `<a href="${pub.slides}" class="pub-link" target="_blank">Slides</a>`;
    }

    if (pub.abstract) {
        html += `<button class="pub-abstract-toggle" onclick="toggleAbstract('${pub.citekey}')">Abstract</button>`;
    }

    html += `</div>`;

    // Add abstract (hidden by default)
    if (pub.abstract) {
        html += `
            <div class="pub-abstract" id="abstract-${pub.citekey}">
                <p>${pub.abstract}</p>
            </div>
        `;
    }

    html += `</div>`;

    return html;
}

/**
 * Render all publications grouped by year
 * @param {Object} groupedPubs - Publications grouped by year
 * @returns {string} HTML string
 */
function renderPublications(groupedPubs) {
    // Sort years in descending order
    const years = Object.keys(groupedPubs).sort((a, b) => {
        if (a === 'Unknown') return 1;
        if (b === 'Unknown') return -1;
        return parseInt(b) - parseInt(a);
    });

    let html = '';

    years.forEach(year => {
        html += `
            <div class="year-group">
                <h2 class="year-header">${year}</h2>
                <div class="year-publications">
        `;

        groupedPubs[year].forEach(pub => {
            html += renderPublication(pub);
        });

        html += `
                </div>
            </div>`;
    });

    return html;
}

/**
 * Toggle abstract visibility
 * @param {string} citekey - Citation key of the publication
 */
function toggleAbstract(citekey) {
    const abstractEl = document.getElementById(`abstract-${citekey}`);
    if (abstractEl) {
        abstractEl.classList.toggle('show');
    }
}
