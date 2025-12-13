import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AutoFollowPop from "./Pop";
import Install from "./Install";
import { Trash2, ArrowLeftIcon } from "lucide-react";
import { motion } from "framer-motion";

/* ============================================================================
   Grade System Selector (4.0 or 5.0 system)
============================================================================ */
function GradeButton({ active, setActive }) {
    const gradeArr = ["4", "5"];

    return (
        <div style={styles.gradeContainer}>
            {gradeArr.map((but) => (
                <motion.button
                    whileHover={{ scale: 1.09 }}
                    key={but}
                    onClick={() => setActive(but)}
                    style={{
                        ...styles.gradeButton,
                        ...(active === but ? styles.gradeButtonActive : {})
                    }}
                >
                    {but}-Point System
                </motion.button>
            ))}
        </div>
    );
}

function DeletedRow({ course, index, setPopState, setIndexToDelete, setCourses }) {

    const handleCancel = () => {
        setPopState(false);
        setIndexToDelete(null);
    };

    const handleDelete = () => {
        const updated = course.filter((_, i) => i !== index);

        setCourses(updated);
        localStorage.setItem("courses", JSON.stringify(updated));

        // IMPORTANT: trigger CGPA recalculation
        if (typeof window.autoRecalcCgpa === "function") {
            window.autoRecalcCgpa(updated);
        }

        setPopState(false);
        setIndexToDelete(null);
    };


    return (
        <div style={styles.popupDeleteBox}>
            <p style={styles.deleteText}>{`Are you sure you want to delete ${course[index].course} course?`}</p>
            <div style={styles.deleteButtonPage}>
                <motion.button
                    whileHover={{ scale: 1.09 }}
                    onClick={handleCancel} style={styles.cancelCourse}>Cancel</motion.button>
                <motion.button
                    whileHover={{ scale: 1.09 }}
                    onClick={handleDelete} style={styles.deleteCourse}><Trash2 size={16} /> Delete</motion.button>
            </div>
        </div>
    )
}

