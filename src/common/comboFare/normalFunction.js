let domesticAirports = ["DAC", "CXB", "CGP", "IRD", "JSR", "RJH","SPD","ZYL"];

export const isCombofare = (trip, origin, destination) => {
  if (trip === "Round Trip") {
    if (
      domesticAirports.includes(origin) &&
      domesticAirports.includes(destination)
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

export const totalComboFare = (comboFare) => {
  const item0Total =
    (comboFare?.item[0].brandedFares[comboFare?.departureInx]?.paxFareBreakDown
      .adt?.totalPrice || 0) *
      (comboFare?.item[0]?.passengerCounts.adt || 0) +
    (comboFare?.item[0].brandedFares[comboFare?.departureInx]?.paxFareBreakDown
      .chd?.totalPrice || 0) *
      (comboFare?.item[0]?.passengerCounts.chd || 0) +
    (comboFare?.item[0].brandedFares[comboFare?.departureInx]?.paxFareBreakDown
      .cnn?.totalPrice || 0) *
      (comboFare?.item[0]?.passengerCounts.cnn || 0) +
    (comboFare?.item[0].brandedFares[comboFare?.departureInx]?.paxFareBreakDown
      .inf?.totalPrice || 0) *
      (comboFare?.item[0]?.passengerCounts.inf || 0);

  const item1Total =
    (comboFare?.item[1].brandedFares[comboFare?.departureInx]?.paxFareBreakDown
      .adt?.totalPrice || 0) *
      (comboFare?.item[1]?.passengerCounts.adt || 0) +
    (comboFare?.item[1].brandedFares[comboFare?.departureInx]?.paxFareBreakDown
      .chd?.totalPrice || 0) *
      (comboFare?.item[1]?.passengerCounts.chd || 0) +
    (comboFare?.item[1].brandedFares[comboFare?.departureInx]?.paxFareBreakDown
      .cnn?.totalPrice || 0) *
      (comboFare?.item[1]?.passengerCounts.cnn || 0) +
    (comboFare?.item[1].brandedFares[comboFare?.departureInx]?.paxFareBreakDown
      .inf?.totalPrice || 0) *
      (comboFare?.item[1]?.passengerCounts.inf || 0);

  const totalFare = item0Total + item1Total;
  return totalFare;
};