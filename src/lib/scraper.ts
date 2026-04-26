
import * as cheerio from 'cheerio';
import axios from 'axios';
import { chromium as playwright, Browser } from 'playwright-core';
import chromium from '@sparticuz/chromium';

const ACCEPTABLE_KEYWORDS = [
    'about', 'about-us', 'our-story',
    'team', 'leadership', 'founders',
    'products', 'services', 'how-it-works',
    'contact', 'locations', 'company'
];

export function prioritizeURLs(urls: string[]): string[] {
    const important = ['about', 'about-us', 'our-story', 'story', 'products', 'services', 'team', 'leadership', 'founders', 'contact', 'locations', 'how-it-works'];
    return urls.sort((a, b) => {
        const aScore = important.some(keyword => a.toLowerCase().includes(keyword)) ? 1 : 0;
        const bScore = important.some(keyword => b.toLowerCase().includes(keyword)) ? 1 : 0;
        return bScore - aScore;
    });
}

async function scrapeWithPlaywright(url: string, baseDomain: string): Promise<{ content: string, links: string[] }> {
    let browser: Browser | null = null;
    try {
        browser = await playwright.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });

        const result = await page.evaluate((domain) => {
            const links = Array.from(document.querySelectorAll('a'))
                .map(a => a.href.replace(/\/$/, ''))
                .filter(href => href && href.startsWith(domain));

            const noise = document.querySelectorAll('nav, footer, aside, header, .ads, .cookie-consent, .popup, .modal, script, style, [role="navigation"], .cookie-banner, .newsletter-signup, picture, img, svg, video, canvas, iframe, noscript, figure');
            noise.forEach(el => el.remove());

            const main = document.querySelector('main') || document.querySelector('article') || document.querySelector('#content') || document.body;
            const content = main ? (main as HTMLElement).innerText : '';
            return { content, urls: links };
        }, baseDomain);

        return {
            content: result.content.replace(/\s+/g, ' ').trim(),
            links: Array.from(new Set(result.urls)).slice(0, 10)
        }

    } catch (error) {
        console.error('Error scraping page:', error);
        return { content: '', links: [] };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

export async function scrapeWebsite(url: string, baseDomain: string): Promise<{ content: string, links: string[] }> {
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            }
        });

        const $ = cheerio.load(response.data);

        const bodyTextLength = $('body').text().trim().length;

        const hasRootDiv =
            $('#root').length > 0 ||
            $('#app').length > 0 ||
            $('#__next').length > 0 ||
            $('[data-reactroot]').length > 0 ||
            $('app-root').length > 0;

        let content = '';
        let uniqueLinks: string[] = [];

        if (bodyTextLength < 500 && hasRootDiv) {
            console.log("Detected SPA/JS-rendered site. Using Playwright for scraping...");
            const playwrightResult = await scrapeWithPlaywright(url, baseDomain);
            content = playwrightResult.content;
            uniqueLinks = playwrightResult.links;

        } else {
            console.log("Detected Static/SSR site. Parsing HTML for...", url);
            $('nav, footer, aside, header, .ads, .cookie-consent, .popup, .modal, script, style, [role="navigation"], .cookie-banner, .newsletter-signup, picture, img, svg, video, canvas, iframe, noscript, figure').remove();
            content = $('main, article, #content, .content, .post, .entry').text() || $('body').text();
            content = content.replace(/\s+/g, ' ').trim();

            const extractedLinks = $('a')
                .map((i, el) => $(el).attr('href'))
                .get()
                .filter(link =>
                    link &&
                    !link.startsWith('#') &&
                    !link.startsWith('javascript:') &&
                    !link.startsWith('mailto:') &&
                    !link.startsWith('tel:')
                )
                .filter(link =>
                    !link.match(/\.(jpg|jpeg|png|gif|pdf|zip|svg|mp4|webp|ico)$/i)
                )
                .map(link => {
                    try {
                        const urlObj = new URL(link, baseDomain);
                        return urlObj.href.replace(/\/$/, '');
                    } catch {
                        return null;
                    }
                })
                .filter(link => link && link.startsWith(baseDomain)) as string[];

            uniqueLinks = Array.from(new Set(extractedLinks)).slice(0, 10);

            const isSkeleton = content.length < 200 || uniqueLinks.length === 0;

            if (isSkeleton) {
                console.log("\nZero to little content scraped from Cheerio...")
                console.log('Falling back to Playwright...');

                const playwrightResult = await scrapeWithPlaywright(url, baseDomain);
                content = playwrightResult.content;
                uniqueLinks = playwrightResult.links;

            }
        }

        return { content, links: uniqueLinks } as { content: string, links: string[] };

    } catch (error: any) {
        if (error.response && (error.response.status === 403 || error.response.status === 429)) {
            console.log(`Axios blocked with status ${error.response.status} at ${url}.`);
            throw new Error('SCRAPING_BLOCKED');
        }
        return { content: '', links: [] };
    }
}

export async function crawler(startURL: string): Promise<string> {
    const baseDomain = new URL(startURL).origin;
    const visited = new Set<string>();
    let urlsToVisit = [startURL];
    let allContent = '';
    const maxPages = 10;

    while (urlsToVisit.length > 0 && visited.size < maxPages) {
        urlsToVisit = prioritizeURLs(urlsToVisit);

        const currentURL = urlsToVisit.shift()!;
        if (visited.has(currentURL)) continue;
        visited.add(currentURL);

        try {
            const { content, links } = await scrapeWebsite(currentURL, baseDomain);
            if (content) {
                allContent += `\n\n---Content from ${currentURL}---\n\n${content}`;
            }

            const acceptableLinks = links.filter(link => {
                const lowerLink = link.toLowerCase();
                return link.includes(baseDomain) &&
                    ACCEPTABLE_KEYWORDS.some(keyword => lowerLink.includes(keyword));
            });

            const prioritizedLinks = prioritizeURLs(acceptableLinks);

            for (const link of prioritizedLinks) {
                if (!visited.has(link) && !urlsToVisit.includes(link)) {
                    urlsToVisit.push(link);
                }
            }

        } catch (error: any) {
            if (error.message === 'SCRAPING_BLOCKED') {
                throw error;
            }
        }
    }

    // console.log(allContent)

    return allContent;
}