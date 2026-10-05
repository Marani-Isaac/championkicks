import { useState } from 'react'
import { mapsEmbedUrl, mapsSearchUrl } from '../lib/company'

function parseMapInput(raw) {
  const value = String(raw || '').trim()
  if (!value) return { query: '', lat: '', lng: '' }

  const at = value.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (at) {
    return { query: `${at[1]},${at[2]}`, lat: at[1], lng: at[2] }
  }

  const q = value.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (q) {
    return { query: `${q[1]},${q[2]}`, lat: q[1], lng: q[2] }
  }

  const pair = value.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/)
  if (pair) {
    return { query: `${pair[1]},${pair[2]}`, lat: pair[1], lng: pair[2] }
  }

  return { query: value, lat: '', lng: '' }
}

export default function DeliveryMapPicker({ value, onChange }) {
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState('')
  const previewQuery = value.query || [value.lat, value.lng].filter(Boolean).join(',')

  const setLocation = (next) => {
    onChange({
      query: next.query || '',
      lat: next.lat || '',
      lng: next.lng || '',
    })
  }

  const onQueryChange = (raw) => {
    setLocateError('')
    setLocation(parseMapInput(raw))
  }

  const useGps = () => {
    if (!navigator.geolocation) {
      setLocateError('This device cannot share GPS. Search a place instead.')
      return
    }
    setLocating(true)
    setLocateError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6)
        const lng = pos.coords.longitude.toFixed(6)
        setLocation({ query: `${lat},${lng}`, lat, lng })
        setLocating(false)
      },
      () => {
        setLocateError('Could not read your location. Allow location access, or search a place.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 12000 },
    )
  }

  return (
    <div>
      <label className="ck-label" htmlFor="mapQuery">
        Delivery map location
      </label>
      <input
        id="mapQuery"
        name="mapQuery"
        className="ck-input"
        required
        placeholder="Estate, building, or paste a Google Maps link"
        value={value.query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <p className="ck-hint">
        Search a place, paste a Google Maps pin link, or use GPS so the rider can find you.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="ck-btn ck-btn-outline px-4 py-2 text-xs" onClick={useGps} disabled={locating}>
          {locating ? 'Finding you…' : 'Use my location'}
        </button>
        {previewQuery && (
          <a
            className="ck-btn ck-btn-primary px-4 py-2 text-xs"
            href={mapsSearchUrl(previewQuery)}
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps
          </a>
        )}
      </div>
      {locateError && <p className="mt-2 text-sm text-[var(--ck-danger)]">{locateError}</p>}
      {previewQuery && (
        <iframe
          title="Delivery location"
          src={mapsEmbedUrl(previewQuery)}
          className="mt-3 h-52 w-full rounded-[0.85rem] border-0 sm:h-64"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  )
}
