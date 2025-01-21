import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStop,faTrash,faPlay} from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import "./talk.css";

// const serverFront = "http://localhost:3001";
const serverFront = 'https://talkapp-e3bo.onrender.com'



function TalkChat({ colors }) {
  const [transcription, setTranscription] = useState("");
  const recognition = useRef(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);

  // Notas
  const [isNotes, setIsNotes] = useState([]);
  const [notes, setNotes] = useState("");


  useEffect(() => {
    const isCompatible = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    if (!isCompatible) {
      alert("El reconocimiento de voz no está disponible en este dispositivo o navegador. Intenta usar Chrome en Android.");
    } else {
      console.log("El reconocimiento de voz está disponible.");
    }
  }, []);

  const solicitarPermisoMicrofono = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => console.log("Permiso del micrófono concedido."))
      .catch(() => alert("Debes habilitar el micrófono para usar esta función."));
  };
  

  useEffect(() => {
    recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
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

  
  const deleteNotes = (id) => {
    axios.delete(`${serverFront}/api/notes/` + id)
    .then(response => {
      setIsNotes(isNotes => isNotes.filter((note) => note._id !== id))
      console.log("Note deleted successfully");
    })
    .catch(err => console.error("Error deleting note:", err))
  }

  const deleteAllNotes = () => {
    axios
        .delete(`${serverFront}/api/notes`)
        .then(response => {
            setIsNotes([]); // Vacía las notas en el estado
            console.log(response.data.message);
        })
        .catch(err => console.error("Error deleting tasks:", err));
  };

  const iniciar = () => {
    solicitarPermisoMicrofono();
    recognition.current.start();
    console.log("Reconocimiento iniciado");
  };

  const detener = () => {
    recognition.current.stop();
  };

  // Función para leer texto en voz alta
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES"; // Idioma: Español
      utterance.pitch = 1; // Tono
      utterance.rate = 1; // Velocidad
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Text-to-Speech no es compatible en este navegador.");
    }
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
        <button onClick={() => addNotes()} className="add-note-button">
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
        <button onClick={deleteAllNotes}> Borrar todo </button>
        <ul>
        {isNotes.map((note) => (
          <li key={note._id} className="note-item">
            {note.notes}
            <div className="note-buttons">
              <button
                onClick={() => speakText(note.notes)}
                className="read-note-button"
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <button onClick={() => deleteNotes(note._id)} className="delete-note-button">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export default TalkChat;
