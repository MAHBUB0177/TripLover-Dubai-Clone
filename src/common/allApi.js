import { environment } from "../Pages/SharePages/Utility/environment";
import axiosInstance from "./interceptor";

export const searchFlights = (payload) => {
  let url = environment.searchFlight;
  return axiosInstance.post(url, payload);
};

export const getUserAllInfo = () => {
  let url = environment.agentInfo;
  return axiosInstance.get(url);
};

export const getGetCurrentUser = () => {
  let url = environment.currentUserInfo;
  return axiosInstance.get(url);
};

export const getTop20LatestNotification = () => {
  let url = environment.topNotificationList;
  return axiosInstance.get(url);
};

//profile
export const getAccountManager = (ui) => {
  let url = environment.accountManagerInfo + "/" + ui;
  return axiosInstance.get(url);
};

export const gatewayChargesByAgent = (agentId) => {
  let url = environment.gatewayCharge + "/" + agentId;
  return axiosInstance.get(url);
};

export const depositRequest = (payload) => {
  let url = environment.depositRequest;
  return axiosInstance.post(url, payload);
};

export const requestOnlineDepositBrac = (payload) => {
  let url = environment.paymentCheckout;
  return axiosInstance.post(url, payload);
};

export const requestOnlineDepositSSL = (payload) => {
  let url = environment.paymentCheckoutSSL;
  return axiosInstance.post(url, payload);
};

export const getAgentDeposits = (id, currentPage, pageSize) => {
  let url =
    environment.agentDeposits +
    "/" +
    id +
    `?pageNumber=${currentPage}&pageSize=${pageSize}`;
  return axiosInstance.get(url);
};

export const getAgentBankAccountsList = (id, currentPage, pageSize) => {
  let url =
    environment.bankAccountsByAgent +
    "/" +
    id +
    `?pageNumber=${currentPage}&pageSize=${pageSize}`;
  return axiosInstance.get(url);
};

export const getAgentBankAccountsByAgent = (id) => {
  let url = environment.accountsByAgentDropdown + "?agentId=" + id;
  return axiosInstance.get(url);
};

export const bankAccounts = () => {
  let url = environment.bankAccounts;
  return axiosInstance.get(url);
};

export const getGatewayCharges = (id) => {
  let url = environment.paymentGatewayNew + "/?gateWayTypeId=" + id;
  return axiosInstance.get(url);
};

export const getBranchesList = () => {
  let url = environment.branchList;
  return axiosInstance.get(url);
};

export const uploadAttachment = (file, config) => {
  let url = environment.agentFileUpload;
  return axiosInstance.post(url, file, config);
};

export const editMyBankAccount = (payload) => {
  let url = environment.bankAccount;
  return axiosInstance.put(url, payload);
};

export const addMyBankAccount = (payload) => {
  let url = environment.bankAccount;
  return axiosInstance.post(url, payload);
};

export const sendEmailProposal = (payload) => {
  let url = environment.sendEmailProposal;
  return axiosInstance.post(url, payload);
};

export const getUserInfo = () => {
  let url = environment.agentInfo;
  return axiosInstance.get(url);
};

export const getTicketData = (utid, status) => {
  let url = environment.getTicketingDetails + "/" + utid + "/" + status;
  return axiosInstance.get(url);
};

export const getSegments = (utid) => {
  let url = environment.segmentList + "/" + utid;
  return axiosInstance.get(url);
};

export const passengerListByIds = (ids, trid) => {
  let url = environment.passengerListByIds + "/" + ids + "/" + trid;
  return axiosInstance.get(url);
};

export const ticketIssue = (payload) => {
  let url = environment.ticketingFlight;
  return axiosInstance.post(url, payload);
};

export const importPnr = (payload) => {
  let url = environment.importPnr;
  return axiosInstance.post(url, payload);
};

export const getLimit = (payload) => {
  let url = environment.getLastTicketTime;
  return axiosInstance.post(url, payload);
};

export const cancelBooking = (payload) => {
  let url = environment.cancelBooking;
  return axiosInstance.post(url, payload);
};

