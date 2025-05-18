import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { STUDENTS } from "../data/students.data";

export default function StudentQRScanner() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const student = STUDENTS.find((std) => std.id === Number(studentId));

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
        src="/backdrop-template.jpg" // Your template image path
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
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
      }}>
        <img
          src={student ? student.photo : "/default.jpg"}
          alt="Student"
          style={{
            width: '60%', // Adjust size as needed
            height: 'auto',
            maxHeight: '70%',
            objectFit: 'contain',
            border: '4px solid white',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
          }}
        />
      </div>

      {/* Name Display (on template) */}
      {student && (
        <div style={{
          position: 'absolute',
          bottom: '20%', // Position on template where name should appear
          left: 0,
          right: 0,
          textAlign: 'center',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px #000',
          zIndex: 3
        }}>
          {student.name}
        </div>
      )}

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