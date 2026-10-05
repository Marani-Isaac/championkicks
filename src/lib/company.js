export const PHONE_DISPLAY = '0727 091 597'
export const PHONE_TEL = 'tel:+254727091597'
export const WHATSAPP_URL = 'https://wa.me/254727091597'
export const EMAIL = 'championkickseldoret@gmail.com'
export const WEBSITE = 'https://www.championkicks.co.ke'

export const SOCIAL = {
  instagram: 'https://www.instagram.com/champion_kicks_/',
  tiktok: 'https://www.tiktok.com/@championkicks1',
  facebook: 'https://www.facebook.com/championkicks',
  x: 'https://x.com/championkicks',
  youtube: 'https://www.youtube.com/@championkicks',
  linkedin: 'https://www.linkedin.com/company/champion-kicks',
}

export const BRANCHES = [
  {
    city: 'Nairobi',
    name: 'AA Plaza, JKUAT Towers',
    detail: 'Mezzanine floor',
    mapQuery: 'AA Plaza JKUAT Towers Nairobi Kenya',
  },
  {
    city: 'Eldoret',
    name: 'Central Arcade',
    detail: 'Jarde Collection',
    mapQuery: 'Central Arcade Eldoret Kenya',
  },
]

export function mapsEmbedUrl(query) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`
}

export function mapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
