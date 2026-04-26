
import { checkRobotsPermission } from '@/lib/robotsCheck';
import { crawler } from '@/lib/scraper';
import { NextResponse } from 'next/server';

function normalizeUrl(url: string): string {
    url = url.replace(/\/$/, '');
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
}

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url } = body;
        if (!url) {
            return NextResponse.json({ allowed: false, message: 'Please enter a valid URL.' }, { status: 400 });
        }

        const normalizedURL = normalizeUrl(url);
        const targetURL = new URL(normalizedURL);
        const baseDomain = targetURL.origin;

        const robotsResult = await checkRobotsPermission(baseDomain);

        if (!robotsResult.allowed) {
            return NextResponse.json(robotsResult, { status: 403 });
        }

        console.log(`\nStarting crawl for: ${normalizedURL}\n`);
        const scrapedContent = await crawler(normalizedURL);

        return NextResponse.json({
            allowed: true,
            message: 'Scraping completed successfully.',
            rawText: scrapedContent,
            rawContentLength: scrapedContent.length,
            rawContentPreview: scrapedContent.substring(0, 500) + "..."
        }, { status: 200 });

    } catch (error: any) {
        if (error.message === "SCRAPING_BLOCKED") {
            return NextResponse.json({
                allowed: false,
                message: "The website's security firewall blocked our scraper. Please use the alternative input methods below.",
                suggestions: [
                    "Company description and history",
                    "Mission and vision statements",
                    "Product/service descriptions with pricing",
                    "Team member names and roles",
                    "Office locations and contact details",
                    "Key achievements or milestones"
                ]
            });
        }

        console.error('Unexpected scraping error:', error);
        return NextResponse.json({
            allowed: false,
            message: 'An unexpected error occurred while scraping the website.'
        }, { status: 500 });
    }
}