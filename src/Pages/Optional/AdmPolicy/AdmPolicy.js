import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../../SharePages/Footer/Footer";
import { Text } from "@chakra-ui/react";
import { environment } from "../../SharePages/Utility/environment";

let admpolicy = [
  {
    name: "Us Bangla",
    title: "BS",
    path: "https://usbair.com/pdf/adm_policy_usbair.pdf",
  },
  {
    name: "EMIRATES",
    title: "EK",
    path: "http://cdn3.fespit.it/newsletter/adm%20emirates%20policy%20-%20global_tcm440-1638842.pdf",
  },
  {
    name: "QATAR AIR",
    title: "QR",
    path: "https://www.qatarairways.com/content/dam/tradepartners/pdf-files/QAPAP_Qatar-Airways-Partner-Agency-Policies.pdf",
  },
  {
    name: "BANGLADESH BIMAN",
    title: "BG",
    path: "https://www.biman-airlines.com/assets/pdf/terms-conditions/Agency-Debit-Memo-Policy.pdf",
  },
  {
    name: "ETIHAD AIRWAYS",
    title: "EY",
    path: "http://cdn3.fespit.it/newsletter/ETIHAD%20adm%20policy.pdf",
  },
  {
    name: "TURKISH  AIRLINES",
    title: "TK",
    path: "https://www.turkishairlines.com/en-int/flights/agency-information/booking-rules/",
  },
  {
    name: "AIR INDIA",
    title: "AI",
    path: "https://switzerland.airindia.ch/wp-content/uploads/2019/04/AGENCY-DEBIT-MEMO-POLICY-23May18.pdf",
  },
  {
    name: "Air China",
    title: "CA",
    path: "https://Triplover-my.sharepoint.com/personal/update_Triplover_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fupdate%5FTriplover%5Fcom%2FDocuments%2FAir%20China%20GDS%20Booking%20Policy%5F2024%2Epdf&parent=%2Fpersonal%2Fupdate%5FTriplover%5Fcom%2FDocuments&ga=1",
  },
  {
    name: "CATHAY PACIFIC",
    title: "CX",
    path: "https://www.cxagents.com/content/dam/cathay-agents/ca/US_ADCM_Policy-revised_092721.pdf",
  },
  {
    name: "GULF AIR",
    title: "GF",
    path: "https://www.gulfair.com/transparency/agent-debit-memo-policy",
  },
  {
    name: "HIMALAYA AIR",
    title: "H9",
    path: "https://www.himalaya-airlines.com/travel/general-conditions-of-carriage",
  },

  {
    name: "INDIGO",
    title: "6E",
    path: "https://www.goindigo.in/information/bsp-memo-policy.html",
  },
  {
    name: "KUWAIT AIRWAYS",
    title: "KU",
    path: "https://www.kuwaitairways.com/Documents/pdf/KU%20ADM%20POLICY4.pdf",
  },
  {
    name: "MALAYSIA AIRLINES",
    title: "MH",
    path: "https://www.startravel.com.my/wp-content/uploads/2016/10/ADM-Policy-Malaysia-Airlines.pdf",
  },
  {
    name: "MALINDO AIR",
    title: "OD",
    path: "https://www.malindoair.com/ADM-Policy",
  },
  {
    name: "SAUDIA",
    title: "SV",
    path: "https://www.saudia.com/-/media/project/sa/sc/static_files/agencies/saudia-adm-policy-20220501-v1_5.pdf",
  },
  {
    name: "SRILANKAN AIRLINES",
    title: "UL",
    path: "https://aviacenter.ru/files/docs/adm-policy/603-UL--AGENCY_DEBIT_MEMO.pdf",
  },
  {
    name: "Ethiopian Airlines",
    title: "ET",
    path: "https://www.ethiopianairlines.com/td/information/essential-information/adm-policy",
  },

  {
    name: "Copa Airlines",
    title: "CM",
    path: "https://www.copaair.com/en-gs/agencies/all-policies/adm/",
  },
  {
    name: "LATAM",
    title: "LA",
    path: "https://www.latamtrade.com/en_uk/procom/adm_policy",
  },
  {
    name: "Hainan Airlines",
    title: "HU",
    path: "https://www.hnair.com/wcmpage/qt/ADM%20Policy%20%E2%80%93%20Hainan%20Airlines.pdf",
  },
  {
    name: "Fly One airline",
    title: "",
    path: "https://flyone.eu/media/8d83dbc2-16b3-4dff-99c9-a8afd9decdd7/rFp6dA/pdf/ADM%20Policy%20BSP%20Agents.pdf",
  },
  {
    name: "Hahn Air",
    title: "HR",
    path: "https://www.hahnair.com/download/en/52919551da66f2c2408d652c65e0f643/25",
  },
  {
    name: "Thai Airways",
    title: "TG",
    path: "https://www.thaiairways.com/en_NZ/Terms_condition/agency_debit_Memo_policy.page?",
  },
  {
    name: "Africa World Airlines",
    title: "",
    path: "https://www.flyafricaworld.com/adm-policy/",
  },

  {
    name: "Xiamen Air",
    title: "",
    path: "https://www.xiamenair.com/brandnew_CN/raw-content-page/33956.html",
  },
  {
    name: "All Nippon Airways",
    title: "NH",
    path: "https://www.ana.co.jp/businesspartners/en/admacm-policy/",
  },
  {
    name: "Air Astana",
    title: "",
    path: "https://airastana.com/global/en-us/Information/Travel-Information/Important-Notices/Agency-Debit-Memo-Policy",
  },
  {
    name: "VISTARA UK",
    title: "",
    path: "https://www.airvistara.com/trip/contents/s3fs-public/pdf/UK-GDS-and-sales-audit-policy.pdf",
  },
  {
    name: "OMAN AIR",
    title: "WY",
    path: "https://www.omanair.com/storage/ADM-Policy/oman-air-ADM-Policy.pdf",
  },

  {
    name: "Singapore Airlines",
    title: "SQ",
    path: "https://www.singaporeair.com/saar5/pdf/local/it/adm_policy_italy.pdf",
  },
  {
    name: "CHINA EASTERN AIRLINES",
    title: "MU",
    path: "https://aviacenter.ru/en/news/2019/04/25/china-eastern-airlines.-adm-policy-(churning)/",
  },
  {
    name: "CHINA SOUTHERN AIRLINES",
    title: "CZ",
    path: "https://gdshelp.blogspot.com/2019/05/china-southern-airlines-gds-booking-and.html",
  },
  {
    name: "Uzbekistan Airways",
    title: "",
    path: "https://corp.uzairways.com/en/uzbekistan-airways-agency-debit-memo-policy-all-bsp-accredited-agents",
  },
  {
    name: "Nepal Airlines",
    title: "RA",
    path: "https://nepalairlines.com.np/storage/download/1654600716_Agency_Debit_Memo_Policy.pdf",
  },
  {
    name: "PAKISTAN INTERNATIONAL AIRLINE",
    title: "",
    path: "https://www.piac.com.pk/corporate/images/PIA-ADM-POLICY-IN-ALL-BSP.pdf",
  },
];

const AdmPolicy = () => {
  window.scrollTo(0, 0);
  return (
    <>
      <Navbar></Navbar>
      <div className="container my-5 pb-5">
        <div class="card card-body m-3">
          <div className="row">
            <div className="col-lg-12 ">
              <Text fontWeight={700} fontSize="20px" pb={"15px"}>
                ADM Policy
              </Text>
            </div>
          </div>
          <table
            className="table table-bordered table-sm "
            style={{ width: "100%", fontSize: "13px", padding: "20px" }}
          >
            <tbody className="tbody">
              {admpolicy?.map((item) => (
                <tr>
                  <td>
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fw-bold"
                    >
                      {item?.name}
                    </a>
                  </td>
                  <td>
                    {item?.title !== "" ? (
                      <>{item?.title}</>
                    ) : (
                      <span>---</span>
                    )}
                  </td>
                  <td>
                    {item?.title !== "" ? (
                      <img
                        src={environment.s3ArliensImage + `${item?.title}.png`}
                        className="rounded-lg shadow p-1"
                        alt=""
                        width="35px"
                        height="35px"
                      />
                    ) : (
                      <span>---</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default AdmPolicy;
