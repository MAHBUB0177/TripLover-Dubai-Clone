import React from "react";

const CustomInput = ({
  labelName,
  placeholder,
  onChange,
  value,
  require,
  type,
  name,
  message,
  submitBtnClick,
}) => {
  return (
    <div className="form-group">
      <label className="form-label float-start fw-bold" type="">
        {labelName}{require && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        name={name}
        className="form-control border-radius"
        onChange={onChange}
        value={value}
        required
        autocomplete="none"
        spellcheck="false"
        placeholder={placeholder}
      />
      {value === "" && submitBtnClick && (
        <span className="text-danger" style={{ fontSize: "12px" }}>
          {message}
        </span>
      )}
    </div>
  );
};

export default CustomInput;
