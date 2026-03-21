
type FieldType = 'text' | 'textarea' | 'string-array' | 'object-array';

export interface ObjectSchemaItem {
    key: string;
    label: string;
    type: 'text' | 'textarea';
}

interface EditableFieldProps {
    label: string;
    value: any
    type: FieldType;
    onChange?: (newValue: string | string[]) => void;
    objectSchema?: ObjectSchemaItem[];
}

export function EditableField({ label, value, type, onChange, objectSchema }: EditableFieldProps) {

    const isNotFound = !value || value === "NOT_FOUND" || (Array.isArray(value) && value.length === 0);
    const displayValue = Array.isArray(value) ? value.join('\n') : (value || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!onChange) return;
        if (type === 'string-array') {
            const arr = e.target.value.split('\n');
            onChange(arr);
        } else {
            onChange(e.target.value);
        }
    };

    const handleObjectChange = (index: number, key: string, newValue: string) => {
        if (!onChange) return;
        const updatedArray = [...(value as any[] || [])];
        updatedArray[index] = { ...updatedArray[index], [key]: newValue };
        onChange(updatedArray);
    };

    const addObject = () => {
        if (!onChange || !objectSchema) return;
        const newObj: any = {};
        objectSchema.forEach(item => newObj[item.key] = '');
        const updatedArray = [...(value as any[] || []), newObj];
        onChange(updatedArray);
    }

    const removeObject = (indexToRemove: number) => {
        if (!onChange || !objectSchema || !Array.isArray(value) || value.length === 0) return;
        const updatedArray = value.filter((_, index) => index !== indexToRemove);
        onChange(updatedArray);
    }

    const inputClasses = `w-full p-2 border rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isNotFound
        ? 'bg-red-50 border-red-300 text-red-800 placeholder-red-350'
        : 'bg-white border-gray-300 text-gray-800'
        }`;

    const editValue = isNotFound ? "" : displayValue;
    const placeholderText = isNotFound ? "Enter data here..." : "";


    // Object array editing (founders & products/services);
    if (type === 'object-array' && objectSchema) {
        return (
            <div className="mb-4">
                <label className="block text-zinc-700 mb-2">{label}</label>
                <div>
                    {(value as any[] || []).map((item: any, index: number) => (
                        <div key={index} className="mb-4 last:mb-0 py-4 px-4 rounded-md bg-zinc-50">
                            {objectSchema.map((schemaItem, objIndex) => {

                                const val = item[schemaItem.key] === "NOT_FOUND" ? "" : item[schemaItem.key] || "";

                                return (
                                    <div className="mb-4 last:mb-0" key={objIndex}>
                                        <label className="block text-zinc-700 mb-1">{schemaItem.label}</label>

                                        {schemaItem.type === 'text' ? (
                                            <input type="text" value={val} onChange={(e) => handleObjectChange(index, schemaItem.key, e.target.value)} className={inputClasses} placeholder={`Enter ${schemaItem.label.toLowerCase()}`} />
                                        ) : (
                                            <textarea value={val} onChange={(e) => handleObjectChange(index, schemaItem.key, e.target.value)} className={`${inputClasses} min-h-15`} placeholder={`Enter ${schemaItem.label.toLowerCase()}`} />
                                        )}
                                    </div>
                                );
                            })}

                            <button onClick={() => removeObject(index)} className="flex gap-1 items-center text-sm px-2 py-2 bg-red-50 text-red-700 font-medium rounded-sm hover:bg-red-100 transition-colors cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button onClick={addObject} className={`flex gap-1 items-center text-sm px-4 py-2 border ${isNotFound ? 'bg-red-50 border-red-300 text-red-800/65 hover:bg-red-100' : 'bg-amber-100/60 border-amber-200 text-zinc-600 hover:bg-amber-100'} font-medium rounded-sm transition-colors cursor-pointer`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                        </svg>
                        Add New {label.slice(0, -1)}
                    </button>
                </div>
            </div>
        )
    }

    // Regular editing fields (text or textarea);
    return (
        <div className="mb-4 last:mb-0">
            <label className="block text-zinc-700 mb-1">{label}</label>

            {type === 'text' ? (
                <input
                    type="text"
                    className={inputClasses}
                    value={editValue}
                    placeholder={placeholderText}
                    onChange={handleChange}
                />
            ) : (
                <textarea
                    className={`${inputClasses} min-h-25 min-w-lg`}
                    value={editValue}
                    placeholder={type === 'string-array' ? "Enter items separated by a new line..." : placeholderText}
                    onChange={handleChange}
                />
            )}
        </div>
    );

}