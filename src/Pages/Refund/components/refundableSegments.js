import React, { useState } from "react";
import { FaChevronCircleDown } from "react-icons/fa";
import { FaChevronCircleUp } from "react-icons/fa";

const RefundableSegmentInfo = ({ item }) => {
  let result=item.filter((item)=>item?.isLegRefundRequested)
  const [toggle, setToggle] = useState(true);
  return (
    <div className="row m-2 bg-light rounded">
      <div className="d-flex justify-content-between align-items-center pt-3">
        <div>Segments Information</div>
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
                <th>ROUTE</th>
                <th>FLIGHT DATE</th>
              </tr>
            </thead>
            <tbody>
              {result?.length > 0 &&
                result
                  .map((itm, index) => (
                    <tr
                      key={index}
                      className="text-start fw-bold text-secondary"
                    >
                      <td>{itm?.legWiseRoute}</td>
                      <td>{itm?.departure}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RefundableSegmentInfo;