export const getPartialPaymentInfo = (utid) => {
  let url = environment.getPartialPaymentInformation + "?UniqueTransId=" + utid;
  return axiosInstance.get(url);
};

export const uploadPassport = (passportNo, payload, config) => {
  let url = environment.passengerupload + "/1/" + passportNo;
  return axiosInstance.post(url, payload, config);
};

export const uploadVisaCopy = (passportNo, payload, config) => {
  let url = environment.passengerupload + "/2/" + passportNo;
  return axiosInstance.post(url, payload, config);
};

export const getAgentPassengers = (currentPage, pageSize, payload) => {
  let url =
    environment.getAgentPassengers +
    `?pageNumber=${currentPage}&pageSize=${pageSize}`;
  return axiosInstance.post(url, payload);
};

export const SaveAgentPassengers = (payload) => {
  let url = environment.saveAgentPassenger;
  return axiosInstance.post(url, payload);
};

export const requestPrice = (payload) => {
  let url = environment.priceCheck;
  return axiosInstance.post(url, payload);
};

export const requestBook = (payload) => {
  let url = environment.bookFlight;
  return axiosInstance.post(url, payload);
};

export const requestExtraServiceRePrice = (payload) => {
  let url = environment.extraServiceReprice;
  return axiosInstance.post(url, payload);
};

export const checkPartialPaymentEligibility = (payload) => {
  let url = environment.checkPartialPaymentEligibility;
  return axiosInstance.post(url, payload);
};

export const serviceRequest = (payload) => {
  let url = environment.extraService;
  return axiosInstance.post(url, payload);
};

export const sendEmailSuccessTicket = (payload) => {
  let url = environment.issueMail;
  return axiosInstance.post(url, payload);
};

export const updateBookingFareBreakdown = (payload) => {
  let url = environment.updateBookingFareBreakdown;
  return axiosInstance.post(url, payload);
};

export const passengerListAll = (uid) => {
  let url = environment.passengerListByIds + "/" + "All" + "/" + uid;
  return axiosInstance.get(url);
};

export const passengerListByPnr = (pnr) => {
  let url = environment.passengerListByPnr + "/" + pnr;
  return axiosInstance.get(url);
};

export const getSupportHistoriesByAgentList = (
  agentId,
  supportId,
  isAgent,
  pageNumberH,
  pageSizeH
) => {
  let url =
    environment.getSupportHistoriesByAgentList +
    "/" +
    agentId +
    "/" +
    (supportId == null ? 0 : supportId) +
    "/" +
    isAgent;
  return axiosInstance.get(url);
};

export const getsupporttypeList = () => {
  let url = environment.getsupporttypeList;
  return axiosInstance.get(url);
};

export const getsubjectList = () => {
  let url = environment.getsubjectList;
  return axiosInstance.get(url);
};
export const getSupportInfoesByStatustList = (
  agentId,
  status,
  searchSubjectId,
  currentPage,
  pageSize
) => {
  let url =
    environment.getSupportInfoesByStatustList +
    "/" +
    agentId +
    "/" +
    status +
    "/" +
    searchSubjectId +
    `?pageNumber=${currentPage}&pageSize=${pageSize}`;
  return axiosInstance.get(url);
};

export const supportFileUpload = (payload, config) => {
  let url = environment.supportFileUpload;
  return axiosInstance.post(url, payload, config);
};

export const historyFileUpload = (payload, config) => {
  let url = environment.historyFileUpload;
  return axiosInstance.post(url, payload, config);
};

export const supportHistory = (payload) => {
  let url = environment.supportHistory;
  return axiosInstance.post(url, payload);
};

export const putSupportInfo = (payload) => {
  let url = environment.supportInfo;
  return axiosInstance.put(url, payload);
};

export const supportInfoPost = (payload) => {
  let url = environment.supportInfo;
  return axiosInstance.post(url, payload);
};

export const addB2BStaff = (payload) => {
  let url = environment.agentStaff;
  return axiosInstance.post(url, payload);
};

export const editB2BStaff = (payload) => {
  let url = environment.agentStaff;
  return axiosInstance.put(url, payload);
};

export const resetPasswordUser = (payload) => {
  let url = environment.restpasswordset;
  return axiosInstance.put(url, payload);
};

