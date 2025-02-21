import PropTypes from "prop-types";
import styles from "../styles/game.module.css"

function Popup({score, onClick, isVisible}) {
  return (
    <section id={styles.popup} className={isVisible ? "" : (styles.hidden)}>
      <div className={styles.popupContent}>
        <h2>GAME OVER</h2>
        <p> You Scored: {score}</p>
        <button className="restart" onClick={onClick}>
          Restart
        </button>
      </div>
    </section>
  );
}

Popup.propTypes = {
  score: PropTypes.number,
  onClick: PropTypes.func,
  isVisible: PropTypes.bool
}

export default Popup;