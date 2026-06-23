import { useAuth } from "../context/AuthProvider";
import { useLogout } from "../features/Auth/useLogout";
import { useNavigate } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import {
  IoPersonOutline,
  IoNotificationsOutline,
  IoLogOutOutline,
  IoColorPaletteOutline,
} from "react-icons/io5";
import PropTypes from "prop-types";
import { useSettings } from "../context/SettingsContext";

function SettingsToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-myGray last:border-b-0">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {description && (
          <p className="text-textGray text-xs mt-0.5">{description}</p>
        )}
      </div>
      {/* Toggle */}
      <div
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={`relative flex-shrink-0 w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
          checked ? "bg-myLightBlue" : "bg-myBgDark ring-1 ring-inputBorder"
        }`}
      >
        {/* Thumb */}
        <span
          className={`absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all duration-200 ${
            checked
              ? "left-[calc(100%-21px)] bg-white"
              : "left-[3px] bg-iconsGray"
          }`}
        />
      </div>
    </div>
  );
}

SettingsToggle.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="text-myLightBlue" size={18} />
      <h2 className="text-myLightBlue text-sm font-semibold uppercase tracking-wider">
        {title}
      </h2>
    </div>
  );
}

SectionHeader.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
};

function Section({ children }) {
  return <div className="bg-myGray rounded-xl p-4">{children}</div>;
}

Section.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function SettingsPage() {
  const { user } = useAuth();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const { settings, updateSetting } = useSettings();

  function handleDesktopNotificationsToggle(val) {
    if (val && Notification.permission === "default") {
      Notification.requestPermission();
    }
    updateSetting("desktopNotifications", val);
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-myGray flex-shrink-0">
        <h1 className="text-white text-xl font-bold">Settings</h1>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-4 overflow-y-auto">
        {/* Profile Section */}
        <Section>
          <SectionHeader icon={IoPersonOutline} title="Profile" />
          <div className="flex items-center gap-4 mb-4">
            <ProfileImage fileName={user?.picture} />
            <div className="min-w-0">
              <p className="text-white font-semibold truncate">
                {user?.unique_name}
              </p>
              <p className="text-textGray text-sm truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/home/edituser")}
            className="w-full text-center text-sm text-myLightBlue hover:text-white bg-gray-800 hover:bg-myGray transition-colors rounded-lg py-2 font-medium"
          >
            Edit Profile
          </button>
        </Section>

        {/* Notifications Section */}
        <Section>
          <SectionHeader icon={IoNotificationsOutline} title="Notifications" />
          <SettingsToggle
            label="Message sounds"
            description="Play a sound when you receive a message"
            checked={settings.messageSounds}
            onChange={(val) => updateSetting("messageSounds", val)}
          />
          <SettingsToggle
            label="Desktop notifications"
            description="Show a notification when the app is in the background"
            checked={settings.desktopNotifications}
            onChange={handleDesktopNotificationsToggle}
          />
        </Section>

        {/* Appearance Section */}
        <Section>
          <SectionHeader icon={IoColorPaletteOutline} title="Appearance" />
          <SettingsToggle
            label="Compact mode"
            description="Reduce spacing between messages"
            checked={settings.compactMode}
            onChange={(val) => updateSetting("compactMode", val)}
          />
          <SettingsToggle
            label="Enter to send"
            description="Press Enter to send — Shift+Enter for a new line"
            checked={settings.enterToSend}
            onChange={(val) => updateSetting("enterToSend", val)}
          />
        </Section>

        {/* Account Section */}
        <Section>
          <SectionHeader icon={IoLogOutOutline} title="Account" />
          <div className="text-textGray text-xs mb-3">
            Signed in as{" "}
            <span className="text-white font-medium">{user?.email}</span>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/30 transition-colors rounded-lg py-2.5 font-medium"
          >
            <IoLogOutOutline size={18} />
            Sign out
          </button>
        </Section>
      </div>
    </div>
  );
}