export const getAgentStaffs = (id, currentPage, pageSize) => {
  let url =
    environment.getAgentStaffByAgent +
    "/" +
    id +
    `?pageNumber=${currentPage}&pageSize=${pageSize}`;
  return axiosInstance.get(url);
};

export const getAgentSettings = (id) => {
  let url = environment.getAgentSettingById + "/" + id + "/" + 1;
  return axiosInstance.get(url);
};

export const getBookingData = (payload, currentPage, pageSize) => {
  let url =
    environment.getTicketingList +
    `?pageNumber=${currentPage}&pageSize=${pageSize}`;
  return axiosInstance.post(url, payload);
};

export const addticketRefundRequest = (utid, ticketNumber) => {
  let url = environment.ticketRefundRequest + "/" + utid + "/" + ticketNumber;
  return axiosInstance.put(url);
};

export const dueAmountSettlement = (utid, amount) => {
  let url =
    environment.getPartialPaymentSettlement +
    `?UniqueTransID=${utid}&Amount=${amount}`;
  return axiosInstance.get(url);
};

export const getPartialPaymentDueB2B = (payload) => {
  let url = environment.getPartialPaymentDuelist;
  return axiosInstance.get(url, payload);
};

export const invoiceTransactionHistory = (tnxNumber) => {
  let url = environment.transactionHistory + "/" + tnxNumber;
  return axiosInstance.get(url);
};

export const getPaymentGatewayCharges = () => {
  let url = environment.paymentGateway;
  return axiosInstance.get(url);
};

export const usbpayCheckout = (payload) => {
  let url = environment.CheckoutUsb;
  return axiosInstance.post(url, payload);
};

export const getBankAccounts = (currentPageNumber, pageSize) => {
  let url =
    environment.bankAccounts +
    `?pageNumber=${currentPageNumber}&pageSize=${pageSize}`;
  return axiosInstance.get(url);
};

export const getSalesInvoice = (utid) => {
  let url = environment.getInvoice + "/" + utid;
  return axiosInstance.get(url);
};
export const getAccountLedger = (payload, currentPage, pageSize) => {
  let url =
    environment.accountLedger +
    `?pageNumber=${currentPage}&pageSize=${pageSize}`;
  return axiosInstance.post(url, payload);
};

export const resetPassword = (payload) => {
  let url = environment.userResetPassword;
  return axiosInstance.put(url, payload);
};

export const updateUser = (payload) => {
  let url = environment.userProfileEdit;
  return axiosInstance.put(url, payload);
};

export const uploadB2BLogo = (ui, payload, config) => {
  let url = environment.logoFileUpload + "/" + ui;
  return axiosInstance.post(url, payload, config);
};

export const _2FARequestEmailVerification = () => {
  let url = environment.requestEmailVerification;
  return axiosInstance.get(url);
};

export const _get2FAInfo = () => {
  let url = environment.get2FAInfo;
  return axiosInstance.get(url);
};

export const _reuestForEmailVerificationOtp = () => {
  let url = environment.reuestForEmailVerificationOtp;
  return axiosInstance.get(url);
};

export const _verifyEmail = (userUTP) => {
  let url = environment.verifyEmail + `?otp=` + userUTP;
  return axiosInstance.get(url);
};

export const _toggle2FA = () => {
  let url = environment.toggle2FA;
  return axiosInstance.get(url);
};

export const _toggle2FAEL = () => {
  let url = environment.toggle2FAEL;
  return axiosInstance.get(url);
};

export const _getPartialPaymentStatus = () => {
  let url = environment.getPartialPaymentStatus;
  return axiosInstance.get(url);
};

export const _applyForPartialPayment = () => {
  let url = environment.applyForPartialPayment;
  return axiosInstance.get(url);
};

export const agentstaffHistory = (userId, currentPageNumber, pageSize) => {
  let url = `${environment.agentstaffHistory}?staffId=${userId}&currentPageNumber=${currentPageNumber}&pageSize=${pageSize}`;
  return axiosInstance.get(url);
};

export const b2BTicketImportSettings = () => {
  let url = environment.B2BTicketImportSettings;
  return axiosInstance.get(url);
};

