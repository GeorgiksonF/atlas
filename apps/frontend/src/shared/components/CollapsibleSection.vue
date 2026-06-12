<template>
  <div class="mt-2">
    <button
      type="button"
      class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-slate-700"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <i :class="icon" class="shrink-0" />
      <span class="flex-1">{{ title }}</span>
      <span v-if="!!badge" class="text-xs text-slate-500">
        {{ badge }}
      </span>
      <i
        class="pi shrink-0 text-slate-500 transition-transform"
        :class="modelValue ? 'pi-chevron-up' : 'pi-chevron-down'"
      />
    </button>
    <div
      class="grid pl-1 transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none"
      :style="{ gridTemplateRows: modelValue ? '1fr' : '0fr' }"
    >
      <div class="min-h-0 overflow-hidden mt-2">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  badge?: string | number;
  modelValue: boolean;
}>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>
