import moment from "moment";


export const findBaggageList = (arr) => {

  const newArr = [];
  arr?.map((res) => {
    res?.directions?.map((direction) => {
      direction?.map((item) => {
        item?.segments?.map((segment) => {
          if(segment.baggage.length > 0){
            newArr.push({...segment.baggage[0],isisClicked : false});
          }
        });
      });
    });
  });
    return Array.from(new Set(newArr.map((obj) => obj.amount))).map((id) =>
      newArr.find((obj) => obj.amount === id)
    )
}

export const baggageFilter = (arr, baggageArr) => {
  const newArr = [];
  arr?.map((res) => {
    res?.directions?.map((direction) => {
      direction?.map((item) => {
        item?.segments?.map((segment) => {
          baggageArr?.map((baggage) => {
            if (baggage.isClicked) {
              if (segment?.baggage[0]?.amount === baggage.amount) {
                newArr.push(res);
              }
            }
          });
        });
      });
    });
  });
  if (
    newArr.length > 0 ||
    baggageArr?.some((baggage) => baggage.isClicked === true)
  ) {
    return Array.from(new Set(newArr.map((obj) => obj.itemCodeRef))).map((id) =>
      newArr.find((obj) => obj.itemCodeRef === id)
    );
  } else {
    return arr;
  }
};


export const stopsFilter = (arr, value) => {
  const segmentLength = parseInt(value);

  if (segmentLength < 1 || segmentLength > 3) {
    return arr; // Return the original array if value is not 1, 2, or 3
  }

  return arr?.reduce((acc, res) => {
    const allDirectionsValid = res?.directions?.every((direction) =>
      direction?.every((item) => {
        const lengthCondition =
          segmentLength === 1
            ? item?.segments?.length === 1 &&
              item?.segments?.every((item) => item.details.length === 1)
            : segmentLength === 2
            ? item?.segments?.length === 2 &&
              item?.segments?.every(
                (item) => item.details.length === 2 || item.details.length === 1
              )
            : item?.segments?.length > 2 &&
              item?.segments?.every((item) => item.details.length > 2);
        return lengthCondition;
      })
    );

    if (allDirectionsValid) {
      acc.push(res);
    }

    return acc;
  }, []);
};

// find aircraft name
export const findAircraft = (arr) => {
  const newArr = [];
  arr?.map((res) => {
    res?.directions?.map((direction) => {
      direction?.map((item) => {
        item?.segments?.map((segment) => {
          if (segment?.details?.length > 0) {
            if (segment?.details[0]?.equipment) {
              newArr.push({
                name: segment?.details[0]?.equipment,
                isClicked: false,
              });
            }
            // newArr.push({
            //   name: segment?.details[0]?.equipment,
            //   isClicked: false,
            // });
          }
        });
      });
    });
  });
  return Array.from(new Set(newArr.map((obj) => obj.name))).map((id) =>
    newArr.find((obj) => obj.name === id)
  );
};

// find layOverAirport name
export const layOverAirportName = (arr) => {
  const newArr = [];
  arr?.map((res) => {
    res?.directions?.map((direction) => {
      direction?.map((item) => {
        item?.segments?.map((segment, index) => {
          if (index === 1) {
            if (segment?.fromAirport) {
              newArr.push({ name: segment?.fromAirport, isClicked: false });
            }
          } else if (index === 2) {
            if (segment?.fromAirport) {
              newArr.push({ name: segment?.fromAirport, isClicked: false });
            }
          } else if (index === 3) {
            if (segment?.fromAirport) {
              newArr.push({ name: segment?.fromAirport, isClicked: false });
            }
            // newArr.push({ name: segment?.fromAirport, isClicked: false });
          }
        });
      });
    });
  });
  return Array.from(new Set(newArr.map((obj) => obj.name))).map((id) =>
    newArr.find((obj) => obj.name === id)
  );
};

// all filter function
export const refunbableFilter = (arr, obj) => {
  if (obj.refunbable && !obj.nonRefundable) {
    const newArr = arr.filter((item) => item.refundable === true);
    return newArr;
  } else if (obj.nonRefundable && !obj.refunbable) {
    const newArr = arr.filter((item) => item.refundable === false);
    return newArr;
  } else {
    return arr;
  }
};

