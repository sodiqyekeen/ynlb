import React from 'react'

export default function About() {
  return (
    <div className="space-y-4 px-4 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800">About YNLB</h2>
      <p className="text-gray-600 text-justify">
        YNLB (Yorùbá Not Left Behind) is a progressive web application dedicated to bridging language barriers and preserving the rich Yorùbá culture. Our mission is to provide an accessible and efficient English to Yorùbá translation service, empowering users to communicate effectively and learn the Yorùbá language.
      </p>
      <p className="text-lg">
        With YNLB, we aim to:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Facilitate communication between English and Yorùbá speakers</li>
        <li>Promote the learning and preservation of the Yorùbá language</li>
        <li>Contribute to the digital presence of the Yorùbá language</li>
        <li>Support cultural exchange and understanding</li>
      </ul>
    </div>
  )
}