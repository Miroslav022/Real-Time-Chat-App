import { useState } from "react";
import propTypes from "prop-types";
import { useContacts } from "../features/Contacts/useContacts";
import ProfileImage from "./ProfileImage";
import { useGroupConverstaion } from "../features/Conversations/useGroupConverstaion";
// import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";

export default function CreateGroupModal({ onClose }) {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { contacts } = useContacts();
  const { createGroup } = useGroupConverstaion();
  // const { data: user } = useQuery({
  //   queryKey: ["currentUser"],
  // });
  const { user } = useAuth();
  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      const data = {
        groupName,
        participantIds: selectedUsers.sort(),
        createdById: user.sub,
      };
      console.log(data);
      createGroup(data);
      onClose();
    } else {
      alert("Please enter a group name and select at least one user.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 bg-[rgba(255,255,255,0.1)]">
      <div className="w-full bg-myBgBlue max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create Group</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="groupName"
            type="text"
            placeholder="Group Name"
            className="w-full mb-4 p-2 border rounded"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <div className="max-h-40 overflow-y-auto mb-4 p-2 rounded">
            {contacts.map((user) => (
              <div className="pb-2 pt-2" key={user.userId}>
                <label className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex gap-2 items-center">
                    <ProfileImage fileName={user.profilePicture} />
                    <span>{user.username}</span>
                  </div>
                  <input
                    type="checkbox"
                    name="userId"
                    checked={selectedUsers.includes(user.userId)}
                    onChange={() => toggleUser(user.userId)}
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 btn btn-error rounded"
            >
              Cancel
            </button>
            <button className="px-4 py-2 text-white rounded btn bg-myLightBlue">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateGroupModal.propTypes = {
  contacts: propTypes.array,
  onClose: propTypes.func,
  onSubmit: propTypes.func,
};
