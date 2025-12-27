/**
 * CV YAML Parser
 * Parses structured CV data from YAML and generates HTML
 */

/**
 * Parse nested YAML structure for CV data
 */
function parseNestedYAML(yamlText) {
    const lines = yamlText.split('\n');
    const data = {};
    let currentSection = null;
    let currentItem = null;
    let currentArray = null;
    let inHighlights = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip empty lines and comments
        if (!line.trim() || line.trim().startsWith('#')) {
            continue;
        }

        // Top-level section (no indentation)
        if (line.match(/^(\w+):/)) {
            const match = line.match(/^(\w+):\s*(.*)$/);
            if (match) {
                const key = match[1];
                const value = match[2].trim();

                currentSection = key;
                inHighlights = false;

                if (value) {
                    // Simple key-value pair
                    data[key] = value;
                    currentSection = null;
                } else {
                    // Section with nested data
                    data[key] = [];
                    currentArray = data[key];
                }
            }
        }
        // List item (starts with -)
        else if (line.match(/^  - /)) {
            inHighlights = false;

            if (line.match(/^  - ".*"$/)) {
                // Simple string item
                const value = line.match(/^  - "(.*)"/)[1];
                if (currentArray) {
                    currentArray.push(value);
                }
            } else if (line.match(/^  - \w+:/)) {
                // Object item starting
                currentItem = {};
                const match = line.match(/^  - (\w+):\s*(.*)$/);
                if (match) {
                    currentItem[match[1]] = match[2].trim();
                }
                if (currentArray) {
                    currentArray.push(currentItem);
                }
            }
        }
        // Property of current item
        else if (line.match(/^    \w+:/) && currentItem) {
            const match = line.match(/^    (\w+):\s*(.*)$/);
            if (match) {
                const key = match[1];
                const value = match[2].trim();

                if (key === 'highlights') {
                    currentItem[key] = [];
                    inHighlights = true;
                } else {
                    currentItem[key] = value;
                    inHighlights = false;
                }
            }
        }
        // Highlight item
        else if (line.match(/^      - /) && inHighlights && currentItem) {
            const value = line.match(/^      - "?(.+?)"?$/)[1];
            currentItem.highlights.push(value);
        }
    }

    return data;
}

/**
 * Load CV data from YAML file
 */
async function loadCVFromYAML() {
    try {
        const response = await fetch('data/cv.yaml');
        if (!response.ok) {
            throw new Error(`Failed to load CV: ${response.status}`);
        }

        const yamlText = await response.text();
        const cvData = parseNestedYAML(yamlText);
        return cvData;
    } catch (error) {
        console.error('Error loading CV:', error);
        return {};
    }
}

/**
 * Format date range for display
 */
function formatDateRange(start, end) {
    if (!start) return '';

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month] = dateStr.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (month) {
            const monthIndex = parseInt(month, 10) - 1;
            return `${months[monthIndex]} ${year}`;
        }
        return year;
    };

    const startFormatted = formatDate(start);
    const endFormatted = end === 'present' ? 'Present' : formatDate(end);

    return `${startFormatted} - ${endFormatted}`;
}

/**
 * Render a CV section (unified renderer for all sections except talks and skills)
 */
function renderCVSection(items) {
    if (!items || items.length === 0) return '';

    return items.map(item => `
        <div class="cv-item">
            <div class="cv-item-header">
                <strong>${item.title || ''}</strong>
                <span class="cv-date">${formatDateRange(item.start, item.end)}</span>
            </div>
            <p>${item.location || ''}</p>
            ${item.description ? `<p class="cv-detail">${item.description}</p>` : ''}
        </div>
    `).join('');
}

/**
 * Render talks section
 */
function renderTalks(talks) {
    if (!talks || talks.length === 0) return '';

    return `<ul>${talks.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

/**
 * Render complete CV
 */
function renderCV(cvData) {
    let html = '';

    // Education
    if (cvData.education && cvData.education.length > 0) {
        html += `
            <section class="cv-section">
                <h2>Education</h2>
                ${renderCVSection(cvData.education)}
            </section>
        `;
    }

    // Work Experience
    if (cvData.work && cvData.work.length > 0) {
        html += `
            <section class="cv-section">
                <h2>Professional Experience</h2>
                ${renderCVSection(cvData.work)}
            </section>
        `;
    }

    // Teaching
    if (cvData.teaching && cvData.teaching.length > 0) {
        html += `
            <section class="cv-section">
                <h2>Teaching</h2>
                ${renderCVSection(cvData.teaching)}
            </section>
        `;
    }

    // Competitions
    if (cvData.competitions && cvData.competitions.length > 0) {
        html += `
            <section class="cv-section">
                <h2>Competitions</h2>
                ${renderCVSection(cvData.competitions)}
            </section>
        `;
    }

    // Academic Service
    if (cvData.academic_service && cvData.academic_service.length > 0) {
        html += `
            <section class="cv-section">
                <h2>Academic Service</h2>
                ${renderCVSection(cvData.academic_service)}
            </section>
        `;
    }

    // Talks
    if (cvData.talks && cvData.talks.length > 0) {
        html += `
            <section class="cv-section">
                <h2>Talks</h2>
                ${renderTalks(cvData.talks)}
            </section>
        `;
    }

    return html;
}
