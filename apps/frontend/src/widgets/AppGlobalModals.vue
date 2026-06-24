<template>
	<AddTransactionModal v-model:visible="isAddTransactionModalOpen" />
</template>

<script setup lang="ts">
import AddTransactionModal from '@/features/transactions/components/AddTransactionModal.vue';
import { useAddTransactionModalStore } from '@/features/transactions/stores/addTransactionModalStore';

import { storeToRefs } from 'pinia';

const addTransactionModalStore = useAddTransactionModalStore();
const { isOpen: isAddTransactionModalOpen } = storeToRefs(
	addTransactionModalStore,
);
</script>
