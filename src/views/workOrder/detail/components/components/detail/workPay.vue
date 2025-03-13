<template>
  <div>
    <a-spin :spinning="isLoading">
      <a-col class="detail-card work-pay" span="24">
        <a-card class="detail-card">
          <template #title>
            <div>
              <span class="work-card-title">Pay</span>
              <span class="pay-type" v-if="pay?.type === PayTypeEnum.HOURLY">Hourly</span>
              <span class="pay-type" v-if="pay?.type === PayTypeEnum.FIXED">Fixed</span>
              <span class="pay-type" v-if="pay?.type === PayTypeEnum.DEVICE">Device</span>
              <span class="pay-type" v-if="pay?.type === PayTypeEnum.BLENDED">Blended</span>
            </div>
          </template>
          <template #extra v-if="editIsDisabled">
            <a-dropdown>
              <a-button shape="circle" :icon="h(MoreOutlined)" />
              <template #overlay>
                <a-menu>
                  <a-menu-item
                    v-for="(item, index) in dropDownList"
                    :key="index"
                    @click="item.handle"
                  >
                    <span>{{ item.label }}</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <div class="content">
            <div class="item">
              <span class="label_total" v-if="increases_pay">Current Pay Structure</span>
              <span class="label_total" v-else>Labor</span>
              <span class="price_total" style="color: red">
                ${{ formattedPrice(pay?.labor_sum) }}
              </span>
            </div>
            <div class="item">
              <span class="label" v-if="pay?.type === PayTypeEnum.FIXED">Pay Amount</span>
              <span class="label" v-else-if="pay?.type === PayTypeEnum.DEVICE">Pay Device</span>
              <span class="label" v-else>Rate</span>
              <span class="dotted-line"></span>
              <span>${{ formattedPrice(pay?.base.amount) }}</span>
            </div>
            <div class="item" v-if="pay?.type === PayTypeEnum.DEVICE && pay?.hours > 0">
              <span class="label">Approximate Hours to Complete</span>
              <span class="dotted-line"></span>
              <span class>{{ pay?.hours }}</span>
            </div>
            <div class="item" v-if="pay?.type !== PayTypeEnum.FIXED">
              <span class="label" v-if="pay?.type === PayTypeEnum.HOURLY">Hours</span>
              <span class="label" v-if="pay?.type === PayTypeEnum.BLENDED">First Hour</span>
              <span class="label" v-if="pay?.type === PayTypeEnum.DEVICE">Number of Devices</span>
              <span class="dotted-line"></span>
              <span v-if="pay?.type === PayTypeEnum.HOURLY">
                <span v-if="pay.reported_hours > 0">
                  {{ formattedPrice(pay.reported_hours) }} Logged /
                </span>
                {{ pay?.base.units }} Max
              </span>
              <span v-else>{{ pay?.base.units }}</span>
            </div>
            <div class="item" v-if="pay?.type === PayTypeEnum.BLENDED">
              <span class="additional">Then pay Additional Hours</span>
            </div>
            <div class="item" v-if="pay?.type === PayTypeEnum.BLENDED">
              <span class="label">Rate</span>
              <span class="dotted-line"></span>
              <span>${{ formattedPrice(pay?.additional.amount) }}</span>
            </div>
            <div class="item" v-if="pay?.type === PayTypeEnum.BLENDED">
              <span class="label">Additional Hour</span>
              <span class="dotted-line"></span>
              <span>
                <span v-if="logged > 0">{{ logged }} Logged /</span>
                {{ pay?.additional.units }} Max
              </span>
            </div>
          </div>
          <div class="increases_content" v-if="increases_pay">
            <div class="item">
              <span class="label_total">Requested Pay Change</span>
              <span v-if="increases" class="price_total" style="color: orange">
                ${{ formattedPrice(increases.all) }}
              </span>
            </div>
            <div class="item">
              <span class="label" v-if="increases_pay?.type === PayTypeEnum.FIXED">Pay Amount</span>
              <span class="label" v-else-if="increases_pay?.type === PayTypeEnum.DEVICE">
                Pay Device
              </span>
              <span class="label" v-else>Rate</span>
              <span class="dotted-line"></span>
              <span>${{ formattedPrice(increases_pay?.base.amount) }}</span>
            </div>
            <div class="item" v-if="hoursIsShow">
              <span class="label">Approximate Hours to Complete</span>
              <span class="dotted-line"></span>
              <span class>{{ increases_pay?.hours }}</span>
            </div>
            <div class="item" v-if="increases_pay?.type !== PayTypeEnum.FIXED">
              <span class="label" v-if="increases_pay?.type === PayTypeEnum.HOURLY">Hours</span>
              <span class="label" v-if="increases_pay?.type === PayTypeEnum.BLENDED">
                First Hour
              </span>
              <span class="label" v-if="increases_pay?.type === PayTypeEnum.DEVICE">
                Number of Devices
              </span>
              <span class="dotted-line"></span>
              <span>{{ increases_pay?.base.units }}</span>
            </div>
            <div class="item" v-if="increases_pay?.type === PayTypeEnum.BLENDED">
              <span class="additional">Then pay Additional Hours</span>
            </div>
            <div class="item" v-if="increases_pay?.type === PayTypeEnum.BLENDED">
              <span class="label">Rate</span>
              <span class="dotted-line"></span>
              <span>
                ${{ formattedPrice(increases_pay?.additional && increases_pay?.additional.amount) }}
              </span>
            </div>
            <div class="item" v-if="increases_pay?.type === PayTypeEnum.BLENDED">
              <span class="label">Additional Hour</span>
              <span class="dotted-line"></span>
              <span>
                {{ increases_pay?.additional && increases_pay?.additional.units }}
              </span>
            </div>
            <div class="item">
              <span class="additional">Reason</span>
            </div>
            <div class="item">
              <span style="color: gray">{{ increases?.pay_change.description }}</span>
            </div>
            <a-divider />
            <div class="footer">
              <p>
                If accepted, the current pay and sum will be updated to reflect the requested pay
                change.
              </p>
              <div class="actions">
                <a-button @click="denyPayChange(increases?.pay_change.id)">Deny</a-button>
                <a-button type="primary" @click="approvePayChange" :loading="approveLoading">
                  Approve
                </a-button>
              </div>
            </div>
          </div>
          <a-divider v-if="expenses?.results && expenses.results.length > 0" />
          <div class="item" v-if="expenses?.results && expenses.results.length > 0">
            <span class="label_total">Expenses</span>
            <span class="price_total" style="color: red">
              ${{ formattedPrice(expenses?.charged) }}
            </span>
          </div>
          <div v-if="expenses?.results && expenses.results.length > 0">
            <a-row v-for="item in expenses?.results" :key="item.id" class="expense-row">
              <a-col span="24">
                <div class="expense-item">
                  <span>{{ item.category.label }}</span>
                  <span class="dotted-line"></span>
                  <del
                    v-if="item.status === FnWorkOrderPayResultStatusEnum.DISAPPROVED"
                    class="expense-amount pointer"
                    @click="showExpense(item)"
                  >
                    {{ item.author.is_provider ? "Provider" : "Buyer" }}: ${{ item.amount }}
                  </del>
                  <span v-else @click="showExpense(item)" class="expense-amount pointer">
                    {{ item.author.is_provider ? "Provider" : "Buyer" }}: ${{ item.amount }}
                  </span>
                </div>
              </a-col>
              <a-col span="24" class="expense-actions">
                <div class="expense-description">
                  {{ item.description }}
                  <br />
                  <a v-if="item.receipt && item.receipt.id" @click="showExpense(item)">
                    <PaperClipOutlined />
                    View Attachment
                  </a>
                </div>
                <div>
                  <a-button
                    size="small"
                    type="primary"
                    ghost
                    class="margin-right-16"
                    :disabled="denyIsDisable(item)"
                    @click="denyHandle(item.id)"
                  >
                    Deny
                  </a-button>
                  <a-button
                    size="small"
                    type="primary"
                    ghost
                    :disabled="approveIsDisable(item)"
                    @click="approveHandle(item.id)"
                  >
                    Approve
                  </a-button>
                </div>
              </a-col>
            </a-row>
          </div>
          <a-divider />
          <div class="item">
            <span class="label_total">Total Estimate</span>
            <span class="price_total" style="color: red">${{ formattedPrice(pay?.total) }}</span>
          </div>
        </a-card>
      </a-col>
    </a-spin>

    <payEditModal ref="payEditModalRef" />
    <expenseModal ref="expenseModalRef" />
    <denyModal ref="denyModalRef" @deny-done="denyDoneHandle" />
    <DenyPayChangeModal ref="denyPayChangeModalRef" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useFnWorkOrderPayStore, useWorkOrderDetailStore } from "@/stores";
