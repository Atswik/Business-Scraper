
import { useState } from 'react';

interface TextInputProps {
    suggestions: string[];
    altError: string | null;
    setAltError: (value: string | null) => void;
    textContent: string;
    setTextContent: (value: string) => void;
    handleTextExtract: () => void;
}

export default function TextInput({ suggestions, altError, setAltError, textContent, setTextContent, handleTextExtract }: TextInputProps) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setTextContent(content);
            setUploadedFile(file)
            setAltError(null);
        };
        reader.onerror = () => {
            setAltError('Failed to read file');
        };
        reader.readAsText(file);
    };

    const removeFile = () => {
        setUploadedFile(null);
        setTextContent('');
        setAltError(null);
    }

    return (
        <div>
            <h1 className='text-xl font-medium mb-3 text-gray-800'>Provide business information manually:</h1>
            <p className="text-zinc-600 mb-4">
                If scraping is not permitted, please paste the content directly
            </p>
            {suggestions.length > 0 && (
                <div>
                    <strong className="block mb-2">Suggested content to paste:</strong>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                        {suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
            )}

            {uploadedFile ? (
                <div className="flex items-center justify-between w-full max-w-lg p-4 border border-indigo-200 bg-indigo-50 rounded-md mb-4 transition-opacity">
                    <div className="flex items-center space-x-3">
                        <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>

                        <div>
                            <p className="text-sm font-bold text-indigo-900">{uploadedFile.name}</p>
                            <p className="text-xs text-indigo-600 font-medium">
                                {(uploadedFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={removeFile}
                        className="text-indigo-400 transition-colors p-2 rounded-full hover:bg-indigo-100 cursor-pointer"
                        title="Remove file"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div>
                    <textarea
                        placeholder="Copy & paste the information here from the website..."
                        value={textContent}
                        onChange={(ev) => setTextContent(ev.target.value)}
                        className='px-3 py-2 border border-gray-300 rounded-sm transition-all w-full h-32 mb-2'
                    />

                    <p className="text-zinc-600 mb-4">
                        Or upload a .txt file <span className='text-zinc-400'>(only .txt files supported)</span>
                    </p>

                    <label className="flex items-center w-sm justify-center px-4 py-12 border-2 mb-4 border-dashed border-gray-300 rounded-sm cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">

                        <div className="text-center">
                            <p className="text-md font-medium text-gray-700">
                                Click to upload a file
                            </p>
                        </div>

                        <input
                            type="file"
                            accept=".txt"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(e.target.files[0]);
                                }
                            }}
                            className="hidden"
                        />
                    </label>
                </div>
            )}

            {altError && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-sm mb-4">
                    {altError}
                </div>
            )}

            <button className='cursor-pointer px-4 py-2 border border-gray-300 rounded-sm transition-all hover:bg-zinc-100' onClick={handleTextExtract}>
                Extract via AI
            </button>
        </div >
    );
}