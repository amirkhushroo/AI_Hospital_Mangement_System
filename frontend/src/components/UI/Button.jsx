import "./UI.css";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  style = {},
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn ${variant}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;