import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStageOpen, setIsStageOpen] = useState(false);

  const handleSubsectionClick = (subsection: string) => {
    // Navigate to the home page stage section and set the active tab.
    window.location.href = `/#stage-${subsection}`;
    setIsMenuOpen(false);
    setIsStageOpen(false);
  };

  const handleSectionClick = (section: string) => {
    window.location.href = `/#${section}`;
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-[#8B3838] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/#home" className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#8B3838] font-serif font-bold text-xl">LTC</span>
              </div>
              <span className="ml-3 text-white font-serif text-xl hidden sm:block">
                Long Toque Club
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {/* Stage with dropdown */}
            <div className="relative group">
              <button
                className="text-white hover:text-gray-200 transition-colors duration-200 font-sans flex items-center gap-1"
                onClick={() => handleSectionClick('stage')}
              >
                Stage
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                <div className="bg-[#6B2828] rounded-md shadow-lg">
                <button
                  onClick={() => handleSubsectionClick('didi')}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-[#8B3838] transition-colors duration-200 font-sans first:rounded-t-md"
                >
                  DIDI
                </button>
                <button
                  onClick={() => handleSubsectionClick('people-you-may-know')}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-[#8B3838] transition-colors duration-200 font-sans"
                >
                  People You May Know
                </button>
                <button
                  onClick={() => handleSubsectionClick('grad-school-improv')}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-[#8B3838] transition-colors duration-200 font-sans last:rounded-b-md"
                >
                  Grad School Improv
                </button>
              </div>
              </div>
            </div>

            <a
              href="/#film-festival"
              className="text-white hover:text-gray-200 transition-colors duration-200 font-sans"
            >
              Film
            </a>
            <a
              href="/#about"
              className="text-white hover:text-gray-200 transition-colors duration-200 font-sans"
            >
              About
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#6B2828]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Stage section with subsections */}
            <div>
              <button
                onClick={() => setIsStageOpen(!isStageOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-[#8B3838] rounded-md transition-colors duration-200 font-sans"
              >
                Stage
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isStageOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isStageOpen && (
                <div className="pl-4 space-y-1 mt-1">
                  <button
                    onClick={() => handleSubsectionClick('didi')}
                    className="block w-full text-left px-3 py-2 text-white hover:bg-[#8B3838] rounded-md transition-colors duration-200 font-sans text-sm"
                  >
                    DIDI
                  </button>
                  <button
                    onClick={() => handleSubsectionClick('people-you-may-know')}
                    className="block w-full text-left px-3 py-2 text-white hover:bg-[#8B3838] rounded-md transition-colors duration-200 font-sans text-sm"
                  >
                    People You May Know
                  </button>
                  <button
                    onClick={() => handleSubsectionClick('grad-school-improv')}
                    className="block w-full text-left px-3 py-2 text-white hover:bg-[#8B3838] rounded-md transition-colors duration-200 font-sans text-sm"
                  >
                    Grad School Improv
                  </button>
                </div>
              )}
            </div>

            <a
              href="/#film-festival"
              className="block px-3 py-2 text-white hover:bg-[#8B3838] rounded-md transition-colors duration-200 font-sans"
              onClick={() => setIsMenuOpen(false)}
            >
              Film
            </a>
            <a
              href="/#about"
              className="block px-3 py-2 text-white hover:bg-[#8B3838] rounded-md transition-colors duration-200 font-sans"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
