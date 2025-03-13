const DurationFormat = (duration) => {
    return Math.floor(duration/60)+"h "+duration%60+"m";
};

export default DurationFormat;