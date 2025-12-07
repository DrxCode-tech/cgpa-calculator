import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AutoFollowPop from "./Pop";

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

/* ============================================================================
   Main Dynamic CGPA Calculator
============================================================================ */
function BodyCalco({ system }) {
    const [courses, setCourses] = useState([
        { course: "", grade: "", unit: "" }
    ]);

    const [cgpa, setCgpa] = useState(null);

    const addCourse = () => {
        setCourses([...courses, { course: "", grade: "", unit: "" }]);
    };

    const updateCourse = (index, field, value) => {
        const updated = [...courses];
        updated[index][field] = value;
        setCourses(updated);
    };

    const calculateCGPA = () => {
        let totalPoints = 0;
        let totalUnits = 0;

        for (const row of courses) {
            const grade = Number(row.grade);
            const unit = Number(row.unit);

            if (!isNaN(grade) && !isNaN(unit)) {
                totalPoints += grade * unit;
                totalUnits += unit;
            }
        }

        if (totalUnits === 0) return setCgpa(0);

        // CGPA BASED ON ACTIVE SYSTEM (4 or 5)
        const result = (totalPoints / totalUnits).toFixed(2);
        setCgpa(result);
    };

    return (
        <div>
            {courses.map((item, index) => (
                <div key={index} style={styles.row}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Course Code"
                        value={item.course}
                        onChange={(e) => updateCourse(index, "course", e.target.value)}
                    />

                    {/* Dropdown for Grade */}
                    <select
                        style={styles.select}
                        value={item.grade}
                        onChange={(e) => updateCourse(index, "grade", e.target.value)}
                    >
                        <option value="">Grade</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        {system === "5" && <option value="5">5</option>}
                    </select>

                    <input
                        style={styles.select}
                        type="number"
                        placeholder="Units"
                        min="1"
                        max="6"
                        value={item.unit}
                        onChange={(e) => updateCourse(index, "unit", e.target.value)}
                    />
                </div>
            ))}

            <button style={styles.addButton} onClick={addCourse}>
                + Add Course
            </button>

            <button style={styles.calculateButton} onClick={calculateCGPA}>
                Calculate CGPA
            </button>

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
    const [active, setActive] = useState("5");
    const [popup, setPopup] = useState(false);
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

    return (
        <div style={styles.wrapper}>
            <button style={styles.backButton} onClick={() => navigate(-1)}>
                Back
            </button>

            <h2 style={styles.title}>CGPA Calculator</h2>

            <GradeButton active={active} setActive={setActive} />

            <BodyCalco system={active} />

            <IdlePopup show={popup} close={() => setPopup(false)} />
            <FollowPopup />
            <AutoFollowPop />
        </div>
    );
}

function FollowPopup() {
    const [open, setOpen] = useState(false);

    // Replace later
    const username = "Dx_AI";
    const followLink = "https://twitter.com/intent/follow?screen_name=Dx_AI";

    return (
        <div style={styles.container}>
            <button style={styles.mainButton} onClick={() => setOpen(true)}>
                Follow Me
            </button>

            {open && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.title1}>Follow {username} on X</h2>

                        <a
                            href={followLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.followButton}
                        >
                            Follow
                        </a>

                        <button style={styles.closeButton1} onClick={() => setOpen(false)}>
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
    container: {
        padding: 20,
    },

    mainButton: {
        padding: "12px 22px",
        background: "blue",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "1rem",
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
        padding: "20px",
        width: "100%",
        margin: "0 auto",
        color: "#fff",
        backgroundColor: "#000",
        minHeight: "100vh"
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
        gap: "10px",
        justifyContent: "center",
        marginBottom: "25px"
    },
    gradeButton: {
        padding: "10px 20px",
        border: "1px solid white",
        background: "black",
        color: "white",
        cursor: "pointer",
        borderRadius: "10px"
    },
    gradeButtonActive: {
        background: "white",
        color: "black"
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
        width: "100%",
        padding: "10px",
        background: "#222",
        color: "white",
        border: "1px solid white",
        cursor: "pointer",
        marginBottom: "20px",
        borderRadius: "10px"
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
