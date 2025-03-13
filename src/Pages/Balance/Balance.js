import axios from "axios";
import $ from "jquery";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../SharePages/Footer/Footer";
import Navbar from "../SharePages/Navbar/Navbar";
import SideNavBar from "../SharePages/SideNavBar/SideNavBar";
import {
  environment,
  onlineToprestrictedUsers,
} from "../SharePages/Utility/environment";
import "./Balance.css";

import { Box, Radio, RadioGroup, useDisclosure } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dbbl from "../../images/bank/DBBL.jpg";
import isbl from "../../images/bank/ISB.jpg";
import city from "../../images/bank/city.jpg";
import brack from "../../images/bank/BB.jpg";
import commercial from "../../images/bank/UCB.jpg";
import pubali from "../../images/bank/pubali_bank.jpg";
import scb from "../../images/bank/scb.png";
import {
  addMyBankAccount,
  bankAccounts,
  depositRequest,
  editMyBankAccount,
  gatewayChargesByAgent,
  getAgentBankAccountsByAgent,
  getAgentBankAccountsList,
  getAgentDeposits,
  getAgentDepositSts,
  getBranchesList,
  getGatewayCharges,
  getGatewayChargesSSl,
  getPaymentGatewayCharges,
  requestOnlineDepositBrac,
  requestOnlineDepositSSL,
  uploadAttachment,
} from "../../common/allApi";
import UsbPay from "./usbpay";
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import NoDataFound from "../../component/noDataFound";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const Balance = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  let [pageCount, setPageCount] = useState(0);
  let [pageCountBank, setPageCountBank] = useState(0);
  let [pageSize, setPageSize] = useState(10);
  let [currentPageNumber, setCurrentPageNumber] = useState(1);
  let [currentPageNumberBank, setCurrentPageNumberBank] = useState(1);
  let [depositTypeId, setDepositType] = useState(1);
  let [paymentTypeId, setPaymentType] = useState(1);
  let [checkNo, setCheckNo] = useState("");
  let [checkBank, setCheckBank] = useState("");
  let [checkIssueDate, setCheckIssueDate] = useState();
  let [reference, setReference] = useState("");
  let [depositInAccountId, setDepositInAccount] = useState(0);
  let [vendorAmount, setVendorAmount] = useState("");
  let [amount, setAmount] = useState("");
  let [gateWayCharge, setGateWayCharge] = useState(0);
  let [attachment, setAttachment] = useState("");
  let [depositFromAccountId, setDepositFromAccount] = useState(0);
  let [depositDate, setDepositDate] = useState();
  let [depositDateBkash, setDepositDateBkash] = useState("");
  let [depositDateNogod, setDepositDateNogod] = useState("");
  let [transferDate, setTransferDate] = useState("");
  let [branchId, setBranch] = useState(0);
  let [transactionId, setTransaction] = useState("");
  let [balanceList, setBalanceList] = useState([]);
  let [cityList, setCityList] = useState([]);
  let [agentBankAccountList, setAgentBankAccountList] = useState([]);
  let [agentAccountDropdownList, setAgentAccountDropdownList] = useState([]);
  let [currentItem, setCurrentItem] = useState({});
  let [accountList, setAccountList] = useState([]);
  let [bankAccountList, setBankAccountList] = useState([]);
  let [onlineAmount, setOnlineAmount] = useState("");
  const [remarkForBrackSSl, setRemarkForBrackSSL] = useState("");
  let [onlineChargeBrck, setOnlineChargeBrck] = useState([]);
  let [onlineCharge, setOnlineCharge] = useState(0);
  let [onlineChargeBrac, setOnlineChargeBrac] = useState(0);

  let [onlineChargessl, setOnlineChargessl] = useState([]);
  let [branchList, setBranchList] = useState([]);
  let [branchNameCash, setBranchNameCash] = useState("");
  let [loading, setLoading] = useState(false);
  let [bdCityList, setBdCityList] = useState([]);
  // let [gatewaycharges, setGatewaycharges] = useState([]);

  let [gatewaycharges, setGatewaycharges] = useState([]);

  const [gatewayChargeList, setGatewayChargeList] = useState([]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const location = useLocation();

  const { data, brackData, sslData, idx } = location.state || {};

  // const getAllCharge = async () => {
  //   let agentId = sessionStorage.getItem("agentId") ?? 0;
  //   const response = await gatewayChargesByAgent(agentId);
  // };
  let [charge, setCharge] = useState([]);
  const singleCharge = (id) => {
    let name;
    if (id == 5) {
      name = "Bkash";
    } else if (id == 6) {
      name = "Nagad";
    } else {
      name = "";
    }
    setCharge(gatewaycharges.filter((item) => item.name === name));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setAmount("");
  }, [depositTypeId]);

  useEffect(() => {
    setBdCityList(
      cityList.filter((item) => item.name.split(",")[0] === "Bangladesh")
    );
  }, [cityList]);

  let sendObj = {
    agentId: sessionStorage.getItem("agentId") ?? 0,
    fromOfPaymentType: depositTypeId,
    paymentType: paymentTypeId,
    checkNo: checkNo,
    checkBank: checkBank,
    checkIssueDate: checkIssueDate,
    reference: reference,
    depositedInAccountId: depositInAccountId,
    requestedAmount: depositTypeId < 5 ? amount : vendorAmount,
    attachment: attachment,
    depositedFromAccountId: depositFromAccountId,
    depositDate: depositDate,
    transferDate: moment(transferDate).format(),
    branchName: branchNameCash,
    transactionId: transactionId,
    chargeAmount:
      depositTypeId < 5
        ? charge[0]?.charge !== undefined
          ? parseFloat(((vendorAmount * charge[0]?.charge) / 100).toFixed(2))
          : parseFloat(gateWayCharge).toFixed(2)
        : charge[0]?.chargePercentage !== undefined
        ? parseFloat(
            ((vendorAmount * charge[0]?.chargePercentage) / 100).toFixed(2)
          )
        : parseFloat(gateWayCharge).toFixed(2),

    gatewayChargePercent:
      depositTypeId < 5
        ? charge[0]?.charge !== undefined
          ? charge[0]?.charge
          : 0
        : charge[0]?.chargePercentage !== undefined
        ? charge[0]?.chargePercentage
        : 0,
    approvalAmount:
      depositTypeId < 5
        ? parseFloat(parseFloat(amount).toFixed(2))
        : parseFloat(amount) +
            parseFloat((vendorAmount * charge[0]?.chargePercentage) / 100) ===
          vendorAmount
        ? parseFloat(amount)
        : parseFloat(
            vendorAmount -
              ((vendorAmount * charge[0]?.chargePercentage) / 100).toFixed(2)
          ).toFixed(2),
  };

  const clearDepositEntry = () => {
    setDepositType(1);
    setPaymentType(1);
    setCheckNo("");
    setCheckBank("");
    setCheckIssueDate();
    setReference("");
    setDepositInAccount(0);
    setAmount("");
    setAttachment("");
    setDepositFromAccount(0);
    setDepositDate();
    setTransferDate("");
    setBranch(0);
    setTransaction();
    setVendorAmount("");
    setGateWayCharge(0);
  };
  let onlineSendObj = {
    requestedAmount: onlineAmount,
    gatewayChargePercent: onlineCharge,
    chargeAmount: onlineChargeBrac,
    approvalAmount: (
      parseInt(onlineAmount) -
      (onlineAmount * onlineCharge) / 100
    ).toFixed(2),
    remarks: remarkForBrackSSl,
  };

  const deposittypeList = [
    { id: 1, name: "Cheque" },
    { id: 2, name: "Bank Deposit" },
    { id: 3, name: "Bank Transfer" },
    { id: 4, name: "Cash" },
    { id: 5, name: "BKash" },
    { id: 6, name: "Nagad" },
  ];

  const paymenttypeList = [
    { id: 1, name: "With Transaction Id" },
    { id: 2, name: "With Account" },
  ];

  const handleSubmit = () => {
    if (depositTypeId == 1) {
      if (checkNo == "") {
        toast.error("Sorry! Check no is empty..");
        return;
      }
      if (checkBank == "") {
        toast.error("Sorry! Check bank is empty..");
        return;
      }
      if (checkIssueDate == "") {
        toast.error("Sorry! Check issue date is empty..");
        return;
      }
      if (transferDate == "") {
        toast.error("Sorry! Deposit date is empty..");
        return;
      }
      if (reference == "") {
        toast.error("Sorry! Refference is empty..");
        return;
      }
      if (depositInAccountId == 0) {
        toast.error("Sorry! Triplover account is empty..");
        return;
      }
      if (gateWayCharge === "") {
        toast.error("Sorry! Gateway Fee/Bank Charge is empty..");
        return;
      }
      if (amount <= 0) {
        toast.error("Sorry! Amount is empty..");
        return;
      }
      if (attachment == "") {
        toast.error("Sorry! Attachment is empty..");
        return;
      }
    }
    if (depositTypeId == 2) {
      if (depositInAccountId == 0) {
        toast.error("Sorry! Deposit bank is empty..");
        return;
      }
      if (transferDate == "") {
        toast.error("Sorry! Deposit date is empty..");
        return;
      }
      if (reference == "") {
        toast.error("Sorry! Refference is empty..");
        return;
      }
      if (amount <= 0) {
        toast.error("Sorry! Amount is empty..");
        return;
      }
      if (gateWayCharge === "") {
        toast.error("Sorry! Gateway Fee/Bank Charge is empty..");
        return;
      }
      if (attachment == "") {
        toast.error("Sorry! Attachment is empty..");
        return;
      }
    }
    if (depositTypeId == 3) {
      if (depositInAccountId == 0) {
        toast.error("Sorry! Triplover bank is empty..");
        return;
      }
      if (depositFromAccountId == 0) {
        toast.error("Sorry! Deposit from bank is empty..");
        return;
      }
      if (transferDate == "") {
        toast.error("Sorry! Transfer date is empty..");
        return;
      }
      if (reference == "") {
        toast.error("Sorry! Refference is empty..");
        return;
      }
      if (amount <= 0) {
        toast.error("Sorry! Amount is empty..");
        return;
      }
      if (gateWayCharge === "") {
        toast.error("Sorry! Gateway Fee/Bank Charge is empty..");
        return;
      }
      if (attachment == "") {
        toast.error("Sorry! Attachment is empty..");
        return;
      }
    }
    if (depositTypeId == 4) {
      if (branchNameCash === "") {
        toast.error("Sorry! Branch is empty..");
        return;
      }
      if (transferDate == "") {
        toast.error("Sorry! Deposit date is empty..");
        return;
      }
      if (reference == "") {
        toast.error("Sorry! Refference is empty..");
        return;
      }
      if (amount <= 0) {
        toast.error("Sorry! Amount is empty..");
        return;
      }
      // if (gateWayCharge === "") {
      //   toast.error("Sorry! Gateway fee is empty..");
      //   return;
      // }
      if (attachment == "") {
        toast.error("Sorry! Attachment is empty..");
        return;
      }
    }
    if (depositTypeId == 5) {
      setAmount(
        vendorAmount + (vendorAmount * (paymentTypeId === 1 ? 1.5 : 1.0)) / 100
      );
      if (vendorAmount == "") {
        toast.error("Sorry! Amount is empty..");
        return;
      }
      if (transactionId == "") {
        toast.error("Sorry! Transaction Id is empty..");
        return;
      }
      if (transferDate == "") {
        toast.error("Sorry! Deposit date is empty..");
        return;
      }
      if (attachment == "") {
        toast.error("Sorry! Attachment is empty..");
        return;
      }
    }
    if (depositTypeId == 6) {
      setAmount(vendorAmount + (vendorAmount * 1.0) / 100);
      if (vendorAmount == "") {
        toast.error("Sorry! Amount is empty..");
        return;
      }
      if (transactionId == "") {
        toast.error("Sorry! Transaction Id is empty..");
        return;
      }
      if (transferDate == "") {
        toast.error("Sorry! Deposit date is empty..");
        return;
      }
      if (attachment == "") {
        toast.error("Sorry! Attachment is empty..");
        return;
      }
    }
    const postData = async () => {
      setLoading(true);
      const response = await depositRequest(sendObj);
      if (response?.data?.isSuccess) {
        clearDepositEntry();
        setAmount("");
        toast.success("Request send successfully..");
        setLoading(false);
        document.getElementById("resetForm").reset();
        setProgress(0);
      } else {
        toast.error(response?.data?.message);
        setLoading(false);
        setProgress(0);
      }
    };
    postData();
  };

  const handleOnlineDepositSubmit = () => {
    const postData = async () => {
      try {
        setIsDownloading(true);
        const response = await requestOnlineDepositBrac(onlineSendObj);
        if (response.data?.isSuccess === true) {
          window.location = response.data?.data?.url;
        } else {
          toast.error(response?.data?.message);
          setIsDownloading(false);
        }
      } catch (e) {
        toast.error("Please try again.");
        setIsDownloading(false);
      }
    };

    if (onlineAmount > 500000) {
      toast.error("Please enter correct amount.");
      setIsDownloading(false);
      return;
    }
    if (onlineAmount < 500) {
      toast.error("Please enter correct amount.");
      setIsDownloading(false);
      return;
    } else {
      postData();
    }
  };

  let onlineSendObjSSl = {
    requestedAmount: onlineAmount,
    gatewayChargePercent: onlineCharge,
    approvalAmount: (
      parseInt(onlineAmount) -
      (onlineAmount * onlineCharge) / 100
    ).toFixed(2),
    chargeAmount: ((onlineAmount * onlineCharge) / 100).toFixed(2),
    remarks: remarkForBrackSSl,
  };

  const handleOnlineSSLCommerz = () => {
    const postData = async () => {
      try {
        setIsDownloading(true);
        const response = await requestOnlineDepositSSL(onlineSendObjSSl);
        if (response.data?.isSuccess === true) {
          window.location = response.data?.data?.url;
        } else {
          toast.error(response?.data?.message);
          setIsDownloading(false);
        }
      } catch (e) {
        toast.error("Please try again.");
        setIsDownloading(false);
      }
    };

    if (onlineAmount > 500000) {
      toast.error("Please enter correct amount.");
      setIsDownloading(false);
      return;
    }
    if (onlineAmount < 10) {
      toast.error("Please enter correct amount.");
      setIsDownloading(false);
      return;
    } else {
      postData();
    }
  };

  const handleGetTransaction = (currentPageNumber) => {
    const getData = async () => {
      const agentId = sessionStorage.getItem("agentId") ?? 0;
      const response = await getAgentDeposits(
        agentId,
        currentPageNumber,
        pageSize
      );
      setBalanceList(response.data.data);
      setPageCount(await response.data.totalPages);
    };
    getData();
  };

  const handleGetAgentBankAccounts = (currentPageNumberBank) => {
    const getData = async () => {
      const response = await axios.get(environment.cityList);
      setCityList(response.data);
    };
    getData();
    let agentId = sessionStorage.getItem("agentId") ?? 0;
    const getAgentBankAccounts = async () => {
      const response = await getAgentBankAccountsList(
        agentId,
        currentPageNumberBank,
        pageSize
      );
      setAgentBankAccountList(response.data.data);
      setPageCountBank(await response.data.totalPages);
    };
    getAgentBankAccounts();

    const getAgentBankDropdown = async () => {
      const response = await getAgentBankAccountsByAgent(agentId);
      setAgentAccountDropdownList(response.data);
    };
    getAgentBankDropdown();
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumber(currentPage);
  };

  const handlePageClickBank = async (data) => {
    let currentPage = data.selected + 1;
    setCurrentPageNumberBank(currentPage);
  };

  const handleGetEntry = () => {
    setUsbPayApiCall(false);
    const getBankAccounts = async () => {
      const response = await bankAccounts();
      setAccountList(response.data);
    };
    getBankAccounts();
    const getGatewayCharge = async () => {
      const response = await getGatewayCharges(4);
      if (response?.data?.isSuccess && response?.data?.data !== null) {
        setOnlineChargeBrck(response.data?.data?.data);
      }
    };
    getGatewayCharge();
    const getGatewayChargeSSl = async () => {
      const response = await getGatewayCharges(3);
      if (response?.data?.isSuccess && response?.data?.data !== null) {
        setOnlineChargessl(response.data?.data?.data);
      }
    };
    getGatewayChargeSSl();

    //normal getway charge
    const getGatewayChargenormal = async () => {
      const response = await getGatewayCharges(1);
      if (response?.data?.isSuccess && response?.data?.data !== null) {
        setGatewaycharges(response.data?.data?.data);
      }
    };
    getGatewayChargenormal();

    const getBranches = async () => {
      const response = await getBranchesList();
      setBranchList(response.data);
    };
    getBranches();
  };

  const handleFileUpload = (file) => {
    setProgress(0);
    setLoading(true);
    var formData = new FormData();
    formData.append(`file`, file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        // Authorization: "Bearer " + tokenData?.token,
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setProgress(percentCompleted); // Update progress state
      },
    };
    const postData = async () => {
      const response = await uploadAttachment(formData, config);
      if (response.data.isUploaded) {
        setAttachment(response.data.fileName);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("Please try again");
      }
    };
    postData();
  };

  const handleCreateItem = () => {
    clearBankForm();
  };
  const handleEditItem = (item) => {
    setCurrentItem(item);
    setHolderName(item.holderName);
    setAccountNumber(item.accountNumber);
    setRoutingNumber(item.routingNumber);
    setBankName(item.bankName);
    setBranchName(item.branchName);
    setBranchCode(item.branchCode);
    setCityId(item.cityId);
    setAddress(item.address);
    setSwiftCode(item.swiftCode);
    setIsActive(item.isActive);
  };
  const clearBankForm = () => {
    setCurrentItem(null);
    setHolderName("");
    setAccountNumber("");
    setRoutingNumber("");
    setBankName("");
    setBranchName("");
    setBranchCode("");
    setCityId(0);
    setAddress("");
    setSwiftCode("");
  };
  let [holderName, setHolderName] = useState("");
  let [accountNumber, setAccountNumber] = useState("");
  let [routingNumber, setRoutingNumber] = useState("");
  let [bankName, setBankName] = useState("");
  let [branchName, setBranchName] = useState("");
  let [branchCode, setBranchCode] = useState("");
  let [cityId, setCityId] = useState(0);
  let [address, setAddress] = useState("");
  let [swiftCode, setSwiftCode] = useState("");
  let [isActive, setIsActive] = useState(true);
  const [value, setValue] = React.useState("");
  let bankObj = {
    id: currentItem == null ? 0 : currentItem.id,
    agentId: sessionStorage.getItem("agentId") ?? 0,
    createdBy: 0,
    ModifiedBy: 0,
    holderName: holderName,
    accountNumber: accountNumber,
    routingNumber: routingNumber,
    bankName: bankName,
    branchName: branchName,
    branchCode: branchCode,
    cityId: cityId,
    address: address,
    swiftCode: swiftCode,
    isActive: isActive,
  };

  function handleCloseModal() {
    $("#accountModal").click();
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $("body").removeAttr("style");
  }

  const handleBankSubmit = () => {
    if (holderName === "") {
      toast.error("Sorry! Holder name is empty");
      return;
    }
    if (accountNumber === "") {
      toast.error("Sorry! Account number is empty");
      return;
    }
    if (bankName === "") {
      toast.error("Sorry! Bank name is empty");
      return;
    }
    if (branchName === "") {
      toast.error("Sorry! Branch name is empty");
      return;
    }
    if ((currentItem == null ? 0 : currentItem.id) > 0) {
      const putData = async () => {
        setLoading(true);
        const response = await editMyBankAccount(bankObj);
        if (response.data > 0) {
          handleGetAgentBankAccounts(currentPageNumberBank);
          clearBankForm();
          toast.success("Bank Account updated successfully..");
          handleCloseModal();
          document.getElementById("bankaccount_close").click();
          setLoading(false);
        } else {
          toast.error("Sorry! Bank Account not updated..");
          setLoading(false);
        }
      };
      putData();
    } else {
      const postData = async () => {
        setLoading(true);
        const response = await addMyBankAccount(bankObj);
        if (response.data > 0) {
          handleGetAgentBankAccounts(currentPageNumberBank);
          clearBankForm();
          toast.success("Bank Account created successfully..");
          handleCloseModal();
          document.getElementById("bankaccount_close").click();
          setLoading(false);
        } else {
          toast.error("Sorry! Bank Account not created..");
          setLoading(false);
        }
      };
      postData();
    }
  };
  useEffect(() => {
    handleGetEntry();
    // handleGetPartnarBankAccounts();
    handleGetTransaction(currentPageNumber);
    handleGetAgentBankAccounts(currentPageNumberBank);
  }, [currentPageNumber, currentPageNumberBank]);

  useEffect(() => {
    const getGatewayCharge = async () => {
      const response = await getPaymentGatewayCharges();
      setGatewayChargeList(response?.data?.data);
    };
    getGatewayCharge();
  }, []);

  const activechargeList =
    gatewayChargeList &&
    gatewayChargeList?.filter(
      (item) => item.isActive === true && item.pgwUser === "B2B"
    );

  const _handelSubmit = () => {
    if (value) {
      if (value === "BRAC") {
        handleOnlineDepositSubmit();
      } else if (value === "SSL") {
        handleOnlineSSLCommerz();
      }
    }
  };

  const [uspPayApiCall, setUsbPayApiCall] = useState(false);
  const [onlineDepositClick, setOnlineDepositClick] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [brackBankCheckedIndex, setBrackBankCheckedIndex] = useState();
  const [sslChecked, setSslChecked] = useState(false);

  // useEffect(() => {
  //   if (onlineDepositClick) {
  //     onOpen()
  //   }
  // }, [onlineDepositClick])
  const navigate = useNavigate();
  const [onlineDeposite, setOnlineDeposite] = useState();
  const getAgentDepositStatus = async () => {
    getAgentDepositSts()
      .then((res) => {
        if (res?.data?.isSuccess) {
          setOnlineDeposite(res?.data?.data[0]?.onlineDeposit);
          if (!res?.data?.data[0]?.onlineDeposit) {
            navigate(location.pathname, { state: {} });
          }
        }
      })
      .catch((err) => {
        setOnlineDeposite();
      });
  };

  useEffect(() => {
    getAgentDepositStatus();
  }, []);

  useEffect(() => {
    setUsbPayApiCall(true);
  }, []);

  const [idxD, setIdxD] = useState("submit-request");
  let onStatusChange = (statusId) => {
    setIdxD(statusId);
  };

  useEffect(() => {
    if (data || brackData || sslData || idx) {
      setIdxD("direct-top-up");
    }
  }, [location]);

  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <div>
        <div className="content-wrapper search-panel-bg">
          <div className="container-fluid bg-white p-1">
            <div class="d-flex flex-column flex-lg-row py-3">
              <div className="d-flex align-items-center ms-5 justify-content-center pt-lg-0 pt-3">
                <h4 className="m-0 fw-bold" style={{ fontSize: "23px" }}>
                  Topup Request
                </h4>
              </div>

              <div className="ms-2 ms-lg-5 mt-1">
                <div className="">
                  <div
                    className="col-lg-12 d-flex justify-content-start align-items-center gap-2 py-1"
                    style={{
                      whiteSpace: "nowrap",
                      overflowX: "auto",
                      scrollbarWidth: "none", // For Firefox
                      WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                      msOverflowStyle: "none", // For IE and Edge
                    }}
                  >
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => onStatusChange("submit-request")}
                    >
                      <span
                        className={
                          idxD === "submit-request"
                            ? "custom-selected-tab rounded px-3 py-2 fs-6 fw-bold"
                            : "fs-6 px-3 py-2 fw-bold text-black"
                        }
                      >
                        Submit Request
                      </span>
                    </div>

                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => onStatusChange("transaction")}
                    >
                      <span
                        className={
                          idxD === "transaction"
                            ? "custom-selected-tab rounded px-3 py-2 fs-6 fw-bold"
                            : "fs-6 px-3 py-2 fw-bold text-black"
                        }
                      >
                        Transaction
                      </span>
                    </div>

                    <div
                      onClick={() => onStatusChange("my-bank-accounts")}
                      style={{ cursor: "pointer" }}
                    >
                      <span
                        className={
                          idxD === "my-bank-accounts"
                            ? "custom-selected-tab px-3 py-2 rounded fs-6 fw-bold"
                            : "fs-6 px-3 py-2 fw-bold text-black"
                        }
                      >
                        My Bank Accounts
                      </span>
                    </div>
                    {/* <div
                      onClick={() =>
                        onStatusChange("Triplover-bank-accounts")
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <span
                        className={
                          idxD === "Triplover-bank-accounts"
                            ? "custom-selected-tab px-3 py-2 rounded fs-6 fw-bold"
                            : "fs-6 px-3 py-2 fw-bold text-black"
                        }
                      >
                        Triplover Bank Accounts
                      </span>
                    </div> */}
                    {onlineDeposite === true && (
                      <div
                        onClick={() => onStatusChange("direct-top-up")}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className={
                            idxD === "direct-top-up"
                              ? "custom-selected-tab px-3 py-2 rounded fs-6 fw-bold"
                              : "fs-6 px-3 py-2 fw-bold text-black"
                          }
                        >
                          Direct Top-up
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className="content-header"></section>
          <section className="content pb-5">
            <ToastContainer position="bottom-right" autoClose={1500} />
            <form
              className="mx-lg-5 mx-md-5 mx-sm-1"
              encType="multipart/form-data"
              style={{ minHeight: "500px" }}
              id="resetForm"
            >
              <div className="container-fluid bg-white">
                {idxD === "submit-request" ? (
                  <div className="row">
                    <div
                      className="col-lg-12 border-bottom d-flex justify-content-start p-0 ms-2 ms-lg-0"
                      style={{
                        whiteSpace: "nowrap",
                        overflowX: "auto",
                        scrollbarWidth: "none", // For Firefox
                        WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                        msOverflowStyle: "none", // For IE and Edge
                      }}
                    >
                      <div
                        className={
                          depositTypeId === 1
                            ? "custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                            : "fs-6 px-3 py-3 fw-bold text-black"
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setDepositType(1);
                          setAmount("");
                          setVendorAmount("");
                          setTransaction("");
                          setDepositDate();
                          setDepositDateBkash("");
                          setDepositDateNogod("");
                          setTransferDate("");
                          setBranchNameCash("");
                          setReference("");
                          setDepositInAccount(0);
                          setDepositFromAccount(0);
                          setCheckNo("");
                          setCheckBank("");
                          setProgress(0);
                          setGateWayCharge(0);
                        }}
                      >
                        <span
                          className={
                            depositTypeId === 1 &&
                            "custom-border-selected-tab pb-3"
                          }
                        >
                          Cheque
                        </span>
                      </div>
                      <div
                        className={
                          depositTypeId === 2
                            ? "custom-selected-tab px-3 rounded-top py-3 fs-6 fw-bold"
                            : "fs-6 px-3 py-3 fw-bold text-black"
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setDepositType(2);
                          setAmount("");
                          setVendorAmount("");
                          setTransaction("");
                          setDepositDate();
                          setDepositDateBkash("");
                          setDepositDateNogod("");
                          setTransferDate("");
                          setBranchNameCash("");
                          setReference("");
                          setDepositInAccount(0);
                          setDepositFromAccount(0);
                          setCheckNo("");
                          setCheckBank("");
                          setProgress(0);
                          setGateWayCharge(0);
                        }}
                      >
                        <span
                          className={
                            depositTypeId === 2 &&
                            "custom-border-selected-tab pb-3"
                          }
                        >
                          Bank Deposit
                        </span>
                      </div>
                      <div
                        className={
                          depositTypeId === 3
                            ? "custom-selected-tab px-3 rounded-top py-3 fs-6 fw-bold"
                            : "fs-6 px-3 py-3 fw-bold text-black"
                        }
                        onClick={() => {
                          setDepositType(3);
                          setAmount("");
                          setVendorAmount("");
                          setTransaction("");
                          setDepositDate();
                          setDepositDateBkash("");
                          setDepositDateNogod("");
                          setTransferDate("");
                          setBranchNameCash("");
                          setReference("");
                          setDepositInAccount(0);
                          setDepositFromAccount(0);
                          setCheckNo("");
                          setCheckBank("");
                          setProgress(0);
                          setGateWayCharge(0);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className={
                            depositTypeId === 3 &&
                            "custom-border-selected-tab pb-3"
                          }
                        >
                          Bank Transfer
                        </span>
                      </div>
                      <div
                        className={
                          depositTypeId === 4
                            ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                            : "fs-6 px-3 py-3 fw-bold text-black"
                        }
                        onClick={() => {
                          setDepositType(4);
                          setAmount("");
                          setVendorAmount("");
                          setTransaction("");
                          setDepositDate();
                          setDepositDateBkash("");
                          setDepositDateNogod("");
                          setTransferDate("");
                          setBranchNameCash("");
                          setReference("");
                          setDepositInAccount(0);
                          setDepositFromAccount(0);
                          setCheckNo("");
                          setCheckBank("");
                          setProgress(0);
                          setGateWayCharge(0);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className={
                            depositTypeId === 4 &&
                            "custom-border-selected-tab pb-3"
                          }
                        >
                          Cash
                        </span>
                      </div>
                      {/* <div
                        className={
                          depositTypeId === 5
                            ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                            : "fs-6 px-3 py-3 fw-bold text-black"
                        }
                        onClick={() => setDepositType(5)}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className={
                            depositTypeId === 5 &&
                            "custom-border-selected-tab pb-3"
                          }
                        >
                          BKash
                        </span>
                      </div>
                      <div
                        className={
                          depositTypeId === 6
                            ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                            : "fs-6 px-3 py-3 fw-bold text-black"
                        }
                        onClick={() => setDepositType(6)}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className={
                            depositTypeId === 6 &&
                            "custom-border-selected-tab pb-3"
                          }
                        >
                          Nagad
                        </span>
                      </div> */}

                      {/* commit bkash and nagad */}
                      {/* {gatewaycharges?.length > 0 &&
                        gatewaycharges?.map(
                          (item) =>
                            item?.isActive === true &&
                            item?.name === "Bkash" && (
                              <>
                                <div
                                  className={
                                    depositTypeId === 5
                                      ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                                      : "fs-6 px-3 py-3 fw-bold text-black"
                                  }
                                  onClick={() => {
                                    setDepositType(5);
                                    singleCharge(5);
                                    setAmount("");
                                    setVendorAmount("");
                                    setTransaction("");
                                    setDepositDate();
                                    setDepositDateBkash("");
                                    setDepositDateNogod("");
                                    setTransferDate("");
                                    setBranchNameCash("");
                                    setReference("");
                                    setDepositInAccount(0);
                                    setDepositFromAccount(0);
                                    setCheckNo("");
                                    setCheckBank("");
                                    setProgress(0);
                                    setGateWayCharge(0);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <span
                                    className={
                                      depositTypeId === 5 &&
                                      "custom-border-selected-tab pb-3"
                                    }
                                  >
                                    BKash
                                  </span>
                                </div>
                              </>
                            )
                        )}
                      {gatewaycharges?.length > 0 &&
                        gatewaycharges?.map(
                          (item) =>
                            item?.isActive === true &&
                            item?.name === "Nagad" && (
                              <>
                                <div
                                  className={
                                    depositTypeId === 6
                                      ? "custom-selected-tab px-3 py-3 rounded-top fs-6 fw-bold"
                                      : "fs-6 px-3 py-3 fw-bold text-black"
                                  }
                                  onClick={() => {
                                    setDepositType(6);
                                    singleCharge(6);
                                    setAmount("");
                                    setVendorAmount("");
                                    setTransaction("");
                                    setDepositDate();
                                    setDepositDateBkash("");
                                    setDepositDateNogod("");
                                    setTransferDate("");
                                    setBranchNameCash("");
                                    setReference("");
                                    setDepositInAccount(0);
                                    setDepositFromAccount(0);
                                    setCheckNo("");
                                    setCheckBank("");
                                    setProgress(0);
                                    setGateWayCharge(0);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <span
                                    className={
                                      depositTypeId === 6 &&
                                      "custom-border-selected-tab pb-3"
                                    }
                                  >
                                    Nagad
                                  </span>
                                </div>
                              </>
                            )
                        )} */}
                    </div>
                  </div>
                ) : idxD === "transaction" ? (
                  <div className="row">
                    <div
                      className="col-lg-12 border-bottom d-flex justify-content-start p-0 ms-2 ms-lg-0"
                      style={{
                        whiteSpace: "nowrap",
                        overflowX: "auto",
                        scrollbarWidth: "none", // For Firefox
                        WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                        msOverflowStyle: "none", // For IE and Edge
                      }}
                    >
                      <div
                        className="custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        style={{ cursor: "pointer" }}
                      >
                        <span className="custom-border-selected-tab pb-3 px-3">
                          Transaction
                        </span>
                      </div>
                    </div>
                  </div>
                ) : idxD === "my-bank-accounts" ? (
                  <div className="row">
                    <div
                      className="col-lg-12 border-bottom d-flex justify-content-start p-0 ms-2 ms-lg-0"
                      style={{
                        whiteSpace: "nowrap",
                        overflowX: "auto",
                        scrollbarWidth: "none", // For Firefox
                        WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                        msOverflowStyle: "none", // For IE and Edge
                      }}
                    >
                      <div
                        className="custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        style={{ cursor: "pointer" }}
                      >
                        <span className="custom-border-selected-tab pb-3 px-3">
                          My Bank Accounts
                        </span>
                      </div>
                    </div>
                  </div>
                ) : idxD === "Triplover-bank-accounts" ? (
                  <div className="row">
                    <div
                      className="col-lg-12 border-bottom d-flex justify-content-start p-0 ms-2 ms-lg-0"
                      style={{
                        whiteSpace: "nowrap",
                        overflowX: "auto",
                        scrollbarWidth: "none", // For Firefox
                        WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                        msOverflowStyle: "none", // For IE and Edge
                      }}
                    >
                      <div
                        className="custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                        style={{ cursor: "pointer" }}
                      >
                        <span className="custom-border-selected-tab pb-3 px-3">
                          Triplover Bank Accounts
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  idxD === "direct-top-up" && (
                    <div className="row">
                      <div
                        className="col-lg-12 border-bottom d-flex justify-content-start p-0 ms-2 ms-lg-0"
                        style={{
                          whiteSpace: "nowrap",
                          overflowX: "auto",
                          scrollbarWidth: "none", // For Firefox
                          WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
                          msOverflowStyle: "none", // For IE and Edge
                        }}
                      >
                        <div
                          className="custom-selected-tab px-3 rounded-top fs-6 py-3 fw-bold"
                          style={{ cursor: "pointer" }}
                        >
                          <span className="custom-border-selected-tab pb-3 px-3">
                            Direct Top-up
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}

                <div className="p-3 py-3">
                  {idxD === "submit-request" ? (
                    <>
                      {depositTypeId === 1 ? (
                        <>
                          <div className="row">
                            <div className="col-sm-3">
                              <label>
                                Cheque No
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type={"text"}
                                className="form-control border-radius"
                                placeholder="Cheque No"
                                onChange={(e) => setCheckNo(e.target.value)}
                                value={checkNo}
                              ></input>
                            </div>
                            <div className="col-sm-3">
                              <label>
                                Cheque Bank
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type={"text"}
                                className="form-control border-radius"
                                placeholder="Cheque Bank"
                                onChange={(e) => setCheckBank(e.target.value)}
                                value={checkBank}
                              ></input>
                            </div>
                            <div className="col-sm-3">
                              <label>
                                Deposit Date
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <Box
                                border="1px solid #ced4da"
                                w="100%"
                                h="40px"
                                pt="6px"
                                pl="8px"
                                className="border-radius"
                              >
                                <DatePicker
                                  dateFormat="dd/MM/yyyy"
                                  selected={transferDate}
                                  onChange={(date) => setTransferDate(date)}
                                  placeholderText="dd/mm/yyyy"
                                  maxDate={new Date()}
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                />
                              </Box>
                            </div>

                            <div className="col-sm-3">
                              <label>
                                Reference
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type={"text"}
                                className="form-control border-radius"
                                placeholder="Reference"
                                onChange={(e) => setReference(e.target.value)}
                                value={reference}
                              ></input>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-3">
                              <label>
                                Triplover Bank A/C
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <select
                                className="form-select border-radius"
                                value={depositInAccountId}
                                placeholder="Triplover Bank A/C"
                                onChange={(e) =>
                                  setDepositInAccount(Number(e.target.value))
                                }
                              >
                                <option key={0} value="0">
                                  Select One
                                </option>
                                {accountList.map((item, index) => {
                                  return (
                                    <option key={index + 1} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <div className="col-sm-3">
                              <label>
                                Amount<span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type={"number"}
                                className="form-control border-radius"
                                placeholder="Amount"
                                onChange={(e) => setAmount(e.target.value)}
                                value={amount}
                                onKeyDown={(e) =>
                                  ["-", "+", "e"].includes(e.key) &&
                                  e.preventDefault()
                                }
                              ></input>
                            </div>
                            <div className="col-sm-3">
                              <label>
                                Gateway Fee/Bank Charge
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type={"number"}
                                className="form-control border-radius"
                                placeholder="Gateway Fee/Bank Charge"
                                onChange={(e) =>
                                  setGateWayCharge(e.target.value)
                                }
                                value={gateWayCharge}
                                onKeyDown={(e) =>
                                  ["-", "+", "e"].includes(e.key) &&
                                  e.preventDefault()
                                }
                              />
                            </div>
                            <div className="col-sm-3">
                              <label>
                                Attachment
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type={"file"}
                                className="form-control border-radius"
                                placeholder="Attachment"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileUpload(e.target.files[0])
                                }
                              ></input>
                              {progress > 0 && (
                                <div className="progress-container mt-1">
                                  <div
                                    className="progress-bar"
                                    style={{ width: `${progress}%` }}
                                  >
                                    {/* <span className="progress-text">{progress}%</span> */}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-sm-12 text-end">
                              <button
                                className="btn button-color text-white px-5 fw-bold border-radius"
                                type="button"
                                onClick={() => handleSubmit()}
                                disabled={loading ? true : false}
                              >
                                {loading ? (
                                  <span
                                    class="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                ) : (
                                  <span>Submit</span>
                                )}
                              </button>
                            </div>
                          </div>
                        </>
                      ) : depositTypeId === 2 ? (
                        <div className="row">
                          <div className="col-sm-6">
                            <label>
                              Triplover Bank A/C
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              className="form-select border-radius"
                              value={depositInAccountId}
                              placeholder="Triplover Bank A/C"
                              onChange={(e) =>
                                setDepositInAccount(Number(e.target.value))
                              }
                            >
                              <option key={0} value="0">
                                Select One
                              </option>
                              {accountList.map((item, index) => {
                                return (
                                  <option key={index + 1} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Deposited Date
                              <span style={{ color: "red" }}>*</span>
                            </label>

                            <Box
                              border="1px solid #ced4da"
                              w="100%"
                              h="40px"
                              pt="6px"
                              pl="8px"
                              className="border-radius"
                            >
                              <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={transferDate}
                                onChange={(date) => setTransferDate(date)}
                                placeholderText="dd/mm/yyyy"
                                maxDate={new Date()}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                              />
                            </Box>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Reference<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"text"}
                              className="form-control border-radius"
                              placeholder="Reference"
                              onChange={(e) => setReference(e.target.value)}
                              value={reference}
                            ></input>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Amount<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"number"}
                              className="form-control border-radius"
                              placeholder="Amount"
                              onChange={(e) => setAmount(e.target.value)}
                              value={amount}
                              onKeyDown={(e) =>
                                ["-", "+", "e"].includes(e.key) &&
                                e.preventDefault()
                              }
                            ></input>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Gateway Fee/Bank Charge
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"number"}
                              className="form-control border-radius"
                              placeholder="Gateway Fee/Bank Charge"
                              onChange={(e) => setGateWayCharge(e.target.value)}
                              value={gateWayCharge}
                              onKeyDown={(e) =>
                                ["-", "+", "e"].includes(e.key) &&
                                e.preventDefault()
                              }
                            />
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Attachment
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"file"}
                              className="form-control border-radius"
                              placeholder="Attachment"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e.target.files[0])
                              }
                            ></input>
                            {progress > 0 && (
                              <div className="progress-container mt-1">
                                <div
                                  className="progress-bar"
                                  style={{ width: `${progress}%` }}
                                >
                                  {/* <span className="progress-text">{progress}%</span> */}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-sm-12 text-right mt-3">
                            <button
                              className="btn button-color text-white px-5 fw-bold border-radius"
                              type="button"
                              onClick={() => handleSubmit()}
                              disabled={loading ? true : false}
                            >
                              {loading ? (
                                <span
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                <span>Submit</span>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : depositTypeId === 3 ? (
                        <div className="row">
                          <div className="col-sm-6">
                            <label>
                              Triplover Bank A/C
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              className="form-select border-radius"
                              value={depositInAccountId}
                              placeholder="Triplover Bank A/C"
                              onChange={(e) =>
                                setDepositInAccount(Number(e.target.value))
                              }
                            >
                              <option key={0} value="0">
                                Select One
                              </option>
                              {accountList.map((item, index) => {
                                return (
                                  <option key={index + 1} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="col-sm-6">
                            <label>My Bank A/C</label>
                            <span style={{ color: "red" }}>*</span>
                            <div className="d-flex">
                              <select
                                className="form-select border-radius"
                                value={depositFromAccountId}
                                placeholder="My Bank A/C"
                                onChange={(e) =>
                                  setDepositFromAccount(Number(e.target.value))
                                }
                              >
                                <option key={0} value="0">
                                  Select One
                                </option>
                                {agentAccountDropdownList.map((item, index) => {
                                  return (
                                    <option key={index + 1} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </select>
                              <div
                                className="btn button-color text-white fw-bold px-3 mx-1 border-radius"
                                onClick={() => handleCreateItem()}
                                data-bs-toggle="modal"
                                data-bs-target="#accountModal"
                              >
                                New
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Transfer Date
                              <span style={{ color: "red" }}>*</span>
                            </label>

                            <Box
                              border="1px solid #ced4da"
                              w="100%"
                              h="40px"
                              pt="6px"
                              pl="8px"
                              className="border-radius"
                            >
                              <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={transferDate}
                                onChange={(date) => setTransferDate(date)}
                                placeholderText="dd/mm/yyyy"
                                maxDate={new Date()}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                              />
                            </Box>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Reference<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"text"}
                              className="form-control border-radius"
                              placeholder="Reference"
                              onChange={(e) => setReference(e.target.value)}
                              value={reference}
                            ></input>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Amount<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"number"}
                              className="form-control border-radius"
                              placeholder="Amount"
                              onChange={(e) => setAmount(e.target.value)}
                              value={amount}
                              onKeyDown={(e) =>
                                ["-", "+", "e"].includes(e.key) &&
                                e.preventDefault()
                              }
                            ></input>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Gateway Fee/Bank Charge
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"number"}
                              className="form-control border-radius"
                              placeholder="Gateway Fee/Bank Charge"
                              onChange={(e) => setGateWayCharge(e.target.value)}
                              value={gateWayCharge}
                              onKeyDown={(e) =>
                                ["-", "+", "e"].includes(e.key) &&
                                e.preventDefault()
                              }
                            />
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Attachment
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"file"}
                              className="form-control border-radius"
                              placeholder="Attachment"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e.target.files[0])
                              }
                            ></input>
                            {progress > 0 && (
                              <div className="progress-container mt-1">
                                <div
                                  className="progress-bar"
                                  style={{ width: `${progress}%` }}
                                >
                                  {/* <span className="progress-text">{progress}%</span> */}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-sm-12 text-right">
                            <button
                              className="btn button-color mt-3 text-white px-5 fw-bold border-radius"
                              type="button"
                              onClick={() => handleSubmit()}
                              disabled={loading ? true : false}
                            >
                              {loading ? (
                                <span
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                <span>Submit</span>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : depositTypeId === 4 ? (
                        <div className="row">
                          <div className="col-sm-3">
                            <label>
                              Branch<span style={{ color: "red" }}>*</span>
                            </label>

                            <input
                              type="text"
                              className="form-control border-radius"
                              placeholder="Branch Name"
                              value={branchNameCash}
                              onChange={(e) =>
                                setBranchNameCash(e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Deposit Date
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <Box
                              border="1px solid #ced4da"
                              w="100%"
                              h="40px"
                              pt="6px"
                              pl="8px"
                              className="border-radius"
                            >
                              <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={transferDate}
                                onChange={(date) => setTransferDate(date)}
                                placeholderText="dd/mm/yyyy"
                                maxDate={new Date()}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                              />
                            </Box>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Reference<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"text"}
                              className="form-control border-radius"
                              placeholder="Reference"
                              onChange={(e) => setReference(e.target.value)}
                              value={reference}
                            ></input>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Amount<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"number"}
                              className="form-control border-radius"
                              placeholder="Amount"
                              onChange={(e) => setAmount(e.target.value)}
                              value={amount}
                              onKeyDown={(e) =>
                                ["-", "+", "e"].includes(e.key) &&
                                e.preventDefault()
                              }
                            ></input>
                          </div>
                          {/* <div className="col-sm-3">
                              <label>
                                Gateway Fee
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type={"number"}
                                className="form-control border-radius"
                                placeholder="Gateway Fee"
                                onChange={(e) =>
                                  setGateWayCharge(e.target.value)
                                }
                                value={gateWayCharge}
                                onKeyDown={(e) =>
                                  ["-", "+", "e"].includes(e.key) &&
                                  e.preventDefault()
                                }
                              />
                            </div> */}
                          <div className="col-sm-3">
                            <label>
                              Attachment
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"file"}
                              className="form-control border-radius"
                              placeholder="Attachment"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e.target.files[0])
                              }
                            ></input>
                            {progress > 0 && (
                              <div className="progress-container mt-1">
                                <div
                                  className="progress-bar"
                                  style={{ width: `${progress}%` }}
                                >
                                  {/* <span className="progress-text">{progress}%</span> */}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-sm-12 text-right">
                            <button
                              className="btn button-color mt-3 text-white px-5 fw-bold border-radius"
                              type="button"
                              onClick={() => handleSubmit()}
                              disabled={loading ? true : false}
                            >
                              {loading ? (
                                <span
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                <span>Submit</span>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : depositTypeId === 5 ? (
                        <div className="row">
                          <div className="col-sm-3">
                            <label>
                              Amount
                              <span style={{ color: "red" }}>*</span>
                            </label>

                            <input
                              type={"number"}
                              className="form-control border-radius"
                              placeholder="Amount"
                              onChange={(e) => {
                                const value = e.target.value;

                                // Regex to match numbers with up to two decimal places
                                const validValue = value.match(
                                  /^\d*\.?\d{0,2}$/
                                )
                                  ? value
                                  : vendorAmount;

                                setVendorAmount(validValue);
                              }}
                              value={vendorAmount}
                              onKeyDown={(e) =>
                                ["-", "+", "e"].includes(e.key) &&
                                e.preventDefault()
                              }
                              step="0.01" // Allow two decimal precision steps
                              min="0" // Prevent negative values
                            />
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Transaction Id
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"text"}
                              className="form-control border-radius"
                              placeholder="Transaction Id"
                              onChange={(e) => setTransaction(e.target.value)}
                              value={transactionId}
                            ></input>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Deposited Date
                              <span style={{ color: "red" }}>*</span>
                            </label>

                            <Box
                              border="1px solid #ced4da"
                              w="100%"
                              h="40px"
                              pt="6px"
                              pl="8px"
                              className="border-radius"
                            >
                              <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={transferDate}
                                onChange={(date) => setTransferDate(date)}
                                placeholderText="dd/mm/yyyy"
                                maxDate={new Date()}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                              />
                            </Box>
                          </div>

                          <div className="col-sm-3">
                            <label>
                              Gateway Fee (%)
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"text"}
                              className="form-control border-radius"
                              disabled
                              // value={charge[0]?.charge}
                              value={
                                charge.length > 0 && charge[0]?.chargePercentage
                                  ? charge[0]?.chargePercentage
                                  : 0
                              }
                            />
                          </div>
                          <div className="col-sm-3">
                            <label>Payable Amount</label>
                            <input
                              type={"number"}
                              className="form-control border-radius"
                              placeholder="Payable Amount"
                              disabled
                              value={parseFloat(
                                vendorAmount -
                                  (
                                    (vendorAmount *
                                      charge[0]?.chargePercentage) /
                                    100
                                  ).toFixed(2)
                              ).toFixed(2)} // Format the value to 2 decimal places
                              ref={() => {
                                setAmount(
                                  parseFloat(
                                    (
                                      vendorAmount -
                                      (vendorAmount *
                                        (charge.length > 0 &&
                                          charge[0]?.chargePercentage)) /
                                        100
                                    ).toFixed(2)
                                  ) // Ensure the state is updated with the formatted number
                                );
                              }}
                            ></input>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Attachment
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"file"}
                              className="form-control border-radius"
                              placeholder="Attachment"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e.target.files[0])
                              }
                            ></input>
                            {progress > 0 && (
                              <div className="progress-container mt-1">
                                <div
                                  className="progress-bar"
                                  style={{ width: `${progress}%` }}
                                >
                                  {/* <span className="progress-text">{progress}%</span> */}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="col-sm-12 text-right">
                            <button
                              className="btn button-color mt-3 text-white px-5 fw-bold border-radius"
                              type="button"
                              onClick={() => handleSubmit()}
                              disabled={loading ? true : false}
                            >
                              {loading ? (
                                <span
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                <span>Submit</span>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : depositTypeId === 6 ? (
                        <div className="row">
                          <div className="col-sm-3">
                            <label>
                              Amount
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"number"}
                              className="form-control border-radius"
                              placeholder="Amount"
                              onChange={(e) => {
                                const value = e.target.value;

                                // Regex to match numbers with up to two decimal places
                                const validValue = value.match(
                                  /^\d*\.?\d{0,2}$/
                                )
                                  ? value
                                  : vendorAmount;

                                setVendorAmount(validValue);
                              }}
                              value={vendorAmount}
                              onKeyDown={(e) =>
                                ["-", "+", "e"].includes(e.key) &&
                                e.preventDefault()
                              }
                              step="0.01" // Allow two decimal precision steps
                              min="0" // Prevent negative values
                            />
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Transaction Id
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"text"}
                              className="form-control border-radius"
                              placeholder="Transaction Id"
                              onChange={(e) => setTransaction(e.target.value)}
                              value={transactionId}
                            ></input>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Deposited Date
                              <span style={{ color: "red" }}>*</span>
                            </label>

                            <Box
                              border="1px solid #ced4da"
                              w="100%"
                              h="40px"
                              pt="6px"
                              pl="8px"
                              className="border-radius"
                            >
                              <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={transferDate}
                                onChange={(date) => setTransferDate(date)}
                                placeholderText="dd/mm/yyyy"
                                maxDate={new Date()}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                              />
                            </Box>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Gateway Fee (%)
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"text"}
                              className="form-control border-radius"
                              disabled
                              // value={charge[0]?.charge}
                              value={
                                charge.length > 0 && charge[0]?.chargePercentage
                                  ? charge[0]?.chargePercentage
                                  : 0
                              }
                            />
                          </div>
                          <div className="col-sm-3">
                            <label>Payable Amount</label>

                            <input
                              type={"number"}
                              className="form-control border-radius"
                              placeholder="Payable Amount"
                              disabled
                              value={parseFloat(
                                vendorAmount -
                                  (
                                    (vendorAmount *
                                      charge[0]?.chargePercentage) /
                                    100
                                  ).toFixed(2)
                              ).toFixed(2)} // Format the value to 2 decimal places
                              ref={() => {
                                setAmount(
                                  parseFloat(
                                    (
                                      vendorAmount -
                                      (vendorAmount *
                                        (charge.length > 0 &&
                                          charge[0]?.chargePercentage)) /
                                        100
                                    ).toFixed(2)
                                  ) // Ensure the state is updated with the formatted number
                                );
                              }}
                            ></input>
                          </div>
                          <div className="col-sm-3">
                            <label>
                              Attachment
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type={"file"}
                              className="form-control border-radius"
                              placeholder="Attachment"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e.target.files[0])
                              }
                            ></input>
                            {progress > 0 && (
                              <div className="progress-container mt-1">
                                <div
                                  className="progress-bar"
                                  style={{ width: `${progress}%` }}
                                >
                                  {/* <span className="progress-text">{progress}%</span> */}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-sm-12 text-right">
                            <button
                              className="btn button-color mt-3 text-white px-5 fw-bold border-radius"
                              type="button"
                              onClick={() => handleSubmit()}
                              disabled={loading ? true : false}
                            >
                              {loading ? (
                                <span
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                <span>Submit</span>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : idxD === "transaction" ? (
                    <>
                      <div className="table-responsive">
                        <table
                          className="table table-lg"
                          style={{ width: "100%", fontSize: "13px" }}
                        >
                          <thead className="text-start fw-bold bg-secondary">
                            <tr>
                              <th>SUBMITTED DATE</th>
                              <th>DEPOSIT REFERENCE</th>
                              <th>TNX NUMBER</th>
                              <th>DEPOSIT NAME</th>
                              <th>DEPOSIT TYPE</th>
                              <th>REFERENCE</th>
                              <th>STATUS</th>
                              <th>REMARKS</th>
                              <th className="text-end">AMOUNT</th>
                              <th className="text-end">BANK CHARGE</th>
                              <th className="text-end">TOPUP AMOUNT</th>
                              <th>IMAGE</th>
                            </tr>
                          </thead>
                          <tbody className="tbody">
                            {balanceList.length > 0 ? (
                              balanceList.map((item, index) => {
                                return (
                                  <tr
                                    key={index}
                                    className="text-start fw-bold text-secondary"
                                  >
                                    <td>
                                      {moment(item.createdDate).format(
                                        "DD-MM-yyyy HH:mm"
                                      )}
                                    </td>
                                    <td
                                      style={{
                                        color: "#7c04c0",
                                        fontWeight: 800,
                                        borderRadius: "50%",
                                      }}
                                    >
                                      {item.sysTransId === null
                                        ? "N/A"
                                        : item.sysTransId}
                                    </td>
                                    <td
                                      style={{
                                        color: "#7c04c0",
                                        fontWeight: 800,
                                        borderRadius: "50%",
                                      }}
                                    >
                                      {item.tnxNumber === null
                                        ? "N/A"
                                        : item.tnxNumber}
                                    </td>
                                    <td>
                                      {item.depositedAt === null
                                        ? "N/A"
                                        : item.depositedAt}
                                    </td>
                                    <td>{item.depositeType}</td>
                                    <td>
                                      {" "}
                                      {item.referenceUser === null
                                        ? "N/A"
                                        : item.referenceUser}
                                    </td>
                                    <td>{item.statusName}</td>
                                    <td>{item.remarks}</td>
                                    <td className="text-end fw-bold text-dark">
                                      AED{" "}
                                      {item.requestedAmount
                                        ?.toFixed(2)
                                        ?.toLocaleString("en-US")}
                                    </td>
                                    <td className="text-end fw-bold text-dark">
                                      AED {item.chargeAmount?.toFixed(2)}
                                    </td>
                                    <td className="text-end fw-bold text-dark">
                                      AED{" "}
                                      {item?.topupAmount
                                        ?.toFixed(2)
                                        ?.toLocaleString("en-US")}
                                    </td>
                                    <td>
                                      {item.attachmentFileName !== null &&
                                      item.attachmentFileName !== "" ? (
                                        <span className="d-flex justify-content-center">
                                          <a
                                            href={
                                              environment.s3URL +
                                              item.attachmentFileName
                                            }
                                            download="images"
                                            target="_blank"
                                          >
                                            <img
                                              src={
                                                environment.s3URL +
                                                item.attachmentFileName
                                              }
                                              alt="images"
                                              width="50"
                                              height="10"
                                            />
                                          </a>
                                        </span>
                                      ) : (
                                        <>N/A</>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <></>
                            )}
                          </tbody>
                        </table>

                        {balanceList?.length === 0 && <NoDataFound />}
                      </div>
                      <div className="d-flex justify-content-end">
                        {balanceList?.length > 0 && (
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
                    </>
                  ) : idxD === "my-bank-accounts" ? (
                    <>
                      <div className="d-flex justify-content-end">
                        <button
                          onClick={() => handleCreateItem()}
                          type="button"
                          className="btn button-color text-white my-2 border-radius"
                          data-bs-toggle="modal"
                          data-bs-target="#accountModal"
                        >
                          Add
                        </button>
                      </div>

                      <div className="table-responsive">
                        <table
                          className="table table table-lg"
                          style={{ width: "100%", fontSize: "13px" }}
                        >
                          <thead className="text-start fw-bold bg-secondary">
                            <tr>
                              <th>Account Name</th>
                              <th>Status</th>
                              <th>Account Number</th>
                              <th>Bank Name</th>
                              <th>Branch Name</th>
                            </tr>
                          </thead>
                          <tbody className="tbody">
                            {agentBankAccountList.map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  className="text-start fw-bold text-secondary"
                                >
                                  <td>
                                    <a
                                      onClick={() => handleEditItem(item)}
                                      href="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#accountModal"
                                    >
                                      {item.holderName}
                                    </a>
                                  </td>
                                  <td>
                                    {item.isActive === true ? (
                                      <span className="px-3 py-2 rounded active-status-color ">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="px-3 py-2 rounded inactive-status-color">
                                        Inactive
                                      </span>
                                    )}
                                  </td>
                                  <td>{item.accountNumber}</td>
                                  <td>{item.bankName}</td>
                                  <td>{item.branchName}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        {agentBankAccountList?.length === 0 && <NoDataFound />}
                      </div>
                      <div className="d-flex justify-content-end">
                        {agentBankAccountList?.length > 0 && (
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
                            pageCount={pageCountBank}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClickBank}
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
                    </>
                  ) : idxD === "Triplover-bank-accounts" ? (
                    <>
                      <div>
                        <p className="fw-bold my-3 fs-5 text-center">
                          BKash: 01701208452 & Nagad: 01322819380
                        </p>
                        <table
                          className="table table-bordered  table-responsive-sm "
                          style={{ width: "100%", fontSize: "12px" }}
                        >
                          <thead className="text-start fw-bold text-white  button-color ">
                            <tr>
                              <th style={{ padding: "15px", fontSize: "17px" }}>
                                Bank Name
                              </th>
                              <th style={{ padding: "15px", fontSize: "17px" }}>
                                Account Name
                              </th>
                              <th style={{ padding: "15px", fontSize: "17px" }}>
                                Account Number
                              </th>
                              <th style={{ padding: "15px", fontSize: "17px" }}>
                                Branch
                              </th>
                              <th style={{ padding: "15px", fontSize: "17px" }}>
                                Routing Number
                              </th>
                              <th style={{ padding: "15px", fontSize: "17px" }}>
                                Swift Code
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            className=" text-start"
                            style={{ background: "rgb(236 254 255)" }}
                          >
                            <tr>
                              <td className="p-0">
                                <img
                                  src={dbbl}
                                  className="img-fluid"
                                  alt="dbbl"
                                  style={{ height: "100%" }}
                                />
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Triplover Limited
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                147-110-0024729
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Bashundhara, Dhaka
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                090260555
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                DBBLBDDH
                              </td>
                            </tr>
                            <tr>
                              <td className="p-0">
                                <img src={isbl} alt="dbbl" />
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Triplover Limited
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                20501770100499611
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Gulshan Corporate, Dhaka
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                125261724
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                IBBLBDDH177
                              </td>
                            </tr>
                            <tr>
                              <td className="p-0">
                                <img src={city} alt="dbbl" />
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Triplover Limited
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                1403664894001
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Gulshan Avenue, Dhaka
                              </td>
                              <td
                                sstyle={{
                                  paddingTop: "20px",
                                  fontSize: "15px",
                                }}
                              >
                                225261732
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                CIBLBDDH
                              </td>
                            </tr>
                            <tr>
                              <td className="p-0">
                                <img src={brack} alt="dbbl" />
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Triplover Limited
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                2055206120001
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Natunbazar, Dhaka
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                060263429
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                N/A
                              </td>
                            </tr>
                            <tr>
                              <td className="p-0">
                                <img src={commercial} alt="dbbl" />
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Triplover Limited
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                0901101000002246
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Banani, Dhaka
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                245260434
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                N/A
                              </td>
                            </tr>
                            <tr>
                              <td className="p-0">
                                <img src={pubali} alt="dbbl" />
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Triplover Limited
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                3311901025114
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Banani, Dhaka
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                175260438
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                N/A
                              </td>
                            </tr>
                            <tr>
                              <td className="p-0">
                                <img src={scb} alt="dbbl" />
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Triplover Limited
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                01-4976936-01
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                Gulshan, Dhaka
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                215261726
                              </td>
                              <td
                                style={{ paddingTop: "20px", fontSize: "15px" }}
                              >
                                N/A
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <div className="pb-5">
                        <UsbPay
                          uspPayApiCall={uspPayApiCall}
                          setOnlineDepositClick={setOnlineDepositClick}
                          onlineChargeBrck={onlineChargeBrck}
                          onlineChargessl={onlineChargessl}
                          setBrackBankCheckedIndex={setBrackBankCheckedIndex}
                          brackBankCheckedIndex={brackBankCheckedIndex}
                          onlineDepositClick={onlineDepositClick}
                          setOnlineCharge={setOnlineCharge}
                          setOnlineChargeBrac={setOnlineChargeBrac}
                          setOnlineAmount={setOnlineAmount}
                          onlineAmount={onlineAmount}
                          setRemarkForBrackSSL={setRemarkForBrackSSL}
                          remarkForBrackSSl={remarkForBrackSSl}
                          handleOnlineDepositSubmit={handleOnlineDepositSubmit}
                          handleOnlineSSLCommerz={handleOnlineSSLCommerz}
                          isDownloading={isDownloading}
                          setSslChecked={setSslChecked}
                          sslChecked={sslChecked}
                          data={data}
                          sslData={sslData}
                          brackData={brackData}
                          indexId={idx}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>

      <div
        className="modal fade"
        id="accountModal"
        tabIndex={-1}
        aria-labelledby="accountModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="accountModalLabel">
                {currentItem === null ? "Add" : "Edit"} Bank Account
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="bankaccount_close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row my-3">
                <div className="col-sm-3">
                  <label>
                    Account Name
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type={"text"}
                    value={holderName}
                    className="form-control border-radius"
                    placeholder="Account Name"
                    onChange={(e) => setHolderName(e.target.value)}
                  ></input>
                </div>
                <div className="col-sm-3">
                  <label>
                    Account Number
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type={"text"}
                    value={accountNumber}
                    className="form-control border-radius"
                    placeholder="Account Number"
                    onChange={(e) => setAccountNumber(e.target.value)}
                  ></input>
                </div>
                <div className="col-sm-3">
                  <label>
                    Bank Name
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type={"text"}
                    value={bankName}
                    className="form-control border-radius"
                    placeholder="Bank Name"
                    onChange={(e) => setBankName(e.target.value)}
                  ></input>
                </div>
                <div className="col-sm-3">
                  <label>
                    Branch Name
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type={"text"}
                    value={branchName}
                    className="form-control border-radius"
                    placeholder="Branch Name"
                    onChange={(e) => setBranchName(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <label>Routing Number</label>
                  <input
                    type={"text"}
                    value={routingNumber}
                    className="form-control border-radius"
                    placeholder="Routing Number"
                    onChange={(e) => setRoutingNumber(e.target.value)}
                  ></input>
                </div>
                <div className="col-sm-3">
                  <label>Branch Code</label>
                  <input
                    type={"text"}
                    value={branchCode}
                    className="form-control border-radius"
                    placeholder="Branch Code"
                    onChange={(e) => setBranchCode(e.target.value)}
                  ></input>
                </div>
                <div className="col-sm-3">
                  <label>City</label>
                  <select
                    className="form-select border-radius"
                    value={cityId}
                    placeholder="City"
                    onChange={(e) => setCityId(Number(e.target.value))}
                  >
                    <option key={0}>Select One</option>
                    {bdCityList.map((item, index) => {
                      return (
                        <option key={index + 1} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-sm-3">
                  <label>Address</label>
                  <input
                    type={"text"}
                    value={address}
                    className="form-control border-radius"
                    placeholder="Address"
                    onChange={(e) => setAddress(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-sm-3">
                  <label>Swift Code</label>
                  <input
                    type={"text"}
                    value={swiftCode}
                    className="form-control border-radius"
                    placeholder="Swift Code"
                    onChange={(e) => setSwiftCode(e.target.value)}
                  ></input>
                </div>
                <div className="col-sm-3">
                  <label>
                    Is Active?
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type={"checkbox"}
                    checked={isActive ?? true}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="form-check"
                  ></input>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn button-secondary-color border-radius text-white fw-bold"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn button-color text-white border-radius fw-bold"
                onClick={() => handleBankSubmit()}
                disabled={loading ? true : false}
              >
                {loading ? (
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size={"5xl"}
        scrollBehavior={true}
      >
        <ModalOverlay />
        <ModalContent>
          <Box borderBottom="2px solid #bbc5d3">
            <ModalHeader>Direct Top-up</ModalHeader>
            <ModalCloseButton
              onClick={() => {
                setOnlineDepositClick(false);
                setOnlineAmount("");
                setValue("");
                setIsDownloading(false);
              }}
            />
          </Box>
          <ModalBody>
            <div className="p-3">
              <div className="flex align-item-center">
                <RadioGroup colorScheme="green" value={value}>
                  {onlineChargeBrck.length > 0 && (
                    <>
                      {onlineChargeBrck.map((item, index) => (
                        <Radio
                          key={index}
                          value={item?.name}
                          onChange={() => {
                            setValue(item?.name);
                            setOnlineCharge(item?.chargePercentage);
                          }}
                          style={{ marginLeft: "5px" }}
                        >
                          {item?.name}
                        </Radio>
                      ))}
                    </>
                  )}
                  {onlineChargessl.length > 0 && (
                    <>
                      {onlineChargessl.map((item, index) => (
                        <Radio
                          key={index}
                          value={item?.name}
                          onChange={() => {
                            setValue(item?.name);
                            setOnlineCharge(item?.chargePercentage);
                          }}
                          style={{ marginLeft: "5px" }}
                        >
                          {item?.name}
                        </Radio>
                      ))}
                    </>
                  )}
                </RadioGroup>
              </div>
              <div className="mb-3">
                <strong>Amount</strong>{" "}
                <input
                  onChange={(e) => {
                    const input = e.target.value;
                    if (/^\d*$/.test(input)) {
                      const sevenDigitInput = input.slice(0, 6);
                      setOnlineAmount(sevenDigitInput);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "." ||
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  type={"number"}
                  value={onlineAmount}
                  className="form-control border-radius"
                  disabled={isDownloading ? true : false}
                ></input>
                <p className=" text-danger " style={{ fontSize: "15px" }}>
                  N/T:Please Enter Amount 500 to 500000
                </p>
                <strong>Charge:</strong>{" "}
                {onlineCharge === null || onlineCharge === undefined
                  ? 0
                  : onlineCharge}
                % <br />
                <strong>Total Amount:</strong>{" "}
                {onlineAmount === ""
                  ? 0
                  : (
                      parseInt(onlineAmount) +
                      (onlineAmount *
                        (onlineCharge === null || onlineCharge === undefined
                          ? 0
                          : onlineCharge)) /
                        100
                    ).toFixed(2)}{" "}
                <br />
              </div>
              <button
                type="button"
                className="btn button-color fw-bold text-white border-radius"
                onClick={() => {
                  _handelSubmit();
                }}
                disabled={
                  onlineAmount === "" || isDownloading || value === ""
                    ? true
                    : false
                }
              >
                {isDownloading ? (
                  <>
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>{" "}
                    Submiting
                  </>
                ) : (
                  <>Submit</>
                )}
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Footer></Footer>
    </div>
  );
};

export default Balance;
