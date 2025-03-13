import { format, intervalToDuration, parse } from "date-fns";

export const createList = (numberOfPax, type) => {
  return Array.from({ length: numberOfPax }, () => ({
    title: type === "ADT" ? "Mr" : "Mstr",
    first: "",
    last: "",
    dateOfBirth: "",
    passengerType: type,
    gender: "Male",
    email: "",
    phone: "",
    phoneCountryCode: "+88",
    cityName: "",
    documentType: null,
    documentNumber: "",
    expireDate: "",
    frequentFlayerNumber: "",
    documentIssuingCountry: "BD",
    nationality: "BD",
    isLeadPax: true,
    passportCopy: "",
    visaCopy: "",
    isPassportS3: null,
    isVisaS3: null,
    isQuickPassenger: false,
    groupFareId: ""
  }));
};

export const checkValidation = (passenger, index, isDomestic) => {
  const { first, last, dateOfBirth, email, documentNumber, expireDate, phone ,passportCopy,visaCopy} =
    passenger[index];
  if (isDomestic) {
    return (
      first !== "" &&
      last !== "" &&
      dateOfBirth !== "" &&
      email !== "" &&
      dateOfBirth !== null &&
      phone !== "" &&
      email !== null
    );
  } else {
    return (
      first !== "" &&
      last !== "" &&
      dateOfBirth !== "" &&
      email !== "" &&
      documentNumber !== "" &&
      expireDate !== "" &&
      dateOfBirth !== null &&
      expireDate !== null &&
      phone !== "" &&
      email !== null && passportCopy !== "" && visaCopy !== ""
    );
  }
};

export function calculateFullAge(dobFrom, dobTo) {
  const dob1 = format(new Date(dobFrom), "dd/MM/yyyy");
  const dob2 = format(new Date(dobTo), "dd/MM/yyyy");
  const birthDateStart = parse(dob1, "dd/MM/yyyy", new Date());
  const birthDateEnd = parse(dob2, "dd/MM/yyyy", new Date());

  const { years, months, days } = intervalToDuration({
    start: birthDateStart,
    end: birthDateEnd,
  });
  if (years < 1 && months < 6 && days <= 31) {
    return true;
  } else return false;
}
