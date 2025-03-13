<template>
  <div>
    <a-modal
      :open="deleteInfo.publishOpen"
      wrap-class-name="publish-action"
      :footer="null"
      :closable="false"
    >
      <a-card
        :title="t('unable_to_publish')"
        class="publish-card"
      >
        <template #extra><close-outlined @click="onClose" /></template>
        <p>{{ t('unable_to_publish_title') }}:</p>
        <div class="flex-column order-detail-title-bar">
          <div class="flex order-detail-info">
            <div class="info-item">
              <div class="flex">
                <div class="margin-left-8 flex-colum">
                  <div class="msg-data">
                    <ul>
                      <li>{{ t('address_must_be_completed') }}.</li>
                      <li>{{ t('city_must_be_completed') }}.</li>
                      <li>{{ t('state_must_be_completed') }}.</li>
                      <li>{{ t('postal_code_must_be_completed') }}.</li>
                      <li>{{ t('invalid_state') }}</li>
                      <li>{{ t('missing_service_description') }}.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #actions>
          <a-space>
            <a-button @click="onClose">{{ t('close') }}</a-button>
          </a-space>
        </template>
      </a-card>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { t } from '@/locale';

// 数据接收
interface Props {
  publishOpen: boolean;
  oreder_id: number;
}
const { deleteInfo } = defineProps<{ deleteInfo: Props }>();
const emits = defineEmits(['cancels']);

const onClose = () => {
  emits('cancels');
};

</script>

<style scoped></style>