import "./UI.css";

const PageTitle = ({ title, subtitle }) => {
  return (
    <div className="page-title">
      <h1>{title}</h1>

      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default PageTitle;