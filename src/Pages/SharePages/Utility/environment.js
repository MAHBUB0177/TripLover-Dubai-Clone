//  const baseURL='http://localhost:7236/';
// const baseURL = "http://13.228.152.29:81/";
// const baseURL = "http://13.212.148.146:81/";
// const baseURL = "http://13.228.152.29:86/";
// const baseURL = "http://192.168.48.55:250/";
// const baseURL = "https://dev-webapi.Triplover.com/";
// const baseURL = "http://18.138.98.64:90/";
// const baseURL = "https://api.Triplover.com/";


// const baseURL = "https://dev-webapi.travelchamp.com/";
const baseURL = "http://13.229.80.34:92/";
// const baseURL = "http://18.138.98.64:210/";
// const newSearch = "https://dev-webapi.Triplover.com/api/search";
const newSearch = "http://13.229.80.34:96/api/Search/";
// const newSearch = "https://apiv2.Triplover.com/api/Search/";
// const newSearch = "http://18.138.98.64:90/api/search";

const baseApiURL = baseURL + "api/";

export const airlinesCode = ["6E"];
export const onlineToprestrictedUsers = ["TC04124"];

const tokenData = JSON.parse(localStorage.getItem("token"));
let headerToken = { headers: { Authorization: "" } };
if (tokenData != null && new Date(tokenData.tokenExpieryTime) >= new Date()) {
  headerToken = { headers: { Authorization: "Bearer " + tokenData?.token } };
}
export const environment = {
  // paymentGatewayLink: "http://localhost:3000/payment?",
  // paymentGatewayLink: "https://dev-b2b.Triplover.com/payment?",
  locationURL: baseApiURL,
  paymentGatewayLink: "https://b2b.Triplover.com/payment?",
  ProgressiveSearch: newSearch + "Progressive",
  s3URL: "https://tcluploaddocument.s3.ap-southeast-1.amazonaws.com/",
  s3ArliensImage:
    "https://tcluploaddocument.s3.ap-southeast-1.amazonaws.com/AirlineLogos/",
  baseApiURL: baseApiURL,
  headerToken: headerToken,
  //sendEmailProposal: baseApiURL + "B2BEmail/NewSendProposal", // modal email senty
  sendEmailProposal: baseApiURL + "B2BEmail/SendModalEmail",
  register: baseApiURL + "user/b2bregister",
  login: baseApiURL + "user/b2blogin",
  currentUserInfo: baseApiURL + "user/GetCurrentUser",
  logoFileUpload: baseApiURL + "user/uploadB2B",
  limitTransaction: baseApiURL + "B2BStaff/transLimit",
  //autometic mail ticket
  issueMail: baseApiURL + "Ticket/MailIssuedTicket",

  userList: baseApiURL + "user",
  userProfileEdit: baseApiURL + "user/B2BProfileEdit",
  searchFlight: newSearch,
  // searchFlight: baseApiURL + "Search",
  bookFlight: baseApiURL + "Book",
  ticketingFlight: baseApiURL + "Ticket/NewTicket",
  importPnr: baseApiURL + "Ticket/ImportPnrTicket",
  priceCheck: baseApiURL + "RePrice",
  getFareRules: baseApiURL + "FareRules",
  getLastTicketTime: baseApiURL + "pnr",
  cancelBooking: baseApiURL + "Cancel",
  cancelBookingCombo: baseApiURL + "Cancel/combo-cancel",
  getCalendarEventBooking: baseApiURL + "B2BDashboard/GetCalendarEventBooking",

  cityList: baseApiURL + "Dropdown/Cities",
  bankAccounts: baseApiURL + "Dropdown/bankaccounts",
  getairlineList: baseApiURL + "Dropdown/Airlines",
  getcountryList: baseApiURL + "Dropdown/Countries",
  getairportList: baseApiURL + "Dropdown/Airports",
  getzoneListbycountryName: baseApiURL + "dropdown/ZonesByCountryName",
  getcityListbycountryName: baseApiURL + "dropdown/CitiesByCountryName",
  getsupporttypeList: baseApiURL + "Dropdown/SupportTypes",
  getsubjectList: baseApiURL + "Dropdown/SupportSubjects",
  accountsByAgentDropdown: baseApiURL + "Dropdown/AgentBankAccountsByAgent",

  // depositRequest: baseApiURL + "B2BBalance/DepositRequest",
  depositRequest: baseApiURL + "PaymentGateway/DepositRequest",
  agentDeposits: baseApiURL + "B2BBalance/AgentDeposits",
  agentFileUpload: baseApiURL + "B2BBalance/Upload",
  paymentCheckoutSSL: baseApiURL + "PaymentGateway/Checkout",
  paymentgetwayCharge: baseApiURL + "PaymentGateway/PaymentGatewayCharge",

  paymentCheckout: baseApiURL + "PaymentGateway/CheckoutPaymentBrac",
  branchList: baseApiURL + "B2BBalance/GetBranches",

  bankAccountsByAgent: baseApiURL + "B2BBankAccount/AgentBankAccountsByAgent",
  bankAccount: baseApiURL + "B2BBankAccount",

  markupsByAgent: baseApiURL + "B2BDynamicMarkup/MarkupsByAgent",
  markupsDelete: baseApiURL + "B2BDynamicMarkup/Delete",
  markup: baseApiURL + "B2BDynamicMarkup",

  getSupportInfoesByStatustList:
    baseApiURL + "B2BSupportInfo/SupportInfoesByStatus",
  supportInfo: baseApiURL + "B2BSupportInfo",
  supportFileUpload: baseApiURL + "B2BSupportInfo/Upload",
  supportHistory: baseApiURL + "B2BSupportHistory",
  historyFileUpload: baseApiURL + "B2BSupportHistory/Upload",
  getSupportHistoriesByAgentList:
    baseApiURL + "B2BSupportHistory/SupportHistoriesByAgent",
  getSupportNoticeCountByAgent:
    baseApiURL + "B2BSupportHistory/SupportNoticeCountByAgent",
  getSupportNoticeByAgent:
    baseApiURL + "B2BSupportHistory/SupportNoticeByAgent",

  accountManagerInfo: baseApiURL + "B2BAccountManager/GetByAgentId",
  agentStaff: baseApiURL + "B2BStaff",
  getAgentStaffByAgent: baseApiURL + "B2BStaff/GetAgentStaffs",
  getAgentSettingById: baseApiURL + "B2BStaff/GetAgentSettings",
  restpasswordset: baseApiURL + "User/ResetPasswordB2B",

  agentstaffHistory: baseApiURL + "B2BStaff/SubAgentPermissionLogs",

  // sendEmailProposal: baseApiURL + "B2BEmail/SendProposal",
  sendEmailInvoice: baseApiURL + "B2BEmail/SendInvoice",
  sendEmailBooking: baseApiURL + "B2BEmail/SendBooking",

  agentInfo: baseApiURL + "B2BInfo/GetByUserId",
  getAgentPassengers: baseApiURL + "B2BInfo/AgentPassengers",
  saveAgentPassenger: baseApiURL + "B2BInfo/SaveAgentPassenger",
  deleteAgentPassenger: baseApiURL + "B2BInfo/DeletePassenger",
  passengerupload: baseApiURL + "B2BInfo/passengerupload",

  accountLedger: baseApiURL + "B2BAccountLadger/AgentAccountLadger",
  agentLoanLedger: baseApiURL + "B2BLoan/AgentloanLadger",
  marqueeList: baseApiURL + "B2BMarquee",
  paymentGateway: baseApiURL + "PaymentGateway",
  paymentGatewayNew: baseApiURL + "PaymentGateway/GetActivePaymentGateway",

  getInvoice: baseApiURL + "B2BReport/OtherInvoice",
  // creditList : baseApiURL + 'CreditList/CreditList',

  changeTicketStatus: baseApiURL + "B2BTicketInfo/ChangeStatus",
  ticketRefundRequest: baseApiURL + "B2BTicketInfo/RefundRequest",

  highestTicktedAirlines: baseApiURL + "B2BDashboard/HighestTicktedAirlines",
  totalBooking: baseApiURL + "B2BDashboard/TotalBooking",
  totalTicket: baseApiURL + "B2BDashboard/TotalTicket",
  totalSales: baseApiURL + "B2BDashboard/TotalSales",

  getTicketingList: baseApiURL + "B2BReport/AirTicketing",
  passengerListByIds: baseApiURL + "B2BReport/PassengerListByIds",
  passengerListByPnr: baseApiURL + "B2BReport/PassengerListByPnr",
  udatePriceByReference: baseApiURL + "B2BReport/UpdatePriceByReference",
  updateBookingFareBreakdown:
    baseApiURL + "B2BReport/UpdateBookingFareBreakdown",
  salesReport: baseApiURL + "B2BReport/GetSalesReport",
  segmentList: baseApiURL + "B2BReport/SegmentsByTransactionId",
  creditNoteList: baseApiURL + "B2BReport/GetCreditNoteByAgentId",
  getTicketingDetails: baseApiURL + "B2BReport/AirTicketingDetails",
  getTicketingDetailsCancel:
    baseApiURL + "B2BReport/AirTicketingDetailsCanceled",
  airTicketingSearch: baseApiURL + "B2BReport/AirTicketingSearch",
  searchLogs: baseApiURL + "B2BReport/SearchLogsByUser",

  sendEmailWithResetLink: baseApiURL + "PasswordRecovery/SendResetLink",
  changePassword: baseApiURL + "PasswordRecovery/changePassword",
  userResetPassword: baseApiURL + "user/ResetPassword",
  gatewayCharge: baseApiURL + "PaymentGateway/GatewayChargesByAgent",

  //notification
  signalRConnectionLink: baseApiURL + "notification",
  signalRNegotiationLink: baseURL + "notification",
  notificationList: baseApiURL + "notification/NotificationList",
  topNotificationList: baseApiURL + "notification/GetTop20LatestNotification",
  topupReadUnraead: baseApiURL + "notification/marknotificationasread",

  //import pnr
  suppliers: baseApiURL + "Dropdown/Apis",
  fetchTicketingVendor: baseApiURL + "pnr/ImportPnrB2B",
  saveImportPnr: baseApiURL + "BookAdmin/manual-book-import",
  CheckoutUsb: baseApiURL + "PaymentGateWay/CheckoutUsb",
  B2BTicketImportSettings: baseApiURL + "B2BTicketImportSettings/GetSettings",

  //2FA
  requestEmailVerification: baseApiURL + "_2FA/RequestEmailVerification",
  reuestForEmailVerificationOtp:
    baseApiURL + "_2FA/ReuestForEmailVerificationOtp",
  verifyEmail: baseApiURL + "_2FA/VerifyEmail",
  toggle2FA: baseApiURL + "_2FA/Toggle2FA",
  toggle2FAEL: baseApiURL + "_2FA/Toggle2FAEL",
  get2FAInfo: baseApiURL + "_2FA/Get2FAInfo",
  LoginWithOTP: baseApiURL + "user/LoginWithOTP",

  //partial payment
  getPartialPaymentStatus:
    baseApiURL + "PartialPayment/GetPartialPaymentStatus",
  applyForPartialPayment: baseApiURL + "PartialPayment/ApplyForPartialPayment",
  checkPartialPaymentEligibility:
    baseApiURL + "PartialPayment/checkPartialPaymentEligibility",
  getPartialPaymentInformation:
    baseApiURL + "PartialPayment/GetPartialPaymentInformation",

  //list
  getPartialPaymentDuelist:
    baseApiURL + "PartialPayment/GetPartialPaymentDueB2B",
  getPartialPaymentPaidB2B:
    baseApiURL + "PartialPayment/GetPartialPaymentPaidB2B",
  getPartialPaymentSettlement:
    baseApiURL + "PartialPayment/DueAmountSettlement",
  getPartialPaymentDashboardinfo:
    baseApiURL + "PartialPayment/GetPartialPaymentB2BDashboardInfo",
  getPartialPaymentdashboardstatus:
    baseApiURL + "PartialPayment/GetUserConfigurationB2B",

  //extra services
  extraService: baseApiURL + "ExtraService",
  extraServiceReprice: baseApiURL + "ExtraService/RePrice",
  transactionHistory: baseApiURL + "Invoice/TransactionHistory",

  //refreah token
  refreshTokenUrl: baseApiURL + "User/RefreshToken",
  uploadB2BRegistrationFile: baseApiURL + "User/UploadB2BRegistrationFile",
  usBanglaAstrfa: true,
  build_version: 1,
  deleteAgentPassenger: baseApiURL + "B2BInfo/DeleteAgentPassenger",
  desabled2FA: baseApiURL + "_2fa/VerifyDisable2FA",
  getSotoTicketList: baseApiURL + "report/GetAgentSotoTicketingReport",

  getTicketUnlockOtp: baseApiURL + "TicketOTP/GetTicketUnlockOtp",
  verifyTicketUnlockOtp: baseApiURL + "TicketOTP/VerifyTicketUnlockOtp",
  verifyIfUnlockedForTicket: baseApiURL + "TicketOTP/VerifyIfUnlockedForTicket",

  groupFareDropdownData: baseApiURL + "GroupFare/get-dropdown-data",
  groupFareSearchFlight: baseApiURL + "GroupFare/search-flights-b2b",
  isGroupFareDomesticPassenger:
    baseApiURL + "GroupFare/isGroupFareDomesticPassenger",
  reserveSeats: baseApiURL + "GroupFare/reserve-seats",
  addFlightPassengerInfo: baseApiURL + "GroupFare/add-flightPassengerInfo",
  groupFareUploadFile: baseApiURL + "GroupFare/upload-passenger-file",
  groupfaredownloadexcel: baseApiURL + "GroupFare/get-sample-excel-file",
  getallFlightPassengerInfo: baseApiURL + "GroupFare/get-bookings-b2b",
  checkPartiallyEligibility:
    baseApiURL + "GroupFare/check-partial-payment-eligibility",
  fulfillPartialPaymentB2b:
    baseApiURL + "GroupFare/fulfill-partial-payment-b2b",

  getBasicInfoFroRefundRequest:
    baseApiURL + "FlightExchange/GetBasicInfoFroRefundRequest",
  getBasicInfoFroRefundRequest:
    baseApiURL + "FlightExchange/GetBasicInfoFroRefundRequest",
  requestRefund: baseApiURL + "FlightExchange/RequestRefund",
  getDataForQuotationView:
    baseApiURL + "FlightExchange/GetDataForQuotationView",
  getAllRefundRequest: baseApiURL + "FlightExchange/GetAllRefundRequest",
  getAllQuotation: baseApiURL + "FlightExchange/GetAllQuotation",
  getRefundRequestAccept:
    baseApiURL + "FlightExchange/RefundQuotationAcceptReject",
  refundRequestReject: baseApiURL + "FlightExchange/RejectRefundRequest",
  AirTicketInfo: baseApiURL + "Ticket/AirTicketInfo",
  getAgentDepositStatus: baseApiURL + "AgentInfo/GetAgentDepositStatus",

  getBasicInfoForVoidRequest:
    baseApiURL + "FlightExchangeVoid/GetBasicInfoForVoidRequest",
  voidRequestReject: baseApiURL + "FlightExchangeVoid/RejectVoidRequest",
  getAllVoidRequest: baseApiURL + "FlightExchangeVoid/GetAllVoidRequest",
  getAllVoidQuotation: baseApiURL + "FlightExchangeVoid/GetAllQuotation",
  getDataForVoidQuotationView:
    baseApiURL + "FlightExchangeVoid/GetDataForQuotationView",
  requestVoid: baseApiURL + "FlightExchangeVoid/RequestVoid",
  getVoidRequestAccept:
    baseApiURL + "FlightExchangeVoid/VoidQuotationAcceptReject",
  isProgressiveSearch: true,

  getBasicInfoForReissueRequest:
    baseApiURL + "FlightExchangeReissue/GetBasicInfoForReissueRequest",
  requestReissue: baseApiURL + "FlightExchangeReissue/ReissueRequestEntry",
  reissueRequestReject:
    baseApiURL + "FlightExchangeReissue/RejectReissueRequest",
  getDataForReissueQuotationView:
    baseApiURL + "FlightExchangeReissue/GetDataForReissueQuotationView",
  getReissueRequestAccept:
    baseApiURL + "FlightExchangeReissue/ReissueQuotationAcceptReject",
  getAllReissueQuotation:
    baseApiURL + "FlightExchangeReissue/GetAllReissueQuotation",
  getAllReissueRequest:
    baseApiURL + "FlightExchangeReissue/GetAllReissueRequest",
  newGlobalSearch: baseApiURL + "TicketReletedReport/GlobalSearchB2B",
  comboFareReprice: baseApiURL + "RePrice/combo-reprice",
  comboFareBook: baseApiURL + "book/combo-book",
  validateTransaction: baseApiURL + "combo/validate-transaction",
  comboTicket: baseApiURL + "Ticket/combo-ticket",
};
