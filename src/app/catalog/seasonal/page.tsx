import Link from 'next/link';

export default function SeasonalSpecialsPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">Seasonal Specials</h1>
      <p className="text-lg text-gray-700 mb-4">Discover limited-time offers and seasonal products.</p>
      <Link href="/catalog" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">Back to Catalog</Link>
    </main>
  );
} 