import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Stage } from './components/Stage';
import { FilmEx } from './components/FilmEx';
import { About } from './components/About';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#A65D5D]">
      <Navigation />
      <main>
        <Hero />
        <Stage />
        <FilmEx />
        <About />
      </main>
      <Footer />
    </div>
  );
}