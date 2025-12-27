# Academic Website

A clean, minimal academic website built with pure HTML, CSS, and vanilla JavaScript. No frameworks or build tools required - just open the HTML files in a browser or deploy to GitHub Pages.

## Features

- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Publications from BibTeX**: Automatically parses and displays publications from a `.bib` file
- **CV from YAML**: Renders CV sections from structured YAML data
- **News from YAML**: Manages news/updates with markdown formatting support
- **Clean UI**: Professional academic aesthetic with smooth animations
- **Easy to Maintain**: Simple file structure with no dependencies
- **Fast Loading**: Minimal JavaScript, no heavy frameworks
- **Markdown Support**: News entries support bold, italic, code, and link formatting

## File Structure

```
/
├── index.html              # Home/About page
├── publications.html       # Publications list
├── cv.html                 # CV/Resume page
├── news.html              # News/Updates page
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── bibparser.js       # BibTeX parser for publications
│   ├── cvparser.js        # YAML parser for CV data
│   ├── newsparser.js      # YAML parser for news with markdown support
│   └── main.js            # Site functionality
├── data/
│   ├── publications.bib   # BibTeX file with publications
│   ├── cv.yaml            # YAML file with CV data
│   └── news.yaml          # YAML file with news entries
└── assets/
    └── img/               # Images folder
        └── profile.jpg    # Profile photo (add your own)
```

## Getting Started

### 1. Add Your Content

#### Profile Photo
- Add your profile photo to `assets/img/profile.jpg`
- Recommended size: 400x400px or larger (will be displayed as 180x180px)

#### Personal Information
Edit [index.html](index.html) to update:
- Your name and title
- Bio paragraphs
- Research interests
- Contact information
- Social media links (GitHub, Google Scholar, LinkedIn)

### 2. Update Publications

The website automatically parses publications from [data/publications.bib](data/publications.bib).

#### Adding a New Publication

Simply add a new BibTeX entry to [data/publications.bib](data/publications.bib):

```bibtex
@article{yourname2024title,
  title={Your Paper Title},
  author={Your Name and Coauthor Name},
  journal={Journal Name},
  year={2024},
  volume={10},
  pages={1--20},
  doi={10.xxxx/xxxx},
  arxiv={2401.xxxxx},
  pdf={https://example.com/paper.pdf},
  code={https://github.com/username/repo},
  abstract={Your paper abstract goes here...}
}
```

#### Supported Fields

**Required:**
- `title`: Paper title
- `author`: Authors (separated by "and")
- `year`: Publication year

**Optional:**
- `journal`: Journal name (for articles)
- `booktitle`: Conference name (for proceedings)
- `volume`, `number`, `pages`: Publication details
- `doi`: DOI identifier (will auto-generate link)
- `arxiv`: arXiv ID (will auto-generate link)
- `pdf`: Direct link to PDF
- `code`: Link to code repository
- `website`: Project website
- `slides`: Link to presentation slides
- `abstract`: Paper abstract (expandable on click)

#### Highlighting Your Name

By default, "Thams" is highlighted in the author list. To change this:

Edit [js/bibparser.js](js/bibparser.js), line ~180:
```javascript
function formatAuthors(authors, highlightName = 'YourLastName') {
```

### 3. Update News

The website automatically loads news from [data/news.yaml](data/news.yaml).

#### Adding a New News Item

Add a new entry to [data/news.yaml](data/news.yaml):

```yaml
- date: 2024-12-26
  title: Paper Accepted at Conference
  text: |
    Our paper __*Title of the Paper*__ was accepted at the Conference!
    This work introduces new methods for... [[PDF]](https://example.com/paper.pdf) [[Code]](https://github.com/user/repo)
  pinned: false
```

#### News Entry Fields

**Required:**
- `date`: Date in YYYY-MM-DD format (displays as "Month Day, YYYY")
- `title`: Short title for the news item
- `text`: News content (supports markdown formatting)

**Optional:**
- `pinned`: Set to `true` to always show on front page (default: `false`)

#### Markdown Formatting in News

The `text` field supports the following markdown syntax:

- **Bold**: `**text**` or `__text__`
- **Italic**: `*text*` or `_text_`
- **Bold+Italic**: `__*text*__`
- **Code**: `` `text` ``
- **Links**: `[text](url)` renders as text (linked)
- **Bracketed Links**: `[[text]](url)` renders as [text] (linked, with brackets visible)

Example:
```yaml
text: |
  New paper __*Causal Inference in Time Series*__ accepted!
  We show how to use `P` and `Q` distributions for testing.
  [[PDF]](https://arxiv.org/pdf/example.pdf) [[Code]](https://github.com/user/repo)
```

#### Front Page News

The homepage automatically displays:
- The 5 most recent news items
- All pinned items (regardless of date)
- Items are sorted by date (most recent first)

### 4. Update CV

The website automatically renders CV from [data/cv.yaml](data/cv.yaml).

#### CV Structure

The CV is organized into sections. Edit [data/cv.yaml](data/cv.yaml) to update your CV:

```yaml
sections:
  - title: Education
    items:
      - degree: PhD in Statistics
        institution: University Name
        location: City, Country
        date: 2020-2024
        details:
          - Thesis: "Title of Dissertation"
          - Advisor: Prof. Name

  - title: Experience
    items:
      - position: Job Title
        organization: Company/Institution
        location: City, Country
        date: 2024-Present
        details:
          - Description of responsibilities
          - Key achievements

  - title: Publications
    note: See full list on Publications page
```

