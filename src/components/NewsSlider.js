"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const newsItems = [
  {
    id: 1,
    title: "New AI Model Breaks Records",
    description:
      "A revolutionary AI model has surpassed human-level performance on various benchmarks.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "SpaceX Launches Starship",
    description:
      "SpaceX's Starship completed its first successful orbital flight and landing.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Quantum Computing Breakthrough",
    description:
      "Scientists achieve quantum supremacy, solving complex problems in record time.",
  },
  {
    id: 4,
    title: "New AI Model Breaks Records",
    description:
      "A revolutionary AI model has surpassed human-level performance on various benchmarks.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Space Launches Starship",
    description:
      "SpaceX's Starship completed its first successful orbital flight and landing.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Quantum Computing Breakthrough",
    description:
      "Scientists achieve quantum supremacy, solving complex problems in record time.",
  },
  {
    id: 7,
    title: "New AI Model Breaks Records",
    description:
      "A revolutionary AI model has surpassed human-level performance on various benchmarks.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 8,
    title: "Spac Launches Starship",
    description:
      "SpaceX's Starship completed its first successful orbital flight and landing.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 9,
    title: "Quantum Computing Breakthrough",
    description:
      "Scientists achieve quantum supremacy, solving complex problems in record time.",
  },
];

export default function NewsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // State to track pause
  const itemsPerPage = 3;
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);

  useEffect(() => {
    if (isPaused) return; // Skip setting interval if paused

    const interval = setInterval(() => {
      goToNext();
    }, 3000); // Change slide every 2 seconds

    return () => clearInterval(interval);
  }, [isPaused]); // Re-run effect when isPaused changes

  const goToPrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
    }
  };

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
    }
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  return (
    <div className="w-full ">
      <div
        className="relative p-4 -z-10"
        style={{
          width: "100%",
          height: "450px",
          backgroundImage: `
      repeating-linear-gradient(
        45deg,
        #f0f0f0,
        #f0f0f0 100px,
        #e0e0e0 100px,
        #e0e0e0 200px
      )
    `,
        }}
      >
        <h2 className="text-2xl mb-3">Visit Our Insights and latest news</h2>
        <div className="relative overflow-hidden  " style={{ height: "300px" }}>
          <div
            className="absolute w-full transition-transform duration-500 ease-in-out flex "
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${totalPages * 100}%`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div key={pageIndex} className="w-full flex-shrink-0 ">
                <div
                  className="flex gap-4 p-2"
                  onMouseEnter={() => setIsPaused(true)} // Pause on hover
                  onMouseLeave={() => setIsPaused(false)} // Resume on leave
                >
                  {newsItems
                    .slice(
                      pageIndex * itemsPerPage,
                      (pageIndex + 1) * itemsPerPage
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className=" w-[436px] bg-white  p-4  flex flex-col transform transition duration-300 hover:scale-105"
                      >
                        <h3 className="text-lg font-semibold mb-2">
                          {item.title}
                        </h3>
                        {item.image && (
                          <div className="relative w-full h-32 mb-2">
                            <Image
                              src={item.image}
                              alt={item.title}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        )}
                        <p className="text-sm">{item.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex space-x-20 item-center justify-center mt-1">
          <button
            onClick={goToPrevious}
            aria-label="Previous news items"
            disabled={isTransitioning}
            className="p-1 border rounded-full hover:bg-gray-200"
          >
            <FaChevronLeft />
          </button>
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentIndex(index);
                  }
                }}
                aria-label={`Go to page ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
                disabled={isTransitioning}
                className={`w-5 h-5 text-[12px] rounded-full ${
                  index === currentIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={goToNext}
            aria-label="Next news items"
            disabled={isTransitioning}
            className="p-1 border rounded-full hover:bg-gray-200"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
