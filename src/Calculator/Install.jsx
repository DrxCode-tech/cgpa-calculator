import React, { useState, useEffect } from "react";

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Listen for the install prompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // show browser install UI

    const result = await deferredPrompt.userChoice;

    // result.outcome is either "accepted" or "dismissed"
    console.log("Install result:", result.outcome);

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  return (
    <div>
      {/* Your existing UI */}

      {/* INSTALL BUTTON */}
      {showInstall && (
        <button
          style={{
            padding: "10px 20px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
          onClick={handleInstall}
        >
          Install App
        </button>
      )}
    </div>
  );
}
