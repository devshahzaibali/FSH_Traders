import BackButton from '@/components/BackButton';

export default function ReturnsPage() {
  return (
    <main className="max-w-3xl mx-auto pt-20 py-16 px-4">
      <div className="text-left mb-4"><BackButton /></div>
      <h1 className="text-4xl font-bold text-blue-900 mb-6">Returns & Exchanges</h1>
      <p className="text-gray-700 mb-4">Learn about our hassle-free returns and exchanges policy.</p>
      <p className="text-gray-600">(Full returns and exchanges policy content goes here.)</p>
    </main>
  );
} 