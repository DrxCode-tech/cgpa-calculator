import { useState, useEffect, useRef } from "react";

export default function AutoFollowPop() {
  const [showPop, setShowPop] = useState(false);
  const popRef = useRef(null);

  const username = "ClassicTec19368"; 
  const followLink = `https://twitter.com/intent/follow?screen_name=${username}`;

  // Show popup every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPop(true);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  // Close pop if user clicks outside the box
  useEffect(() => {
    function handleClickOutside(e) {
      if (popRef.current && !popRef.current.contains(e.target)) {
        setShowPop(false);
      }
    }

    if (showPop) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showPop]);

  return (
    <div>
      {showPop && (
        <div style={styles.overlay}>
          <div style={styles.popContainer} ref={popRef}>
            <a
              href={followLink}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.followButton}
            >
              Follow on X
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "25px",
    backdropFilter:"blur(6px)",
  },

  popContainer: {
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    width: "260px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },

  followButton: {
    display: "block",
    width: "100%",
    background: "#1DA1F2",
    color: "white",
    padding: "12px",
    borderRadius: "12px",
    textAlign:"center",
    textDecoration: "none",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
};
