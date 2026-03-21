
import { BusinessPlan } from "@/types/BusinessPlan";
import SectionCard from "./SectionCard";
import { useState } from "react";
import DisplayField from "./DisplayField";

export default function BusinessPlanDisplay({ setShowPreview, plan }: { setShowPreview: (show: boolean) => void; plan: BusinessPlan }) {

    const [editedPlan, setEditedPlan] = useState<BusinessPlan | null>(plan);

    if (!editedPlan) return null;

    return (
        <div className="mb-4">

            <div className="px-1 flex justify-between items-center mb-2 print:border-none print:pb-0 print:hidden">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Business Plan</h2>
            </div>

            <SectionCard title="Company Overview">
                <div>
                    <DisplayField label={"Company Name"} value={editedPlan.companyOverview?.name} type="text" />
                    <DisplayField label={"Location"} value={editedPlan.companyOverview?.location} type="text" />
                    <DisplayField label={"Legal Structure"} value={editedPlan.companyOverview?.legalStructure} type="text" />
                    <DisplayField label={"Mission Statement"} value={editedPlan.companyOverview?.missionStatement} type="textarea" />
                    <DisplayField label={"Vision Statement"} value={editedPlan.companyOverview?.visionStatement} type="textarea" />
                    <DisplayField label={"Founders"} value={editedPlan.companyOverview?.founders} type="object-array" objectSchema={[
                        { key: 'name', label: 'Name', type: 'text' },
                        { key: 'role', label: 'Role', type: 'text' },
                        { key: 'background', label: 'Background', type: 'textarea' }
                    ]} />
                    <DisplayField label={"Goals and Inspiration"} value={editedPlan.companyOverview?.goalsAndInspiration} type="textarea" />
                </div>
            </SectionCard>

            <SectionCard title="Market Analysis">
                <div>
                    <DisplayField label={"Industry Overview"} value={editedPlan.marketAnalysis?.industryOverview} type="text" />
                    <DisplayField label={"Target Market"} value={editedPlan.marketAnalysis?.targetMarket} type="textarea" />
                    <DisplayField label={"Competitive Analysis"} value={editedPlan.marketAnalysis?.competitiveAnalysis} type="textarea" />
                    <DisplayField label={"Market Trends"} value={editedPlan.marketAnalysis?.marketTrends} type="string-array" />
                    <DisplayField label={"Key Assumptions"} value={editedPlan.marketAnalysis?.keyAssumptions} type="string-array" />
                </div>

            </SectionCard>

            <SectionCard title="Products and Services">
                <div>
                    <DisplayField label={"Products/Services"} value={editedPlan.productsAndServices} type="object-array" objectSchema={[
                        { key: 'description', label: 'Description', type: 'textarea' },
                        { key: 'pricing', label: 'Pricing', type: 'textarea' },
                        { key: 'uniqueValueProposition', label: 'Unique Value Proposition', type: 'textarea' },
                        { key: 'lifecycle', label: 'Lifecycle Stage', type: 'text' }
                    ]} />
                </div>
            </SectionCard>

            <SectionCard title="Marketing and Sales">
                <div>
                    <DisplayField label={"Marketing Channels"} value={editedPlan.marketingAndSales?.marketingChannels} type="string-array" />
                    <DisplayField label={"Sales Strategy"} value={editedPlan.marketingAndSales?.salesStrategy} type="textarea" />
                </div>
            </SectionCard>

            <SectionCard title="Operations">
                <div>
                    <DisplayField label={"Production Process"} value={editedPlan.operations?.productionProcess} type="textarea" />
                    <DisplayField label={"Suppliers"} value={editedPlan.operations?.suppliers} type="string-array" />
                    <DisplayField label={"Facilities"} value={editedPlan.operations?.facilities} type="string-array" />
                    <div>
                        <h2 className="block text-zinc-500 mb-1">Staffing Plan</h2>
                        <div className="px-2 flex flex-wrap gap-10">
                            <DisplayField
                                label={"Key Roles"}
                                value={editedPlan.operations?.staffingPlan?.roles}
                                type="string-array"
                            />

                            <DisplayField
                                label={"Recruitment Strategy"}
                                value={editedPlan.operations?.staffingPlan?.recruitmentStrategy}
                                type="textarea"
                            />
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Risk Analysis">
                <div>
                    <DisplayField label={"Risks"} value={editedPlan.riskAnalysis?.risks} type="string-array" />
                    <DisplayField label={"Mitigation Strategies"} value={editedPlan.riskAnalysis?.mitigationStrategies} type="string-array" />
                </div>
            </SectionCard>

            <SectionCard title="Milestones">
                <div>
                    <DisplayField label={"Key Milestones"} value={editedPlan.milestones?.keyMilestones} type="string-array" />
                    <DisplayField label={"Metrics"} value={editedPlan.milestones?.metrics} type="string-array" />
                </div>
            </SectionCard>

            <div className="px-6 py-4 gap-4 flex justify-end print:hidden">
                <button
                    onClick={() => { setShowPreview(true); }}
                    className="px-6 py-2 cursor-pointer bg-white rounded-md hover:bg-zinc-50 font-medium transition-colors shadow-sm"
                >
                    Edit Business Plan
                </button>

                <button
                    onClick={() => {
                        const originalTitle = document.title;
                        const companyName = plan.companyOverview.name;
                        const cleanName = companyName?.replace(/[^a-zA-Z0-9]/g, '_');
                        document.title = `${cleanName}_Business_Plan`;

                        setTimeout(() => {
                            window.print();
                            setTimeout(() => {
                                document.title = originalTitle;
                            }, 500);
                        }, 100);
                    }}
                    className="px-6 py-2 cursor-pointer bg-emerald-500 text-white rounded-md hover:bg-emerald-600 font-medium transition-colors shadow-sm"
                >
                    Export to PDF
                </button>
            </div>
        </div>
    );
}