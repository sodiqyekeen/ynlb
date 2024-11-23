import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import NavMenu from './NavMenu'

export default function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 text-gray-900 flex flex-col">
            <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
                <Link to="/" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                    YNLB
                </Link>
                <NavMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            </header>

            <main className="flex-grow p-4 md:p-6 max-w-6xl mx-auto w-full">
                <Outlet />
            </main>

            <footer className="bg-white shadow-md mt-auto py-4 px-6 text-center text-sm text-gray-600">
                © {new Date().getFullYear()} YNLB. All rights reserved.
            </footer>
        </div>
    )
}