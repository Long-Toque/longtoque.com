'use client'

import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export default function EventCreator() {
  const [description, setDescription] = useState('');
  const [ticketLink, setTicketLink] = useState('');
  const [generatedString, setGeneratedString] = useState('');

  const handleGenerate = () => {
    const data = {
      body: description,
      link: ticketLink
    };
    const jsonString = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(jsonString)));
    setGeneratedString(base64);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#A65D5D]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-serif font-bold text-[#8B3838] mb-8">Event Creator Tool</h1>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Rich Text / Hypertext)
              </label>
              <textarea
                id="description"
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8B3838] focus:border-[#8B3838] font-mono text-sm"
                placeholder="Write your event description here. You can use HTML tags if needed."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Tip: You can use &lt;br&gt;, &lt;b&gt;, &lt;i&gt;, &lt;a href="..."&gt; etc.
              </p>
            </div>

            <div>
              <label htmlFor="ticket-link" className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Link
              </label>
              <input
                type="url"
                id="ticket-link"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8B3838] focus:border-[#8B3838]"
                placeholder="https://example.com/tickets"
                value={ticketLink}
                onChange={(e) => setTicketLink(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full bg-[#8B3838] text-white py-3 px-4 rounded-md hover:bg-[#6B2828] transition-colors duration-200 font-bold"
            >
              Generate Description
            </button>

            {generatedString && (
              <div id="results" className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-md">
                <h2 className="text-xl font-serif font-bold text-[#8B3838] mb-4">Generated String</h2>
                <div className="relative">
                  <textarea
                    readOnly
                    className="w-full p-3 bg-white border border-gray-300 rounded font-mono text-sm break-all"
                    rows={4}
                    value={generatedString}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedString)}
                    className="mt-2 text-sm text-[#8B3838] hover:underline"
                  >
                    Copy to clipboard
                  </button>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-bold text-gray-800 mb-2">Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Copy the encoded string above.</li>
                    <li>Open your Google Calendar event.</li>
                    <li>Paste this string directly into the <strong>Description</strong> field of the event.</li>
                    <li><strong>Important:</strong> Ensure the string is the ONLY content in the description field for the website to correctly parse the link.</li>
                    <li>Save the event.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
