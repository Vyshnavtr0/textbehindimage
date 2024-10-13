"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
const LandingPage = () => {
  const router = useRouter();
  const images = [
    '/images/life.png',
    '/images/confident.png',
  ];

  const handleGetStarted = () => {
    console.log("Get Started button clicked");
    router.push('/editor');
  };

  return (
    <div className="container mx-auto px-4 py-8">
       {/* App Bar */}
      <div className="bg-white text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold  text-black">Text Behind Image</h1>
        <Button 
            className="bg-white text-black px-6  py-4 rounded-md  text-xl font-semibold hover:text-white hover:bg-gray-800 transition-colors duration-300 shadow-lg"
            onClick={handleGetStarted}
          >
            Login
          </Button>
        {/* {originalImage ? (
                   <Button 
                   className="bg-white text-black font-semibold rounded-lg px-4 py-2 shadow hover:bg-black hover:text-white transition duration-200 border-2 border-black"
                   onClick={captureAndSaveImage}
                 >
                   <Download className="inline mr-2 h-4 w-4" />
                   Download Image
                 </Button>
        ) : (
          <Button 
            className="bg-white text-black font-semibold rounded-lg px-4 py-2 shadow hover:bg-black hover:text-white transition duration-200 border-black" 
            onClick={() => fileInputRef.current.click()}
          >
            <Upload className="inline mr-2 h-4 w-4" />
            Upload Image
          </Button>
        )} */}
      </div>
      <Separator />
      <br />
      <br />
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold mb-4"
          >
          Text Behind
            <br />
           Elevate Your Images with Striking Text
            <br />
            
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-gray-600"
          >
            Enhance Your Visuals with Compelling Text Overlays 
            <br />
            That Not Only Beautify but Also Convey Powerful Messages
          </motion.p>
          
          <Button 
            className="bg-black text-white px-8  py-4 rounded-md h-10 text-xl font-semibold hover:bg-gray-800 transition-colors duration-300 shadow-lg"
            onClick={handleGetStarted}
          >
            Design Now For Free
          </Button>
        </div>

        <div className="lg:w-1/2 relative h-[600px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute top-0 left-0 w-3/4 h-3/4"
          >
            <Image 
              src={images[0]}
              alt="Nature image 1"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-3xl"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute bottom-0 right-0 w-3/4 h-3/4"
          >
            <Image 
              src={images[1]}
              alt="Nature image 2"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-3xl"
            />
          </motion.div>
        </div>
      </div>
      
<div className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[600px]">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative col-span-2 row-span-2"
    >
      <Image 
        src="/images/car.png"
        alt="Car"
        fill
        style={{ objectFit: "cover" }}
        className="rounded-lg"
      />
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative col-span-2 row-span-1"
    >
      <Image 
        src="/images/van.png"
        alt="Confident"
        fill
        style={{ objectFit: "contain" }}
        className="rounded-lg"
      />
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative col-span-1 row-span-1"
    >
      <Image 
        src="/images/go.png"
        alt="Life"
        fill
        style={{ objectFit: "contain" }}
        className="rounded-lg"
      />
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="relative col-span-1 row-span-1"
    >
      <Image 
        src="/images/drone.png"
        alt="Another Car"
        fill
        style={{ objectFit: "cover" }}
        className="rounded-lg"
      />
    </motion.div>
  </div>
</div>
<footer className="bg-gray-100 mt-16">
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0">
        <p className="text-gray-600">Created by Vyshnav TR</p>
      </div>
      <div className="flex space-x-4">
      <a href="https://x.com/vyshnav_tr_?t=Qk-a0kwEArQKBJvd5-zR-Q&s=08" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/vyshnav-tr-7b4902204?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/vyshnav.t.r/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
          </svg>
        </a>
        <a href="https://github.com/Vyshnavtr0" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};

export default LandingPage;