'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ChatProvider } from '../contexts/ChatContext';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>MedBot - Medical Education Chatbot</title>
        <meta name="description" content="AI Medical Chatbot for Medical Students - Learn about basic health issues" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50">
          <ChatProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'bg-slate-800 text-white',
              }}
            />
          </ChatProvider>
        </div>
      </body>
    </html>
  );
}