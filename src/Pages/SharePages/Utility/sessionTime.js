import moment from "moment";

const sessionTime = (expireTime, runningTime) => {
    var ms = moment(expireTime, "YYYY-MM-DD HH:mm").diff(moment(runningTime, "YYYY-MM-DD HH:mm"));
    var seconds = Math.floor((ms / 1000) % 60);
    var minutes = Math.floor((ms / (1000 * 60)) % 60);
    var hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const time = hours;
    return time;
}

export default sessionTime;