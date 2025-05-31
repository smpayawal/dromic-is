"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gov-blue-dark text-white py-8 px-4 sm:px-6 lg:px-8 print:hidden mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Section: Copyright & App Info */}
          <div className="md:col-span-6 lg:col-span-5 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <Image 
                src="/AGAPP.png" 
                alt="DROMIC IS Logo" 
                width={40} 
                height={40} 
                className="h-10 w-10" 
              />
              <div>
                <h3 className="text-lg font-semibold text-white">DROMIC Integrated System</h3>
                <p className="text-sm text-gray-300 italic">
                  Service Delayed is Social Justice Denied!
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-300">
              <p>&copy; {new Date().getFullYear()} DROMIC Integrated System. All Rights Reserved.</p>
            </div>
          </div>

          {/* Middle Section: Quick Links */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3 text-center md:text-left">
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-gov-yellow transition-colors duration-200 text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/reports" 
                  className="text-gray-300 hover:text-gov-yellow transition-colors duration-200 text-sm"
                >
                  Reports & Analytics
                </Link>
              </li>
              <li>
                <Link 
                  href="/dromic-matrix" 
                  className="text-gray-300 hover:text-gov-yellow transition-colors duration-200 text-sm"
                >
                  DROMIC Matrix
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-gov-yellow transition-colors duration-200 text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Right Section: Government Links & Go to Top */}
          <div className="md:col-span-3 lg:col-span-4 space-y-3">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Government Links</h4>
              <ul className="space-y-2 mb-6">
                <li>
                  <a 
                    href="https://www.gov.ph" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-gov-yellow transition-colors duration-200 text-sm"
                  >
                    GOV.PH
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.dswd.gov.ph" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-gov-yellow transition-colors duration-200 text-sm"
                  >
                    DSWD Official Website
                  </a>
                </li>
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-gray-300 hover:text-gov-yellow transition-colors duration-200 text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms" 
                    className="text-gray-300 hover:text-gov-yellow transition-colors duration-200 text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Go to Top Button */}
            <div className="flex justify-center md:justify-end">
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-400 rounded-md text-gray-300 hover:text-gov-yellow hover:border-gov-yellow transition-all duration-200 text-sm bg-transparent hover:bg-gov-yellow/10"
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-4 w-4" />
                <span>Go to Top</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Border & DSWD Copyright */}
        <div className="mt-8 pt-6 border-t border-gov-blue-light text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Department of Social Welfare and Development. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