export const fetchTicketingVendor = (payload) => {
  let url = environment.fetchTicketingVendor;
  return axiosInstance.post(url, payload);
};

export const saveImportPnr = (payload) => {
  let url = environment.saveImportPnr;
  return axiosInstance.post(url, payload);
};

export const getNotificationAll = (payload) => {
  let url = environment.notificationList;
  return axiosInstance.post(url, payload);
};

export const marknotificationasread = (payload) => {
  let url = environment.topupReadUnraead + "/" + payload;
  return axiosInstance.put(url);
};

export const getAirTicketingInfo = (payload) => {
  const url = `${environment.newGlobalSearch}/${payload}`;
  return axiosInstance.get(url, payload);
};

export const updatePricereference = (payload) => {
  let url = environment.updateBookingFareBreakdown;
  return axiosInstance.post(url, payload);
};

export const GetcreditnoteList = (agentid, currentPageNumber, pageSize) => {
  let url =
    environment.creditNoteList +
    "/" +
    agentid +
    `?pageNumber=${currentPageNumber}&pageSize=${pageSize}`;
  return axiosInstance.get(url);
};
export const getSupportNoticeCountByAgent = (agentId, status) => {
  let url =
    environment.getSupportNoticeCountByAgent + "/" + agentId + "/" + status;
  return axiosInstance.get(url);
};

export const getSupportNoticeByAgent = (agentId, status) => {
  let url = environment.getSupportNoticeByAgent + "/" + agentId + "/" + status;
  return axiosInstance.get(url);
};

export const getEventBookingCalender = (year, month) => {
  let url = environment.getCalendarEventBooking + `/${year}/${month - 1}`;
  return axiosInstance.get(url);
};

export const gettotalbooking = (payload) => {
  let url = environment.totalTicket;
  return axiosInstance.post(url, payload);
};

export const gettotalsales = (payload) => {
  let url = environment.totalSales;
  return axiosInstance.post(url, payload);
};

export const getTicketedAirlines = (payload) => {
  let url = environment.highestTicktedAirlines;
  return axiosInstance.post(url, payload);
};

export const getPartialinfo = () => {
  let url =
    environment.getPartialPaymentDashboardinfo + "?upcomingDayCount=800";
  return axiosInstance.get(url);
};

export const PartialPaymenteligiblestatus = () => {
  let url = environment.getPartialPaymentdashboardstatus;
  return axiosInstance.get(url);
};

export const MarqueeTextDetails = (id) => {
  let url = environment.marqueeList + `/${id}`;
  return axiosInstance.get(url);
};

export const agentLoanLedger = (currentPage, pageSize, payload) => {
  let url =
    environment.agentLoanLedger +
    `?pageNumber=${currentPage}&pageSize=${pageSize}`;
  return axiosInstance.post(url, payload);
};

export const partialpaidinfoB2B = (payload) => {
  let url = environment.getPartialPaymentPaidB2B;
  return axiosInstance.get(url, payload);
};

export const FaareRulesinfo = (payload) => {
  let url = environment.highestTicktedAirlines;
  return axiosInstance.post(url, payload);
};

export const getFareRules = (payload) => {
  let url = environment.getFareRules;
  return axiosInstance.post(url, payload);
};

export const totalBookingData = (payload) => {
  let url = environment.totalBooking;
  return axiosInstance.post(url, payload);
};

export const getSalesReport = (payload) => {
  let url = environment.salesReport + `?pageNumber=1&pageSize=2147483647`;
  return axiosInstance.post(url, payload);
};

export const getSalesReportApi = (payload, pageNumber, pageSize) => {
  let url =
    environment.salesReport + `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return axiosInstance.post(url, payload);
};

export const searchLogs = () => {
  let url = environment.searchLogs;
  return axiosInstance.get(url);
};

export const marqueeList = () => {
  let url = environment.marqueeList;
  return axiosInstance.get(url);
};

export const fileUpload = (payload, config, uploadType) => {
  let url = environment.uploadB2BRegistrationFile + `?uploadType=${uploadType}`;
  return axiosInstance.post(url, payload, config);
};

export const getAgentPassengerSearch = (payload, pageNumber, pageSize) => {
  let url =
    environment.getAgentPassengers +
    `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return axiosInstance.post(url, payload);
};

