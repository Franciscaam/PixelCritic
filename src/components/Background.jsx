import React, { useEffect, useState } from "react";
import "../style/global.css";

function Background() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="parallax-background"
      style={{
        transform: `translateY(${offsetY * 0.17}px)`,
        transition: "transform 0.1s ease-out",
        opacity: 0.7,
      }}
    />
  );
}

export default Background;

