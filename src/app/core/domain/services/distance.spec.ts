import { calculateDistanceInMeters, formatDistance } from './distance';

describe('distance utilities', () => {
  it('returns zero for the same coordinate', () => {
    const point = { latitude: 3.139, longitude: 101.6869 };

    expect(calculateDistanceInMeters(point, point)).toBe(0);
  });

  it('formats distances for the bazaar card', () => {
    expect(formatDistance(450)).toBe('450 m away');
    expect(formatDistance(1500)).toBe('1.5 km away');
  });
});
