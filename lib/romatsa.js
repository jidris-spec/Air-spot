export const ROMATSA_SOURCE_URL = 'https://flightplan.romatsa.ro/init/static/zone_restrictionate_uav.json'
export const ROMATSA_MAP_URL = 'https://flightplan.romatsa.ro/init/drones'

export function validateCoordinates(latitude, longitude) {
  const lat = Number(latitude)
  const lon = Number(longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) return { valid: false, message: 'Enter a latitude between -90 and 90 and longitude between -180 and 180.' }
  return { valid: true, latitude: lat, longitude: lon }
}

function pointInRing(point, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    const intersects = yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

function pointInPolygon(point, coordinates) {
  return pointInRing(point, coordinates[0]) && !coordinates.slice(1).some((hole) => pointInRing(point, hole))
}

function featureContains(feature, longitude, latitude) {
  const geometry = feature.geometry
  if (!geometry) return false
  if (geometry.type === 'Polygon') return pointInPolygon([longitude, latitude], geometry.coordinates)
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.some((polygon) => pointInPolygon([longitude, latitude], polygon))
  return false
}

export function normalizeSnapshot(payload, importedAt = new Date().toISOString()) {
  if (!payload || payload.type !== 'FeatureCollection' || !Array.isArray(payload.features)) throw new Error('ROMATSA snapshot is not a valid GeoJSON FeatureCollection.')
  const unsupported = payload.features.some((feature) => !['Polygon', 'MultiPolygon'].includes(feature?.geometry?.type))
  return {
    sourceUrl: ROMATSA_SOURCE_URL,
    mapUrl: ROMATSA_MAP_URL,
    importedAt,
    publishedAt: payload.metadata?.valid_from || payload.valid_from || 'Published date not provided by snapshot',
    incomplete: unsupported,
    zones: payload.features.filter((feature) => feature?.geometry && ['Polygon', 'MultiPolygon'].includes(feature.geometry.type)).map((feature, index) => ({
      id: feature.properties?.zone_id || `zone-${index + 1}`,
      status: feature.properties?.status || 'Status not provided',
      lowerLimit: feature.properties?.lower_lim || 'Lower limit not provided',
      upperLimit: feature.properties?.upper_lim || 'Upper limit not provided',
      contact: feature.properties?.contact || 'Contact not provided',
      geometry: feature.geometry,
    })),
  }
}

export function checkPoint(snapshot, latitude, longitude) {
  const coordinates = validateCoordinates(latitude, longitude)
  if (!coordinates.valid) return { status: 'invalid', message: coordinates.message, matches: [] }
  if (!snapshot?.zones?.length || snapshot.incomplete) return { status: 'unavailable', message: 'Check unavailable or incomplete — review required.', matches: [] }
  const matches = snapshot.zones.filter((zone) => featureContains(zone, coordinates.longitude, coordinates.latitude)).map(({ geometry, ...zone }) => zone)
  return { status: matches.length ? 'overlap' : 'none', message: matches.length ? 'Published zone overlap — review requirements.' : 'No published zone overlap found.', matches, checkedAt: new Date().toISOString(), latitude: coordinates.latitude, longitude: coordinates.longitude }
}

export async function fetchRomatsaSnapshot() {
  const response = await fetch(ROMATSA_SOURCE_URL)
  if (!response.ok) throw new Error(`ROMATSA snapshot request failed (${response.status}).`)
  return normalizeSnapshot(await response.json())
}
