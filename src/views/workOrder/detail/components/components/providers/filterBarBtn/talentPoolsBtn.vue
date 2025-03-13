<template>
  <a-popover class="filter-quality" trigger="click" placement="bottom">
    <template #title>
      <span>{{ t("talent_pools") }}</span>
    </template>
    <template #content>
      <popoverContent>
        <div class="flex-column">
          <div class="flex margin-bottom-8">
            <div>
              <a-checkbox class="margin-right-8"></a-checkbox>
            </div>
            <span> Active on a job at my company </span>
          </div>

          <div class="flex margin-bottom-8">
            <div>
              <a-checkbox class="margin-right-8"></a-checkbox>
            </div>
            <span> Active on a job at my company </span>
          </div>

          <a-select ref="select">
            <a-select-option value="jack">Jack</a-select-option>
          </a-select>
        </div>
      </popoverContent>
    </template>
    <a-button :icon="h(TeamOutlined)">{{ t("talent_pools") }}</a-button>
  </a-popover>
</template>

<script setup lang="ts">
import { h } from "vue";
import { t } from "@/locale";
import { TeamOutlined } from "@ant-design/icons-vue";
</script>
