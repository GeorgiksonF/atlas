import {
	moexCellToNumber,
	moexCellToString,
} from '@/integrations/moex/moex-cell.utils';

describe('moexCellToString', () => {
	it('возвращает пустую строку для null и undefined', () => {
		expect(moexCellToString(null)).toBe('');
		expect(moexCellToString(undefined)).toBe('');
	});

	it('обрезает пробелы у строк', () => {
		expect(moexCellToString('  SBER  ')).toBe('SBER');
	});

	it('преобразует число и boolean в строку', () => {
		expect(moexCellToString(42)).toBe('42');
		expect(moexCellToString(true)).toBe('true');
	});

	it('возвращает пустую строку для неподдерживаемых типов', () => {
		expect(moexCellToString({})).toBe('');
	});
});

describe('moexCellToNumber', () => {
	it('возвращает null для null и undefined', () => {
		expect(moexCellToNumber(null)).toBeNull();
		expect(moexCellToNumber(undefined)).toBeNull();
	});

	it('возвращает число как есть', () => {
		expect(moexCellToNumber(250.5)).toBe(250.5);
	});

	it('парсит строковое число', () => {
		expect(moexCellToNumber('250.5')).toBe(250.5);
	});

	it('возвращает null для NaN', () => {
		expect(moexCellToNumber('not-a-number')).toBeNull();
	});
});