import {
  WorkOrderDetailStatusEnum,
  FnWorkOrderPayResultStatusEnum,
  FnWorkOrderPayResult,
  ExamineExpenseRes,
  ExamineExpenseStatusEnum,
  PayTypeEnum,
  type ExamineRequestedPayChangeReq,
  ExamineRequestedPayChangeEnum
} from "@/api/api/workOrder/types";
import { MoreOutlined, PaperClipOutlined } from "@ant-design/icons-vue";
import payEditModal from "./workPay/payEditModal.vue";
import expenseModal from "./workPay/expenseModal.vue";
import denyModal from "./workPay/denyModal.vue";
import { getFnWorkOrderPay, examineExpense, examineRequestedPayChange } from "@/api/api/workOrder";
import { notifyError, notifySuccess } from "@/utils/notify";
import DenyPayChangeModal from "./components/denyPayChangeModal.vue";
import { toNumber } from "lodash";

const { setFnWorkOrderPay } = useFnWorkOrderPayStore();
const { fnWorkOrderPay } = storeToRefs(useFnWorkOrderPayStore());
const { workOrderStatus, workOrderId } = storeToRefs(useWorkOrderDetailStore());

const pay = computed(() => {
  return fnWorkOrderPay.value;
});

const expenses = computed(() => {
  return fnWorkOrderPay.value?.expenses;
});