export const deletePassenger = (id) => {
  let url = environment.deleteAgentPassenger + "/" + id;
  return axiosInstance.get(url);
};

export const desabled2FA = (otp, tracker) => {
  const url = `${environment.desabled2FA}?userOtp=${otp}&tracker=${tracker}`;
  return axiosInstance.get(url);
};

export const getsototicketData = (payload, currentPage, pageSize) => {
  let url =
    environment.getSotoTicketList +
    `?pageNumber=${currentPage}&pageSize=${pageSize}`;
  return axiosInstance.post(url, payload);
};

export const getTicketUnlockOtp = (uid) => {
  let url = environment.getTicketUnlockOtp + "?uniqueTransId=" + uid;
  return axiosInstance.get(url);
};

export const verifyTicketUnlockOtp = (otp, uid) => {
  let url =
    environment.verifyTicketUnlockOtp + "?otp=" + otp + "&uniqueTransId=" + uid;
  return axiosInstance.get(url);
};

export const verifyIfUnlockedForTicket = (uid) => {
  let url = environment.verifyIfUnlockedForTicket + "?uniqueTransId=" + uid;
  return axiosInstance.get(url);
};

export const groupFareDropdownData = () => {
  const url = environment.groupFareDropdownData;
  return axiosInstance.get(url);
};

export const seachFlight = (payload) => {
  let url = environment.groupFareSearchFlight;
  return axiosInstance.post(url, payload);
};

export const isGroupFareDomesticPassenger = (id) => {
  const url = environment.isGroupFareDomesticPassenger + "?groupFareId=" + id;
  return axiosInstance.get(url);
};

export const reserveSeats = (payload) => {
  let url = environment.reserveSeats;
  return axiosInstance.post(url, payload);
};

export const addFlightPassengerInfo = (payload) => {
  let url = environment.addFlightPassengerInfo;
  return axiosInstance.post(url, payload);
};

export const groupFareUploadFile = (file, config, type) => {
  let url = environment.groupFareUploadFile + "?fileType=" + type;
  return axiosInstance.post(url, file, config);
};

export const downloadexceldemo = (payload) => {
  let url = `${environment.groupfaredownloadexcel}?isActive=${true}`;
  return axiosInstance.get(url, payload);
};

export const getGroupfarelistData = (params, currentPage, pageSize) => {
  const queryParams = new URLSearchParams({
    pageNumber: currentPage,
    pageSize: pageSize,
    ...params,
  });
  const url = `${
    environment.getallFlightPassengerInfo
  }?${queryParams.toString()}`;
  return axiosInstance.get(url);
};

export const checkPartiallyEligibility = (groupFareId) => {
  let url = `${environment.checkPartiallyEligibility}?groupFareId=${groupFareId}`;
  return axiosInstance.get(url);
};

export const fulfillPartialPaymentB2b = (payload) => {
  let url = environment.fulfillPartialPaymentB2b;
  return axiosInstance.post(url, payload);
};

export const getBasicInfoFroRefundRequest = (uid) => {
  let url = environment.getBasicInfoFroRefundRequest + "?uniqueTransId=" + uid;
  return axiosInstance.get(url);
};

export const requestRefund = (payload) => {
  let url = environment.requestRefund;
  return axiosInstance.post(url, payload);
};

