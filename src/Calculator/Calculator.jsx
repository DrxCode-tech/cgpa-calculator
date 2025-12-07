import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AutoFollowPop from "./Pop";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

/* ============================================================================
   Grade System Selector (4.0 or 5.0 system)
============================================================================ */
function GradeButton({ active, setActive }) {
    const gradeArr = ["4", "5"];

    return (
        <div style={styles.gradeContainer}>
            {gradeArr.map((but) => (
                <button
                    key={but}
                    onClick={() => setActive(but)}
                    style={{
                        ...styles.gradeButton,
                        ...(active === but ? styles.gradeButtonActive : {})
                    }}
                >
                    {but}-Point System
                </button>
            ))}
        </div>
    );
}

function DeletedRow({course,index,setPopState,setIndexToDelete,setCourses}) {
    const handleCancel = () => {
        setPopState(false);
        setIndexToDelete(null);
    };

    const handleDelete = () => {
        const updated = course.filter((_, i) => i !== index);
        setCourses(updated);
        localStorage.setItem("courses", JSON.stringify(updated));
        setPopState(false);
        setIndexToDelete(null);
    };

    return (
        <div style={styles.popupDeleteBox}>
            <p style={styles.deleteText}>{`Are you sure you want to delete ${course[index].course} course?`}</p>
            <div style={styles.deleteButtonPage}>
                <button onClick={handleCancel} style={styles.cancelCourse}>Cancel</button>
                <button onClick={handleDelete} style={styles.deleteCourse}><Trash2 size={16}/> Delete</button>
            </div>
        </div>
    )
}

/* ============================================================================
   Main Dynamic CGPA Calculator
============================================================================ */
function BodyCalco({ system,handleDelete,courses,setCourses }) {
    const [cgpa, setCgpa] = useState(null);

    const gradeValues = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

    const addCourse = () => {
        const updated = [...courses, { course: "", grade: "", unit: "" }];
        localStorage.setItem("courses", JSON.stringify(updated));
        setCourses(updated);
        autoCalculate(updated);
    };

    const updateCourse = (index, field, value) => {
        const updated = [...courses];
        updated[index][field] = value;
        localStorage.setItem("courses", JSON.stringify(updated));
        setCourses(updated);
        autoCalculate(updated);
    };

    const autoCalculate = (rows) => {
        let totalPoints = 0;
        let totalUnits = 0;

        rows.forEach((row) => {
            const gradePoint = gradeValues[row.grade] ?? null;
            const unit = Number(row.unit);

            if (!isNaN(gradePoint) && !isNaN(unit)) {
                totalPoints += gradePoint * unit;
                totalUnits += unit;
            }
        });

        if (totalUnits === 0) return setCgpa(0);

        const result = (totalPoints / totalUnits).toFixed(2);
        setCgpa(result);
    };

    return (
        <div>
            {courses.map((item, index) => (
                <div key={index} style={styles.row}>
                    {/* Course Code (max 6 characters) */}
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Course Code"
                        value={item.course}
                        maxLength={6}
                        onChange={(e) =>
                            updateCourse(index, "course", e.target.value.toUpperCase())
                        }
                    />

                    {/* Grade Dropdown: A–F */}
                    <select
                        style={styles.select}
                        value={item.grade}
                        onChange={(e) => updateCourse(index, "grade", e.target.value)}
                    >
                        <option value="">Grade</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                    </select>

                    {/* Unit Dropdown: 1–7 */}
                    <select
                        style={styles.select}
                        value={item.unit}
                        onChange={(e) => updateCourse(index, "unit", e.target.value)}
                    >
                        <option value="">Unit</option>
                        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    <motion.button 
                    onClick={() => handleDelete(index)}
                    whileTap={{ scale: 1.2 }}
                    style={styles.deleteButton}>
                        <Trash2 size={25} />
                    </motion.button>
                </div>
            ))}

            {/* Add Button Only */}
            <button style={styles.addButton} onClick={addCourse}>
                + Add Course
            </button>

            {/* Auto-calculated CGPA */}
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

                <button style={styles.closeButton} onClick={close}>
                    Continue
                </button>
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
    },[])
    
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
            <button style={styles.backButton} onClick={() => navigate(-1)}>
                Back
            </button>

            <h2 style={styles.title}>CGPA Calculator</h2>

            <GradeButton active={active} setActive={setActive} />

            <BodyCalco system={active} handleDelete={handleDelete} courses={courses} setCourses={setCourses} />

            <IdlePopup show={popup} close={() => setPopup(false)} />
            <FollowPopup />
            <AutoFollowPop />

            {
                popState && <DeletedRow course={courses} index={indexToDelete} setPopState={setPopState} setIndexToDelete={setIndexToDelete} setCourses={setCourses} />
            }
        </div>
    );
}

function FollowPopup() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const followPopupShown = localStorage.getItem("followPopupShown");
        if (followPopupShown) {
            setOpen(true);
        }
    }, []);

    const handleOpen = () => {
        setOpen(true);
        localStorage.setItem("followPopupShown", true);
    };

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem("followPopupShown", false);
    };

    // Replace later
    const username = "Dx_AI";
    const followLink = "https://twitter.com/intent/follow?screen_name=Dx_AI";

    return (
        <div style={styles.container}>
            <button style={styles.mainButton} onClick={handleOpen}>
                Mmuchacho
            </button>

            {open && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.title1}>Follow on X</h2>

                        <a
                            href={followLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.followButton}
                        >
                            Follow
                        </a>

                        <button style={styles.closeButton1} onClick={handleClose}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}



/* ============================================================================
   Styles (Black + White + Rounded Corners)
============================================================================ */
const styles = {
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
        zIndex: 999,
        borderRadius: "12px",
        padding: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
        color: "red",
        border: "1px solid red",
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
        background: "red",
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
        background: "blue",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "1rem",
        display: "block",
        margin: "auto",
    },

    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
    },

    deleteButton: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0",
        marginLeft: "10px",
        color: "red",
    },
    modal: {
        background: "white",
        padding: "25px",
        width: "85%",
        maxWidth: "350px",
        borderRadius: "20px",
        textAlign: "center",
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
        background: "#1DA1F2",
        color: "white",
        borderRadius: "12px",
        fontSize: "1.1rem",
        textDecoration: "none",
        marginBottom: "15px",
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
        padding: "20px",
        width: "100vw",
        margin: "0 auto",
        color: "#000",
        backgroundColor: "white",
        height: "100vh",
        overflowY: "auto"
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        fontWeight: "600"
    },
    backButton: {
        background: "transparent",
        border: "1px solid white",
        padding: "8px 16px",
        color: "white",
        cursor: "pointer",
        marginBottom: "20px",
        borderRadius: "10px"
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
        flex: 1,
        padding: "8px",
        border: "1px solid white",
        background: "#111",
        color: "white",
        borderRadius: "8px"
    },
    select: {
        flex: 1,
        padding: "8px",
        border: "1px solid white",
        background: "#111",
        color: "white",
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
        borderRadius: "10px",
        margin: "auto",
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
