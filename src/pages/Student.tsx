import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { STUDENTS } from "../data/students.data";
import "./styles.css";

export default function StudentQRScanner() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const student = STUDENTS.find((std) => std.id === Number(studentId));

  const [glitchActive, setGlitchActive] = useState(false)

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)
      },
      Math.random() * 5000 + 3000,
    )

    return () => clearInterval(glitchInterval)
  }, [])

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  const playWelcomeAudio = (studentId: number) => {
    if (audio) audio.pause();
    const newAudio = new Audio(`/welcome-audios/${studentId}.mp3`);
    setAudio(newAudio);
    newAudio.play().catch(e => {
      console.error("Audio playback failed:", e);
      setError(`Audio file for student ${studentId} not found`);
    });
  };

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Backdrop/Template Image (fills entire screen) */}
      <img
        src="/default.jpg" // Your template image path
        alt="Event Backdrop"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1
        }}
      />

      {/* Student Photo (appears above backdrop) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '25%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        width: '40%',
        maxWidth: '500px'
      }}>
        <img
          src={student?.photo || "/default.jpg"}
          alt="Student"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        />
      </div>


      {/* Name Display (on template) */}
      {student && (
        <div style={{
          position: "relative",
          minHeight: "100vh",
          padding: "16px",
          background: "linear-gradient(to bottom, #111827, #000000)",
        }}>
          <div className={`cyberpunk-container`}>
            {/* Animated border effect */}
            <div className="cyberpunk-border"></div>

            {/* Main container */}
            <div className={`cyberpunk-box ${glitchActive ? "glitch-active" : ""}`}>
              {/* Circuit pattern overlay */}
              <div className="circuit-pattern"></div>

              {/* Content */}
              <div className="cyberpunk-content">
                {/* Username */}
                <div className="cyberpunk-field">
                  <div className="cyberpunk-label username-label">Username</div>
                  <div className={`cyberpunk-username ${glitchActive ? "glitch-active" : ""}`}>
                    {student.name}
                    <span className="ping-dot"></span>
                  </div>
                </div>

                {/* Team name */}
                <div className="cyberpunk-field">
                  <div className="cyberpunk-label team-label">Team</div>
                  <div className={`cyberpunk-badge ${glitchActive ? "glitch-active" : ""}`}>{student.team}</div>
                </div>

                {/* Decorative elements */}
                <div className="cyberpunk-footer">
                  <div className="cyberpunk-line left-line"></div>
                  <div className="cyberpunk-status">SYSTEM:ACTIVE</div>
                  <div className="cyberpunk-line right-line"></div>
                </div>
              </div >
            </div >
          </div >
        </div>
      )
      }

      {/* Hidden Scanner */}
      <div style={{ display: "none" }}>
        <Scanner
          onScan={(result) => {
            const scannedId = result[0].rawValue;
            setStudentId(scannedId);
            const std = STUDENTS.find((std) => std.id === Number(scannedId));
            if (std) playWelcomeAudio(std.id);
          }}
          scanDelay={100}
          onError={(error) => setError(error as string)}
        />
      </div>

      {
        error && (
          <p style={{
            position: 'absolute',
            bottom: '10px',
            left: 0,
            right: 0,
            color: 'red',
            fontWeight: 'bold',
            textAlign: 'center',
            zIndex: 3
          }}>
            {error}
          </p>
        )
      }
    </div >
  );
}