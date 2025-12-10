import { useState, useEffect } from "react";

export default function AutoFollowPop() {
  const username = "ClassicTec19368";
  const followLink = `https://twitter.com/intent/follow?screen_name=${username}`;

  const [showPop, setShowPop] = useState(false);

  /* ============================================================
     LOAD POPUP STATE ON PAGE LOAD
     If user has NOT clicked follow before => show popup
  ============================================================ */
  useEffect(() => {
    const hasFollowed = localStorage.getItem("hasFollowedX");

    // If not followed before → show popup
    if (hasFollowed !== "true") {
      setShowPop(true);
    }
  }, []);

  /* ============================================================
     SHOW POPUP EVERY 5 MINUTES IF NOT FOLLOWED YET
  ============================================================ */
  useEffect(() => {
    const interval = setInterval(() => {
      const hasFollowed = localStorage.getItem("hasFollowedX");

      if (hasFollowed !== "true") {
        setShowPop(true);
      }
    }, 150000);

    return () => clearInterval(interval);
  }, []);

  /* ============================================================
     USER CLICKED FOLLOW BUTTON
     => Mark as followed
     => Hide popup permanently
  ============================================================ */
  const handleFollowClick = () => {
    localStorage.setItem("hasFollowedX", "true");
    setShowPop(false);
  };

  return (
    <>
      {showPop && (
        <div style={styles.overlay}>
          <div style={styles.popContainer}>
            <a
              href={followLink}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.followButton}
              onClick={handleFollowClick} // CLOSE ONLY WHEN FOLLOW IS CLICKED
            >
              Follow on X
            </a>
          </div>
        </div>
      )}
    </>
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
    backdropFilter: "blur(6px)",
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
    textAlign: "center",
    textDecoration: "none",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
};
