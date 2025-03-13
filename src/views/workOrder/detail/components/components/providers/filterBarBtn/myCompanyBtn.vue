<template>
  <a-popover class="filter-quality" trigger="click" placement="bottom">
    <template #title>
      <span>{{ t("my_company") }}</span>
    </template>
    <template #content>
      <popoverContent>
        <div class="flex-column">
          <div class="flex">
            <div>
              <a-checkbox class="margin-right-8"></a-checkbox>
            </div>
            <span> Active on a job at my company </span>
          </div>

          <div class="divider"></div>

          <div class="flex margin-bottom-8">
            <div>
              <a-checkbox class="margin-right-8"></a-checkbox>
            </div>
            <span> Active on a job at my company </span>
          </div>

          <div class="flex">
            <div>
              <a-checkbox class="margin-right-8"></a-checkbox>
            </div>
            <span> Active on a job at my company </span>
          </div>
        </div>
      </popoverContent>
    </template>
    <a-button :icon="h(TableOutlined)">{{ t("my_company") }}</a-button>
  </a-popover>
</template>

<script setup lang="ts">
import { ref, h } from "vue";
import { t } from "@/locale";
import { TableOutlined } from "@ant-design/icons-vue";
</script>
