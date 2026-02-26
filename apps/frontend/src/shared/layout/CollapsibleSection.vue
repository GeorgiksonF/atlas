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
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[800px]"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 max-h-[800px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="modelValue" class="overflow-hidden pl-1">
        <slot />
      </div>
    </Transition>
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