const increases = computed(() => {
  return fnWorkOrderPay.value?.increases;
});

const increases_pay = computed(() => {
  if (!increases.value) return;
  const { pay_change } = increases.value;
  if (!pay_change) return;
  if (JSON.stringify(pay_change) === "{}") return;
  return increases.value?.pay_change.pay;
});

const logged = computed(() => {
  if (!pay.value) return 0;
  const { reported_hours, base } = pay.value;
  if (!base.units) return 0;
  return reported_hours - base.units < 0 ? 0 : formattedPrice(reported_hours - base.units);
});

const hoursIsShow = computed(() => {
  if (!increases_pay.value?.hours) return;
  return increases_pay.value?.type === PayTypeEnum.DEVICE && increases_pay.value?.hours > 0;
});

const formattedPrice = (amount: string | number | undefined) => {
  return parseFloat(String(amount)).toFixed(2);
};

const approveLoading = ref<boolean>(false);
// 编辑按钮事件
const payEditModalRef = ref();
const toEdit = () => {
  payEditModalRef.value.show();
};

// 更多按钮下拉菜单
const dropDownList = [{ label: "Edit", handle: toEdit }];

// 编辑按钮是否展示
const editIsDisabled = computed(() => {
  const arr = [WorkOrderDetailStatusEnum.PUBLISHED, WorkOrderDetailStatusEnum.DRAFT];
  if (!workOrderStatus.value) return;
  return arr.includes(workOrderStatus.value);
});

// 额外费用信息展示
const expenseModalRef = ref();
const showExpense = (expensesValue: FnWorkOrderPayResult) => {
  expenseModalRef.value.show(expensesValue);
};

