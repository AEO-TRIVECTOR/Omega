import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-purple-500/20 backdrop-blur-sm bg-black/30 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Trivector.ai
            </h3>
            <p className="text-gray-400 text-sm">
              Consciousness mathematics visualization platform
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/trilogic" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Tri-Logic Visualizer
                </Link>
              </li>
              <li>
                <Link href="/spectral" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Spectral Geometry
                </Link>
              </li>
              <li>
                <Link href="/spectral-wasm" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Spectral Geometry (WASM)
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Research
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Contact</h4>
            <div className="space-y-2 text-sm">
              <a 
                href="mailto:link@trivector.ai" 
                className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                link@trivector.ai
              </a>
              <a 
                href="https://help.manus.im" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Support
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-purple-500/10 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Trivector.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
