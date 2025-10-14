export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

export function roundCoord(coord: number, precision: number = 3): number {
  const factor = Math.pow(10, precision);
  return Math.round(coord * factor) / factor;
}

export function roundLat(lat: number): number {
  return roundCoord(lat, 3);
}

export function roundLon(lon: number): number {
  return roundCoord(lon, 3);
}