#### CV Fields

**Section Fields:**
- `title`: Section heading (e.g., "Education", "Experience")
- `items`: List of entries in this section
- `note`: Optional text displayed instead of items (useful for references)

**Item Fields:**
Common fields include:
- `degree`, `institution`, `location`, `date` (for education)
- `position`, `organization`, `location`, `date` (for experience)
- `award`, `grantor`, `date`, `amount` (for awards)
- `details`: List of bullet points (optional)

The CV parser is flexible and will display whatever fields you include.

## Customization

### Colors and Styling

All visual styling is controlled by CSS variables in [css/style.css](css/style.css). Edit the `:root` section:

```css
:root {
    --primary-color: #1e40af;      /* Main accent color */
    --accent-color: #3b82f6;       /* Link color */
    --text-color: #1f2937;         /* Main text */
    --text-light: #6b7280;         /* Secondary text */
    --bg-color: #ffffff;           /* Background */
    --secondary-bg: #f9fafb;       /* Card backgrounds */
    --max-width: 960px;            /* Content width */
}
```

### Fonts

The site uses system fonts by default. To use custom fonts:

1. Add a Google Fonts link to the `<head>` of each HTML file:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

2. Update the `font-family` in [css/style.css](css/style.css):
```css
body {
    font-family: 'Inter', sans-serif;
}
```

## Local Testing

Simply open [index.html](index.html) in your web browser. However, to properly load the publications (which uses `fetch()`), you need to run a local server:

### Option 1: Python
```bash
# Python 3
python -m http.server 8000

# Then visit http://localhost:8000
```

### Option 2: Node.js
```bash
npx http-server -p 8000
```

### Option 3: VS Code
Install the "Live Server" extension and click "Go Live" in the status bar.

## Deployment

### GitHub Pages

1. Create a GitHub repository
2. Push all files to the repository
3. Go to Settings → Pages
4. Select "Deploy from main branch"
5. Your site will be available at `https://username.github.io/repository-name`

### Custom Domain

To use a custom domain with GitHub Pages:

1. Add a `CNAME` file with your domain name
2. Configure DNS settings with your domain provider
3. See [GitHub's documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

### Other Hosting

Upload all files to any static hosting service:
- Netlify (drag and drop)
- Vercel
- Cloudflare Pages
- Any web server with static file hosting

## Browser Support

The website works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Publications Not Loading

**Issue**: "Error loading publications" message

**Solutions**:
1. Make sure you're running a local server (see Local Testing section)
2. Check that [data/publications.bib](data/publications.bib) exists
3. Validate your BibTeX syntax (unmatched braces, missing commas)
4. Check browser console for error messages

### News Not Loading

**Issue**: "Error loading news" or news items don't appear

**Solutions**:
1. Make sure you're running a local server (see Local Testing section)
2. Check that [data/news.yaml](data/news.yaml) exists
3. Validate your YAML syntax (proper indentation, colons, dashes)
4. Ensure dates are in YYYY-MM-DD format
5. Check browser console for error messages

### CV Not Loading

**Issue**: CV sections don't appear

**Solutions**:
1. Make sure you're running a local server (see Local Testing section)
2. Check that [data/cv.yaml](data/cv.yaml) exists
3. Validate your YAML syntax (proper indentation, colons, dashes)
4. Ensure the structure has `sections` as the top-level key
5. Check browser console for error messages

### Images Not Loading

**Issue**: Profile photo doesn't appear

**Solutions**:
1. Check that the image exists at `assets/img/profile.jpg`
2. Verify the file extension matches (`.jpg`, `.jpeg`, `.png`)
3. Update the `src` attribute in [index.html](index.html) if using a different filename

### Special Characters in BibTeX

**Issue**: Accented characters display incorrectly

**Solution**: Use LaTeX notation in your `.bib` file:
- `{\\'e}` for é
- `{\\\"o}` for ö
- `{\\~n}` for ñ

The parser will automatically convert these to proper characters.

### Markdown Not Rendering in News

**Issue**: Markdown syntax appears as plain text

**Solutions**:
1. Make sure you're using the correct syntax (see News section)
2. Check that the text is in the `text` field (not `title`)
3. Use the pipe `|` character after `text:` for multi-line content
4. Verify the newsparser.js file is loaded in your HTML pages

## Advanced Customization

### Adding New Pages

1. Copy one of the existing HTML files
2. Update the content
3. Add a link in the navigation of all pages

### Enabling Scroll Animations

Uncomment this line in [js/main.js](js/main.js):
```javascript
document.addEventListener('DOMContentLoaded', addScrollAnimations);
```

### Analytics

To add Google Analytics, insert the tracking code in the `<head>` section of each HTML file.

### Adding Search Functionality

To add publication search, modify [publications.html](publications.html) to include a search input and filter the displayed publications based on keywords.

## License

Feel free to use this template for your own academic website. No attribution required.

## Support

If you encounter issues:
1. Check the browser console for errors
2. Validate your BibTeX syntax
3. Ensure file paths are correct
4. Make sure you're using a local server for development

## Credits

Built with vanilla HTML, CSS, and JavaScript. Icons from SVG sources. No external dependencies.
