import React, { useState } from "react";
import { FaChevronCircleDown } from "react-icons/fa";
import { FaChevronCircleUp } from "react-icons/fa";

const VoidableFlightInfo = ({ item }) => {
  const [toggle, setToggle] = useState(true);
  return (
    <div className="row m-2 bg-light rounded">
      <div className="d-flex justify-content-between align-items-center pt-3">
        <div>Voidable Information</div>
        {toggle ? (
          <FaChevronCircleUp onClick={() => setToggle((pre) => !pre)} />
        ) : (
          <FaChevronCircleDown onClick={() => setToggle((pre) => !pre)} />
        )}
      </div>
      <div className="py-2 table-responsive">
        {toggle && (
          <table
            className="table table-lg"
            style={{ width: "100%", fontSize: "13px" }}
          >
            <thead className="text-start fw-bold bg-secondary">
              <tr>
                <th>AIRLINE</th>
                <th>PASSENGER NAME & TYPE</th>
                <th>UNIQUETRANSID</th>
                <th>PNR</th>
                <th>TICKET NUMBER</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-start fw-bold text-secondary">
                <td>{item?.airlineCode}</td>
                <td>
                  {item?.passengerName}({item?.passengerType})
                </td>
                <td>{item?.uniqueTransId}</td>
                <td>{item?.pnr}</td>
                <td>{item?.ticketNumbers}</td>
                <td>{item?.status}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VoidableFlightInfo;
