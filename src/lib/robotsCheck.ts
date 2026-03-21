import axios from 'axios';
import robotsParser from 'robots-parser';
export interface RobotsCheckResult {
    allowed: boolean;
    message?: string;
    suggestions?: string[];
}
export async function checkRobotsPermission(url: string):
    Promise<RobotsCheckResult> {
    try {
        const robotsUrl = new URL('/robots.txt', url).href;
        const response = await axios.get(robotsUrl, { timeout: 5000 });
        const robots = robotsParser(robotsUrl, response.data);
        const isAllowed = robots.isAllowed(url, '*') ?? true;
        if (!isAllowed) {
            return {
                allowed: false,
                message: "Unable to scrape this website as it's not permitted by robots.txt",
                suggestions: [
                    "Company description and history",
                    "Mission and vision statements",
                    "Product/service descriptions with pricing",
                    "Team member names and roles",
                    "Office locations and contact details",
                    "Key achievements or milestones"
                ]
            };
        }
        return { allowed: true };
    } catch (error) {
        // If robots.txt doesn't exist or can't be fetched, assume allowed
        return { allowed: true };
    }
}