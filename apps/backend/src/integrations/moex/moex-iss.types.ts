export type MoexIssTable = {
	columns: string[];
	data: unknown[][];
};

export type MoexIssResponse = Record<string, MoexIssTable | undefined>;
