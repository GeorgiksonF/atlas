import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const preset = definePreset(Aura, {
	semantic: {
		primary: {
			50: '{indigo.50}',
			100: '{indigo.100}',
			200: '{indigo.200}',
			300: '{indigo.300}',
			400: '{indigo.400}',
			500: '{indigo.500}',
			600: '{indigo.600}',
			700: '{indigo.700}',
			800: '{indigo.800}',
			900: '{indigo.900}',
			950: '{indigo.950}',
		},
		colorScheme: {
			light: {
				primary: {
					color: '{primary.500}',
					hoverColor: '{primary.600}',
					activeColor: '{primary.700}',
					contrastColor: '#ffffff',
				},
				formField: {
					background: '{slate.100}',
					hoverBackground: '{slate.200}',
					focusBackground: '{slate.100}',
					color: '{slate.800}',
					placeholderColor: '{slate.500}',
					borderColor: '{slate.300}',
					hoverBorderColor: '{slate.400}',
					focusBorderColor: '{primary.500}',
				},
				surface: {
					0: '#ffffff',
					50: '{slate.50}',
					100: '{slate.100}',
					200: '{slate.200}',
					300: '{slate.300}',
					400: '{slate.400}',
					500: '{slate.500}',
					600: '{slate.600}',
					700: '{slate.700}',
					800: '{slate.800}',
					900: '{slate.900}',
					950: '{slate.950}',
				},
			},
			dark: {
				primary: {
					color: '{primary.500}',
					hoverColor: '{primary.400}',
					activeColor: '{primary.200}',
					contrastColor: '{primary.950}',
				},
				formField: {
					background: '{slate.900}',
					hoverBackground: '{slate.700}',
					focusBackground: '{slate.800}',
					color: '{slate.200}',
					placeholderColor: '{slate.400}',
					borderColor: '{slate.600}',
					hoverBorderColor: '{slate.500}',
					focusBorderColor: '{primary.00}',
				},
				surface: {
					0: '#ffffff',
					50: '{slate.50}',
					100: '{slate.100}',
					200: '{slate.200}',
					300: '{slate.300}',
					400: '{slate.400}',
					500: '{slate.500}',
					600: '{slate.600}',
					700: '{slate.700}',
					800: '{slate.800}',
					900: '{slate.900}',
					950: '{slate.950}',
				},
			},
		},
	},
	components: {
		dialog: {
			colorScheme: {
				light: {
					root: {
						background: '{slate.100}',
					},
				},
				dark: {
					root: {
						background: '{slate.800}',
					},
				},
			},
		},
		togglebutton: {
			colorScheme: {
				light: {
					root: {
						background: '{slate.100}',
						checkedBackground: '{slate.100}',
						hoverBackground: '{slate.200}',
						borderColor: '{slate.300}',
						color: '{slate.600}',
						hoverColor: '{slate.800}',
						checkedColor: '{slate.900}',
						checkedBorderColor: '{slate.300}',
					},
					content: {
						checkedBackground: '{slate.50}',
					},
				},
				dark: {
					root: {
						background: '{slate.900}',
						checkedBackground: '{slate.900}',
						hoverBackground: '{slate.900}',
						borderColor: '{slate.900}',
						color: '{slate.400}',
						hoverColor: '{slate.200}',
						checkedColor: '{slate.0}',
						checkedBorderColor: '{slate.900}',
					},
					content: {
						checkedBackground: '{slate.800}',
					},
				},
			},
		},
	},
});
