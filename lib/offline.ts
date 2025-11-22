// Offline data caching and sync
export class OfflineManager {
  private static CACHE_KEY = 'stockmaster_offline_data'
  
  static saveToCache(key: string, data: any) {
    const cache = this.getCache()
    cache[key] = { data, timestamp: Date.now() }
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache))
  }
  
  static getFromCache(key: string, maxAge = 5 * 60 * 1000) {
    const cache = this.getCache()
    const item = cache[key]
    if (!item || Date.now() - item.timestamp > maxAge) return null
    return item.data
  }
  
  private static getCache() {
    try {
      return JSON.parse(localStorage.getItem(this.CACHE_KEY) || '{}')
    } catch {
      return {}
    }
  }
  
  static isOnline() {
    return navigator.onLine
  }
}