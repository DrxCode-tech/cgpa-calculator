import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./All.css";

export default function Ask() {
    const navigate = useNavigate();
    const [exit, setExit] = useState(false);
    const [targetRoute, setTargetRoute] = useState(null);

    // When exit animation finishes, navigate
    useEffect(() => {
        if (exit && targetRoute) {
            const timer = setTimeout(() => {
                navigate(targetRoute);
            }, 600); // exit duration
            return () => clearTimeout(timer);
        }
    }, [exit, targetRoute, navigate]);

    const handleExit = (route) => {
        setTargetRoute(route);
        setExit(true);
    };

    return (
        <AnimatePresence>
            {!exit && (
                <motion.div
                    className="ask"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        initial={{ y: 150, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 5,
                            stiffness: 300,
                            type: "spring"
                        }}
                        className="question"
                    >
                        Do You believe in God ?
                    </motion.div>

                    <div className="button">
                        <motion.button
                            initial={{ x: -150, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                                duration: 5,
                                stiffness: 60,
                                type: "spring"
                            }}
                            whileTap={{ scale: 1.10 }}
                            whileHover={{ scale: 1.05 }}
                            className="cancle"
                            onClick={() => handleExit("/bye")}
                        >
                            No I don't
                        </motion.button>

                        <motion.button
                            initial={{ x: 150, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                                duration: 5,
                                stiffness: 60,
                                type: "spring"
                            }}
                            whileTap={{ scale: 1.10 }}
                            whileHover={{ scale: 1.05 }}
                            className="yes-button"
                            onClick={() => handleExit("/calco")}
                        >
                            Yes I do
                        </motion.button>
                    </div>

                    <div className="text snake-text">Mmuchacho</div>


                </motion.div>
            )}
        </AnimatePresence>
    );
}
