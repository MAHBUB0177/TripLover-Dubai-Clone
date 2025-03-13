import React, { useState } from "react";
import { FaChevronCircleDown } from "react-icons/fa";
import { FaChevronCircleUp } from "react-icons/fa";

const RefundableFlightInfo = ({ item }) => {
  const [toggle, setToggle] = useState(true);
  return (
    <div className="row m-2 bg-light rounded">
      <div className="d-flex justify-content-between align-items-center pt-3">
        <div>Refundable Information</div>
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
              {item.length > 0 &&
              item.map((itm)=>
                <tr className="text-start fw-bold text-secondary">
              <td>{itm?.airlineCode}</td>
              <td>
                {itm?.passengerName}({itm?.passengerType})
              </td>
              <td>{itm?.uniqueTransId}</td>
              <td>{itm?.pnr}</td>
              <td>{itm?.ticketNumbers}</td>
              <td>{itm?.status}</td>
            </tr>
              )
             }
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RefundableFlightInfo;
