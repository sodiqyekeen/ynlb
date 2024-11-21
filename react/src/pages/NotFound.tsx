import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "../components/ui/button"
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center px-4 text-center h-full">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-4">
          <h2 className="text-6xl font-extrabold text-gray-900">404</h2>
          <h3 className="text-3xl font-bold text-gray-800">Page not found</h3>
          <p className="text-xl text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
          <Link to="/">
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors duration-300"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}