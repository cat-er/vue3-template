<template>
  <a-popover class="filter-quality" trigger="click" placement="bottom">
    <template #title>
      <span>{{ t("quality") }}</span>
    </template>
    <template #content>
      <popoverContent>
        <div class="flex-column">
          <div class="quality-item flex">
            <div>
              <a-checkbox class="margin-right-8"></a-checkbox>
            </div>
            <div class="item-option flex-column">
              <span class="line-height-1 margin-bottom-8">xxxxxxxxx rating</span>
              <span class="font-color-minor font-size-10 line-height-1 margin-bottom-8">
                testtesttesttesttesttesttesttesttesttesttesttesttesttest
              </span>
              <a-select ref="select" style="width: 120px">
                <a-select-option value="jack">Jack</a-select-option>
              </a-select>
            </div>
          </div>

          <div class="quality-item flex margin-top-8">
            <div>
              <a-checkbox class="margin-right-8"></a-checkbox>
            </div>
            <div class="item-option flex-column">
              <span class="line-height-1 margin-bottom-8">xxxxxxxxx rating</span>
              <span class="font-color-minor font-size-10 line-height-1 margin-bottom-8">
                Hide providers who don't meet this timeliness rate
              </span>
              <a-select ref="select" style="width: 120px">
                <a-select-option value="jack">Jack</a-select-option>
              </a-select>
            </div>
          </div>
        </div>
      </popoverContent>
    </template>
    <a-button :icon="h(StarOutlined)">{{ t("quality") }}</a-button>
  </a-popover>
</template>

<script setup lang="ts">
import { h } from "vue";
import { t } from "@/locale";
import { StarOutlined } from "@ant-design/icons-vue";
import popoverContent from "@/components/popoverContent/popoverContent.vue";
</script>
