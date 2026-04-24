<script setup lang="ts">
const visible = defineModel<boolean>('visible', { required: true });

withDefaults(
	defineProps<{
		appendTo?: HTMLElement | string;
		title?: string;
	}>(),
	{
		appendTo: 'body',
		title: '',
	},
);
</script>

<template>
	<Dialog
		v-model:visible="visible"
		modal
		:draggable="false"
		:append-to="appendTo"
		class="w-full max-w-lg"
	>
		<template v-if="title || $slots.header" #header>
			<slot name="header">
				<h2 class="text-lg font-semibold text-slate-100">
					{{ title }}
				</h2>
			</slot>
		</template>
		<slot />
		<template v-if="$slots.footer" #footer>
			<slot name="footer" />
		</template>
	</Dialog>
</template>
