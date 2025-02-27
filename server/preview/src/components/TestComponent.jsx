import { useState, useEffect } from "react";

function TestComponent() {
  const colors = ["#FF0000", "#00FF00", "#0000FF"];
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorIndex((prevColorIndex) => (prevColorIndex + 1) % colors.length);
    }, 2000);

    return () => {
      clearInterval(colorInterval);
    };
  }, []);

  return (
    <div
      style={{
        height: `${process.env.PREVIEW_HEIGHT}px`,
        width: `${process.env.PREVIEW_WIDTH}px`,
      }}
    >
      <div
        style={{
          width: `100%`,
          height: `100%`,
          backgroundColor: colors[colorIndex],
        }}
      />
    </div>
  );
}

export default TestComponent;
