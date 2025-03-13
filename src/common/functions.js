import { format, intervalToDuration, parse } from "date-fns";
import airports from "../JSON/airports.json";
import countries from "../JSON/countries.json";
import layOver from "../Pages/SharePages/Utility/layOver";
import moment from "moment";

export const preAirlinesValidate = (e) => {
  if (!/^[a-zA-Z0-9,]+$/.test(e.key)) {
    e.preventDefault();
  }
};
export const isValidEmail = (input) => {
  return input
    ?.toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    ? true
    : false;
};
export const isValidPhone = (input) => {
  return input
    ?.toLowerCase()
    .match(/(^(\+8801|8801|01|008801))[1|3-9]{1}(\d){8}$/)
    ? true
    : false;
};
export const getCabinClass = (input) => {
  if (input === "Economy") return 1;
  else if (input === "Premium Economy") return 2;
  else if (input === "Business") return 3;
  else if (input === "First") return 4;
  else return 1;
};

export const getPassengerType = (input, array) => {
  if (input === "ADT") return "Adult";
  else if (input === "CHD") return "Child > 5 ";
  else if (input === "INF") return "Infant";
  else if (input === "CNN")
    return array?.some((item) => item.passengerType === "CHD")
      ? "Child < 5"
      : "Child";
  else return "";
};

export const totalFlightDuration = (input) => {
  let totalMinutes = 0;
  input?.map((item) => {
    let h = item.duration?.[0].length > 4 ? item.duration[0].split("h")[0] : 0;

    let m =
      item.duration?.[0].length > 4
        ? item.duration[0].split(" ")[1]?.split("m")[0]
        : item.duration[0].split("m")[0];

    totalMinutes += parseInt(h) * 60 + parseInt(m);
  });

  return totalMinutes >= 60
    ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
    : `${totalMinutes % 60}m`;
  //return `${Math.floor(totalMinutes / 60)}h+`;
};

export const addDurations = (inputArr) => {
  let arr = inputArr.map((item) => {
    return item.length > 7 ? item : `0d ${item}`;
  });

  let totalMinutes = 0;
  arr.map((item) => {
    let d = parseInt(item.split(" ")[0]?.slice(0, -1));
    let h = parseInt(item.split(" ")[1]?.slice(0, -1));
    let m = parseInt(item.split(" ")[2]?.slice(0, -1));

    totalMinutes += parseInt(d) * 24 * 60 + parseInt(h) * 60 + parseInt(m);
  });

  return totalMinutes >= 1440
    ? `${Math.floor(totalMinutes / 1440)}d ${Math.floor(
        (totalMinutes % 1440) / 60
      )}h ${(totalMinutes % 1440) % 60}m`
    : totalMinutes >= 60
    ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
    : `${totalMinutes % 60}m`;
};

// INTERVAL BETWEEN SEGMENTS
export const timeDuration = (start, end) => {
  const result = intervalToDuration({
    start: parse(start, "yyyy-MM-dd H:m:s", new Date()),
    end: parse(end, "yyyy-MM-dd H:m:s", new Date()),
  });

  return `${result.days}d ${result.hours}h ${result.minutes}m`;
};

export const ISODateFormatter = (input) => {
  return format(new Date(input), "yyyy-MM-dd");
};

export const getCountryNameFomCountryCode = (input) => {
  return countries.find((obj) => {
    return obj.code === input;
  })?.name;
};

export const getCountryCode = (input) => {
  // return countries.find((obj) => {
  //   return obj.code === input;
  // })?.name;
  let list = airports.find((obj) => obj.iata === input);
  return list.country;
};

export const getCountryFomAirport = (input) => {
  return airports.find((obj) => {
    return obj.iata === input;
  })?.country;
};

export const preventNegativeValues = (e) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

export const sumRating = (agent) => {
  let total = 0;
  agent?.forEach((a) => {
    total += a.totalPrice * a.passengerCount;
  });
  return total;
};

export const sumRatingGross = (agent) => {
  let total = 0;
  agent?.forEach((a) => {
    total += (a.totalPrice - a.discount) * a.passengerCount;
  });
  return total;
};

export const moveToFirstPlace = (arr, text) => {
  arr.map((elem, index) => {
    if (elem?.platingCarrier === text) {
      arr.splice(index, 1);
      arr.splice(0, 0, elem);
    }
  });
  return arr;
};

