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
    // Stop any currently playing audio
    if (audio) {
      audio.pause();
    }

    // Create new audio object
    const newAudio = new Audio(`/welcome-audios/${studentId}.mp3`);
    setAudio(newAudio);
    
    // Play the audio
    newAudio.play().catch(e => {
      console.error("Audio playback failed:", e);
      setError(`Audio file for student ${studentId} not found`);
    });
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <img
          src={student ? student.photo : "/default.jpg"}
          alt="Student"
          style={{
            width: "99vw",
            height: "98vh",
            objectFit: "contain",
            borderRadius: "0px",
          }}
        />
      </div>

      <div style={{ display: "none" }}>
        <Scanner
          onScan={(result) => {
            const scannedId = result[0].rawValue;
            setStudentId(scannedId);
            const std = STUDENTS.find((std) => std.id === Number(scannedId));

            if (std) {
              playWelcomeAudio(std.id);
            }
          }}
          scanDelay={100}
          onError={(error) => setError(error as string)}
        />
      </div>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
    </div>
  );
}