import "./style.scss";
import PropTypes from "prop-types";

export default function ClearTranscript({ clearTranscript, isDisable }) {
  return (
    <button
      className={`${isDisable ? "clear-button-disabled" : "clear-button"}`}
      onClick={clearTranscript}
      disabled={isDisable}
    >
      clear
    </button>
  );
}

ClearTranscript.propTypes = {
  clearTranscript: PropTypes.func.isRequired,
  isDisable: PropTypes.bool.isRequired,
};