export const sortPassangerType = (data) => {
  return data?.sort((a, b) => a.passengerType.localeCompare(b.passengerType));
  // return data?.sort((a,b)=>b.passengerType.localeCompare(a.passengerType));
};

export const uniqueUser = (arr) => {
  const uniqueValues = new Set(arr.map((v) => v?.firstName));
  if (uniqueValues.size < arr.length) {
    return true;
  } else return false;
};

export const sortAndGroup = (arr = []) => {
  let result = [];
  let groupArray;
  arr.sort((a, b) => a.groupName - b.groupName);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i - 1]?.groupName !== arr[i]?.groupName) {
      groupArray = [];
      result.push(groupArray);
    }
    groupArray.push(arr[i]);
  }
  return result;
};

export const getAge = (dateString) => {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const sumTotal = (agent, item) => {
  let total = 0;
  if (item === "sellingBasePrice") {
    agent?.forEach((a) => {
      total += a.basePriceSelling;
    });
  } else if (item === "taxesSelling") {
    agent?.forEach((a) => {
      total += a.taxesSelling;
    });
  } else if (item === "priceSelling") {
    agent?.forEach((a) => {
      total += a.priceSelling;
    });
  } else if (item === "ait") {
    agent?.forEach((a) => {
      total += a.ait;
    });
  } else if (item === "commission") {
    agent?.forEach((a) => {
      total += a.discount;
    });
  }
  return total;
};

export const dayCount = (stratDate, endDate) => {
  // let A = moment(stratDate);
  // let B = moment(endDate);
  // let days = B.diff(A, 'days');
  let days = Math.floor((endDate - stratDate) / 86400000);
  return days;
};

export const formateTime = (time) => {
  if (!time) {
    return "00:00";
  }
  const tenPad = (time) => {
    if (time < 10) {
      return `0${time}`;
    } else {
      return time;
    }
  };
  const one_sec = 60;
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);
  if (hours == 0) {
    return `${tenPad(minutes)}:${tenPad(seconds)}`;
  }
  return `${tenPad(hours)}:${tenPad(minutes)}:${tenPad(seconds)}`;
};

export const sumAdditinalPrice = (agent) => {
  let total = 0;
  agent?.forEach((a) => {
    total += a.reissueCharge * a.passengerCount;
  });
  return total;
};

