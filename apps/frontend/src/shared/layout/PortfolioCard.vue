<template>
  <div
    class="portfolio-card group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5"
    :class="
      active
        ? 'bg-slate-600 text-slate-100'
        : 'text-slate-200 hover:bg-slate-700'
    "
  >
    <button
      type="button"
      class="flex min-w-0 flex-1 items-center gap-3 text-left"
      @click="$emit('click')"
    >
      <i :class="icon" class="shrink-0 text-slate-400" />
      <div class="min-w-0 flex-1">
        <div class="truncate text-sm font-medium">
          {{ title }}
        </div>
        <div v-if="subtitle" class="text-xs text-slate-400">
          {{ subtitle }}
        </div>
      </div>
      <span v-if="!!value" class="shrink-0 text-xs text-slate-400">
        {{ value }}
      </span>
    </button>
    <div
      v-if="$slots.actions"
      class="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  active: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.portfolio-card {
  cursor: pointer;
}
</style>
