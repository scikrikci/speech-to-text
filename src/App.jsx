import { useEffect, useRef, useState } from "react";

import ToggleSwitch from "./components/ToggleSwitch";
import ClearTranscript from "./components/ClearTranscript";
import LanguageSwitch from "./components/LanguageSwitch";

import "./App.scss";

export default function App() {
  const resultElement = useRef(null);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState(""); // Tüm metin için durum
  const [isRecording, setIsRecording] = useState(false); // Kayıt durumu

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true; // Sürekli dinleme
      recognitionInstance.interimResults = false; // Geçici sonuçları alma

      recognitionInstance.onstart = () => {
        setIsRecording(true); // Kayıt durumunu güncelle
        console.log("Recording started");
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = "";

        // Sonuçları güncelle
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript = event.results[i][0].transcript.trim(); // Sonucu al
          }
        }

        // Mevcut metni güncelle
        setTranscript((prev) => prev + (prev ? " " : "") + finalTranscript);
        resultElement.current.innerText = transcript; // Güncel metni göster

        // Eğer "stop recording" ifadesi geçiyorsa durdurma fonksiyonunu çağır
        if (finalTranscript.toLowerCase().includes("stop recording")) {
          stopRecording();
        }
      };

      recognitionInstance.onerror = (event) => {
        setIsRecording(false); // Hata durumunda kayıt durdurulur
        console.error("Speech recognition error:", event.error);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false); // Tanıma sona erdiğinde durdurulur
        console.log("Speech recognition ended");
      };

      setRecognition(recognitionInstance);
    } else {
      console.error("Speech recognition not supported");
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      recognition.start(); // Dinlemeye başla
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop(); // Dinlemeyi durdur
    }
  };

  const clearTranscript = () => {
    setTranscript(""); // Metni temizle
    resultElement.current.innerText = ""; // Önceki metni temizle
  };

  // ToggleSwitch değiştiğinde kayıt başlat/durdur
  const handleToggle = (checked) => {
    if (checked) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const copyToClipboard = () => {
    if (resultElement.current) {
      resultElement.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <div className="main">
      <h1 className="title">Voice to Text Converter</h1>

      <div className="container-box">
        <LanguageSwitch isDisable={isRecording} isRecognition={recognition} />

        <ToggleSwitch checked={isRecording} onChange={handleToggle} />

        <ClearTranscript
          clearTranscript={clearTranscript}
          isDisable={isRecording}
        />
      </div>

      <div className="text-main">
        <textarea
          id="textarea"
          ref={resultElement}
          value={transcript || "No sound has been recorded yet."}
          readOnly={
            isRecording || transcript === "No sound has been recorded yet."
          }
          onChange={(e) => setTranscript(e.target.value)}
        />
      </div>

      <div className="copy-main" onClick={copyToClipboard}>
        <span className="copy-text">Copy</span>
      </div>
    </div>
  );
}
