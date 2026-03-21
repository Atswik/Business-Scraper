import Image from "next/image";
import spinner from '../../public/loading.svg'

interface WebsiteInputProps {
    loading: boolean;
    error: string | null;
    url: string;
    setUrl: (val: string) => void;
    handleScrape: () => void;
}

export default function WebsiteInput({ loading, error, url, setUrl, handleScrape }: WebsiteInputProps) {
    return (
        <div className='flex flex-col w-fullborder border-red-500 print:hidden'>
            <h1 className='text-xl font-medium mb-4 text-gray-800'>Extract from the website:</h1>
            <div className='flex gap-2 mb-4'>
                <input type="url" placeholder="https://www.example.com" value={url} onChange={(ev) => setUrl(ev.target.value)} className='px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all w-lg' />
                <button className='cursor-pointer px-4 py-2 border border-gray-300 rounded-sm transition-all hover:bg-gray-100 disabled:cursor-not-allowed' disabled={loading} onClick={handleScrape}>
                    {loading ? 'Extracting...' : 'Extract'}
                </button>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center mt-4 space-y-4">
                    <Image
                        src={spinner}
                        alt="Loading..."
                        width={90}
                        priority
                    />
                    <p className="text-zinc-700 animate-pulse text-lg">
                        Crawling website and analyzing with AI...&nbsp;This may take up to 30 seconds.
                    </p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-sm mb-4">
                    {error}
                </div>
            )}

        </div>
    );
}