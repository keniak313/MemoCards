import PropTypes from "prop-types";
import styles from "../styles/card.module.css";

function Card({ name, image, onClick, ref }) {
  return (
    <button
      className={`${styles.card}`}
      name={name}
      onClick={onClick}
      ref={ref}
    >
      <img src={`${image}`} alt={name} />
      <h3>{name}</h3>
    </button>
  );
}

Card.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  onClick: PropTypes.func,
  ref: PropTypes.object
}

export default Card;