/* ============================================================================
   Main Dynamic CGPA Calculator
============================================================================ */
function BodyCalco({ system, handleDelete, courses, setCourses }) {
    const [cgpa, setCgpa] = useState(null);

    // Correct grading scales
    const gradeValues =
        system === "5"
            ? { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 } // University
            : { A: 4, B: 3, C: 2, D: 1, F: 0 };     // Polytechnic

    // Load on first mount
    useEffect(() => {
        const storedCourses = JSON.parse(localStorage.getItem("courses"));
        const storedCgpa = JSON.parse(localStorage.getItem("cgpa"));

        if (storedCourses && Array.isArray(storedCourses)) {
            setCourses(storedCourses);
            autoCalculate(storedCourses, false);
        }

        if (storedCgpa !== null) {
            setCgpa(storedCgpa);
        }
    }, []);

    // Recalculate whenever system changes
    useEffect(() => {
        if (courses.length > 0) autoCalculate(courses);
    }, [system]);

    // Add new course row
    const addCourse = () => {
        const updated = [...courses, { course: "", grade: "", unit: "" }];
        setCourses(updated);
        localStorage.setItem("courses", JSON.stringify(updated));
        autoCalculate(updated);
    };

    // Update a field in a row
    const updateCourse = (index, field, value) => {
        const updated = [...courses];
        updated[index][field] = value;

        setCourses(updated);
        localStorage.setItem("courses", JSON.stringify(updated));
        autoCalculate(updated);
    };

    // CGPA Calculation
    const autoCalculate = (rows, save = true) => {
        let totalPoints = 0;
        let totalUnits = 0;

        rows.forEach((row) => {
            if (!row.grade || !row.unit) return;

            const gp = gradeValues[row.grade];
            const unit = Number(row.unit);

            if (!isNaN(gp) && !isNaN(unit)) {
                totalPoints += gp * unit;
                totalUnits += unit;
            }
        });

        if (totalUnits === 0) {
            const stored = JSON.parse(localStorage.getItem("cgpa"));
            setCgpa(stored ?? null);
            return;
        }

        const result = (totalPoints / totalUnits).toFixed(2);
        setCgpa(result);

        if (save) {
            localStorage.setItem("cgpa", JSON.stringify(result));
        }
    };

    return (
        <div>
            {courses.map((item, index) => (
                <div key={index} style={styles.row}>
                    <motion.input
                        style={styles.input}
                        type="text"
                        placeholder="Course Code"
                        maxLength={6}
                        value={item.course}
                        onChange={(e) =>
                            updateCourse(index, "course", e.target.value.toUpperCase())
                        }
                    />

                    <motion.select
                        style={styles.select}
                        value={item.grade}
                        onChange={(e) =>
                            updateCourse(index, "grade", e.target.value)
                        }
                    >
                        <option value="">Grade</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        {system === "5" && <option value="E">E</option>}
                        <option value="F">F</option>
                    </motion.select>

                    <motion.select
                        style={styles.select}
                        value={item.unit}
                        onChange={(e) =>
                            updateCourse(index, "unit", e.target.value)
                        }
                    >
                        <option value="">Unit</option>
                        {[1, 2, 3, 4, 5, 6, 7].map((u) => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </motion.select>

                    <motion.button
                        onClick={() => handleDelete(index)}
                        style={styles.deleteButton}
                    >
                        <Trash2 size={25} />
                    </motion.button>
                </div>
            ))}

            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={styles.Text}
            >
                Input all results earned from year1 till date including all F's and carryovers for correct calculation
            </motion.div>

            {/* ADD BUTTON FIXED */}
            <motion.button
                style={styles.addButton}
                onClick={addCourse}
                whileTap={{ scale: 0.9 }}
            >
                + Add Course
            </motion.button>

            {cgpa !== null && (
                <div style={styles.cgpaDisplay}>
                    CGPA on {system}-Point Scale: <strong>{cgpa}</strong>
                </div>
            )}
        </div>
    );
}




/* ============================================================================
   POPUP (after 300 seconds inactivity)
============================================================================ */
function IdlePopup({ show, close }) {
    if (!show) return null;

    return (
        <div style={styles.popupOverlay}>
            <div style={styles.popupBox}>
                <h3>You’ve been inactive</h3>
                <p>Do you want to continue?</p>

                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{
                        duration: 3,
                        type: "spring",
                        stiffnees: 300
                    }}
                    style={styles.closeButton} onClick={close}>
                    Continue
                </motion.button>
            </div>
        </div>
    );
}

/* ============================================================================
   MAIN PAGE
============================================================================ */
export default function Calco() {
    const [courses, setCourses] = useState([
        { course: "", grade: "", unit: "" }
    ]);

    useEffect(() => {
        const fetchCor = async () => {
            try {
                const cors = await JSON.parse(localStorage.getItem("courses"));
                if (cors) {
                    setCourses(cors);
                }
            } catch (error) {
                console.error("Failed to fetch courses from localStorage:", error);
            }
        };

        fetchCor();
    }, [])

    const [indexToDelete, setIndexToDelete] = useState(null);
    const [active, setActive] = useState("5");
    const [popup, setPopup] = useState(false);
    const [popState, setPopState] = useState(false);
    const navigate = useNavigate();

    // 300 seconds inactivity popup
    useEffect(() => {
        let timeout;

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => setPopup(true), 600000);
        };

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        resetTimer();

        return () => {
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            clearTimeout(timeout);
        };
    }, []);

    const handleDelete = (index) => {
        setPopState(true);
        setIndexToDelete(index);
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.brand}>
                <motion.button
                    whileHover={{ scale: 1.09 }}
                    style={styles.backButton} onClick={() => navigate(-1)}>
                    <ArrowLeftIcon size={24} /> Back
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.025 }}
                    style={styles.mainButton}>
                    Mmuchacho
                </motion.button>
            </div>

            <h2 style={styles.title}>CGPA Calculator</h2>

            <GradeButton active={active} setActive={setActive} />

            <BodyCalco system={active} handleDelete={handleDelete} courses={courses} setCourses={setCourses} />

            <IdlePopup show={popup} close={() => setPopup(false)} />
            {
                popState && <DeletedRow course={courses} index={indexToDelete} setPopState={setPopState} setIndexToDelete={setIndexToDelete} setCourses={setCourses} />
            }
            <FollowPopup />
            <AutoFollowPop />
            <Install />
        </div>
    );
}

function FollowPopup() {
    const followLink = "https://twitter.com/intent/follow?screen_name=ClassicTec19368";

    return (
        <div style={styles.container}>
            <motion.a
                whileHover={{ scale: 1.025 }}
                href={followLink}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.followButton}
            >
                Level up your CGPA, Follow on X
            </motion.a>
        </div>
    );
}



