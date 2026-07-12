import { MOEX_ISS_BASE } from '@/integrations/moex/moex.constants';
import { MoexHttpClient } from '@/integrations/moex/moex-http.client';

describe('MoexHttpClient', () => {
	const fetchMock = jest.fn();
	let client: MoexHttpClient;

	beforeEach(() => {
		client = new MoexHttpClient();
		fetchMock.mockReset();
		global.fetch = fetchMock;
	});

	it('возвращает JSON при успешном ответе', async () => {
		const payload = {
			securities: { columns: ['secid'], data: [['SBER']] },
		};
		fetchMock.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(payload),
		});

		await expect(
			client.fetchJson('/securities.json?q=SBER'),
		).resolves.toEqual(payload);
		expect(fetchMock).toHaveBeenCalledWith(
			`${MOEX_ISS_BASE}/securities.json?q=SBER&iss.meta=off`,
		);
	});

	it('не добавляет iss.meta=off повторно', async () => {
		fetchMock.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({}),
		});

		await client.fetchJson('/securities.json?iss.meta=off');

		expect(fetchMock).toHaveBeenCalledWith(
			`${MOEX_ISS_BASE}/securities.json?iss.meta=off`,
		);
	});

	it('возвращает null при HTTP ошибке', async () => {
		fetchMock.mockResolvedValue({ ok: false });

		await expect(client.fetchJson('/securities.json')).resolves.toBeNull();
	});

	it('возвращает null при исключении fetch', async () => {
		fetchMock.mockRejectedValue(new Error('network error'));

		await expect(client.fetchJson('/securities.json')).resolves.toBeNull();
	});
});
