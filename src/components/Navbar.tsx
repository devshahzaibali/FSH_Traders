"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { useCart } from '@/components/CartContext';
import { useAuth } from './AuthContext';
import { categories } from '@/data/categories';
import { 
  UserIcon, 
  ShoppingCartIcon, 
  ArrowRightOnRectangleIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  Bars3Icon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLink {
  href: string;
  label: string;
  icon?: boolean;
  dropdown?: {
    title: string;
    items: {
      href: string;
      label: string;
      description?: string;
      icon?: React.ReactNode;
    }[];
  };
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { 
    href: '/catalog', 
    label: 'Categories',
    dropdown: {
      title: 'All Categories',
      items: categories.map(cat => ({
        href: `/catalog/${cat.name.toLowerCase().replace(/ & | /g, '-').replace(/[^a-z0-9-]/g, '')}`,
        label: cat.name,
        description: undefined,
        icon: undefined
      }))
    }
  },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname() || "";
  const { cart } = useCart();
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
        if (!search) setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [search]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset states on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(null);
    setSearchOpen(false);
    setSearch('');
    setSearchResults([]);
  }, [pathname]);

  // Set mounted state for animations
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      if (query.length > 1) {
        const results = products.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    },
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const toggleDropdown = (href: string) => {
    setDropdownOpen(dropdownOpen === href ? null : href);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    } else {
      setSearch('');
      setSearchResults([]);
    }
  };

  const handleProductClick = (id: string) => {
    router.push(`/product/${id}`);
    setSearch('');
    setSearchResults([]);
    setSearchOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 px-2
        ${scrolled ? 'bg-white/95 shadow-lg backdrop-blur-lg py-1' : 'bg-white/90 shadow-sm backdrop-blur-md py-2'}
        border-b border-gray-100
      `}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-3 group" 
            aria-label="Home"
            onClick={() => {
              setMenuOpen(false);
              setDropdownOpen(null);
            }}
          >
              <motion.div 
                className="relative w-11 h-11"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <Image 
                src="/fsh-traders.png" 
                alt="FSH Traders Logo" 
                fill 
                className="rounded-full object-contain shadow-md" 
                sizes="44px" 
                priority
              />
              </motion.div>
              <motion.span 
                className="font-extrabold text-2xl bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent tracking-tight hidden sm:inline font-serif drop-shadow-sm"
                initial={isMounted ? { opacity: 0, y: -10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
              FSH Traders
              </motion.span>
          </Link>

          {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 relative ml-4">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.dropdown ? (
                    <div className="relative">
                    <button
                      onClick={() => toggleDropdown(link.href)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-1 
                          ${pathname.startsWith(link.href) ? 'text-blue-700 bg-blue-100/60' : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50/60'}
                      `}
                        aria-expanded={dropdownOpen === link.href}
                        aria-haspopup="true"
                    >
                      {link.label}
                        <motion.svg 
                        className={`w-4 h-4 transition-transform ${dropdownOpen === link.href ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                          animate={{ rotate: dropdownOpen === link.href ? 180 : 0 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                    </button>
                    
                      <AnimatePresence>
                    {dropdownOpen === link.href && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-64 origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                          >
                            <div className="p-2">
                              <h3 className="px-4 py-2 text-sm font-bold text-gray-700 border-b border-gray-100">
                                {link.dropdown.title}
                              </h3>
                          {link.dropdown.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors gap-2"
                            >
                                  {item.icon && <span className="text-lg">{item.icon}</span>}
                                  <div>
                                    <p className="font-medium">{item.label}</p>
                              {item.description && (
                                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                              )}
                                  </div>
                            </Link>
                          ))}
                        </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      </div>
                ) : (
                  <Link
                    href={link.href}
                      className={`relative px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-1 
                        ${pathname === link.href ? 'text-blue-700 bg-blue-100/60' : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50/60'}
                      `}
                    >
                    {link.label}
                    {pathname === link.href && (
                        <motion.span 
                          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 w-6 bg-blue-500 rounded-full"
                          layoutId="navIndicator"
                        />
                    )}
                  </Link>
                )}
              </div>
            ))}
            </div>
          </div>

          {/* Right side elements */}
          <div className="flex items-center gap-4">
            {/* Search bar (desktop) */}
            <motion.div 
              className="hidden md:flex items-center relative"
              animate={{ 
                width: searchOpen ? '240px' : '40px',
                transition: { duration: 0.3 }
              }}
            >
              {searchOpen ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full"
                >
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={handleSearch}
                    className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => {
                      setSearch('');
                      setSearchResults([]);
                      setSearchOpen(false);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  onClick={toggleSearch}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-700 hover:text-blue-700 rounded-full hover:bg-blue-50"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </motion.button>
              )}

              {/* Search results dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden"
                >
                  <div className="py-2 max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-3"
                      >
                        <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Cart Icon */}
            <Link href="/cart" passHref>
              <motion.div 
                className="relative p-2 rounded-full hover:bg-blue-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCartIcon className="w-6 h-6 text-gray-700 hover:text-blue-700" />
                {cartCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>
            {/* Wishlist Icon */}
            <Link href="/wishlist" passHref>
              <motion.div 
                className="relative p-2 rounded-full hover:bg-pink-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HeartIcon className="w-6 h-6 text-gray-700 hover:text-pink-600" />
              </motion.div>
            </Link>
            
            {/* Auth Buttons for Desktop */}
            {!loading && (
              <div className="hidden md:flex items-center gap-2 ml-2">
                {!user ? (
                  <>
                    <Link href="/login" passHref>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1 px-3 py-2 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50 transition-all text-sm font-medium"
                      >
                        <UserIcon className="w-5 h-5" />
                        <span>Login</span>
                      </motion.button>
                    </Link>
                    <Link href="/signup" passHref>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1 px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-medium shadow-sm"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Sign Up</span>
                      </motion.button>
                </Link>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/account" passHref>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg border-2 border-blue-200 shadow-sm">
                          {user.email?.charAt(0).toUpperCase() || <UserIcon className="w-5 h-5" />}
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                          {user.email?.split('@')[0]}
                        </span>
                      </motion.div>
                </Link>
                    <motion.button
                      onClick={logout}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1 px-3 py-2 rounded-full border border-red-200 text-red-700 hover:bg-red-50 transition-all text-sm font-medium"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span className="hidden sm:inline">Logout</span>
                    </motion.button>
              </div>
            )}
              </div>
            )}

          {/* Mobile menu button */}
            <motion.button
              className={`md:hidden flex items-center justify-center p-2 rounded-xl transition-all
                ${menuOpen ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}
              `}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {menuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-6 space-y-2 bg-white/95 backdrop-blur-md border-t border-gray-100 rounded-b-2xl shadow-lg">
                {/* Mobile Search */}
                <div className="px-2 mb-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={search}
                      onChange={handleSearch}
                      className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => {
                        setSearch('');
                        setSearchResults([]);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {search ? <XMarkIcon className="w-5 h-5" /> : <MagnifyingGlassIcon className="w-5 h-5" />}
                    </button>
      </div>

                  {/* Mobile search results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
                        >
                          <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

          {navLinks.map((link) => (
            <div key={link.href}>
              {link.dropdown ? (
                      <div className="mb-1">
                  <button
                    onClick={() => toggleDropdown(link.href)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors
                      ${pathname.startsWith(link.href) ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}
                      flex items-center justify-between
                    `}
                  >
                    {link.label}
                          <motion.svg 
                            className={`w-4 h-4 ${dropdownOpen === link.href ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                            animate={{ rotate: dropdownOpen === link.href ? 180 : 0 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                  </button>
                  
                        <AnimatePresence>
                  {dropdownOpen === link.href && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 overflow-hidden"
                            >
                              <div className="space-y-1 py-1">
                      {link.dropdown.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                                    className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors text-sm"
                                    onClick={() => setMenuOpen(false)}
                        >
                                    <div className="flex items-center gap-2">
                                      {item.icon && <span className="text-lg">{item.icon}</span>}
                                      <div>
                          <p className="font-medium">{item.label}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                          )}
                                      </div>
                                    </div>
                        </Link>
                      ))}
                    </div>
                            </motion.div>
                  )}
                        </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl font-semibold transition-colors
                    ${pathname === link.href ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}
                  `}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}

                {/* Mobile Auth Buttons */}
          {!loading && !user && (
                  <div className="pt-2 border-t border-gray-100">
                    <Link href="/login" passHref>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 rounded-xl font-semibold transition-colors text-blue-600 hover:bg-blue-50 text-left"
                      >
                        Login
                      </motion.button>
                    </Link>
                    <Link href="/signup" passHref>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 rounded-xl font-semibold transition-colors text-white bg-blue-600 hover:bg-blue-700 mt-2 text-left"
                      >
                        Create Account
                      </motion.button>
                    </Link>
                  </div>
          )}
          {!loading && user && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="px-4 py-3 text-sm text-gray-700">
                      Signed in as <span className="font-medium">{user.email}</span>
                    </div>
                    <Link href="/account" passHref>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 rounded-xl font-semibold transition-colors text-gray-700 hover:bg-blue-50 text-left"
                        onClick={() => setMenuOpen(false)}
                      >
                        My Account
                      </motion.button>
                    </Link>
                    <motion.button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 rounded-xl font-semibold transition-colors text-red-600 hover:bg-red-50 mt-1 text-left"
                    >
                      Logout
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;