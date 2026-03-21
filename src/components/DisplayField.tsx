
type FieldType = 'text' | 'textarea' | 'string-array' | 'object-array';

export interface ObjectSchemaItem {
    key: string;
    label: string;
    type: 'text' | 'textarea';
}

interface FieldProps {
    label: string;
    value: any
    type: FieldType;
    objectSchema?: ObjectSchemaItem[];
}


export default function DisplayField({ label, value, type, objectSchema }: FieldProps) {

    const isNotFound = !value || value === "NOT_FOUND" || (Array.isArray(value) && value.length === 0);

    return (
        <div className="mb-4">
            <label className="block text-zinc-500 mb-1">{label}</label>

            <div className="py-0.5 pl-px">
                {isNotFound ? (
                    <span className="inline-block px-5 py-2 bg-red-50 border-red-300 text-red-600 text-sm rounded-sm print:p-0">
                        Not Found
                    </span>
                ) : type === 'object-array' && objectSchema && Array.isArray(value) ? (
                    <div className="flex gap-3 flex-wrap">
                        {value.map((item: any, index: number) => (
                            <div key={index} className="bg-zinc-50 py-5 px-6 w-2xs rounded-sm border border-zinc-200">
                                {objectSchema.map((schemaItem, objIndex) => {
                                    const itemVal = item[schemaItem.key];
                                    const itemIsNotFound = !itemVal || itemVal === "NOT_FOUND";
                                    return (
                                        <div key={objIndex} className="mb-2 last:mb-0">
                                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{schemaItem.label}</span>
                                            <p className={`${itemIsNotFound ? 'text-red-600' : 'text-zinc-900'}`}>
                                                {itemIsNotFound ? `Missing ${schemaItem.label}` : itemVal}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                ) : type === 'string-array' && Array.isArray(value) ? (
                    <ul className="list-disc list-inside text-zinc-900">
                        {value.map((item, id) => <li key={id}>{item}</li>)}
                    </ul>
                ) : (
                    <p className="text-zinc-900">{value}</p>
                )}
            </div>

        </div>
    );
}