export const scheduleFilter = (airResponseArr, onwordSchduleArr, type) => {
  const newArr = [];
  airResponseArr?.map((res) => {
    res?.directions?.map((direction) => {
      direction?.map((item) => {
        item?.segments?.map((segment) => {
          onwordSchduleArr?.map((schdule) => {
            if (schdule.isClicked) {
              if (type === 0) {
                if (
                  moment(segment?.departure).hour() >= schdule.min &&
                  moment(segment?.departure).hour() < schdule.max
                ) {
                  newArr.push(res);
                }
              } else {
                if (
                  moment(segment?.arrival).hour() >= schdule.min &&
                  moment(segment?.arrival).hour() < schdule.max
                ) {
                  newArr.push(res);
                }
              }
            }
          });
        });
      });
    });
  });
  if (
    newArr.length > 0 ||
    onwordSchduleArr?.some((schdule) => schdule.isClicked === true)
  ) {
    return Array.from(new Set(newArr.map((obj) => obj.itemCodeRef))).map((id) =>
      newArr.find((obj) => obj.itemCodeRef === id)
    );
  } else {
    return airResponseArr;
  }
};

export const layOverAirportFilter = (arr, layOverAirport) => {
  const newArr = [];
  arr?.map((res) => {
    res?.directions?.map((direction) => {
      direction?.map((item) => {
        item?.segments?.map((segment) => {
          layOverAirport?.map((airport) => {
            if (airport.isClicked) {
              if (segment?.fromAirport === airport.name) {
                newArr.push(res);
              }
            }
          });
        });
      });
    });
  });
  if (
    newArr.length > 0 ||
    layOverAirport?.some((schdule) => schdule.isClicked === true)
  ) {
    return Array.from(new Set(newArr.map((obj) => obj.itemCodeRef))).map((id) =>
      newArr.find((obj) => obj.itemCodeRef === id)
    );
  } else {
    return arr;
  }
};

export const aircraftFilter = (arr, aircraft) => {
  const newArr = [];
  arr?.map((res) => {
    res?.directions?.map((direction) => {
      direction?.map((item) => {
        item?.segments?.map((segment) => {
          aircraft?.map((craft) => {
            if (craft.isClicked) {
              if (segment?.details[0]?.equipment === craft.name) {
                newArr.push(res);
              }
            }
          });
        });
      });
    });
  });
  if (
    newArr.length > 0 ||
    aircraft?.some((schdule) => schdule.isClicked === true)
  ) {
    return Array.from(new Set(newArr.map((obj) => obj.itemCodeRef))).map((id) =>
      newArr.find((obj) => obj.itemCodeRef === id)
    );
  } else {
    return arr;
  }
};

export const layoverFilter = (arr, layoverTime) => {
  const newArr = [];
  arr?.map((res) => {
    res?.directions?.map((direction) => {
      direction?.map((item) => {
        item?.segments?.map((segment, indx) => {
          layoverTime?.map((time) => {
            if (time.isClicked) {
              if (item?.segments?.length === 1 && time.min === 0) {
                newArr.push(res);
              } else if (item?.segments[indx + 1]) {
                let arrivalTime = moment(item?.segments[indx]?.arrival);
                let departureTime = moment(item?.segments[indx + 1]?.departure);
                let diff = moment.duration(departureTime?.diff(arrivalTime));
                let timeDiffHours = parseInt(diff.asHours());
                if (timeDiffHours >= time.min && timeDiffHours < time.max) {
                  newArr.push(res);
                }
              }
            }
          });
        });
      });
    });
  });
  if (
    newArr.length > 0 ||
    layoverTime?.some((schdule) => schdule.isClicked === true)
  ) {
    return Array.from(new Set(newArr.map((obj) => obj.itemCodeRef))).map((id) =>
      newArr.find((obj) => obj.itemCodeRef === id)
    );
  } else {
    return arr;
  }
};

export const airlinesCodeName = (item) => {
  const newArr = [];
  item?.segments?.map((segment) => {
    newArr?.push({
      airlineCode: segment.airlineCode,
      airline: segment.airline,
      flightNumber: segment.flightNumber,
      equipment: segment?.details[0].equipment,
    });
  });

  return Array.from(new Set(newArr.map((obj) => obj.airlineCode))).map((id) =>
    newArr.find((obj) => obj.airlineCode === id)
  );
};

export const fareTypeFilter = (airResponseArr, obj) => {
  const newArr = [];
  airResponseArr?.map((res) => {
    obj?.map((item) => {
      if (
        item.isClicked &&
        (item.value === res?.passengerFares?.adt?.fareType ||
          item.value === res?.passengerFares)
      ) {
        newArr.push(res);
      }
    });
  });
  if (newArr.length > 0) {
    return Array.from(new Set(newArr.map((obj) => obj.itemCodeRef))).map((id) =>
      newArr.find((obj) => obj.itemCodeRef === id)
    );
  } else {
    if (obj?.some((item) => item.isClicked === true)) {
      return [];
    } else {
      return airResponseArr;
    }
  }
};
