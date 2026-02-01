import { useState, useEffect } from 'react';
import { ImageCarousel } from './ImageCarousel';
import { UpcomingEvents } from './UpcomingEvents';

export function Stage() {
  const [activeTab, setActiveTab] = useState('didi');

  // Listen for hash changes from navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash.startsWith('stage-')) {
        const tab = hash.replace('stage-', '');
        setActiveTab(tab);
        // Scroll to the stage section
        document.getElementById('stage')?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Check on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const tabs = [
    { 
      id: 'didi', 
      label: 'DIDI',
      images: [
        'https://images.unsplash.com/photo-1761618291331-535983ae4296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3Njk3MzY2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1762786113000-fa587fd3d69c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdHJpY2FsJTIwbGlnaHRpbmclMjBzdGFnZXxlbnwxfHx8fDE3Njk3MzY2ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1698678302424-1be514d0f680?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMHBlcmZvcm1hbmNlJTIwYXJ0c3xlbnwxfHx8fDE3Njk3MzY2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      title: 'About DIDI',
      content: (
        <>
          <p className="leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p className="leading-relaxed">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
          </p>
        </>
      ),
      calendarId: 'didi'
    },
    { 
      id: 'people-you-may-know', 
      label: 'People You May Know',
      images: [
        'https://images.unsplash.com/photo-1641903806973-17eaf2d2634f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBpbXByb3YlMjBzaG93fGVufDF8fHx8MTc2OTczNjY4MHww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1759103570737-8485420df3a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdWRpZW5jZSUyMHRoZWF0ZXIlMjB2ZW51ZXxlbnwxfHx8fDE3Njk3MzY2ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1545129139-1beb780cf337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFnZSUyMGN1cnRhaW5zJTIwcmVkfGVufDF8fHx8MTc2OTczNjY4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      title: 'About People You May Know',
      content: (
        <>
          <p className="leading-relaxed">
            People You May Know perform original improv formats every two months at The Little Mountain Gallery.
          </p>
          <p className="leading-relaxed">
            They also host a free workshop (open to all skill levels) on the first Monday of every month.
            Each month, a cast member designs a workshop that tackles a particular aspect of improv, so each workshop is wholly unique.
          </p>
        </>
      ),
      calendarId: 'pymk'
    },
    { 
      id: 'grad-school-improv', 
      label: 'Grad School Improv',
      images: [
        'https://images.unsplash.com/photo-1760170437237-a3654545ab4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc2VhdHMlMjBlbXB0eXxlbnwxfHx8fDE3Njk3MzY2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1765224747170-be7b97010052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90bGlnaHQlMjBzdGFnZSUyMGRhcmt8ZW58MXx8fHwxNzY5NzM2NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1761618291331-535983ae4296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3Njk3MzY2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      title: 'About Grad School Improv',
      content: (
        <>
          <p className="leading-relaxed">
            Performing for over a decade, Grad School Improv has become a staple of Vancouver's underground comedy scene.
          </p>
          <p className="leading-relaxed">
            GSI performs on the third Friday of each month at The Little Mountain Gallery.
            They perform improvised long-form theatre spoofs of current, popular movies and TV Shows.
          </p>
        </>
      ),
      calendarId: 'gsi'
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <section id="stage" className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-300 mb-8 text-center">
          Stage
        </h2>

        {/* Tabs */}
        <div className="bg-[#8B3838] rounded-t-lg">
          <div className="flex flex-wrap border-b border-[#6B2828]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-sans transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#6B2828] text-white border-b-2 border-white'
                    : 'text-gray-200 hover:text-white hover:bg-[#6B2828]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-[#6B2828] rounded-b-lg p-6 md:p-8">
          <div className="space-y-8">
            <ImageCarousel images={activeTabData.images} />
            
            <div className="text-white font-sans space-y-4">
              <h3 className="text-2xl font-serif text-gray-200">{activeTabData.title}</h3>
              {activeTabData.content}
            </div>

            <UpcomingEvents calendarId={activeTabData.calendarId} title="Upcoming Shows and Events" />
          </div>
        </div>
      </div>
    </section>
  );
}