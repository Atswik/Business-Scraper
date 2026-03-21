
import OpenAI from "openai";
import { BusinessPlan, createEmptyBusinessPlan } from "@/types/BusinessPlan";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const EXTRACTION_PROMPT = `You are an AI assistant extracting structured business information from website content.

RULES:
1. Extract only factual information found in the content.
2. Use the exact string "NOT_FOUND" for any string field where the information is missing or cannot be reasonably inferred.
3. Return an empty array [] for any array/list field where the information is missing.
4. Ignore template/placeholder text like "Coming soon", "Lorem ipsum", or "Add your text here".
5. Make reasonable inferences when possible (e.g., inferring the target market or industry from product descriptions).
6. Output ONLY a raw, valid JSON object. Do not wrap the response in markdown code blocks (e.g., no \`\`\`json).

Extract information matching this EXACT JSON structure:
{
  "companyOverview": {
    "name": "string or NOT_FOUND",
    "legalStructure": "string or NOT_FOUND",
    "location": "string or NOT_FOUND",
    "missionStatement": "string or NOT_FOUND",
    "visionStatement": "string or NOT_FOUND",
    "founders": [
      {
        "name": "string",
        "role": "string",
        "background": "string or NOT_FOUND"
      }
    ],
    "goalsAndInspiration": "string or NOT_FOUND"
  },
  "marketAnalysis": {
    "industryOverview": "string or NOT_FOUND",
    "targetMarket": "string or NOT_FOUND",
    "competitiveAnalysis": "string or NOT_FOUND",
    "marketTrends": ["string"],
    "keyAssumptions": ["string"]
  },
  "productsAndServices": [
    {
      "description": "string",
      "pricing": "string or NOT_FOUND",
      "uniqueValueProposition": "string or NOT_FOUND",
      "lifecycle": "string or NOT_FOUND"
    }
  ],
  "marketingAndSales": {
    "marketingChannels": ["string"],
    "salesStrategy": "string or NOT_FOUND"
  },
  "operations": {
    "productionProcess": "string or NOT_FOUND",
    "suppliers": ["string"],
    "facilities": ["string"],
    "staffingPlan": {
      "roles": ["string"],
      "recruitmentStrategy": "string or NOT_FOUND"
    }
  },
  "riskAnalysis": {
    "risks": ["string"],
    "mitigationStrategies": ["string"]
  },
  "milestones": {
    "keyMilestones": ["string"],
    "metrics": ["string"]
  }
}`;


function chunkText(text: string, maxChars: number = 12000): string[] {
    const chunks: string[] = [];
    let currentIndex = 0;

    while (currentIndex < text.length) {
        let endIndex = currentIndex + maxChars;
        if (endIndex < text.length) {
            const lastPeriod = text.lastIndexOf('.', endIndex);
            if (lastPeriod > currentIndex) {
                endIndex = lastPeriod + 1;
            }
        }
        chunks.push(text.slice(currentIndex, endIndex));
        currentIndex = endIndex;
    }

    return chunks;
}

