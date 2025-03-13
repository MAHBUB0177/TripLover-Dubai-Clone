import React, { useEffect, useState } from "react";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { agentstaffHistory } from "../../common/allApi";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import NoDataFound from "../../component/noDataFound";
import TableLoader from "../../component/tableLoader";

const StaffHistory = ({ userId }) => {
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [historyList, setHistoryList] = useState();
  const [loader, setLoader] = useState(false);

  const handleGetStaffHistory = (currentPageNumber) => {
    const getData = async () => {
      setLoader(true);
      await agentstaffHistory(userId, currentPageNumber, pageSize)
        .then((response) => {
          setHistoryList(response?.data?.data?.data);
          setPageCount(response?.data?.data?.totalPages);
          setLoader(false);
        })
        .catch(() => {
          setLoader(false);
        });
    };
    getData();
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
    handleGetStaffHistory(currentPage);
  };

  useEffect(() => {
    handleGetStaffHistory(currentPageNumber);
  }, [currentPageNumber]);

  return (
    <div className="my-3">
      <div className="table-responsive">
        <table
          className="table table-lg"
          style={{ width: "100%", fontSize: "13px" }}
        >
          <thead className="text-start fw-bold bg-secondary">
            <tr>
              <th>SL</th>
              <th> Action</th>
              <th>Action Details</th>
              <th>Created Date</th>
              <th>Created By</th>
            </tr>
          </thead>
          {!loader && (
            <tbody className="tbody ">
              {historyList?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.action}</td>
                    <td title={item.actionDetails}>
                      {item.actionDetails?.substr(0, 20)}
                      {item.actionDetails?.length > 20 ? <>...</> : <></>}{" "}
                    </td>
                    <td> {moment(item.createdDate).format("DD-MMMM-yyyy")}</td>
                    <td>{item?.creatorName}</td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>

        {loader && <TableLoader />}
        {historyList?.length === 0 && !loader && <NoDataFound />}
      </div>
      <div className="d-flex justify-content-end">
        {historyList?.length > 0 && !loader && (
          <ReactPaginate
            previousLabel={
              <div className="d-flex align-items-center gap-1">
                <MdOutlineSkipPrevious
                  style={{ fontSize: "18px" }}
                  color="#ed8226"
                />{" "}
                Prev
              </div>
            }
            nextLabel={
              <div className="d-flex align-items-center gap-1">
                <MdOutlineSkipNext
                  style={{ fontSize: "18px" }}
                  color="#ed8226"
                />
                Next
              </div>
            }
            breakLabel={"..."}
            pageCount={pageCount}
            forcePage={currentPageNumber - 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={
              "pagination justify-content-center py-2 border rounded"
            }
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
  );
};

export default StaffHistory;
