import Link from 'next/link';
import BackButton from '@/components/BackButton';

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto pt-20 py-16 px-4 text-center">
      <div className="text-left mb-4"><BackButton /></div>
      <h1 className="text-4xl font-bold text-blue-900 mb-6">About FSH Traders</h1>
      <p className="text-lg text-gray-700 mb-4">
        FSH Traders is your trusted partner for premium products and exceptional shopping experiences. Founded in 2020, we are committed to quality, fair pricing, and customer satisfaction.
      </p>
      <p className="text-gray-600 mb-6">
        Our mission is to bring you the best products at unbeatable deals, with a focus on quality and service. Thank you for choosing us!
      </p>
      <Link href="/catalog" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
        Explore Our Products
      </Link>
    </main>
  );
}