import common from "./common";
import http from "./http";
import workOrder from "./workOrder";
import work from "./work";
import workOrderDetail from "./workOrderDetail";
import manage from "./manage";
import messages from "./messages";
import amount from "./amount";
import workOrderDetailCommon from "./workOrderDetailCommon";

export default {
  ...common,
  ...http,
  ...workOrder,
  ...manage,
  ...work,
  ...workOrderDetail,
  ...amount,
  ...workOrderDetailCommon,
  ...messages
};
