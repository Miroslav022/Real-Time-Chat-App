import PropTypes from "prop-types";

function buildImageSrc(fileName) {
  if (!fileName) return "/avatar.jpg";
  if (fileName.startsWith("/")) return `https://localhost:7257${fileName}`;
  return `https://localhost:7257/Uploads/${fileName}`;
}

function ProfileImage({ fileName }) {
  return (
    <div className="w-[3rem] h-[3rem] rounded-full">
      <img
        src={buildImageSrc(fileName)}
        onError={(e) => {
          e.currentTarget.src = "/avatar.jpg";
        }}
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
