import BackButton from '@/components/BackButton';

export default function ShippingPage() {
  return (
    <main className="max-w-3xl mx-auto pt-20 py-16 px-4">
      <div className="text-left mb-4"><BackButton /></div>
      <h1 className="text-4xl font-bold text-blue-900 mb-6">Shipping Information</h1>
      <p className="text-gray-700 mb-4">Find out about our shipping methods, costs, and delivery times.</p>
      <p className="text-gray-600">(Full shipping information content goes here.)</p>
    </main>
  );
} 