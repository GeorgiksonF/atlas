import { MOEX_ISS_BASE, MOEX_ISS_META_OFF_QUERY } from './moex.constants';

export class MoexHttpClient {
	async fetchJson<T>(path: string): Promise<T | null> {
		try {
			const url = this.buildUrl(path);
			const res = await fetch(url);
			if (!res.ok) return null;
			return (await res.json()) as T;
		} catch {
			return null;
		}
	}

	private buildUrl(path: string): string {
		const normalizedPath = path.startsWith('/') ? path : `/${path}`;
		const separator = normalizedPath.includes('?') ? '&' : '?';
		const pathWithMeta = normalizedPath.includes(MOEX_ISS_META_OFF_QUERY)
			? normalizedPath
			: `${normalizedPath}${separator}${MOEX_ISS_META_OFF_QUERY}`;

		return `${MOEX_ISS_BASE}${pathWithMeta}`;
	}
}
