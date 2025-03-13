import moment from "moment";

const dayCount = (durationOne, durationTwo) => {
  var dates = moment
    .duration(
      moment(durationOne, "YYYY-MM-DD").diff(moment(durationTwo, "YYYY-MM-DD"))
    )
    .asDays();
  return dates;
};

export default dayCount;
