import Link from 'next/link';

export default function NewArrivalsPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">New Arrivals</h1>
      <p className="text-lg text-gray-700 mb-4">Check out the latest products just added to our catalog!</p>
      <Link href="/catalog" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">Back to Catalog</Link>
    </main>
  );
} 