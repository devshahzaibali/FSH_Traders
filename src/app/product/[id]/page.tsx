"use client";
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '../../../components/CartContext';
import { useAuth } from '../../../components/AuthContext';
import { useWishlist } from '../../../components/WishlistContext';
import { useRouter } from 'next/navigation';
import { db } from '../../../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { FiStar, FiTruck, FiShield, FiRotateCcw, FiShare2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import Image from 'next/image';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useState as useReactState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  description?: string;
  stock?: number;
  rating?: number;
  shipping?: string;
  returnPolicy?: string;
  features?: string[];
  discount?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

type ProductWithRequiredFields = Product & {
  categoryId: string;
  featured: boolean;
  sku: string;
  slug: string;
  description: string;
  stock: number;
  reviewCount?: number;
};

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const productId = params && 'id' in params ? params.id as string : "";
  const [product, setProduct] = useState<ProductWithRequiredFields | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [addedToCart, setAddedToCart] = useState(false);
  const { toggleWishlist, isWishlisted, wishlist } = useWishlist();
  const [wishlistMsg, setWishlistMsg] = useReactState<string | null>(null);
  const [shareMsg, setShareMsg] = useReactState<string | null>(null);

  // Helper to sync wishlist to Firestore if logged in
  const syncWishlistToFirestore = async (add: boolean) => {
    if (user && user.uid && product && product.id) {
      const userRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userRef, {
          wishlist: add ? arrayUnion(product.id) : arrayRemove(product.id)
        });
      } catch (e) {
        // Optionally handle error
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as ProductWithRequiredFields;
          setProduct(productData);
          setSelectedImage(productData.image || '');
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Error loading product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (product) {
      const safeProduct: ProductWithRequiredFields = {
        ...product,
        categoryId: (product as ProductWithRequiredFields).categoryId || product.category || "",
        featured: (product as ProductWithRequiredFields).featured || false,
        sku: (product as ProductWithRequiredFields).sku || "",
        slug: (product as ProductWithRequiredFields).slug || "",
        description: product.description || "",
        stock: typeof product.stock === "number" ? product.stock : 0
      };
      addToCart(safeProduct, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => Math.min(prev + 1, product?.stock || 10));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button
            onClick={() => router.push('/catalog')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
  const availableImages = product.images && product.images.length > 0 ? [product.image, ...product.images] : [product.image];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <button
                onClick={() => router.push('/')}
                className="text-gray-700 hover:text-blue-600 text-sm font-medium"
              >
                Home
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <button
                  onClick={() => router.push('/catalog')}
                  className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                >
                  Catalog
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-500 text-sm">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center border-2 border-blue-500">
              {selectedImage && selectedImage.trim() !== '' ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="object-contain"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-2">📦</div>
                    <div>No Image Available</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Image Gallery */}
            {availableImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {availableImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square bg-white rounded-lg border-2 overflow-hidden flex items-center justify-center ${
                      selectedImage === image ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    {image && image.trim() !== '' ? (
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={100}
                        height={100}
                        className="object-contain"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <FiStar className="text-yellow-400 w-5 h-5" />
                  <span className="ml-1 text-gray-600">
                    {product.rating || 4.5} ({product.reviewCount ?? 0} reviews)
                  </span>
                </div>
                <span className="text-gray-500">|</span>
                <span className="text-gray-600">Category: {product.category}</span>
              </div>
              {/* Action Buttons: Wishlist and Share */}
              <div className="flex space-x-3 mb-4">
                {/* Wishlist Button */}
                <button
                  onClick={async () => {
                    const isNowWishlisted = !isWishlisted(product.id);
                    toggleWishlist(product.id);
                    await syncWishlistToFirestore(isNowWishlisted);
                    setWishlistMsg(isNowWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
                    setTimeout(() => setWishlistMsg(null), 1200);
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-pink-50 transition-colors"
                  aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isWishlisted(product.id) ? (
                    <HeartIconSolid className="w-5 h-5 text-pink-600" />
                  ) : (
                    <HeartIconOutline className="w-5 h-5 text-gray-400 hover:text-pink-600" />
                  )}
                  <span className="text-sm">Wishlist</span>
                </button>
                {/* Share Button */}
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={async () => {
                    const url = window.location.href;
                    if (navigator.share) {
                      try {
                        await navigator.share({ title: product.name, url });
                        setShareMsg('Shared!');
                      } catch {}
                    } else {
                      try {
                        await navigator.clipboard.writeText(url);
                        setShareMsg('Link copied!');
                      } catch {
                        setShareMsg('Failed to copy');
                      }
                    }
                    setTimeout(() => setShareMsg(null), 1200);
                  }}
                >
                  <FiShare2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
                {wishlistMsg && (
                  <span className="ml-2 text-xs text-pink-600 animate-pulse">{wishlistMsg.replace(/'/g, "&apos;")}</span>
                )}
                {shareMsg && (
                  <span className="ml-2 text-xs text-blue-600 animate-pulse">{shareMsg}</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {product.discount && product.discount > 0 ? (
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-blue-600">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    {product.discount}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${(product.stock || 0) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {(product.stock || 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(false)}
                  disabled={quantity <= 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(true)}
                  disabled={quantity >= (product.stock || 10)}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock <= 0}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400'
                }`}
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>{addedToCart ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>
              {/* Removed duplicate Wishlist and Share buttons here */}
              <div className="flex space-x-3"></div>
            </div>

            {/* Product Features */}
            {product.features && product.features.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Policies */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <FiTruck className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Shipping</div>
                    <div className="text-sm text-gray-600">{product.shipping || 'Free shipping on orders over $50'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiShield className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Warranty</div>
                    <div className="text-sm text-gray-600">2-year guarantee</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiRotateCcw className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Returns</div>
                    <div className="text-sm text-gray-600">{product.returnPolicy || '30-day return policy'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'specifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-900">Category:</span>
                    <span className="ml-2 text-gray-700">{product.category}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Stock:</span>
                    <span className="ml-2 text-gray-700">{product.stock || 0} units</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Rating:</span>
                    <span className="ml-2 text-gray-700">{product.rating || 4.5}/5</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Reviews:</span>
                    <span className="ml-2 text-gray-700">{product.reviewCount ?? 0}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 