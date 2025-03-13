import { BsCheckLg } from "react-icons/bs";

const CustomRadioButton = ({ id, value, checked, onChange, imageSrc }) => {
  const imageStyle = {
    height: "60px",
    width: "70px",
    objectFit: "contain",
    filter: checked ? "none" : "",
  };
  return (
    <label className="shadow border-radius border-2 border-primary">
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        className="d-none"
      />
      <div
        className={`d-flex justify-content-center align-items-center  position-relative`}
        style={{ width: "100px", height: "50px", cursor: "pointer" }}
      >
        {checked && (
          <span className="w-5 h-5 border position-absolute top-0 start-0">
            <BsCheckLg className="w-3 h-3 text-primary" />
          </span>
        )}
        <img
          src={imageSrc}
          alt="Logo"
          style={{ width: "70px", height: "40px", objectFit: "contain" }}
          className="img-fluid"
        />
      </div>
    </label>
  );
};

export default CustomRadioButton;
