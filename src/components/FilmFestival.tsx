import { ImageCarousel } from './ImageCarousel';
import { MapPin, Film } from 'lucide-react';

export function FilmFestival() {
  const filmImages = [
    'https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzY5NjkzMDI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1765213310101-d0eed6a0682a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwcHJvamVjdG9yJTIwdmludGFnZXxlbnwxfHx8fDE3Njk3MzgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1621276336795-925346853745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHNjcmVlbiUyMGF1ZGllbmNlfGVufDF8fHx8MTc2OTczOTA0OHww&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  const cinemaLocation = 'The Revue Cinema, 400 Roncesvalles Ave, Toronto, ON';

  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  return (
    <section id="film-festival" className="py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-300 mb-8 text-center">
          Short Toque Exhibition
        </h2>

        <div className="space-y-8">
          {/* Image Carousel */}
          <ImageCarousel images={filmImages} />

          {/* Location */}
          <div className="flex items-center justify-center gap-3 text-gray-200 font-sans">
            <MapPin size={24} className="flex-shrink-0" />
            <a
              href={getGoogleMapsUrl(cinemaLocation)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:text-white underline transition-colors duration-200"
            >
              {cinemaLocation}
            </a>
          </div>

          {/* Main Description */}
          <div className="bg-[#6B2828] rounded-lg p-8">
            <div className="space-y-6 text-white font-sans">
              <p className="text-lg leading-relaxed">
                The Short Toque Exhibition celebrates independent short films from emerging and established filmmakers. 
                Join us for an evening of compelling storytelling, innovative cinematography, and diverse perspectives 
                that showcase the best of contemporary short-form cinema.
              </p>
              <p className="text-lg leading-relaxed">
                Each exhibition features a curated selection of short films across various genres, followed by 
                Q&A sessions with filmmakers and networking opportunities with fellow cinema enthusiasts.
              </p>
            </div>
          </div>

          {/* Submission Information */}
          <div className="bg-[#8B3838] rounded-lg p-8">
            <h3 className="text-2xl font-serif text-gray-200 mb-6">Submit Your Film</h3>
            
            <div className="space-y-6 text-white font-sans">
              <div>
                <h4 className="text-xl font-serif text-gray-100 mb-3">Who Can Submit</h4>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Independent filmmakers of all experience levels</li>
                  <li>Film students and recent graduates</li>
                  <li>Production companies with original short-form content</li>
                  <li>International submissions are welcome</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-serif text-gray-100 mb-3">Submission Guidelines</h4>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Films must be 20 minutes or less in duration</li>
                  <li>All genres accepted (narrative, documentary, experimental, animation)</li>
                  <li>Films must have been completed within the last 2 years</li>
                  <li>Submit via our online submission platform</li>
                  <li>Include a brief synopsis, filmmaker bio, and still images</li>
                </ul>
              </div>

              <div className="pt-4">
                <a
                  href="https://example.com/submit-film"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#8B3838] font-sans rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <Film size={20} />
                  Submit Your Film
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}