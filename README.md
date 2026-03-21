# Business Information Scraper

A full-stack web application that intelligently scrapes business websites (handling both static HTML and modern JavaScript SPAs) to automatically generate structured, editable, and exportable Business Plans using AI.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Atswik/Business-Scraper.git
   cd Business-Scraper
   ```

2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Environment Variables:** Create a .env file
    ```bash
    OPENAI_API_KEY=your_api_key_here
    ```
4. **Run the development server:**
    ```bash
    npm run dev
    ```
    Open http://localhost:3000 in your browser to view the application.

## Features Implemented

- **Dual-Scraping Engine:** Automatically handles both Static/SSR sites and modern SPAs.

- **Ethical Scraping Compliance:** Respects robots.txt instructions before initiating crawls.

- **Targeted Pathing:** Prioritizes high-value business pages (/about, /products, /team) while filtering out noise.

- **Interactive Preview Modal:** A schema-driven form allowing users to manually edit, add, or correct extracted data.

- **Manual Data Entry:** Supports direct text upload (.txt files) or manual pasting if scraping is blocked.

- **PDF Generation:** Exports the final business plan into a clean, print-optimized PDF document.

## Architecture

The system is designed with a "Fallback-first" architecture to handle unpredictable nature of moderm web pages:

1. **Ethics Check:** The scraper first queries `robots.txt` using the `robots-parser` library. If scraping is disallowed, the backend rejects and the UI guides the user to an alternative flow.

2. **Scraping:**
    - The scraper initially fetches the URL using `axios` and parses it with `cheerio`. It strips out `<nav>`, `<footer>`, `<script>`,...etc., tags to extract core text of the site.

    - **The fallback:** If Cheerio returns an empty "skeleton" (*under 200 characters of text or 0 links*), which is a sign of modern React/Next.js SPA, the system falls back to **Playwright**.

    - **Playwright:** It launches a headless browser, waits for the `networkidle` event (*allowing React/Vue to hydrate the DOM*), and successfully extracts the dynamically rendered text.

3. **Crawling:** Extracted links are filtered against an "Acceptable Keywords" list (*e.g., about, services*) and scored. The crawler only visits the highest-value pages, capped at 10 pages limit to prevent timeout errors and token-limit-exhaustion.

### OpenAI (gpt-4o)

This API was chosen for its strong JSON-mode adherence, allowing the massive string of scraped website content to be accurately mapped directly into the application's TypeScript BusinessPlan interface.

## Demo Video

[![Business Scraper Demo](https://img.youtube.com/vi/bPScXP9T5-g/maxresdefault.jpg)](https://youtu.be/bPScXP9T5-g)


## Trade-off & Limitations

**Anti-Bot Protection:** Sites using advanced Cloudflare protection will actively block Playwright, resulting in a 403 error. In these cases, the scraper fails gracefully and relies on the user's manual text upload.


## Future Improvements

- **Concurrent Scraping:** To scrape all the prioritized links in parallel rather than sequentially, reducing the total wait time for the user.
- **Rich Media Extraction:** Expand the scraper to extract company logos, founder headshots, and other relevant images and inject them into final business plan display and the PDF export to create a more polished document instead of just plain text.
