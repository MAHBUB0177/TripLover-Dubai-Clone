import React, { useEffect, useState } from "react";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import NoDataFound from "../../component/noDataFound";
import TableLoader from "../../component/tableLoader";

const FarePassengerList = ({ passengerData }) => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [loader, setLoader] = useState(false);
  const pageCount = Math.ceil(passengerData.length / pageSize);
  const currentPageData = passengerData.slice(
    (currentPageNumber - 1) * pageSize,
    currentPageNumber * pageSize
  );

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
  };

  return (
    <div className="mx-lg-5 mx-md-5 mx-sm-1">
      <div className="card mt-3">
        <div className="card-body">
          <div className="tab-content ">
            <div className="tab-pane fade show active" id="tp1">
              <div className="table-responsive">
                <table
                  className="table table-bordered text-center mt-1 table-sm"
                  style={{ width: "100%", fontSize: "13px" }}
                >
                  <thead className="text-center fw-bold button-color text-white">
                    <tr>
                      <th>SL</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Gender</th>
                      <th>DOB</th>
                      <th>Passport No.</th>
                      <th>Passport Exp. Date</th>
                    </tr>
                  </thead>
                  {!loader && (
                    <tbody className="lh-1 tbody ">
                      {currentPageData?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              {(currentPageNumber - 1) * pageSize + index + 1}
                            </td>
                            <td className="text-start">
                              {item?.title} {item?.first} {item?.last}
                            </td>
                            <td>{item.email}</td>
                            <td>{item.phone}</td>
                            <td>{item.gender}</td>
                            <td>
                              {moment(item.dateOfBirth).format("DD-MMMM-yyyy")}
                            </td>
                            <td>
                              {item.documentNumber !== null
                                ? item.documentNumber
                                : "N/A"}
                            </td>
                            <td>
                              {item.expireDate !== null
                                ? moment(item.expireDate).format("DD-MMMM-yyyy")
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  )}
                </table>

                {loader && <TableLoader />}
                {passengerData?.length === 0 && !loader && <NoDataFound />}
              </div>

              {passengerData?.length > 0 && !loader && (
                <ReactPaginate
                  previousLabel={
                    <MdOutlineSkipPrevious
                      style={{ fontSize: "18px" }}
                      color="#ed8226"
                    />
                  }
                  nextLabel={
                    <MdOutlineSkipNext
                      style={{ fontSize: "18px" }}
                      color="#ed8226"
                    />
                  }
                  breakLabel={"..."}
                  pageCount={pageCount}
                  forcePage={currentPageNumber - 1}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination justify-content-center py-2"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarePassengerList;
