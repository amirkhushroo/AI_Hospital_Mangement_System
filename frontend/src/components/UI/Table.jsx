import "./UI.css";

const Table = ({ children }) => {
  return (
    <div className="table-wrapper">
      <table className="custom-table">
        {children}
      </table>
    </div>
  );
};

export default Table;