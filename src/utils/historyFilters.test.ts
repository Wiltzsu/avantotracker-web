import { describe, expect, it } from 'vitest';
import { buildHistoryQueryParams } from '../services/api';

describe('buildHistoryQueryParams', () => {
  it('includes pagination and optional filters', () => {
    expect(buildHistoryQueryParams(2, 10, {})).toEqual({
      page: 2,
      per_page: 10,
    });

    expect(
      buildHistoryQueryParams(1, 10, {
        location: ' Seurasaari ',
        start_date: '2026-01-01',
        end_date: '2026-02-01',
        sauna: true,
      })
    ).toEqual({
      page: 1,
      per_page: 10,
      location: 'Seurasaari',
      start_date: '2026-01-01',
      end_date: '2026-02-01',
      sauna: true,
    });
  });
});
