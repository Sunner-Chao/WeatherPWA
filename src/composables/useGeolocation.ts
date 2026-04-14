import { ref, computed } from 'vue'

export function useGeolocation() {
  const coordinates = ref<{ lat: number; lon: number } | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const permissionDenied = ref(false)
  const usingIPLocation = ref(false)

  const isLoading = computed(() => loading.value)
  const hasLocation = computed(() => coordinates.value !== null)
  const hasError = computed(() => error.value !== null)

  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      // 浏览器不支持 GPS，尝试 IP 定位
      return tryIPGeolocation()
    }

    loading.value = true
    error.value = null
    permissionDenied.value = false
    usingIPLocation.value = false

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        })
      })

      coordinates.value = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }

      return coordinates.value
    } catch (e) {
      if (e instanceof GeolocationPositionError) {
        switch (e.code) {
          case e.PERMISSION_DENIED:
            error.value = '用户拒绝了定位权限'
            permissionDenied.value = true
            break
          case e.POSITION_UNAVAILABLE:
            error.value = '定位服务不可用（可能需要HTTPS）'
            break
          case e.TIMEOUT:
            error.value = '定位请求超时'
            break
          default:
            error.value = '未知定位错误'
        }
      } else {
        error.value = '获取定位失败'
      }

      // GPS 失败时，尝试 IP 定位作为备选
      return tryIPGeolocation()
    } finally {
      loading.value = false
    }
  }

  // IP 定位备选方案（使用免费服务）
  async function tryIPGeolocation(): Promise<{ lat: number; lon: number } | null> {
    loading.value = true
    usingIPLocation.value = true

    try {
      // 使用 ip-api.com 免费 IP 定位服务（无需 API key）
      const response = await fetch('http://ip-api.com/json/?lang=zh-CN')
      if (!response.ok) {
        throw new Error('IP定位服务不可用')
      }

      const data = await response.json()
      if (data.status === 'success') {
        coordinates.value = {
          lat: data.lat,
          lon: data.lon
        }
        // 返回时附带城市名称信息
        return {
          lat: data.lat,
          lon: data.lon,
          city: data.city,
          region: data.regionName
        } as any
      }
    } catch (e) {
      console.warn('IP定位也失败了:', e)
      error.value = '无法获取位置（GPS和IP定位都失败）'
    } finally {
      loading.value = false
    }

    return null
  }

  function clearLocation() {
    coordinates.value = null
    error.value = null
    permissionDenied.value = false
    usingIPLocation.value = false
  }

  return {
    coordinates,
    loading,
    error,
    permissionDenied,
    usingIPLocation,
    isLoading,
    hasLocation,
    hasError,
    getCurrentLocation,
    clearLocation
  }
}