export const domestic = (origin, destination) => {
  if (origin && destination) {
    if (
      origin?.includes("Bangladesh") === true &&
      destination?.includes("Bangladesh") === true
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export const findLayoverAirTime = (arr) => {
  const newArr = [];
  arr?.map((segment, index) => {
    if (index === 1) {
      if (segment?.fromAirport) {
        newArr.push({
          name: segment?.fromAirport,
          layoverTime: layOver(arr[index]?.departure, arr[index - 1]?.arrival),
        });
      }
    } else if (index === 2) {
      if (segment?.fromAirport) {
        newArr.push({
          name: segment?.fromAirport,
          layoverTime: layOver(arr[index]?.departure, arr[index - 1]?.arrival),
        });
      }
    } else if (index === 3) {
      if (segment?.fromAirport) {
        newArr.push({
          name: segment?.fromAirport,
          layoverTime: layOver(arr[index]?.departure, arr[index - 1]?.arrival),
        });
      }
      // newArr.push({ name: segment?.fromAirport, isClicked: false });
    }
  });
  return newArr;
};

export const removeExtraSpaces = (inputString) => {
  return inputString.replace(/\s+(?=\s|$)/g, "");
};

export const numberWithCommas = (x) => {
  if (!x) {
    return 0;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function filterAndSumWeights(inputString) {
  const splitArray = inputString.split(", ");
  const uniqueSet = new Set(splitArray);
  const uniqueArray = Array.from(uniqueSet);
  const resultString = uniqueArray.join(", ");
  return resultString;
}

export function remainingDay(lastday) {
  const timeDifference = new Date(lastday) - new Date();
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysRemaining;
}

const sumBaggage = (arr) => {
  let total = 0;
  arr?.forEach((a) => {
    a?.forEach((b) => {
      total += b.price;
    });
  });
  return total;
};

export const totalBaggageCost = (arr) => {
  let totalCost = 0;
  arr?.map((item) => {
    totalCost += sumBaggage(item.aCMExtraServices);
  });
  return totalCost;
};

export const sortAndGroupExtra = (arr = []) => {
  let result = [];
  let groupArray;
  arr?.sort((a, b) => a.fK_PaxId - b.fK_PaxId);
  for (let i = 0; i < arr?.length; i++) {
    if (arr[i - 1]?.fK_PaxId !== arr[i]?.fK_PaxId) {
      groupArray = [];
      result.push(groupArray);
    }
    groupArray.push(arr[i]);
  }
  return result;
};

export const getPassengerTypeWithCode = (input) => {
  if (input === "ADT") return "Adult";
  else if (input === "CHD") return "Child ";
  else if (input === "INF") return "Infant";
  else if (input === "CNN") return "Child ";
  else return "";
};

export const invoiceTotalCost = (arr) => {
  let total = 0;
  arr.forEach((item) => {
    total +=
      item.amount +
      item.reissueCharge +
      item.extraService +
      item.additionalCollection;
  });
  return total;
};

export const cityWithIata = (input) => {
  return airports.find((obj) => {
    return obj.iata === input;
  })?.city;
};

export const getFullPassengerType = (input) => {
  if (input === "ADT") return "Adult";
  else if (input === "CHD" || input === "CNN") return "Child  ";
  else if (input === "INF") return "Infant";
  else return "";
};

export const sumTaxesDiscount = (arr) => {
  let total = 0;
  arr?.forEach((a) => {
    total += a.taxCommissionValue;
  });
  return total;
};

export const checkCabinClass = (cabinClass, userInput) => {
  if (!cabinClass) {
    return true;
  } else {
    if (userInput === "First") {
      return cabinClass === userInput;
    } else if (userInput === "Business") {
      return !(cabinClass === "Economy" || cabinClass === "Premium Economy");
    } else if (userInput === "Premium Economy") {
      return cabinClass !== "Economy";
    } else {
      return true;
    }
  }
};

export const isNestedObject = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  for (let key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      typeof obj[key] === "object" &&
      obj[key] !== null
    ) {
      return true;
    }
  }
  return false;
};

export const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export const passengerType = (code) => {
  const passengerTypes = {
    ADT: "Adult",
    CHD: "Child",
    CNN: "Child",
    INF: "Infant",
  };

  return passengerTypes[code] || code;
};
export const DateFormatterWithMonth = (input) => {
  if (!input) return "";
  return moment(input).format("DD-MMM-YYYY");
};

export const CheckInTimeFormatter = (input, offsetHours) => {
  if (!input) return "";

  const date = moment(input);

  const [hours, minutes] = offsetHours.split(":").map(Number);

  date.subtract(hours, "hours").subtract(minutes, "minutes");

  return date.format("HH:mm");
};

export const formatAmount = (amount) => {
  return parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const timeFormatter = (input) => {
  if (!input) return "";
  return moment(input).format("HH:mm");
};

export const domesticAirports = [
  "DAC",
  "CGP",
  "ZYL",
  "SPD",
  "JSR",
  "RJH",
  "CXB",
  "BZL",
  "IRD",
];
export const checkIsDomestic = (segments) => {
  return segments?.every(
    (segment) =>
      domesticAirports.includes(segment?.origin) &&
      domesticAirports.includes(segment?.destination)
  );
};

export const checkOperationCarrier = (segments) => {
  const carrierCode = segments?.[0]?.operationCarrier;
  return (
    (carrierCode === "BS" || carrierCode === "2A") &&
    segments?.every((segment) => segment.operationCarrier === carrierCode)
  );
};

export const ISODateFormatterTicketView = (input) => {
  return format(new Date(input), "dd-MMM-yy HH:mm");
};

export const sumRatingForPassengerTicket = (agent, passengers) => {
  let adtCount = 0;
  let chdCount = 0;
  let cnnCount = 0;
  let infCount = 0;

  // Count passengers
  passengers?.forEach((passenger) => {
    if (passenger.passengerType === "ADT") adtCount++;
    else if (passenger.passengerType === "CHD") chdCount++;
    else if (passenger.passengerType === "CNN") cnnCount++;
    else if (passenger.passengerType === "INF") infCount++;
  });

  let total = 0;

  // Calculate total
  agent?.forEach((a) => {
    if (
      typeof a.totalPrice === "number" &&
      typeof a.passengerCount === "number"
    ) {
      if (a.passengerType === "ADT") {
        total += a.totalPrice * (a.passengerCount - adtCount);
      } else if (a.passengerType === "CHD") {
        total += a.totalPrice * (a.passengerCount - chdCount);
      } else if (a.passengerType === "CNN") {
        total += a.totalPrice * (a.passengerCount - cnnCount);
      } else if (a.passengerType === "INF") {
        total += a.totalPrice * (a.passengerCount - infCount); // Fixed typo here
      }
    }
  });

  return total;
};

export const sumRatingForPassengerTicketGross = (agent, passengers) => {
  let adtCount = 0;
  let chdCount = 0;
  let cnnCount = 0;
  let infCount = 0;
  passengers?.forEach((passenger) => {
    if (passenger.passengerType === "ADT") {
      adtCount++;
    } else if (passenger.passengerType === "CHD") {
      chdCount++;
    } else if (passenger.passengerType === "CNN") {
      cnnCount++;
    } else if (passenger.passengerType === "INF") {
      infCount++;
    }
  });
  let total = 0;
  agent?.forEach((a) => {
    if (a.passengerType === "ADT") {
      total += (a.totalPrice - a.discount) * (a.passengerCount - adtCount);
    } else if (a.passengerType === "CHD") {
      total += (a.totalPrice - a.discount) * (a.passengerCount - chdCount);
    } else if (a.passengerType === "CNN") {
      total += (a.totalPrice - a.discount) * (a.passengerCount - cnnCount);
    } else if (a.passengerType === "INF") {
      total += (a.totalPrice - a.discount) * (a.passengerCount - infCount);
    }
  });
  return total;
};

export const convertFareType = (fareType) => {
  if (fareType === "Regular") return 1;
  else if (fareType === "Student") return 2;
};

export const validateNameForPax =(firstName, lastName) =>{
  
  const RESERVED_WORDS = new Set([
    "TEST", "DUMMY", "GUEST", "ADMIN", "UNKNOWN", "NULL", "NONE","TRAINING", "SABRE", "GALILEO", "AMADEUS"
  ]);
  const SEQUENTIAL_PATTERNS = ["XYZ", "ABCD", "QWER", "ASDF", "ZXCV"]; // Add more patterns if needed
  const BENGALI_MUSLIM_NAMES = new Set(["ALI", "MUHAMMAD", "MOHAMMAD", "UDDIN", "HASAN", "HOSSAIN"]);
  const NAME_REGEX = /^[a-zA-Z]+( [a-zA-Z]+)*$/; // Regex to allow only letters and spaces, and no leading/trailing spaces

  // Trim and normalize input
  firstName = (firstName || "").trim().toUpperCase();
  lastName = (lastName || "").trim().toUpperCase();

  // Check for empty or null values
  if (!firstName || !lastName) {
      return { isValid: false, message: "First name and last name are required." };
  }


  // Check if names contain only letters and spaces, and no leading/trailing spaces
  if (!NAME_REGEX.test(firstName) || !NAME_REGEX.test(lastName)) {
    return { isValid: false, message: "Name contains invalid characters or has leading/trailing spaces (only letters and single spaces are allowed)" };
  }

  // Check for reserved words
  if (RESERVED_WORDS.has(firstName) || RESERVED_WORDS.has(lastName)) {
      return { isValid: false, message: "Name contains a reserved word." };
  }

  // Check for sequential or repeated patterns
  if (SEQUENTIAL_PATTERNS.includes(firstName) || SEQUENTIAL_PATTERNS.includes(lastName)) {
      return { isValid: false, message: "Name contains a sequential or repeated pattern." };
  }

  // Check for specific combinations (e.g., "abacus" with Bengali/Muslim names)
  if (
      (firstName === "ABACUS" && BENGALI_MUSLIM_NAMES.has(lastName)) ||
      (lastName === "ABACUS" && BENGALI_MUSLIM_NAMES.has(firstName))
  ) {
      return { isValid: false, message: "Invalid combination of names." };
  }



  // If all checks pass, the name is valid
  return { isValid: true, message: "Name is valid." };
}
