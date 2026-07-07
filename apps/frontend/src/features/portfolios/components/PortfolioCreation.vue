<template>
	<div class="flex flex-col gap-6 p-4 rounded-lg bg-slate-800">
		<Stepper :value="step" class="flex flex-col gap-6">
			<StepList>
				<Step :value="STEPS.TYPE">Тип портфеля</Step>
				<Step :value="STEPS.BROKER">Брокер</Step>
				<Step :value="STEPS.NAME">Название</Step>
			</StepList>
			<StepPanels>
				<StepPanel :value="STEPS.TYPE">
					<PortrfolioCreationChooseCategory />
				</StepPanel>
				<StepPanel :value="STEPS.BROKER">
					<PortrfolioCreationChooseBroker />
				</StepPanel>
				<StepPanel :value="STEPS.NAME">
					<PortrfolioCreationName />
				</StepPanel>
			</StepPanels>
		</Stepper>

		<div class="flex justify-between">
			<div>
				<Button
					v-if="step > STEPS.TYPE"
					label="Назад"
					severity="secondary"
					@click="--step"
				/>
			</div>
			<div class="flex">
				<Button
					v-if="step < STEPS.NAME"
					:disabled="!canProceed"
					label="Далее"
					@click="++step"
				/>
				<Button
					v-else
					label="Создать"
					:loading="loading"
					:disabled="loading"
					@click="save"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { useCreatePortfolioForm } from '../composables/useCreatePortfolioForm';
import PortrfolioCreationChooseBroker from './portfolio-creation/PortrfolioCreationChooseBroker.vue';
import PortrfolioCreationChooseCategory from './portfolio-creation/PortrfolioCreationChooseCategory.vue';
import PortrfolioCreationName from './portfolio-creation/PortrfolioCreationName.vue';

const { save, loading, portfolioForm } = useCreatePortfolioForm();

const STEPS = { TYPE: 1, BROKER: 2, NAME: 3 } as const;

const step = ref(1);

const canProceed = computed(() => {
	if (step.value === STEPS.TYPE) return portfolioForm.category != null;
	if (step.value === STEPS.BROKER) return portfolioForm.broker != null;
	return false;
});
</script>
