import type { GeocodingResponse, CitySearchResult } from '@/types/city'

const BASE_URL = 'https://geocoding-api.open-meteo.com/v1'

// 中国省份映射
const CHINA_PROVINCES: Record<string, string> = {
  '浙江': '浙江省',
  '江苏': '江苏省',
  '广东': '广东省',
  '山东': '山东省',
  '河南': '河南省',
  '四川': '四川省',
  '湖北': '湖北省',
  '湖南': '湖南省',
  '安徽': '安徽省',
  '福建': '福建省',
  '江西': '江西省',
  '河北': '河北省',
  '陕西': '陕西省',
  '山西': '山西省',
  '辽宁': '辽宁省',
  '吉林': '吉林省',
  '黑龙江': '黑龙江省',
  '云南': '云南省',
  '贵州': '贵州省',
  '甘肃': '甘肃省',
  '青海': '青海省',
  '广西': '广西',
  '内蒙古': '内蒙古',
  '新疆': '新疆',
  '西藏': '西藏',
  '宁夏': '宁夏',
  '海南': '海南省',
  '北京': '北京市',
  '上海': '上海市',
  '天津': '天津市',
  '重庆': '重庆市',
  '香港': '香港',
  '澳门': '澳门',
  '台湾': '台湾省'
}

// 知名城市与省份的匹配（用于纠正API错误）
const CITY_PROVINCE_MAP: Record<string, string> = {
  '杭州': '浙江',
  '宁波': '浙江',
  '温州': '浙江',
  '绍兴': '浙江',
  '嘉兴': '浙江',
  '湖州': '浙江',
  '金华': '浙江',
  '台州': '浙江',
  '衢州': '浙江',
  '丽水': '浙江',
  '舟山': '浙江',
  '南京': '江苏',
  '苏州': '江苏',
  '无锡': '江苏',
  '常州': '江苏',
  '镇江': '江苏',
  '扬州': '江苏',
  '徐州': '江苏',
  '连云港': '江苏',
  '淮安': '江苏',
  '盐城': '江苏',
  '泰州': '江苏',
  '宿迁': '江苏',
  '广州': '广东',
  '深圳': '广东',
  '东莞': '广东',
  '佛山': '广东',
  '珠海': '广东',
  '中山': '广东',
  '惠州': '广东',
  '江门': '广东',
  '汕头': '广东',
  '湛江': '广东',
  '肇庆': '广东',
  '茂名': '广东',
  '济南': '山东',
  '青岛': '山东',
  '烟台': '山东',
  '潍坊': '山东',
  '临沂': '山东',
  '淄博': '山东',
  '济宁': '山东',
  '泰安': '山东',
  '威海': '山东',
  '日照': '山东',
  '成都': '四川',
  '绵阳': '四川',
  '德阳': '四川',
  '宜宾': '四川',
  '南充': '四川',
  '泸州': '四川',
  '达州': '四川',
  '乐山': '四川',
  '内江': '四川',
  '自贡': '四川',
  '武汉': '湖北',
  '宜昌': '湖北',
  '襄阳': '湖北',
  '荆州': '湖北',
  '黄石': '湖北',
  '十堰': '湖北',
  '孝感': '湖北',
  '黄冈': '湖北',
  '咸宁': '湖北',
  '长沙': '湖南',
  '株洲': '湖南',
  '湘潭': '湖南',
  '衡阳': '湖南',
  '岳阳': '湖南',
  '常德': '湖南',
  '邵阳': '湖南',
  '郴州': '湖南',
  '永州': '湖南',
  '合肥': '安徽',
  '芜湖': '安徽',
  '蚌埠': '安徽',
  '淮南': '安徽',
  '马鞍山': '安徽',
  '安庆': '安徽',
  '阜阳': '安徽',
  '滁州': '安徽',
  '福州': '福建',
  '厦门': '福建',
  '泉州': '福建',
  '漳州': '福建',
  '莆田': '福建',
  '宁德': '福建',
  '龙岩': '福建',
  '三明': '福建',
  '南昌': '江西',
  '九江': '江西',
  '赣州': '江西',
  '吉安': '江西',
  '上饶': '江西',
  '景德镇': '江西',
  '抚州': '江西',
  '宜春': '江西',
  '新余': '江西',
  '郑州': '河南',
  '洛阳': '河南',
  '开封': '河南',
  '安阳': '河南',
  '新乡': '河南',
  '许昌': '河南',
  '平顶山': '河南',
  '焦作': '河南',
  '南阳': '河南',
  '信阳': '河南',
  '周口': '河南',
  '驻马店': '河南',
  '石家庄': '河北',
  '唐山': '河北',
  '秦皇岛': '河北',
  '保定': '河北',
  '邯郸': '河北',
  '邢台': '河北',
  '张家口': '河北',
  '承德': '河北',
  '廊坊': '河北',
  '沧州': '河北',
  '衡水': '河北',
  '西安': '陕西',
  '宝鸡': '陕西',
  '咸阳': '陕西',
  '渭南': '陕西',
  '延安': '陕西',
  '汉中': '陕西',
  '榆林': '陕西',
  '安康': '陕西',
  '商洛': '陕西',
  '太原': '山西',
  '大同': '山西',
  '阳泉': '山西',
  '长治': '山西',
  '晋城': '山西',
  '朔州': '山西',
  '临汾': '山西',
  '运城': '山西',
  '晋中': '山西',
  '忻州': '山西',
  '吕梁': '山西',
  '沈阳': '辽宁',
  '大连': '辽宁',
  '鞍山': '辽宁',
  '抚顺': '辽宁',
  '本溪': '辽宁',
  '丹东': '辽宁',
  '锦州': '辽宁',
  '营口': '辽宁',
  '阜新': '辽宁',
  '辽阳': '辽宁',
  '朝阳': '辽宁',
  '长春': '吉林',
  '吉林': '吉林',
  '四平': '吉林',
  '辽源': '吉林',
  '通化': '吉林',
  '白山': '吉林',
  '松原': '吉林',
  '白城': '吉林',
  '哈尔滨': '黑龙江',
  '齐齐哈尔': '黑龙江',
  '牡丹江': '黑龙江',
  '佳木斯': '黑龙江',
  '大庆': '黑龙江',
  '鸡西': '黑龙江',
  '双鸭山': '黑龙江',
  '伊春': '黑龙江',
  '七台河': '黑龙江',
  '鹤岗': '黑龙江',
  '黑河': '黑龙江',
  '绥化': '黑龙江',
  '昆明': '云南',
  '大理': '云南',
  '丽江': '云南',
  '曲靖': '云南',
  '玉溪': '云南',
  '昭通': '云南',
  '保山': '云南',
  '普洱': '云南',
  '贵阳': '贵州',
  '遵义': '贵州',
  '六盘水': '贵州',
  '安顺': '贵州',
  '毕节': '贵州',
  '铜仁': '贵州',
  '兰州': '甘肃',
  '天水': '甘肃',
  '白银': '甘肃',
  '武威': '甘肃',
  '张掖': '甘肃',
  '酒泉': '甘肃',
  '平凉': '甘肃',
  '庆阳': '甘肃',
  '西宁': '青海',
  '海东': '青海',
  '南宁': '广西',
  '柳州': '广西',
  '桂林': '广西',
  '梧州': '广西',
  '北海': '广西',
  '防城港': '广西',
  '钦州': '广西',
  '贵港': '广西',
  '玉林': '广西',
  '百色': '广西',
  '贺州': '广西',
  '河池': '广西',
  '来宾': '广西',
  '崇左': '广西',
  '海口': '海南',
  '三亚': '海南',
  '三沙': '海南',
  '儋州': '海南'
}

