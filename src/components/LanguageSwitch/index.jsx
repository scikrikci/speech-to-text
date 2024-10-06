import { useRef, useState } from "react";
import PropTypes from "prop-types";
import "./style.scss";

export default function LanguageSwitch({ isDisable, isRecognition }) {
  const [selectedLanguage, setSelectedLanguage] = useState("tr-TR");
  const selectRef = useRef(null);

  const handleLanguageChange = (event) => {
    isRecognition.lang = event.target.value;
    setSelectedLanguage(event.target.value);
  };

  const handleSelectOpen = () => {
    if (selectRef.current) {
      selectRef.current.focus();
      selectRef.current.click();
    }
  };

  const languages = [
    { code: "tr-TR", name: "Turkish", key: 1 },
    { code: "en-US", name: "English", key: 2 },
    { code: "es-ES", name: "Spanish", key: 3 },
    { code: "fr-FR", name: "French", key: 4 },
    { code: "de-DE", name: "German", key: 5 },
  ];

  LanguageSwitch.propTypes = {
    isDisable: PropTypes.bool,
    isRecognition: PropTypes.shape({
      lang: PropTypes.string,
    }).isRequired,
  };

  return (
    <div className="language-main" onClick={handleSelectOpen}>
      <select
        ref={selectRef}
        className="language-menu"
        disabled={isDisable}
        value={selectedLanguage}
        onChange={handleLanguageChange}
      >
        {languages.map((language) => (
          <option value={language.code} key={language.key}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}
