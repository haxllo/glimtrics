"use client";

import { useEffect, useState } from "react";

const BackgroundRays = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="ray-container">
      <div className="light-ray ray-1" />
      <div className="light-ray ray-2" />
      <div className="light-ray ray-3" />
      <div className="light-ray ray-4" />
      <div className="light-ray ray-5" />
      <div className="light-ray ray-6" />
      <div className="light-ray ray-7" />
      <div className="light-ray ray-8" />
    </div>
  );
};

export default BackgroundRays;
