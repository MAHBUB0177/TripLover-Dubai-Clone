import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function FormWithExcelData() {
  const [formData, setFormData] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0]; 
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log(parsedData,"parsedData")

      const formattedData = parsedData.map(row => ({
        field1: row[0] || '', // assuming the first column contains field1 data
        field2: row[1] || '', // assuming the second column contains field2 data
      }));

      setFormData(formattedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedData = [...formData];
    updatedData[index][name] = value;
    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fileInput">Upload Excel File:</label>
              <input
                type="file"
                className="form-control-file"
                id="fileInput"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </div>
            {formData.map((data, index) => (
              <div key={index}>
                <div className="form-group">
                  <label htmlFor={`field1_${index}`}>Field 1:</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`field1_${index}`}
                    name="field1"
                    value={data.field1}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`field2_${index}`}>Field 2:</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`field2_${index}`}
                    name="field2"
                    value={data.field2}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>
              </div>
            ))}
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormWithExcelData;
