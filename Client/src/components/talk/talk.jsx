import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStop } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import "./talk.css";

const serverFront = "http://localhost:3001";

function TalkChat({ colors }) {
  const [transcription, setTranscription] = useState("");
  const recognition = useRef(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);

  // Notas
  const [isNotes, setIsNotes] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.current.lang = "es-ES";

    recognition.current.onstart = () => {
      setLoading(true);
    };

    recognition.current.onend = () => {
      setLoading(false);
    };

    recognition.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Transcripción recibida:", transcript);
      setNotes(transcript);

      if (event.results[event.results.length - 1].isFinal) {
        console.log("Transcripción finalizada:", transcript);
        setTranscription(transcript); // Guardar la transcripción final
        // addNotes(transcript); // Agregar automáticamente la nota
      }

      // Cambiar color de fondo si coincide con algún color
      colors.forEach((color) => {
        if (transcript.includes(color.name)) {
          setBgColor(color.code);
        }
      });

      // Agregar la transcripción como nota
      addNotes(transcript);
    };
  }, [colors]);

  useEffect(() => {
    axios
      .get(`${serverFront}/api/notes`)
      .then((response) => {
        setIsNotes(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const addNotes = (note = notes) => {
    if (note.trim() !== "") {
      axios
        .post(`${serverFront}/api/notes`, { notes: note })
        .then((response) => {
          const newNote = response.data;
          setIsNotes([...isNotes, newNote]);
          setNotes(""); // Limpiar campo de texto
          setTranscription(""); // Limpiar transcripción
        })
        .catch((err) => console.log(err));
    }
  };

  const iniciar = () => {
    recognition.current.start();
    console.log("Reconocimiento iniciado");
  };

  const detener = () => {
    recognition.current.stop();
  };

  return (
    <div
      className="chat-container"
      style={{ backgroundColor: bgColor, minHeight: "100vh", padding: "20px" }}
    >
      <div className="input-container">
        <input
          type="text"
          value={notes}
          placeholder="Escribe una nota o usa el micrófono..."
          onChange={(event) => setNotes(event.target.value)}
          className="transcription-input"
        />
        <button  onClick={() => addNotes()} className="add-note-button">
          Agregar Nota
        </button>
        {loading && (
          <ThreeDots
            height="40"
            width="40"
            color="#6200ea"
            ariaLabel="loading"
            visible={true}
          />
        )}
      </div>
      <div className="button-container">
        <button onClick={iniciar} className="icon-button">
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
        <button onClick={detener} className="icon-button">
          <FontAwesomeIcon icon={faStop} />
        </button>
      </div>
      <div className="notes-container">
        <h3>Tus Notas:</h3>
        <ul>
          {isNotes.map((note, index) => (
            <li key={index} className="note-item">
              {note.notes}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TalkChat;
