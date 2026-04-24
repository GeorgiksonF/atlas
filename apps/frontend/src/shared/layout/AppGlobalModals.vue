<template>
	<AddTransactionModal v-model:visible="isAddTransactionModalOpen" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import AddTransactionModal from '@/features/transactions/components/AddTransactionModal.vue';
import { useAddTransactionModalStore } from '@/features/transactions/stores/addTransactionModalStore';

const addTransactionModalStore = useAddTransactionModalStore();
const { isOpen: isAddTransactionModalOpen } = storeToRefs(
	addTransactionModalStore,
);
</script>
