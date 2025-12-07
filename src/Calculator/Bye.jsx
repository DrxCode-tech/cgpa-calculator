import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./All.css";

export default function Greet(){
    const navigate = useNavigate();
    useEffect(()=>{
        setTimeout(()=> window.location.replace("about:blank"),3000)
    },[])
    return (
        <motion.div 
        initial={{y:150 , opacity:0}}
        animate={{y:0, opacity:1}}
        transition={{
            duration:5,
            stiffness:300,
            type:"spring"
        }}
        className="greet">
            <div className="greet-text">
                Okay Thanks for trying out the CGPA Calculator App.
            </div>
        </motion.div>
    )
}