export const FX_RATE_PROVIDER = Symbol('FX_RATE_PROVIDER');

export interface IFxRateProvider {
	getUsdToRub(): Promise<number | null>;
}
