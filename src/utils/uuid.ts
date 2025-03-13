import { v4 as uuidv4 } from "uuid";

const uuid = () => {
  return uuidv4() as string;
};

export default uuid;
