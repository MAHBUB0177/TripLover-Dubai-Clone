import React from 'react'
import courtries from '../../../JSON/countries.json'

const CustomSelect = ({ labelName,
    onChange,
    value,
    require,
    name,}) => {
  return (
    <div className="form-group">
    <label
      className="form-label float-start fw-bold"
      type=""
    >
      {labelName}{require && <span className="text-danger">*</span>}
    </label>
    <div className="input-group mb-3">
      <select
        name={name}
        className="form-select border-radius"
        onChange={onChange}
        value={value}
        required
      >
        <option value="BD">
          Bangladesh
        </option>
        {courtries.map(
          (item, index) => {
            return (
              <option
                key={index}
                value={item.code}
              >
                {item.name}
              </option>
            );
          }
        )}
      </select>
    </div>
  </div>
  )
}

export default CustomSelect