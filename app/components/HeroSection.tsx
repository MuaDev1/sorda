// components/HeroSection.tsx
export default function HeroSection() {
    return (
      <header className="text-center py-16 md:py-24 bg-gradient-to-r from-purple-800 via-black to-gray-900 shadow-lg">
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-300 mb-4">مرحبًا بكم في موقع المانجا</h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-8">
          اكتشف أفضل المانجا والإبداعات المميزة في مكان واحد.
        </p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition">
          استكشاف المانجا
        </button>
      </header>
    );
  }
    