import { extractBusinessInfo } from "@/lib/aiExtractor";
import { NextResponse } from "next/server";

export const config = {
    maxDuration: 60, // seconds
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text } = body;

        // console.log("\nReceived text for extraction (length:", text.length, ")\n");

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Invalid input. Please provide a valid text.' }, { status: 400 });
        }

        const businessPlan = await extractBusinessInfo(text);

        return NextResponse.json({
            message: 'Business plan extracted successfully.',
            businessPlan
        }, { status: 200 });


    } catch (error) {
        console.error('Error in extract route:', error);
        return NextResponse.json({ error: 'An error occurred while extracting business information.' }, { status: 500 });
    }
}
