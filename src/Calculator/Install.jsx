import React, { useState, useEffect } from "react";

export default function InstallPWA() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setPromptEvent(e);
      setShowButton(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function installApp() {
    if (!promptEvent) return;

    setShowButton(false);

    // Trigger the browser prompt
    promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;

    console.log("INSTALL OUTCOME:", outcome);

    // Reset prompt so it doesn't fire twice
    setPromptEvent(null);
  }

  return (
    <div>
      {showButton && (
        <button
          onClick={installApp}
          style={{
            background: "black",
            color: "white",
            padding: "12px 22px",
            borderRadius: "12px",
            cursor: "pointer",
            border: "1px solid white"
          }}
        >
          Install App
        </button>
      )}
    </div>
  );
}
