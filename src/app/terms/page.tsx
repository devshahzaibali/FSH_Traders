import BackButton from '@/components/BackButton';

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto pt-20 py-16 px-4">
      <div className="text-left mb-4"><BackButton /></div>
      <h1 className="text-4xl font-bold text-blue-900 mb-6">Terms of Service</h1>
      <p className="text-gray-700 mb-4">Please read these terms and conditions carefully before using our website.</p>
      <p className="text-gray-600">(Full terms of service content goes here.)</p>
    </main>
  );
} 