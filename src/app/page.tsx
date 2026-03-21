'use client';

import { useState } from 'react';
import { BusinessPlan, createEmptyBusinessPlan } from '@/types/BusinessPlan';
import PreviewModal from '@/components/PreviewModal';
import BusinessPlanDisplay from '@/components/BusinessPlanDisplay';
import TextInput from '@/components/TextInput';
import WebsiteInput from '@/components/WebsiteInput';

const robotsError = 'Extraction failed due to robots.txt restrictions. Please provide the information manually.'

export default function Home() {
  const [url, setUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [businessPlan, setBusinessPlan] = useState<BusinessPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [altError, setAltError] = useState<string | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleScrape = async () => {
    if (!url) {
      setError('Please enter a valid URL.');
      return;
    }

    setShowPreview(false);
    setBusinessPlan(null);
    setLoading(true);
    setError(null);
    setShowTextInput(false);
    setSuggestions([]);

    try {
      let normalizedURL = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        normalizedURL = 'https://' + url;
        setUrl(normalizedURL);
      }

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: normalizedURL })
      });

      const data = await response.json();

      if (!data.allowed) {
        setError(data.message || robotsError);
        setSuggestions(data.suggestions || []);
        setShowTextInput(true);
        setLoading(false);
        return;
      }

      const extractedResponse = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: data.rawText })
      })

      const extractedData = await extractedResponse.json();

      console.log(extractedData);

      if (!extractedResponse.ok) {
        throw new Error(extractedData.message || 'Failed to extract data using AI.');
      }

      if (extractedResponse.ok) {
        setBusinessPlan(extractedData.businessPlan);
        setShowPreview(true);
        console.log(`Text extracted (length: ${data.rawContentLength}):`);
        console.log(data.rawContentPreview);
      }

    } catch (err) {
      console.log('Error during scraping:', err);
      setError('An error occurred while trying to extract information.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextExtract = async () => {
    if (!textContent || textContent.trim().length === 0) {
      setAltError('Please enter text content or upload .txt file to extract.');
      return;
    }

    setShowTextInput(false);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: textContent })
      });

      const extractedData = await response.json();

      if (!response.ok) {
        throw new Error(extractedData.message || 'Failed to extract data using AI.');
      }

      setBusinessPlan(extractedData.businessPlan);
      setShowPreview(true);
      console.log(extractedData);

    } catch (err) {
      console.error('Error during text extraction:', err);
      setError('An error occurred while trying to extract information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-8 px-12">
      <h1 className="text-3xl font-bold mb-8">Business Information Extractor</h1>

      {/* - URL input form */}
      <WebsiteInput
        loading={loading}
        error={error} url={url}
        setUrl={setUrl}
        handleScrape={handleScrape}
      />

      {/* - Text paste area (shown when scraping not allowed) */}
      {showTextInput && !businessPlan && (
        <TextInput
          handleTextExtract={handleTextExtract}
          suggestions={suggestions} altError={altError}
          setAltError={setAltError} textContent={textContent}
          setTextContent={setTextContent}
        />
      )}

      {/* - Preview modal */}
      {showPreview && (
        <PreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)}
          data={businessPlan || createEmptyBusinessPlan()}
          onSave={(updatedPlan: BusinessPlan) => {
            setBusinessPlan(updatedPlan);
            setShowPreview(false);
          }} />
      )}

      {/* - Final business plan display */}
      {businessPlan && !showPreview && (
        <BusinessPlanDisplay setShowPreview={setShowPreview} plan={businessPlan} />
      )}

    </main>
  );
}