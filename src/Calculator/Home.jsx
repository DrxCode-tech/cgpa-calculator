import { motion, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./All.css";

export default function Greet() {
    const navigate = useNavigate();
    const fullText =
        "As unto a light that shines in dark place, until the day dawn and the day star arise in your heart";

    const [displayed, setDisplayed] = useState("");

    // Typing effect
    useEffect(() => {
        let controls = animate(
            0,
            fullText.length,
            {
                duration: 5,                    // <= typing duration (3 secs)
                onUpdate(latest) {
                    setDisplayed(fullText.slice(0, Math.floor(latest)));
                }
            }
        );

        return () => controls.stop();
    }, []);

    // Navigate after animation completes
    useEffect(() => {
        const timer = setTimeout(() => navigate("/ask"), 7000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 5,
                stiffness: 300,
                type: "spring"
            }}
            className="greet"
        >
            <div className="greet-text">
                {displayed}
            </div>
        </motion.div>
    );
}
