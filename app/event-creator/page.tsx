'use client'

import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { EventCard } from '../components/EventCard';

export default function EventCreator() {
  const [description, setDescription] = useState('<p>Write your event description here.</p>');
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

  const placeholderEvent = {
    title: "Example Event Title",
    date: "Monday, January 1, 2026",
    time: "7:00 PM",
    location: "The Long Toque Club, 123 Music Lane"
  };

  return (
    <div className="min-h-screen bg-[#A65D5D]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-[#8B3838] rounded-lg shadow-xl p-8 border border-[#6B2828]">
          <h1 className="text-3xl font-serif font-bold text-white mb-8 text-center">Event Creator Tool</h1>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg overflow-hidden">
              <label className="block text-sm font-bold text-[#8B3838] mb-2 px-4 pt-3">
                Event Description (Rich Text)
              </label>
              <div>
                <SimpleEditor 
                  initialContent={description} 
                  onContentChange={setDescription}
                  variant="embedded"
                  showImageButton={false}
                  showThemeToggle={false}
                />
              </div>
            </div>

            <div>
              <label htmlFor="ticket-link" className="block text-sm font-medium text-gray-200 mb-2">
                Ticket Link
              </label>
              <input
                type="url"
                id="ticket-link"
                className="w-full px-4 py-3 bg-[#6B2828] border border-[#8B3838] rounded-md shadow-sm focus:ring-white focus:border-white text-white placeholder-gray-400"
                placeholder="https://example.com/tickets"
                value={ticketLink}
                onChange={(e) => setTicketLink(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full bg-[#6B2828] text-white py-4 px-6 rounded-md hover:bg-[#5A1F1F] border border-[#8B3838] transition-colors duration-200 font-bold text-lg shadow-lg"
            >
              Generate Description String
            </button>

            {/* Live Preview Section */}
            <div className="mt-12">
              <h2 className="text-xl font-serif font-bold text-gray-200 mb-4 border-b border-[#6B2828] pb-2">Live Preview</h2>
              <EventCard
                title={placeholderEvent.title}
                date={placeholderEvent.date}
                time={placeholderEvent.time}
                location={placeholderEvent.location}
                descriptionHtml={description}
                ticketLink={ticketLink || undefined}
                showAddToCalendar
                readOnlyActions
                containerClassName="bg-[#6B2828] border border-[#5A1F1F] shadow-inner"
                titleClassName="text-2xl"
                descriptionClassName="border-t border-[#8B3838] pt-4"
              />
            </div>

            {generatedString && (
              <div id="results" className="mt-12 p-8 bg-[#5A1F1F] border border-[#6B2828] rounded-lg shadow-2xl">
                <h2 className="text-2xl font-serif font-bold text-white mb-6">Generated String</h2>
                <p className="text-gray-300 mb-4 text-sm font-sans">Copy this string and paste it into your Google Calendar event description.</p>
                <div className="relative">
                  <textarea
                    readOnly
                    className="w-full p-4 bg-[#6B2828] border border-[#8B3838] rounded text-white font-mono text-xs break-all h-32"
                    value={generatedString}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedString);
                      alert('Copied to clipboard!');
                    }}
                    className="mt-3 px-4 py-2 bg-white text-[#8B3838] rounded font-bold text-sm hover:bg-gray-100 transition-colors font-sans"
                  >
                    Copy to clipboard
                  </button>
                </div>
                
                <div className="mt-8 bg-[#6B2828] p-6 rounded-md border border-[#8B3838]">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2 font-serif">
                    <span className="bg-white text-[#8B3838] w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans">i</span>
                    Instructions:
                  </h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-200 text-sm font-sans">
                    <li>Copy the encoded string above.</li>
                    <li>Open your Google Calendar event.</li>
                    <li>Paste this string directly into the <strong>Description</strong> field of the event.</li>
                    <li><strong>Important:</strong> Ensure the string is the ONLY content in the description field.</li>
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
