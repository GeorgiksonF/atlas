<template>
  <div
    class="portfolio-card group relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5"
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
      class="flex shrink-0 items-center overflow-hidden transition-[width] duration-200 ease-out"
      :class="actionsPinned ? 'w-10' : 'w-0 group-hover:w-10'"
    >
      <div
        class="flex w-10 shrink-0 justify-end transition-transform duration-200 ease-out"
        :class="
          actionsPinned ? 'translate-x-0' : 'translate-x-full group-hover:translate-x-0'
        "
      >
        <slot name="actions" />
      </div>
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
  actionsPinned?: boolean;
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
