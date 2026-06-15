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
					<PortrfolioCreationChooseCategory v-model="category" />
				</StepPanel>
				<StepPanel :value="STEPS.BROKER">
					<PortrfolioCreationChooseBroker v-model="broker" :brokers />
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
					@click="prevStep"
				/>
			</div>
			<div class="flex">
				<Button
					v-if="step < STEPS.NAME"
					:disabled="!canProceed"
					label="Далее"
					@click="nextStep"
				/>
				<Button
					v-else
					label="Создать"
					:loading="loading"
					:disabled="loading || !meta.valid"
					@click="onSubmit"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCreatePortfolio, STEPS } from '../composables/useCreatePortfolio';
import PortrfolioCreationChooseCategory from './portfolio-creation/PortrfolioCreationChooseCategory.vue';
import PortrfolioCreationChooseBroker from './portfolio-creation/PortrfolioCreationChooseBroker.vue';
import PortrfolioCreationName from './portfolio-creation/PortrfolioCreationName.vue';

const { step, loading, meta, canProceed, category, broker, brokers, onSubmit, nextStep, prevStep } =
	useCreatePortfolio();
</script>
