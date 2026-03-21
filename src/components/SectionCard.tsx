
interface SectionCardProps {
    title: string;
    children: React.ReactNode;
}

export default function SectionCard({ title, children }: SectionCardProps) {

    return (
        <div className="mb-4 bg-white py-5 px-6 rounded-xl shadow-sm border border-zinc-100 print:p-0 print:border-none print:shadow-none">

            <h2 className="text-[22px] font-semibold mb-3">{title}</h2>
 
            <div className="animate-in fade-in duration-200 pl-px">
                {children}
            </div>

        </div >
    );
}