function mergeBusinessPlans(plans: BusinessPlan[]): BusinessPlan {
    const masterPlan = createEmptyBusinessPlan();

    const isBetterData = (current: any, incoming: any) => {
        if (!incoming || incoming === "NOT_FOUND" || incoming === "") return false;
        if (current === "NOT_FOUND" || current === "") return true;
        return false;
    }

    plans.forEach(plan => {
        if (plan.companyOverview) {
            if (isBetterData(masterPlan.companyOverview.name, plan.companyOverview.name)) {
                masterPlan.companyOverview.name = plan.companyOverview.name;
            }
            if (isBetterData(masterPlan.companyOverview.legalStructure, plan.companyOverview.legalStructure)) {
                masterPlan.companyOverview.legalStructure = plan.companyOverview.legalStructure;
            }
            if (isBetterData(masterPlan.companyOverview.location, plan.companyOverview.location)) {
                masterPlan.companyOverview.location = plan.companyOverview.location;
            }
            if (isBetterData(masterPlan.companyOverview.missionStatement, plan.companyOverview.missionStatement)) {
                masterPlan.companyOverview.missionStatement = plan.companyOverview.missionStatement;
            }
            if (isBetterData(masterPlan.companyOverview.visionStatement, plan.companyOverview.visionStatement)) {
                masterPlan.companyOverview.visionStatement = plan.companyOverview.visionStatement;
            }
            if (plan.companyOverview.founders && plan.companyOverview.founders.length > 0) {
                masterPlan.companyOverview.founders = [...(masterPlan.companyOverview.founders || []), ...plan.companyOverview.founders.filter(f => !(masterPlan.companyOverview.founders || []).some(existing => existing.name === f.name))];
            }
            if (isBetterData(masterPlan.companyOverview.goalsAndInspiration, plan.companyOverview.goalsAndInspiration)) {
                masterPlan.companyOverview.goalsAndInspiration = plan.companyOverview.goalsAndInspiration;
            }
        }

        if (plan.marketAnalysis) {
            if (isBetterData(masterPlan.marketAnalysis.industryOverview, plan.marketAnalysis.industryOverview)) {
                masterPlan.marketAnalysis.industryOverview = plan.marketAnalysis.industryOverview;
            }
            if (isBetterData(masterPlan.marketAnalysis.targetMarket, plan.marketAnalysis.targetMarket)) {
                masterPlan.marketAnalysis.targetMarket = plan.marketAnalysis.targetMarket;
            }
            if (isBetterData(masterPlan.marketAnalysis.competitiveAnalysis, plan.marketAnalysis.competitiveAnalysis)) {
                masterPlan.marketAnalysis.competitiveAnalysis = plan.marketAnalysis.competitiveAnalysis;
            }
            if (plan.marketAnalysis.marketTrends && plan.marketAnalysis.marketTrends.length > 0) {
                masterPlan.marketAnalysis.marketTrends = [...(masterPlan.marketAnalysis.marketTrends || []), ...plan.marketAnalysis.marketTrends.filter(trend => !(masterPlan.marketAnalysis.marketTrends || []).includes(trend))];
            }
            if (plan.marketAnalysis.keyAssumptions && plan.marketAnalysis.keyAssumptions.length > 0) {
                masterPlan.marketAnalysis.keyAssumptions = [...(masterPlan.marketAnalysis.keyAssumptions || []), ...plan.marketAnalysis.keyAssumptions.filter(assumption => !(masterPlan.marketAnalysis.keyAssumptions || []).includes(assumption))];
            }
        }

        if (plan.productsAndServices && plan.productsAndServices.length > 0) {
            masterPlan.productsAndServices = [...(masterPlan.productsAndServices || []), ...plan.productsAndServices.filter(product => !(masterPlan.productsAndServices || []).some(existing => existing.description === product.description))];
        }

        if (plan.marketingAndSales) {
            if (!masterPlan.marketingAndSales) {
                masterPlan.marketingAndSales = { marketingChannels: [], salesStrategy: "NOT_FOUND" };
            }

            if (plan.marketingAndSales.marketingChannels && plan.marketingAndSales.marketingChannels.length > 0) {
                if (masterPlan.marketingAndSales) {
                    masterPlan.marketingAndSales.marketingChannels = [...(masterPlan.marketingAndSales?.marketingChannels || []), ...plan.marketingAndSales.marketingChannels.filter(channel => !(masterPlan.marketingAndSales?.marketingChannels || []).includes(channel))];
                }
            }

            if (isBetterData(masterPlan.marketingAndSales.salesStrategy, plan.marketingAndSales.salesStrategy)) {
                masterPlan.marketingAndSales.salesStrategy = plan.marketingAndSales.salesStrategy;
            }
        }

        if (plan.operations) {
            if (isBetterData(masterPlan.operations?.productionProcess, plan.operations.productionProcess)) {
                if (!masterPlan.operations) {
                    masterPlan.operations = { productionProcess: "NOT_FOUND", suppliers: [], facilities: [], staffingPlan: { roles: [], recruitmentStrategy: "NOT_FOUND" } };
                }
                masterPlan.operations.productionProcess = plan.operations.productionProcess;
            }
            if (plan.operations.suppliers && plan.operations.suppliers.length > 0) {
                if (!masterPlan.operations) {
                    masterPlan.operations = { productionProcess: "NOT_FOUND", suppliers: [], facilities: [], staffingPlan: { roles: [], recruitmentStrategy: "NOT_FOUND" } };
                }
                masterPlan.operations.suppliers = [...(masterPlan.operations.suppliers || []), ...plan.operations.suppliers.filter(supplier => !(masterPlan.operations?.suppliers || []).includes(supplier))];
            }
            if (plan.operations.facilities && plan.operations.facilities.length > 0) {
                if (!masterPlan.operations) {
                    masterPlan.operations = { productionProcess: "NOT_FOUND", suppliers: [], facilities: [], staffingPlan: { roles: [], recruitmentStrategy: "NOT_FOUND" } };
                }
                masterPlan.operations.facilities = [...(masterPlan.operations.facilities || []), ...plan.operations.facilities.filter(facility => !(masterPlan.operations?.facilities || []).includes(facility))];
            }
            if (plan.operations.staffingPlan) {
                if (!masterPlan.operations) {
                    masterPlan.operations = { productionProcess: "NOT_FOUND", suppliers: [], facilities: [], staffingPlan: { roles: [], recruitmentStrategy: "NOT_FOUND" } };
                }
                if (plan.operations.staffingPlan.roles && plan.operations.staffingPlan.roles.length > 0) {
                    if (masterPlan.operations?.staffingPlan) {
                        masterPlan.operations.staffingPlan.roles = [...(masterPlan.operations.staffingPlan.roles || []), ...plan.operations.staffingPlan.roles.filter(role => !(masterPlan.operations?.staffingPlan?.roles || []).includes(role))];
                    }
                }
                if (masterPlan.operations?.staffingPlan && isBetterData(masterPlan.operations.staffingPlan.recruitmentStrategy, plan.operations.staffingPlan.recruitmentStrategy)) {
                    masterPlan.operations.staffingPlan.recruitmentStrategy = plan.operations.staffingPlan.recruitmentStrategy;
                }
            }
        }

        if (plan.riskAnalysis) {
            if (plan.riskAnalysis.risks && plan.riskAnalysis.risks.length > 0) {
                masterPlan.riskAnalysis = masterPlan.riskAnalysis || { risks: [], mitigationStrategies: [] };
                masterPlan.riskAnalysis.risks = [...(masterPlan.riskAnalysis.risks || []), ...plan.riskAnalysis.risks.filter(risk => !(masterPlan.riskAnalysis?.risks || []).includes(risk))];
            }
            if (plan.riskAnalysis.mitigationStrategies && plan.riskAnalysis.mitigationStrategies.length > 0) {
                masterPlan.riskAnalysis = masterPlan.riskAnalysis || { risks: [], mitigationStrategies: [] };
                masterPlan.riskAnalysis.mitigationStrategies = [...(masterPlan.riskAnalysis.mitigationStrategies || []), ...plan.riskAnalysis.mitigationStrategies.filter(strategy => !(masterPlan.riskAnalysis?.mitigationStrategies || []).includes(strategy))];
            }
        }

        if (plan.milestones) {
            if (plan.milestones.keyMilestones && plan.milestones.keyMilestones.length > 0) {
                masterPlan.milestones = masterPlan.milestones || { keyMilestones: [], metrics: [] };
                masterPlan.milestones.keyMilestones = [...(masterPlan.milestones.keyMilestones || []), ...plan.milestones.keyMilestones.filter(milestone => !(masterPlan.milestones?.keyMilestones || []).includes(milestone))];
            }
            if (plan.milestones.metrics && plan.milestones.metrics.length > 0) {
                masterPlan.milestones = masterPlan.milestones || { keyMilestones: [], metrics: [] };
                masterPlan.milestones.metrics = [...(masterPlan.milestones.metrics || []), ...plan.milestones.metrics.filter(metric => !(masterPlan.milestones?.metrics || []).includes(metric))];
            }
        }
    });

    return masterPlan;
}

export async function extractBusinessInfo(scrapedText: string): Promise<BusinessPlan> {
    const chunks = chunkText(scrapedText);
    const partialPlans: BusinessPlan[] = [];

    for (let i = 0; i < chunks.length; i++) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                response_format: {
                    type: "json_object",
                },
                messages: [
                    { role: "system", content: EXTRACTION_PROMPT },
                    { role: "user", content: `Here is the website content to extract from:\n\n${chunks[i]}` }
                ],
                temperature: 0.1
            })

            const jsonString = response.choices[0].message.content;
            if (jsonString) {
                partialPlans.push(JSON.parse(jsonString) as BusinessPlan);
            }
        } catch (error) {
            console.error("Error occurred while extracting business info:", error);
        }
    }

    const finalPlan = mergeBusinessPlans(partialPlans);
    return finalPlan;
}