'use client'

import React from 'react'
import Image from 'next/image'
import Chatbox from '../components/chatbox'

export default function Page() {
  return (
    <div className="flex-grow font-poppins">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Chat</h1>
        <p className="text-lg">Ask Melos</p>
      </header>

      <Image
        src="/melos.png"
        alt="Melos chatbot"
        width={200}
        height={200}
        priority
        className="mx-auto mb-6"
      />

      <main className="flex flex-col gap-6">
        <Chatbox />
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">Chat with Melos for answers</h2>
          <p className="text-gray-600 mt-2">Find Answers!</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Chat</button>
        </div>
      </main>
    </div>
  )
}