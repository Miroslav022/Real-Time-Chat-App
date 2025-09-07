import { GrEmoji } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import propTypes from "prop-types";

function MessageActionBar({ position, onClickHandler }) {
  const absolutePositionClass =
    position === "received" ? "left-[110%]" : "right-[110%]";
  const style = `text-lg absolute ${absolutePositionClass} opacity-0 group-hover:opacity-100 flex translate-y-2 group-hover:translate-y-0 transform transition-all duration-200 bg-myGray rounded-xl pl-[0.1rem] pr-[0.1rem] pt-[0.3rem] pb-[0.3rem] items-center gap-1`;
  return (
    <div className={style} onClick={onClickHandler}>
      {position === "received" ? (
        <>
          <IoIosArrowDown />
          <GrEmoji />
        </>
      ) : (
        <>
          <GrEmoji />
          <IoIosArrowDown />
        </>
      )}
    </div>
  );
}

MessageActionBar.propTypes = {
  position: propTypes.string,
  onClickHandler: propTypes.func,
};

export default MessageActionBar;
