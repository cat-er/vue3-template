import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

const timeFormat = (time: string) => {
  return dayjs(time, "YYYY-MM-DD HH:mm:ss").format("M/D/YYYY [at] h:mm A");
};

export default timeFormat;
