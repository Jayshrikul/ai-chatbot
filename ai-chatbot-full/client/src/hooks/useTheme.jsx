
import { useState, useEffect } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme; // apply to body
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return { theme, toggleTheme };
}
