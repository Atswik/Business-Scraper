import { BusinessPlan } from "@/types/BusinessPlan";
import { useEffect, useState } from "react";
import SectionCard from "./SectionCard";
import { EditableField } from "./EditableField";

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: BusinessPlan | null;
    onSave: (updatedPlan: BusinessPlan) => void;
}

export default function PreviewModal({ isOpen, onClose, data, onSave }: PreviewModalProps) {
    if (!isOpen || !data) return null;

    const [editedPlan, setEditedPlan] = useState<BusinessPlan | null>(data);

    const updateSection = (section: keyof BusinessPlan, field: string | null, newValue: any) => {
        setEditedPlan(prev => {
            if (!prev) return prev;
            if (!field) {
                return {
                    ...prev,
                    [section]: newValue
                };
            }

            return {
                ...prev,
                [section]: {
                    ...(prev[section] as any),
                    [field]: newValue
                }
            }
        });
    }

    useEffect(() => {
        if (data) {
            setEditedPlan(JSON.parse(JSON.stringify(data)));
        }
    }, [data, isOpen]);

    if (!isOpen || !editedPlan) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs print:static print:bg-white print:p-0 print:block print:h-auto print:w-full">

            <div className="bg-gray-100 rounded-2xl shadow-2xl pt-6 px-2 w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:p-0 print:shadow-none print:rounded-none print:max-h-none print:max-w-none print:bg-white print:overflow-visible print:block print:h-auto print:w-full">

                <div className="px-4 border-0 border-red-500 flex justify-between items-center mb-2 print:border-none print:pb-0 print:hidden">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Review & Edit Business Plan</h2>
                        <p className="text-red-600/90 font-medium">
                            Please fill in any missing fields highlighted in red.
                        </p>
                    </div>

                    <button onClick={onClose} className="text-zinc-700 cursor-pointer hover:bg-zinc-50 p-2 rounded-full focus:outline-none print:hidden">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 overflow-y-auto space-y-6 print:overflow-visible print:p-0 print:block print:h-auto mt-4">

                    <SectionCard title="Company Overview">
                        <div>
                            <EditableField label={"Company Name"} value={editedPlan.companyOverview?.name} type="text" onChange={(val) => updateSection('companyOverview', 'name', val)} />
                            <EditableField label={"Location"} value={editedPlan.companyOverview?.location} type="text" onChange={(val) => updateSection('companyOverview', 'location', val)} />
                            <EditableField label={"Legal Structure"} value={editedPlan.companyOverview?.legalStructure} type="text" onChange={(val) => updateSection('companyOverview', 'legalStructure', val)} />
                            <EditableField label={"Mission Statement"} value={editedPlan.companyOverview?.missionStatement} type="textarea" onChange={(val) => updateSection('companyOverview', 'missionStatement', val)} />
                            <EditableField label={"Vision Statement"} value={editedPlan.companyOverview?.visionStatement} type="textarea" onChange={(val) => updateSection('companyOverview', 'visionStatement', val)} />
                            <EditableField label={"Founders"} value={editedPlan.companyOverview?.founders} type="object-array" onChange={(val) => updateSection('companyOverview', 'founders', val)} objectSchema={[
                                { key: 'name', label: 'Name', type: 'text' },
                                { key: 'role', label: 'Role', type: 'text' },
                                { key: 'background', label: 'Background', type: 'textarea' }
                            ]} />
                            <EditableField label={"Goals and Inspiration"} value={editedPlan.companyOverview?.goalsAndInspiration} type="textarea" onChange={(val) => updateSection('companyOverview', 'goalsAndInspiration', val)} />
                        </div>
                    </SectionCard>

                    <SectionCard title="Market Analysis">
                        <div>
                            <EditableField label={"Industry Overview"} value={editedPlan.marketAnalysis?.industryOverview} type="text" onChange={(val) => updateSection('marketAnalysis', 'industryOverview', val)} />
                            <EditableField label={"Target Market"} value={editedPlan.marketAnalysis?.targetMarket} type="textarea" onChange={(val) => updateSection('marketAnalysis', 'targetMarket', val)} />
                            <EditableField label={"Competitive Analysis"} value={editedPlan.marketAnalysis?.competitiveAnalysis} type="textarea" onChange={(val) => updateSection('marketAnalysis', 'competitiveAnalysis', val)} />
                            <EditableField label={"Market Trends"} value={editedPlan.marketAnalysis?.marketTrends} type="string-array" onChange={(val) => updateSection('marketAnalysis', 'marketTrends', val)} />
                            <EditableField label={"Key Assumptions"} value={editedPlan.marketAnalysis?.keyAssumptions} type="string-array" onChange={(val) => updateSection('marketAnalysis', 'keyAssumptions', val)} />
                        </div>
                    </SectionCard>

                    <SectionCard title="Products and Services">

                        <div>
                            <EditableField label={"Products/Services"} value={editedPlan.productsAndServices} type="object-array" onChange={(val) => updateSection('productsAndServices', null, val)} objectSchema={[
                                { key: 'description', label: 'Description', type: 'textarea' },
                                { key: 'pricing', label: 'Pricing', type: 'textarea' },
                                { key: 'uniqueValueProposition', label: 'Unique Value Proposition', type: 'textarea' },
                                { key: 'lifecycle', label: 'Lifecycle Stage', type: 'text' }
                            ]} />
                        </div>
                    </SectionCard>

                    <SectionCard title="Marketing and Sales">
                        <div>
                            <EditableField label={"Marketing Channels"} value={editedPlan.marketingAndSales?.marketingChannels} type="string-array" onChange={(val) => updateSection('marketingAndSales', 'marketingChannels', val)} />
                            <EditableField label={"Sales Strategy"} value={editedPlan.marketingAndSales?.salesStrategy} type="textarea" onChange={(val) => updateSection('marketingAndSales', 'salesStrategy', val)} />
                        </div>
                    </SectionCard>

                    <SectionCard title="Operations">
                        <div>
                            <EditableField label={"Production Process"} value={editedPlan.operations?.productionProcess} type="textarea" onChange={(val) => updateSection('operations', 'productionProcess', val)} />
                            <EditableField label={"Suppliers"} value={editedPlan.operations?.suppliers} type="string-array" onChange={(val) => updateSection('operations', 'suppliers', val)} />
                            <EditableField label={"Facilities"} value={editedPlan.operations?.facilities} type="string-array" onChange={(val) => updateSection('operations', 'facilities', val)} />
                            <div>
                                <h2 className="block text-zinc-500 mb-1">Staffing Plan</h2>
                                <div className="px-2 flex flex-wrap">
                                    <EditableField
                                        label={"Key Roles"}
                                        value={editedPlan.operations?.staffingPlan?.roles}
                                        type="string-array"
                                        onChange={(val) => setEditedPlan(prev => {
                                            if (!prev) return prev;
                                            const roles = Array.isArray(val) ? val : (val ? [val] : []);
                                            return {
                                                ...prev,
                                                operations: {
                                                    ...prev.operations,
                                                    staffingPlan: { ...(prev.operations?.staffingPlan || {}), roles }
                                                }
                                            }
                                        })}
                                    />

                                    <EditableField
                                        label={"Recruitment Strategy"}
                                        value={editedPlan.operations?.staffingPlan?.recruitmentStrategy}
                                        type="textarea"
                                        onChange={(val) => setEditedPlan(prev => {
                                            if (!prev) return prev;
                                            const recruitmentStrategy = typeof val === 'string' ? val : '';
                                            return {
                                                ...prev,
                                                operations: {
                                                    ...prev.operations,
                                                    staffingPlan: { ...(prev.operations?.staffingPlan || { roles: [] }), recruitmentStrategy }
                                                }
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Risk Analysis">
                        <div>
                            <EditableField label={"Risks"} value={editedPlan.riskAnalysis?.risks} type="string-array" onChange={(val) => updateSection('riskAnalysis', 'risks', val)} />
                            <EditableField label={"Mitigation Strategies"} value={editedPlan.riskAnalysis?.mitigationStrategies} type="string-array" onChange={(val) => updateSection('riskAnalysis', 'mitigationStrategies', val)} />
                        </div>
                    </SectionCard>

                    <SectionCard title="Milestones">
                        <div>
                            <EditableField label={"Key Milestones"} value={editedPlan.milestones?.keyMilestones} type="string-array" onChange={(val) => updateSection('milestones', 'keyMilestones', val)} />
                            <EditableField label={"Metrics"} value={editedPlan.milestones?.metrics} type="string-array" onChange={(val) => updateSection('milestones', 'metrics', val)} />
                        </div>
                    </SectionCard>
                </div>

                <div className="px-6 py-4 gap-4 flex justify-end print:hidden">
                    <button
                        onClick={() => {
                            if (editedPlan) {
                                onSave(editedPlan);
                                onClose();
                            }
                        }}
                        className="px-6 py-2 cursor-pointer bg-emerald-500 text-white rounded-md hover:bg-emerald-600 font-medium transition-colors shadow-sm"
                    >
                        Apply
                    </button>
                </div>

            </div>
        </div>
    );
}