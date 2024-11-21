'use client'

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavMenu from './components/nav-menu';
import Footer from './components/footer';
import TranslatePage from './pages/translate-page';
import AboutPage from './pages/about-page'; // Import the new AboutPage component

export default function YNLBApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 text-gray-900 flex flex-col">
      <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          YNLB
        </h1>
        <NavMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </header>

      <main className="flex-grow p-4 md:p-6 max-w-3xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<TranslatePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}