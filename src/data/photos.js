// Real photos per property id (files live in /public/images/properties).
// The first image is the card cover; the rest fill the detail-page gallery.
// A listing without an entry, or an image that fails to load, falls back to the illustrations.
export const photoMap = {
  '1': ['/images/properties/3.avif', '/images/properties/7.avif', '/images/properties/14.avif', '/images/properties/31.avif'],
  '2': ['/images/properties/1.avif', '/images/properties/14.avif', '/images/properties/26.avif'],
  '3': ['/images/properties/20.avif', '/images/properties/26.avif', '/images/properties/18.avif'],
  '4': ['/images/properties/24.avif', '/images/properties/18.avif', '/images/properties/11.avif', '/images/properties/9.avif'],
  '5': ['/images/properties/8.avif', '/images/properties/11.avif', '/images/properties/15.avif'],
  '6': ['/images/properties/32.avif', '/images/properties/15.avif', '/images/properties/8.avif', '/images/properties/9.avif'],
  '7': ['/images/properties/23.avif', '/images/properties/8.avif', '/images/properties/7.avif', '/images/properties/31.avif'],
  '8': ['/images/properties/34.avif', '/images/properties/7.avif', '/images/properties/14.avif'],
  '9': ['/images/properties/33.avif', '/images/properties/14.avif', '/images/properties/26.avif', '/images/properties/31.avif'],
  '10': ['/images/properties/12.avif', '/images/properties/26.avif', '/images/properties/18.avif'],
  '11': ['/images/properties/26.avif', '/images/properties/18.avif', '/images/properties/11.avif'],
  '12': ['/images/properties/6.avif', '/images/properties/11.avif', '/images/properties/15.avif', '/images/properties/9.avif'],
  '13': ['/images/properties/7.avif', '/images/properties/15.avif', '/images/properties/8.avif'],
  '14': ['/images/properties/28.avif', '/images/properties/8.avif', '/images/properties/7.avif', '/images/properties/9.avif'],
  '15': ['/images/properties/10.avif', '/images/properties/7.avif', '/images/properties/14.avif'],
  '16': ['/images/properties/3.avif', '/images/properties/14.avif', '/images/properties/26.avif', '/images/properties/9.avif'],
  '17': ['/images/properties/33.avif', '/images/properties/26.avif', '/images/properties/18.avif'],
  '18': ['/images/properties/32.avif', '/images/properties/18.avif', '/images/properties/11.avif', '/images/properties/9.avif'],
  '19': ['/images/properties/14.avif', '/images/properties/11.avif', '/images/properties/15.avif'],
  '20': ['/images/properties/18.avif', '/images/properties/15.avif', '/images/properties/8.avif'],
  '21': ['/images/properties/24.avif', '/images/properties/8.avif', '/images/properties/7.avif', '/images/properties/31.avif'],
  '22': ['/images/properties/23.avif', '/images/properties/7.avif', '/images/properties/14.avif', '/images/properties/9.avif'],
  '23': ['/images/properties/33.avif', '/images/properties/14.avif', '/images/properties/26.avif', '/images/properties/31.avif'],
  '24': ['/images/properties/6.avif', '/images/properties/26.avif', '/images/properties/18.avif', '/images/properties/9.avif'],
  '25': ['/images/properties/11.avif', '/images/properties/18.avif', '/images/properties/15.avif'],
  '26': ['/images/properties/17.avif', '/images/properties/11.avif', '/images/properties/15.avif'],
  '27': ['/images/properties/28.avif', '/images/properties/15.avif', '/images/properties/8.avif', '/images/properties/31.avif'],
  '28': ['/images/properties/15.avif', '/images/properties/8.avif', '/images/properties/7.avif'],
  '29': ['/images/properties/24.avif', '/images/properties/7.avif', '/images/properties/14.avif', '/images/properties/31.avif'],
  '30': ['/images/properties/20.avif', '/images/properties/14.avif', '/images/properties/26.avif'],
  '31': ['/images/properties/8.avif', '/images/properties/26.avif', '/images/properties/18.avif'],
  '32': ['/images/properties/3.avif', '/images/properties/18.avif', '/images/properties/11.avif', '/images/properties/9.avif'],
  '33': ['/images/properties/34.avif', '/images/properties/11.avif', '/images/properties/15.avif'],
  '34': ['/images/properties/33.avif', '/images/properties/15.avif', '/images/properties/8.avif', '/images/properties/9.avif'],
  '35': ['/images/properties/32.avif', '/images/properties/8.avif', '/images/properties/7.avif', '/images/properties/31.avif'],
  '36': ['/images/properties/26.avif', '/images/properties/7.avif', '/images/properties/14.avif'],
}

// Large images used on the home page.
export const HERO_IMAGE = '/images/properties/32.avif'
export const TYPE_IMAGES = {
  House: '/images/properties/3.avif',
  Villa: '/images/properties/12.avif',
  Apartment: '/images/properties/20.avif',
  Townhouse: '/images/properties/24.avif',
}
