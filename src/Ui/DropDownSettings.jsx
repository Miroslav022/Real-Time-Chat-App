import PropTypes from "prop-types";

function DropDownSettings({ children }) {
  const style = {
    backgroundColor: "rgba(37, 43, 46, 0.4)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  };
  return (
    <div
      style={style}
      className="absolute right-0 p-3 top-[110%] rounded-[1rem] w-[10rem] text-md z-[9999]"
    >
      {children}
    </div>
  );
}

DropDownSettings.propTypes = {
  handleIsModalOpen: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default DropDownSettings;
