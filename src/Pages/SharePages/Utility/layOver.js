import moment from "moment";

const layOver = (durationOne, durationTwo) => {
  var days = moment(durationOne, "YYYY/MM/DD HH:mm").diff(
    moment(durationTwo, "YYYY/MM/DD HH:mm"), 'days'
  )
  var ms = moment(durationOne, "YYYY/MM/DD HH:mm").diff(
    moment(durationTwo, "YYYY/MM/DD HH:mm"));

  var minutes = Math.floor((ms / (1000 * 60)) % 60);
  var hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  let time = '';
  if (days > 0) {
    time = days + "d " + hours + "h " + minutes + "m "
  } else {
    time = hours + "h " + minutes + "m "
  }
  return time;
};

export default layOver;
