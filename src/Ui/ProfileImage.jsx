import PropTypes from "prop-types";
function ProfileImage({ fileName }) {
  return (
    <div className="w-[3rem] h-[3rem] rounded-full">
      <img
        src={`https://localhost:7257/Uploads/${fileName}`}
        className="w-full h-full rounded-full object-cover"
        alt="online-avatar"
      />
    </div>
  );
}

ProfileImage.propTypes = {
  fileName: PropTypes.string,
};

export default ProfileImage;
