import React from "react";
import FooterLR from "../FooterLR/FooterLR";
import Navbar from "../Navbar/Navbar";

const BankDetails = () => {
  window.scrollTo(0,0);
  return (
    <>
    <Navbar></Navbar>
    <div className="hold-transition login-page search-panel-bg pt-3" style={{height:"100%"}}>
      <div className="container mb-3">
        <div className="row">
          <div className="col-md-12">
            <h3 className="text-white fw-bold">Topup Options</h3>
          </div>
          <div className="col-md-12">           
            <h5 className="py-2 text-white">
              We accept all the following payment methods:
            </h5>
            <h4 className="py-2 text-white fw-bold">DIRECT BANKING</h4>
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: "33.33%" }}>Dutch Bangla Bank Limited</th>
                  <th style={{ width: "33.33%" }}>Standard Chartered Bank</th>
                  <th style={{ width: "33.33%" }}>Eastern Bank Limited</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Account Name: Triplover Limited
                    <br />
                    Account Number: 147-110-0018527
                    <br />
                    Branch: Bashundhara Branch, Dhaka
                    <br />
                    Swift Code: DBBLBDDH
                    <br />
                    Routing number: 090260555
                    <br />
                  </td>
                  <td>
                    Account Name: Triplover Limited
                    <br />
                    Account Number: 01-3579246-01
                    <br />
                    Branch: Gulshan Branch, Dhaka
                    <br />
                    Swift Code: SCBLBDDX
                    <br />
                    Routing number: 215261726
                  </td>
                  <td>
                    Account Name: Triplover Limited
                    <br />
                    Account Number: 1041060491993
                    <br />
                    Branch: Gulshan Branch, Dhaka
                    <br />
                    Swift Code: EBLDBDDH011
                    <br />
                    Routing number: 095261720
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: "33.33%" }}>
                    City Bank Limited (The City Bank)
                  </th>
                  <th style={{ width: "33.33%" }}>
                    Islami Bank Bangladesh Limited
                  </th>
                  <th style={{ width: "33.33%" }}>Dhaka Bank</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Account Name: Triplover Limited
                    <br />
                    Account Number: 1233305341001
                    <br />
                    Branch: Gulshan Avenue Branch, Dhaka
                    <br />
                    Swift Code: CIBLBDDH
                    <br />
                    Routing number: 225261732
                  </td>
                  <td>
                    Account Name: Triplover Limited
                    <br />
                    Account Number: 20501770100479609
                    <br />
                    Branch: Gulshan Corporate Branch, Dhaka
                    <br />
                    Swift Code: IBBLBDDH177
                    <br />
                    Routing number:125261724
                  </td>
                  <td>
                    Account Name: Triplover Limited
                    <br />
                    Account Number: 2181000006443
                    <br />
                    Branch: Baridhara Branch, Dhaka
                    <br />
                    Swift Code: DHBLBDDH
                    <br />
                    Routing number: 085260528
                  </td>
                </tr>
              </tbody>
            </table>

            <h4 className="py-2 text-white fw-bold">MOBILE BANKING</h4>
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: "33.33%" }}>Bkash</th>
                  <th>Nagad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01730785686</td>
                  <td>01730785686</td>
                </tr>
              </tbody>
            </table>
            </div>
        </div>
      </div>
      <FooterLR></FooterLR>
    </div>
    </>
  );
};

export default BankDetails;
