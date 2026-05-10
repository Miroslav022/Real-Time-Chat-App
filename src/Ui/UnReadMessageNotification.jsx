import PropTypes from "prop-types";

function UnReadMessageNotification({ count }) {
  const display = count > 99 ? "99+" : count > 0 ? String(count) : "";
  if (!display) return null;

  return (
    <div className="bg-myLightBlue text-[0.7rem] text-white font-bold min-w-[1.5rem] h-5 flex items-center justify-center rounded-full px-1">
      <span>{display}</span>
    </div>
  );
}

UnReadMessageNotification.propTypes = {
  count: PropTypes.number,
};

export default UnReadMessageNotification;
