"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { featureContents } from "@/constants";
import {Button} from "@/components/Button";

const IMG_PADDING = 10;

export const FeatureSection = () => {
  return (
    <div className="bg-white">
      {featureContents.map(({ id, imgPath, heading, content }) => (
        <TextParallaxContent
          key={id}
          imgPath={imgPath}
          heading={heading}
        >
          <ExampleContent content={content} />
        </TextParallaxContent>
      ))}
    </div>
  );
};

const TextParallaxContent = ({ imgPath, heading, children }) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgPath={imgPath} />
        <OverlayCopy heading={heading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgPath }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgPath})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ heading }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
    </motion.div>
  );
};

const ExampleContent = ({ content }) => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4">
      {content.title}
    </h2>
    <div className="col-span-1 md:col-span-8">
      {content.description.map((desc, index) => (
        <p key={index} className="mb-4 text-xl text-neutral-600 md:text-2xl">
          {desc}
        </p>
      ))}
      <Button variant="default" className="font-semibold">
        Learn more <FiArrowUpRight className="inline" />
      </Button>
    </div>
  </div>
);