export const getDataForQuotationView = (groupId, editCount) => {
  let url =
    environment.getDataForQuotationView +
    "?groupId=" +
    groupId +
    "&editCount=" +
    editCount;
  return axiosInstance.get(url, {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};

export const getAllRefundRequest = (payload) => {
  let url = environment.getAllRefundRequest;
  return axiosInstance.post(url, payload);
};

export const getAllQuotation = (payload) => {
  let url = environment.getAllQuotation;
  return axiosInstance.post(url, payload);
};

export const getRefundRequestAccept = (groupId, accept, editCount, remarks) => {
  let url =
    environment.getRefundRequestAccept +
    "?groupId=" +
    groupId +
    "&accept=" +
    accept +
    "&editCount=" +
    editCount +
    "&agentRemarks=" +
    remarks;
  return axiosInstance.get(url);
};

export const getRefundRequestReject = (groupId, remarks) => {
  let url =
    environment.refundRequestReject +
    "?groupId=" +
    groupId +
    "&remarks=" +
    remarks;
  return axiosInstance.get(url); // making a GET request
};

export const originalTicket = (utid) => {
  const url = environment.AirTicketInfo + "?uniqueTransId=" + utid;
  return axiosInstance.get(url);
};

export const getAgentDepositSts = () => {
  let url = environment.getAgentDepositStatus;
  return axiosInstance.get(url);
};

export const getAllVoidRequest = (payload) => {
  let url = environment.getAllVoidRequest;
  return axiosInstance.post(url, payload);
};

export const getBasicInfoForVoidRequest = (uid) => {
  let url = environment.getBasicInfoForVoidRequest + "?uniqueTransId=" + uid;
  return axiosInstance.get(url);
};

export const getVoidRequestReject = (groupId, remarks) => {
  let url =
    environment.refundRequestReject +
    "?groupId=" +
    groupId +
    "&remarks=" +
    remarks;
  return axiosInstance.get(url); // making a GET request
};

export const getAllQuotationForVoid = (payload) => {
  let url = environment.getAllVoidQuotation;
  return axiosInstance.post(url, payload);
};

export const getDataForVoidQuotationView = (groupId, editCount) => {
  let url =
    environment.getDataForVoidQuotationView +
    "?groupId=" +
    groupId +
    "&editCount=" +
    editCount;
  return axiosInstance.get(url, {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};

export const requestVoid = (payload) => {
  let url = environment.requestVoid;
  return axiosInstance.post(url, payload);
};

export const getVoidRequestAccept = (groupId, accept, editCount, remarks) => {
  let url =
    environment.getVoidRequestAccept +
    "?groupId=" +
    groupId +
    "&accept=" +
    accept +
    "&editCount=" +
    editCount +
    "&agentRemarks=" +
    remarks;
  return axiosInstance.get(url);
};

export const getBasicInfoForReissueRequest = (uid) => {
  let url = environment.getBasicInfoForReissueRequest + "?uniqueTransId=" + uid;
  return axiosInstance.get(url);
};

export const requestReissue = (payload) => {
  let url = environment.requestReissue;
  return axiosInstance.post(url, payload);
};

export const getDataForReissueQuotationView = (ReissueRequestId, editCount) => {
  let url =
    environment.getDataForReissueQuotationView +
    "?ReissueRequestId=" +
    ReissueRequestId +
    "&editCount=" +
    editCount;
  return axiosInstance.get(url, {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};

export const getReissueRequestReject = (groupId, remarks) => {
  let url =
    environment.reissueRequestReject +
    "?reissueRequestId=" +
    groupId +
    "&remarks=" +
    remarks;
  return axiosInstance.get(url); // making a GET request
};

export const getReissueRequestAccept = (
  reissueRequestId,
  accept,
  editCount,
  remarks
) => {
  let url =
    environment.getReissueRequestAccept +
    "?reissueRequestId=" +
    reissueRequestId +
    "&accept=" +
    accept +
    "&editCount=" +
    editCount +
    "&agentRemarks=" +
    remarks;
  return axiosInstance.get(url);
};

export const getAllQuotationForReissue = (payload) => {
  let url = environment.getAllReissueQuotation;
  return axiosInstance.post(url, payload);
};

export const getAllReissueRequest = (payload) => {
  let url = environment.getAllReissueRequest;
  return axiosInstance.post(url, payload);
};


export const requestComboPrice = (payload) => {
  let url = environment.comboFareReprice;
  return axiosInstance.post(url, payload);
};

export const requestComboBook = (payload) => {
  let url = environment.comboFareBook;
  return axiosInstance.post(url, payload);
};

export const validateTransaction = (utid) => {
  let url = "http://13.229.80.34:96/api/combo/validate-transaction" + "/" + utid;
  return axiosInstance.get(url);
};

export const requestComboTicket = (payload) => {
  let url = environment.comboTicket;
  return axiosInstance.post(url, payload);
};