/* ============================================================================
   Styles (Black + White + Rounded Corners)
============================================================================ */
const styles = {
    brand: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding:"4px",
        width:"100%",
    },
    popupDeleteBox: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translateY(-50%) translateX(-50%)",
        background: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
        borderRadius: "12px",
        padding: "10px",
        boxShadow: "0 10px -10px rgba(0, 0, 0, 0.1)",
    },
    deleteText: {
        textAlign: "center",
        fontWeight: "600",
        color: "black",
        padding: "10px",
    },
    deleteButtonPage: {
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
        gap: "40px"
    },
    cancelCourse: {
        padding: "8px 16px",
        color: "black",
        border: "1px solid black",
        borderRadius: "12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
    },
    container: {
        padding: "20px",
        textAlign: "center",
        borderRadius: "12px",
        color: "red",
    },
    deleteCourse: {
        padding: "8px 16px",
        background: "black",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
    },
    mainButton: {
        padding: "12px 22px",
        fontSize: "1rem",
        display: "block",
        borderRadius:"15px",
        border:"none",
        fontWeight: 900,
        letterSpacing: "2px",
        color: "rgb(20, 20, 20)",     // fixed
    },

    deleteButton: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0",
        marginLeft: "10px",
        color: "black",
    },
    modal: {
        background: "white",
        padding: "25px",
        width: "85%",
        maxWidth: "350px",
        borderRadius: "20px",
        textAlign: "center",
        zIndex: 10,
    },

    title1: {
        marginBottom: "20px",
        fontSize: "1.4rem",
        fontWeight: "600",
        color: "black",
    },

    followButton: {
        display: "block",
        padding: "12px",
        background: "white",
        color: "black",
        borderRadius: "12px",
        fontSize: "1.1rem",
        textDecoration: "none",
        marginBottom: "15px",
        border:"2px solid black",
        width:"30%",
        margin:"auto auto",
    },

    closeButton1: {
        padding: "10px 20px",
        background: "#444",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    wrapper: {
        userSelect: "none",
        boxSizing: "border-box",
        padding: "10px",
        width: "100%",
        color: "#000",
        backgroundColor: "white",
        height: "100vh",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        fontWeight: "600"
    },
    backButton: {
        background: "black",
        padding: "8px 16px",
        color: "white",
        cursor: "pointer",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px"
    },
    gradeContainer: {
        display: "flex",
        gap: "50px",
        justifyContent: "center",
        marginBottom: "25px"
    },
    gradeButton: {
        width: "120px",
        height: "120px",
        border: "2px solid black",
        background: "white",
        color: "black",
        cursor: "pointer",
        borderRadius: "50%",
        fontWeight: "bold",
    },
    gradeButtonActive: {
        background: "black",
        color: "white"
    },
    row: {
        display: "flex",
        gap: "10px",
        marginBottom: "15px"
    },
    input: {
        width: "100%",
        padding: "8px",
        border: "1px solid black",
        background: "white",
        color: "black",
        borderRadius: "8px"
    },
    select: {
        width: "100%",
        padding: "8px",
        border: "1px solid black",
        background: "white",
        color: "black",
        borderRadius: "8px"
    },
    addButton: {
        display: "block",
        width: "30%",
        padding: "10px",
        background: "#222",
        color: "white",
        border: "1px solid white",
        cursor: "pointer",
        marginBottom: "20px",
        marginTop: "20px",
        borderRadius: "10px",
        margin: "auto",
    },
    Text: {
        display: "block",
        width: "80%",
        cursor: "pointer",
        marginBottom: "20px",
        margin: "auto",
        textAlign: "center",
        padding: "20px",
    },
    calculateButton: {
        width: "100%",
        padding: "12px",
        background: "white",
        color: "black",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        borderRadius: "10px"
    },
    cgpaDisplay: {
        marginTop: "20px",
        textAlign: "center",
        fontSize: "20px"
    },
    popupOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    popupBox: {
        background: "#000",
        padding: "25px",
        border: "1px solid white",
        width: "80%",
        maxWidth: "350px",
        textAlign: "center",
        borderRadius: "12px"
    },
    closeButton: {
        marginTop: "15px",
        padding: "10px 20px",
        background: "white",
        color: "black",
        border: "none",
        cursor: "pointer",
        borderRadius: "10px"
    }
};
