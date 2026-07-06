import {
	getCellValue,
	getColumnIndex,
	getFirstRow,
	type MoexIssResponse,
	parseIssBlock,
} from '@/integrations/moex/moex-iss.parser';

describe('parseIssBlock', () => {
	it('возвращает таблицу, если блок валиден', () => {
		const json: MoexIssResponse = {
			securities: {
				columns: ['secid', 'shortname'],
				data: [['SBER', 'Сбербанк']],
			},
		};

		expect(parseIssBlock(json, 'securities')).toEqual(json.securities);
	});

	it('возвращает null, если блок отсутствует', () => {
		expect(parseIssBlock({}, 'securities')).toBeNull();
	});

	it('возвращает null, если columns или data пустые', () => {
		expect(
			parseIssBlock(
				{ securities: { columns: [], data: [] } },
				'securities',
			),
		).toBeNull();
		expect(
			parseIssBlock(
				{ securities: { columns: ['secid'], data: [] } },
				'securities',
			),
		).toBeNull();
	});
});

describe('getColumnIndex', () => {
	it('возвращает индекс колонки или -1', () => {
		expect(getColumnIndex(['secid', 'LAST'], 'LAST')).toBe(1);
		expect(getColumnIndex(['secid'], 'LAST')).toBe(-1);
	});
});

describe('getCellValue', () => {
	it('возвращает значение ячейки или undefined', () => {
		const row = ['SBER', 250.5];
		expect(getCellValue(row, 0)).toBe('SBER');
		expect(getCellValue(row, 1)).toBe(250.5);
		expect(getCellValue(row, -1)).toBeUndefined();
	});
});

describe('getFirstRow', () => {
	it('возвращает первую строку таблицы', () => {
		const table = {
			columns: ['LAST'],
			data: [[250.5], [300]],
		};

		expect(getFirstRow(table)).toEqual([250.5]);
	});

	it('возвращает null для пустой таблицы', () => {
		expect(getFirstRow({ columns: ['LAST'], data: [] })).toBeNull();
	});
});
