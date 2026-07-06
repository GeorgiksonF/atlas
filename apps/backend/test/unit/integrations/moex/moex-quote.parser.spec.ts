import { extractQuoteFromMarketdata } from '@/integrations/moex/moex-quote.parser';

describe('extractQuoteFromMarketdata', () => {
	it('возвращает цену из колонки LAST', () => {
		const result = extractQuoteFromMarketdata({
			columns: ['SECID', 'LAST'],
			data: [['SBER', 250.5]],
		});

		expect(result).toEqual({ price: 250.5 });
	});

	it('парсит строковую цену', () => {
		const result = extractQuoteFromMarketdata({
			columns: ['LAST'],
			data: [['300.25']],
		});

		expect(result).toEqual({ price: 300.25 });
	});

	it('возвращает null, если LAST отсутствует', () => {
		expect(
			extractQuoteFromMarketdata({
				columns: ['SECID'],
				data: [['SBER']],
			}),
		).toBeNull();
	});

	it('возвращает null для невалидной или неположительной цены', () => {
		expect(
			extractQuoteFromMarketdata({
				columns: ['LAST'],
				data: [['not-a-number']],
			}),
		).toBeNull();
		expect(
			extractQuoteFromMarketdata({
				columns: ['LAST'],
				data: [[0]],
			}),
		).toBeNull();
	});

	it('возвращает null для пустой таблицы', () => {
		expect(
			extractQuoteFromMarketdata({
				columns: ['LAST'],
				data: [],
			}),
		).toBeNull();
	});
});
