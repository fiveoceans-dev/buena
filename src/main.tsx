import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register PWA manifest
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // Service worker is registered in the PWA service
  });
}

// Add PWA meta tags dynamically
if (typeof document !== 'undefined') {
  // Add manifest link if not already present
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);
  }

  // Add theme color meta tag
  if (!document.querySelector('meta[name="theme-color"]')) {
    const themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    themeColorMeta.content = '#2563eb';
    document.head.appendChild(themeColorMeta);
  }

  // Add apple touch icon
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/icon-192.png';
    document.head.appendChild(appleTouchIcon);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
