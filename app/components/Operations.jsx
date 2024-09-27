import Image from "next/image";
import PropTypes from "prop-types";

// AddButton Component
const AddButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="btn" aria-label="Add Button">
      <Image
        src="/style.addProduct.svg"
        alt="Add"
        width={20}
        height={20}
        className="w-[20px] h-[20px]"
      />
    </button>
  );
};

// TableCell Component
const TableCell = ({ children, className = "" }) => {
  return <td className={`py-2 px-4 border-r ${className}`}>{children}</td>;
};

// Add PropTypes for better type checking
AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { AddButton, TableCell };
