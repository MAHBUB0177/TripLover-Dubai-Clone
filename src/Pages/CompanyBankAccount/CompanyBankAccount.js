import React, { useEffect, useState } from "react";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import Navbar from "../SharePages/Navbar/Navbar";
import currentYear from "../SharePages/Utility/currentYear";
import ReactPaginate from "react-paginate";
import { getBankAccounts } from "../../common/allApi";

const CompanyBankAccount = () => {
  let [pageCount, setPageCount] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [accountList, setAccountList] = useState([]);
  const bankAccount = async (currentPageNumber) => {
    const response = await getBankAccounts(currentPageNumber,pageSize)
    setAccountList(response.data);
    setPageCount(await response.data.totalPages);
  };
  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
    bankAccount(currentPage);
  };
  useEffect(() => {
    bankAccount(currentPageNumber);
  }, [currentPageNumber]);

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content pb-5">
          <div className="mx-5 pb-5">
            <div className="card pb-5">
              <div className="card-body">
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="tp1">
                    <h4>Company Bank Account</h4>
                    <hr className="my-3" />
                    <table className="table table-bordered align-middle table-striped text-center">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Bank Name</th>
                          <th>Branch Code</th>
                          <th>Branch Name</th>
                          <th>Account Number</th>
                          <th>Address</th>
                          <th>Ruting Number</th>
                        </tr>
                      </thead>
                      <tbody className="lh-1">
                        {accountList.map((item, index) => {
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{item.bankName}</td>
                              <td>{item.branchCode}</td>
                              <td>{item.branchName}</td>
                              <td>{item.accountNumber}</td>
                              <td>{item.address}</td>
                              <td>{item.routingNumber}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <ReactPaginate
                      previousLabel={"previous"}
                      nextLabel={"next"}
                      breakLabel={"..."}
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={3}
                      onPageChange={handlePageClick}
                      containerClassName={"pagination justify-content-center"}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="text-center text-white pt-5 pb-2 mt-5">
          {/* <b>Version</b> 3.1.0 */}
          <strong>Copyright &copy; {currentYear()} All rights reserved.</strong>
        </div>
      </div>
    </div>
  );
};

export default CompanyBankAccount;
