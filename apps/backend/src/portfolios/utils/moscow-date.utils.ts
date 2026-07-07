const MOSCOW_TIME_ZONE = 'Europe/Moscow';

const moscowDateFormatter = new Intl.DateTimeFormat('en-CA', {
	timeZone: MOSCOW_TIME_ZONE,
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
});

/** Calendar date YYYY-MM-DD in Europe/Moscow. */
export const toMoscowCalendarDate = (date: Date): string =>
	moscowDateFormatter.format(date);

export const yesterdayMoscowCalendarDate = (now = new Date()): string => {
	const yesterday = new Date(now);
	yesterday.setUTCDate(yesterday.getUTCDate() - 1);
	return toMoscowCalendarDate(yesterday);
};

export const moscowCalendarDateToUtcDate = (calendarDate: string): Date =>
	new Date(`${calendarDate}T00:00:00.000Z`);

export const endOfMoscowCalendarDateUtc = (calendarDate: string): Date =>
	new Date(`${calendarDate}T23:59:59.999Z`);
