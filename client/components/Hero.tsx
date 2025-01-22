"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { squareData } from "@/constants/index";

const Hero = () => {
  return (
    <section className="w-full px-8 py-40 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div>
        <h3 className="text-4xl md:text-6xl font-semibold">
          Your Game, Your Turf, Your Time
        </h3>
        <p className="text-base md:text-lg text-slate-700 my-4 md:my-6">
          Revolutionizing sports in Bangladesh. TurfMania offers quick and
          hassle-free turf booking for enthusiasts and streamlined management
          for owners.
        </p>
        <Button variant="default" className="font-semibold">
          Get Started
        </Button>
      </div>
      <ShuffleGrid />
    </section>
  );
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const ShuffleGrid = () => {
  const [squares, setSquares] = useState([]);

  useEffect(() => {
    // Only shuffle on the client
    const shuffledData = shuffle([...squareData]);
    setSquares(shuffledData);

    const shuffleInterval = setInterval(() => {
      setSquares(shuffle([...squareData]));
    }, 3000);

    return () => clearInterval(shuffleInterval);
  }, []);

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares.map((sq) => (
        <motion.div
          key={sq.id}
          layout
          transition={{ duration: 1.5, type: "spring" }}
          className="w-full h-full"
          style={{
            backgroundImage: `url(${sq.src})`,
            backgroundSize: "cover",
          }}
        ></motion.div>
      ))}
    </div>
  );
};

export default Hero;
