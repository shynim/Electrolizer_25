import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { STUDENTS } from "../data/students.data";
import "./styles.css";

export default function StudentQRScanner() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [hasScanned, setHasScanned] = useState(false);

  const student = STUDENTS.find((std) => std.id === Number(studentId));

  const [glitchActive, setGlitchActive] = useState(false);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      },
      Math.random() * 5000 + 3000,
    );

    return () => clearInterval(glitchInterval);
  }, []);

  const [imageGlitch, setImageGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageGlitch(true);
      setTimeout(() => setImageGlitch(false), 100 + Math.random() * 200);
    }, 3000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = ''; // Release audio resource
      }
    };
  }, [audio]);

  const playWelcomeAudio = (studentId: number) => {
    if (audio) {
      audio.pause();
      audio.src = ''; // Clean up previous audio
    }

    const newAudio = new Audio(`/welcome-audios/${studentId}.mp3`);
    setAudio(newAudio);

    // Add delay (2 seconds in this example)
    const delay = 400; // milliseconds
    const playTimer = setTimeout(() => {
      newAudio.play().catch(e => {
        console.error("Audio playback failed:", e);
        setError(`Audio file for student ${studentId} not found`);
      });
    }, delay);

    // Cleanup timer if component unmounts
    return () => clearTimeout(playTimer);
  };

  const handleScan = (result: any) => {
  const scannedId = result[0].rawValue;
  setStudentId(scannedId);
  setHasScanned(true);

  const std = STUDENTS.find((std) => std.id === Number(scannedId));
  if (std) playWelcomeAudio(std.id);

  fetch("http://127.0.0.1:5000/qr-scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId: scannedId }),
  })
    .then((response: Response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Failed to notify backend:", error);
    });
};

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          filter: 'grayscale(0%) contrast(75%) brightness(100%)',
        }}
      >
        <source src="/background-video.mp4" type="video/mp4" />
        <img src="/default.jpg" alt="Fallback Background" />
      </video>


      {/* Student Photo and Additional Image (shown after scan) */}
      {hasScanned && (
        <>
          {/* Student Photo */}
          {student?.photo && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '25%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              width: '40%',
              maxWidth: '550px'
            }}>
              <img
                src={student.photo}
                alt="Student"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              />
            </div>
          )}

          {/* Additional Image */}
          <div style={{
            position: 'absolute',
            top: '-12%',
            right: '-7%',
            zIndex: 1,
            width: '100%',
            maxWidth: '1000px',
            transform: imageGlitch ? 'translateX(6px)' : 'translateX(0)',
            transition: 'transform 0.1s ease'
          }}>
            <img
              src="/title.png"
              alt="Additional Content"
              style={{
                width: '100%',
                height: 'auto',

                boxShadow: imageGlitch
                  ? '0 0 15px #f0f, 0 0 30px #f0f'
                  : '0 0 10px #0ff, 0 0 20px #0ff',
                filter: imageGlitch
                  ? 'contrast(200%) brightness(1.5)'
                  : 'contrast(150%) brightness(1.2)',
                clipPath: imageGlitch
                  ? 'polygon(0 0, 100% 0, 100% 80%, 0 80%)'
                  : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                transition: 'all 0.3s ease'
              }}
            />
            {imageGlitch && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '0%',
                background: 'linear-gradient(to bottom, rgba(255,0,255,0.3), transparent)',
                zIndex: 3
              }} />
            )}
          </div>
        </>
      )}

      {/* Name Display (shown after scan) */}
      {hasScanned && student && (
        <div style={{
          position: "relative",
          minHeight: "100vh",
          padding: "16px",
          background: "linear-gradient(to bottom, #111827, #000000)",
        }}>
          <div className={`cyberpunk-container`}>
            <div className="cyberpunk-border"></div>
            <div className={`cyberpunk-box ${glitchActive ? "glitch-active" : ""}`}>
              <div className="circuit-pattern"></div>
              <div className="cyberpunk-content">
                <div className="cyberpunk-field">
                  <div className="cyberpunk-label username-label">Username</div>
                  <div className={`cyberpunk-username ${glitchActive ? "glitch-active" : ""}`}>
                    {student.name}
                    <span className="ping-dot"></span>
                  </div>
                </div>
                <div className="cyberpunk-field">
                  <div className="cyberpunk-label team-label">Team</div>
                  <div className={`cyberpunk-badge ${glitchActive ? "glitch-active" : ""}`}>{student.team}</div>
                </div>
                <div className="cyberpunk-footer">
                  <div className="cyberpunk-line left-line"></div>
                  <div className="cyberpunk-status">................</div>
                  <div className="cyberpunk-line right-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Scanner */}
      <div style={{ display: "none" }}>
        <Scanner
          onScan={handleScan}
          scanDelay={100}
          onError={(error) => setError(error as string)}
        />
      </div>

      {error && (
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
      )}
    </div>
  );
}