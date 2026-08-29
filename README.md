# WeatherPWA - 精美天气应用
+

## 项目事实速览

Vue 3/Vite 天气 PWA，使用 Open-Meteo 数据。

**运行与开发**：Node.js；`npm install && npm run dev`，构建 `npm run build`。

**边界与安全**：模型、第三方 API、支付渠道、桌面自动化、OCR 和外部数据源均受其自身授权、限额和兼容性约束；不要把演示数据或测试通过当作生产 SLA。禁止提交密钥、令牌、个人数据、模型文件和生产日志。许可证以仓库 LICENSE/NOTICE 及第三方组件声明为准。


一款基于 Vue 3 + TypeScript 的精美天气应用，具有动态背景和流畅动画效果。

## 特性

- 🌤️ 实时天气显示（温度、湿度、风速、气压等）
- 📅 7天天气预报
- ⏰ 24小时逐时预报
- 🔍 城市搜索与收藏
- 🎨 动态渐变背景（根据天气和时间变化）
- ✨ 天气动画效果（雨滴、雪花、云朵、阳光）
- 📍 地理位置自动检测
- 📱 PWA 支持（可安装到桌面）

## 技术栈

- Vue 3 + TypeScript
- Vite 5
- Open-Meteo API（免费、无需API Key）
- CSS动画 + Canvas粒子效果

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## API

使用 [Open-Meteo](https://open-meteo.com/) 免费 API，无需注册或 API Key。

## 许可

MIT License