export async function searchCities(query: string, count: number = 20): Promise<CitySearchResult[]> {
  if (!query.trim()) return []

  const params = new URLSearchParams({
    name: query.trim(),
    count: count.toString(),
    language: 'zh',
    format: 'json'
  })

  try {
    const response = await fetch(`${BASE_URL}/search?${params}`)
    if (!response.ok) {
      throw new Error(`搜索失败: ${response.status}`)
    }

    const data: GeocodingResponse = await response.json()

    if (!data.results || data.results.length === 0) return []

    // 过滤并处理结果
    const processedResults = data.results
      .filter(result => {
        // 只保留中国的城市
        return result.country_code === 'CN' || result.country === '中国' || result.country === 'China'
      })
      .map(result => {
        const cityNames = [result.name]

        // 使用我们的城市-省份映射来纠正错误的行政区划
        // 只有在城市映射表中时才显示省份，否则不显示（避免显示错误省份）
        const mappedProvince = CITY_PROVINCE_MAP[result.name]

        if (mappedProvince) {
          // 使用我们映射的省份
          const fullProvince = CHINA_PROVINCES[mappedProvince] || mappedProvince
          cityNames.push(fullProvince)
        }
        // 不再使用 API 返回的 admin1，因为它经常是错误的
        cityNames.push('中国')

        return {
          id: result.id.toString(),
          name: result.name,
          fullName: cityNames.join(', '),
          country: '中国',
          countryCode: 'CN',
          latitude: result.latitude,
          longitude: result.longitude
        }
      })

    // 按人口排序（大城市优先）
    processedResults.sort((a, b) => {
      const aPop = data.results?.find(r => r.id.toString() === a.id)?.population || 0
      const bPop = data.results?.find(r => r.id.toString() === b.id)?.population || 0
      return bPop - aPop
    })

    return processedResults.slice(0, 10)
  } catch (error) {
    console.error('城市搜索失败:', error)
    return []
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      count: '1',
      language: 'zh',
      format: 'json'
    })

    const response = await fetch(`${BASE_URL}/reverse?${params}`)
    if (!response.ok) return '当前位置'

    const data = await response.json()
    if (data.results && data.results[0]) {
      const name = data.results[0].name
      // 如果在我们的映射中，可以返回更准确的名称
      return name || '当前位置'
    }
  } catch (error) {
    console.warn('逆地理编码失败:', error)
  }
  return '当前位置'
}