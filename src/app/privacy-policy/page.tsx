import BackButton from '@/components/BackButton';

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto pt-20 py-16 px-4">
      <div className="text-left mb-4"><BackButton /></div>
      <h1 className="text-4xl font-bold text-blue-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">Your privacy is important to us. This page will outline how we collect, use, and protect your information.</p>
      <p className="text-gray-600">(Full privacy policy content goes here.)</p>
    </main>
  );
} 