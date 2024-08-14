import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useNavigate } from "react-router-dom";
function UserPhone() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  function submitStep1() {
    navigate("/login/step-2");
  }
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-5xl">Enter phone number</h1>
      <p className="text-xl">Select a country and enter your phone number.</p>
      <PhoneInput
        containerClassName="custom-phone-input-container"
        inputClassName="custom-phone-input"
        defaultCountry="rs"
        value={phone}
        onChange={(phone) => setPhone(phone)}
      />

      <button
        onClick={submitStep1}
        className="btn btn-primary bg-myLightBlue text-xl border-myLightBlue"
      >
        Next
      </button>
    </div>
  );
}

export default UserPhone;
