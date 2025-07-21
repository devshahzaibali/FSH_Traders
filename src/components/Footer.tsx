"use client";

import Link from "next/link";
import { useAuth } from './AuthContext';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { useState } from 'react';
import Image from 'next/image';

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const companyLinks = [
    { href: "/about", text: "About" },
    { href: "/blog", text: "Blog" },
    { href: "/careers", text: "Careers" },
    { href: "/press", text: "Press" },
  ];

  const shopLinks = [
    { href: "/catalog", text: "Catalog" },
    { href: "/featured", text: "Featured" },
    { href: "/deals", text: "Deals" },
    { href: "/new-arrivals", text: "New Arrivals" },
  ];

  const supportLinks = [
    { href: "/contact", text: "Contact" },
    { href: "/faq", text: "FAQ" },
    { href: "/shipping", text: "Shipping" },
    { href: "/returns", text: "Returns" },
  ];

  const accountLinks = !user ? [
    { href: "/login", text: "Login" },
    { href: "/signup", text: "Sign Up" },
    { href: "/forgot-password", text: "Forgot Password" },
  ] : [
    { href: "/account", text: "My Account" },
    { href: "/orders", text: "My Orders" },
    { href: "/wishlist", text: "Wishlist" },
  ];

  const socialLinks = [
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaFacebook />, href: "#", label: "Facebook" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
    { icon: <FaYoutube />, href: "#", label: "YouTube" },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscriptionMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscriptionMessage('✅ Thank you for subscribing! Check your email for confirmation.');
        setEmail('');
      } else {
        const errorData = await response.json();
        setSubscriptionMessage(`❌ ${errorData.message || 'Failed to subscribe. Please try again.'}`);
      }
    } catch (error) {
      setSubscriptionMessage('❌ Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Image 
                src="/fsh-traders.png" 
                alt="FSH Traders Logo" 
                className="h-10 w-10 rounded-full shadow-lg" 
                width={40}
                height={40}
              />
              <span className="text-2xl font-bold text-white tracking-tight">
                FSH Traders<span className="text-blue-400">®</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Premium products, unbeatable deals. Serving customers worldwide since 2015.
            </p>
            
            {/* Newsletter signup */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Subscribe to our newsletter</h3>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-r-md transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <FiMail className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {subscriptionMessage && (
                  <div className={`text-sm ${
                    subscriptionMessage.includes('✅') 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {subscriptionMessage}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
        </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Account</h3>
            <ul className="space-y-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
              {user && (
                <li className="text-gray-400 text-sm mt-4">
                  Logged in as: <span className="text-blue-400">{user.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social links */}
            <div className="flex space-x-6 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <span className="sr-only">{social.label}</span>
                  <span className="h-6 w-6">{social.icon}</span>
                </Link>
              ))}
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm">
                Sitemap
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center text-sm text-gray-500">
            &copy; {currentYear} FSH Traders. All rights reserved.
            <div className="mt-1 text-xs">
              Prices and offers are subject to change. All trademarks are property of their respective owners.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 