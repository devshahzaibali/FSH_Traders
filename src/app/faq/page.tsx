import BackButton from '@/components/BackButton';

export default function FAQPage() {
  return (
    <main className="max-w-3xl mx-auto pt-20 py-16 px-4">
      <div className="text-left mb-4"><BackButton /></div>
      <h1 className="text-4xl font-bold text-blue-900 mb-6">Frequently Asked Questions</h1>
      <p className="text-gray-700 mb-4">Find answers to common questions about our products, shipping, returns, and more.</p>
      <p className="text-gray-600">(Full FAQ content goes here.)</p>
    </main>
  );
} 