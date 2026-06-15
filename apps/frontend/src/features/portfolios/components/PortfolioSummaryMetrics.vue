<template>
	<section class="flex flex-col gap-3" aria-label="Ключевые показатели портфеля">
		<div
			v-if="summary"
			class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
			:aria-busy="loading"
		>
			<PortfolioMetricWidget
				label="Стоимость"
				:tooltip="PORTFOLIO_METRIC_TOOLTIPS.value"
				icon="pi pi-wallet"
			>
				<span>{{ formatMoney(summary.marketValue, 'RUB', false) }}</span>
			</PortfolioMetricWidget>

			<PortfolioMetricWidget
				label="Прибыль"
				:tooltip="PORTFOLIO_METRIC_TOOLTIPS.profit"
				icon="pi pi-chart-line"
			>
				<div class="flex flex-wrap items-center gap-2">
					<span :class="profitAmountClass(summary.profit)">
						{{ formatMoney(summary.profit, 'RUB') }}
					</span>
					<span
						v-if="summary.profitPercentOfNetInvested != null"
						class="rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums"
						:class="profitBadgeClass(summary.profitPercentOfNetInvested)"
					>
						{{ formatPercent(summary.profitPercentOfNetInvested) }}
					</span>
				</div>
			</PortfolioMetricWidget>

			<PortfolioMetricWidget
				label="Доходность"
				:tooltip="PORTFOLIO_METRIC_TOOLTIPS.yield"
				icon="pi pi-percentage"
			>
				<span class="tabular-nums">
					{{ formatPercent(summary.annualizedReturnPercent || 0) }}
				</span>
			</PortfolioMetricWidget>

			<PortfolioMetricWidget
				label="Изменение за день"
				:tooltip="PORTFOLIO_METRIC_TOOLTIPS.dayChange"
				icon="pi pi-arrow-right-arrow-left"
			>
				<div class="flex flex-wrap items-baseline gap-2">
					<span :class="profitAmountClass(summary.dayChangeAmount)">
						{{ formatMoney(summary.dayChangeAmount, 'RUB') }}
					</span>
					<span
						v-if="summary.dayChangePercent != null"
						class="text-sm font-medium tabular-nums text-slate-400"
					>
						({{ formatPercent(summary.dayChangePercent) }})
					</span>
				</div>
			</PortfolioMetricWidget>
		</div>
	</section>
</template>

<script setup lang="ts">
import PortfolioMetricWidget from '@/shared/components/PortfolioMetricWidget.vue';
import { formatPercent, formatMoney } from '@utils';
import { PORTFOLIO_METRIC_TOOLTIPS } from '../constants/constants';
import { usePortfolioSummary } from '../composables/usePortfolioSummary';

const { summary, loading } = usePortfolioSummary();

function profitAmountClass(amount: number): string {
	if (amount > 0) {
		return 'text-emerald-400';
	}

	if (amount < 0) {
		return 'text-rose-400';
	}

	return 'text-slate-200';
}

function profitBadgeClass(percent: number): string {
	if (percent > 0) {
		return 'bg-emerald-950/80 text-emerald-300';
	}

	if (percent < 0) {
		return 'bg-rose-950/70 text-rose-300';
	}

	return 'bg-slate-700 text-slate-300';
}
</script>
