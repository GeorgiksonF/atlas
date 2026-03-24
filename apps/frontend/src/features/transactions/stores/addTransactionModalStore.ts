import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAddTransactionModalStore = defineStore('addTransactionModal', () => {
	const isOpen = ref(false);

	function open() {
		isOpen.value = true;
	}

	function setVisible(value: boolean) {
		isOpen.value = value;
	}

	return {
		isOpen,
		open,
		setVisible,
	};
});
