import { useState, useEffect, useRef } from "react";

export default function AutoFollowPop() {
  const [showPop, setShowPop] = useState(false);
  const popRef = useRef(null);

  const username = "ClassicTec19368";
  const followLink = `https://twitter.com/intent/follow?screen_name=${username}`;

  /* ============================================================
     LOAD POPUP STATE ON REFRESH
     If popup was open before refresh => reopen it
  ============================================================ */
  useEffect(() => {
    const wasOpen = localStorage.getItem("autoFollowPopOpen");
    if (wasOpen === "true") {
      setShowPop(true);
    }
  }, []);

  /* ============================================================
     SHOW POPUP EVERY 5 MINUTES (300000 ms)
     And persist its visibility state
  ============================================================ */
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPop(true);
      localStorage.setItem("autoFollowPopOpen", "true");
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  /* ============================================================
     CLOSE WHEN CLICKING OUTSIDE ONLY
     Clicking overlay closes it
  ============================================================ */
  const closePopup = () => {
    setShowPop(false);
    localStorage.setItem("autoFollowPopOpen", "false");
  };

  return (
    <>
      {showPop && (
        <div style={styles.overlay} onClick={closePopup}>
          <div
            style={styles.popContainer}
            ref={popRef}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside the box
          >
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
    cursor: "pointer", // background is clickable
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
    cursor: "default", // do not close when clicking the box
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