// 重新获取pay信息
const isRefreshLoading = ref(true);
const refresh = async () => {
  try {
    if (!workOrderId.value) return;
    isRefreshLoading.value = true;
    const res = await getFnWorkOrderPay({ order_id: workOrderId.value });
    if (res) {
      setFnWorkOrderPay(res);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isRefreshLoading.value = false;
  }
};

// 审核逻辑

// deny按钮是否禁用
const denyIsDisable = (item: FnWorkOrderPayResult) => {
  return (
    (workOrderStatus.value !== WorkOrderDetailStatusEnum.ASSIGNED &&
      item.status !== FnWorkOrderPayResultStatusEnum.NEW) ||
    item.status === FnWorkOrderPayResultStatusEnum.DISAPPROVED
  );
};

// approve按钮是否禁用
const approveIsDisable = (item: FnWorkOrderPayResult) => {
  return (
    (workOrderStatus.value !== WorkOrderDetailStatusEnum.ASSIGNED &&
      item.status !== FnWorkOrderPayResultStatusEnum.NEW) ||
    item.status === FnWorkOrderPayResultStatusEnum.APPROVED
  );
};

// 审核数据
const auditFormData = ref<ExamineExpenseRes>({
  order_id: workOrderId.value as number,
  status: ExamineExpenseStatusEnum.DISAPPROVED,
  status_description: ""
});

// 审核方法
const isAuditLoading = ref(true);
const expenseId = ref<number | string>();
const auditHandle = async () => {
  try {
    isAuditLoading.value = true;
    const res = await examineExpense(auditFormData.value, String(expenseId.value));
    if (res) {
      notifySuccess("Success");
      refresh();
    }
  } catch (error) {
    console.error(error);
  } finally {
    isAuditLoading.value = false;
  }
};

// pay loading
const isLoading = computed(() => isAuditLoading.value || isRefreshLoading.value);

// 打开拒绝信息窗口
const denyModalRef = ref();
const denyHandle = (id: number) => {
  expenseId.value = id;
  denyModalRef.value.show();
};

const denyPayChangeModalRef = ref();
// 拒绝修改价格
const denyPayChange = (pay_id) => {
  console.log("increases:", increases.value);
  denyPayChangeModalRef.value.show(pay_id, workOrderId.value);
};

//同意修改价格
const approvePayChange = async () => {
  const param = ref<ExamineRequestedPayChangeReq>({
    order_id: toNumber(workOrderId.value), //本系统工单id
    status: ExamineRequestedPayChangeEnum.ACCEPTED, //状态，accepted,denied
    status_description: "" //如果审核为不通过则为必填
  });
  approveLoading.value = true;
  try {
    let res = await examineRequestedPayChange(
      param.value,
      increases.value?.pay_change.id.toString()
    );
    if (res) {
      notifySuccess("Approved successful");
    }
    await refresh();
  } catch {
    notifyError("Approved failure");
  }
  approveLoading.value = false;
};

// 拒绝逻辑
const denyDoneHandle = (desc: string | undefined) => {
  auditFormData.value.status_description = desc;
  auditFormData.value.status = ExamineExpenseStatusEnum.DISAPPROVED;
  auditHandle();
};

// 通过逻辑
const approveHandle = (id: number) => {
  expenseId.value = id;
  auditFormData.value.status = ExamineExpenseStatusEnum.APPROVED;
  auditHandle();
};

// 初次进入时将pay loading置为true，pay信息获取到时置为false
watch(
  () => fnWorkOrderPay.value,
  () => {
    isRefreshLoading.value = !fnWorkOrderPay.value;
    isAuditLoading.value = !fnWorkOrderPay.value;
  },
  { immediate: true }
);
</script>

<style scoped>
.pay-type {
  font-size: 14px;
  color: gray;
  margin-left: 8px;
}

.content {
  padding: 0 0;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.label {
  white-space: nowrap;
}

.additional {
  font-size: 15px;
  font-weight: bolder;
  margin: 5px 0;
}

.dotted-line {
  flex-grow: 5;
  border-bottom: 1px dashed #ccc;
  margin: 0 8px;
}

.expense-description {
  font-size: 14px;
  color: gray;
}

.label_total {
  flex: 1;
  font-size: 18px;
  margin: 8px 0;
}

.price_total {
  flex: 1;
  text-align: right;
  font-size: 18px;
  color: #1c1c1e;
}

.expense-row {
  margin-bottom: 16px;
}

.expense-item {
  display: flex;
  align-items: center;
}

.expense-amount {
  margin-left: auto;
  margin-right: 8px;
  font-weight: bold;
  background-color: var(--color-background-content);
  padding: 0 var(--padding-base);
}

.expense-description {
  color: #999;
}

.expense-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.increases_content {
  padding: 8px;
  background-color: #fdf2de; /* 设置背景颜色 */
}

.footer {
  p {
    margin-bottom: 16px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;

    button {
      margin-left: 16px;
    }
  }
}
</style>
