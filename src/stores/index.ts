import { createPinia } from "pinia";

const pinia = createPinia();
export default pinia;

import { usStates, time, timeZoneList } from "./common/commonData";
import { useUserStore, useNewMessagesStore } from "./user/index";
import {
  useWorkOrderCreateStore,
  useWorkOrderDetailStore,
  useFnWorkOrderPayStore,
  useCompanyBalanceStore,
  useWorkOrderProvidersList
} from "./app/workOrder";
import { usePageLoadingStore } from "./common/common";
import {
  useWorkFlightBoardStore,
  useTableRowSelectionDataStore,
  useWorkOrderFilterStore
} from "./app/workFlightBoard";
import { useWorkOrderaTemplateCreateStore } from "./app/template";

export {
  usStates,
  time,
  useUserStore,
  useNewMessagesStore,
  useWorkOrderCreateStore,
  useFnWorkOrderPayStore,
  useCompanyBalanceStore,
  usePageLoadingStore,
  useWorkFlightBoardStore,
  timeZoneList,
  useWorkOrderDetailStore,
  useWorkOrderProvidersList,
  useWorkOrderaTemplateCreateStore,
  useTableRowSelectionDataStore,
  useWorkOrderFilterStore
};
