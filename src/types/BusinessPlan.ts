export interface Founder {
    name: string;
    role: string;
    background?: string;
}
export interface ProductOrService {
    description: string;
    pricing: string;
    uniqueValueProposition: string;
    lifecycle?: string;
}
export interface StaffingPlan {
    roles: string[];
    recruitmentStrategy?: string;
}
export interface BusinessPlan {
    companyOverview: {
        name?: string;
        legalStructure?: string;
        location?: string;
        missionStatement?: string;
        visionStatement?: string;
        founders?: Founder[];
        goalsAndInspiration?: string;
    };
    marketAnalysis: {
        industryOverview?: string;
        targetMarket?: string;
        competitiveAnalysis?: string;
        marketTrends?: string[];
        keyAssumptions?: string[];
    };
    productsAndServices?: ProductOrService[];
    marketingAndSales?: {
        marketingChannels: string[];
        salesStrategy: string;
    };
    operations?: {
        productionProcess?: string;
        suppliers?: string[];
        facilities?: string[];
        staffingPlan?: StaffingPlan;
    };
    riskAnalysis?: {
        risks: string[];
        mitigationStrategies?: string[];
    };
    milestones?: {
        keyMilestones: string[];
        metrics?: string[];
    };
}
export const createEmptyBusinessPlan = (): BusinessPlan => ({
    companyOverview: {
        name: "NOT_FOUND",
        legalStructure: "NOT_FOUND",
        location: "NOT_FOUND",
        missionStatement: "NOT_FOUND",
        visionStatement: "NOT_FOUND",
        founders: [],
        goalsAndInspiration: "NOT_FOUND",
    },
    marketAnalysis: {
        industryOverview: "NOT_FOUND",
        targetMarket: "NOT_FOUND",
        competitiveAnalysis: "NOT_FOUND",
        marketTrends: [],
        keyAssumptions: [],
    },
    productsAndServices: [],
    marketingAndSales: {
        marketingChannels: [],
        salesStrategy: "NOT_FOUND",
    },
    operations: {
        productionProcess: "NOT_FOUND",
        suppliers: [],
        facilities: [],
        staffingPlan: {
            roles: [],
            recruitmentStrategy: "NOT_FOUND",
        },
    },
    riskAnalysis: {
        risks: [],
        mitigationStrategies: [],
    },
    milestones: {
        keyMilestones: [],
        metrics: [],
    },
});