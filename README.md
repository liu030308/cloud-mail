<p align="center">
  <img src="doc/demo/logo.png" width="80" alt="Cloud Mail 標誌" />
</p>
<h1 align="center">Cloud Mail</h1>
<p align="center">基於 Cloudflare 的簡潔響應式郵件服務，支援寄信、附件收發、PWA 安裝與即時通知 🎉</p>
<p align="center">
  繁體中文 | <a href="/README-en.md">English</a>
</p>
<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT 授權條款" /></a>
  <a href="https://github.com/maillab/cloud-mail"><img src="https://img.shields.io/badge/upstream-maillab%2Fcloud--mail-blue" alt="上游專案" /></a>
</p>

## 專案簡介

只需一個網域，即可建立多個不同的電子郵件地址。專案可部署至 Cloudflare Workers，搭配 Email Routing、D1、KV 與 R2，低成本建立自己的郵件服務。

本儲存庫以 [maillab/cloud-mail](https://github.com/maillab/cloud-mail) 為基礎，針對繁體中文使用體驗、行動裝置安裝、通知、安全性與寄信穩定性持續改進。

## 本版本新增與改進

相較於上游專案，本版本主要加入下列功能與修正：

- **完整繁體中文介面**：新增 `zh-TW` 翻譯及 `zh-Hant` 語系辨識，並調整臺灣常用詞彙與日期顯示。
- **PWA 應用程式**：可在支援的桌面及 Android 瀏覽器安裝 Cloud Mail，提供安裝提示、應用程式圖示及獨立視窗體驗。
- **背景郵件通知**：透過 Web Push 與 VAPID，在應用程式未開啟時也能接收新郵件通知。
- **Discord Webhook 通知**：支援 Discord Webhook 格式、重試機制、錯誤診斷及一般 Webhook 相容性。
- **寄送狀態追蹤**：驗證 Resend Webhook 簽章並同步寄送結果，避免未授權事件竄改郵件狀態。
- **寄信可靠性改善**：補齊純文字內容、處理空白主旨與附件、清理郵件標頭，並改善回覆鏈及 Resend 冪等請求。
- **安全性強化**：加入安全回應標頭、請求速率限制、較安全的工作階段 Cookie 與 Cloudflare 相容的 PBKDF2 密碼處理。
- **啟動與相容性修正**：改善初始化流程、避免載入畫面卡住，並修正 Element Plus 模組初始化與 Cloudflare WAF／重新導向問題。
- **自動化部署改進**：GitHub Actions 可安全帶入 Resend Webhook 與 VAPID 設定並部署至 Cloudflare Workers。

## 專案展示

- [線上展示](https://skymail.ink)
- [部署文件](https://doc.skymail.ink)

| ![](/doc/demo/demo1.png) | ![](/doc/demo/demo2.png) |
| --- | --- |
| ![](/doc/demo/demo3.png) | ![](/doc/demo/demo4.png) |

## 功能介紹

- **💰 低成本使用**：部署至 Cloudflare Workers，無須自行維護郵件伺服器。
- **💻 響應式設計**：自動適應電腦及大多數行動裝置瀏覽器。
- **📱 PWA 安裝**：可安裝至桌面或手機主畫面，以獨立應用程式模式使用。
- **📧 郵件寄送**：整合 Resend，支援群發、內嵌圖片、附件及寄送狀態查詢。
- **🛡️ 管理功能**：管理使用者與郵件，並以 RBAC 控制功能權限及資源使用量。
- **📦 附件收發**：透過 Cloudflare R2 儲存及下載附件。
- **🔔 郵件通知**：支援 Web Push、Telegram、Discord Webhook、一般 Webhook 及轉寄至其他信箱。
- **📡 開放 API**：支援批次建立使用者及多條件郵件查詢。
- **🔢 驗證碼辨識**：使用 Workers AI 自動辨識郵件中的驗證碼。
- **📈 資料視覺化**：使用 ECharts 顯示系統資料與使用者郵件成長趨勢。
- **🎨 個人化設定**：可自訂網站標題、登入背景與透明度。
- **🤖 人機驗證**：整合 Cloudflare Turnstile，防止自動化大量註冊。

## 技術架構

- **平台**：[Cloudflare Workers](https://developers.cloudflare.com/workers/)
- **Web 框架**：[Hono](https://hono.dev/)
- **ORM**：[Drizzle](https://orm.drizzle.team/)
- **前端框架**：[Vue 3](https://vuejs.org/)
- **UI 框架**：[Element Plus](https://element-plus.org/)
- **郵件寄送**：[Resend](https://resend.com/)
- **快取**：[Cloudflare KV](https://developers.cloudflare.com/kv/)
- **資料庫**：[Cloudflare D1](https://developers.cloudflare.com/d1/)
- **檔案儲存**：[Cloudflare R2](https://developers.cloudflare.com/r2/)

## 目錄結構

```text
cloud-mail
├── mail-worker                 # Worker 後端專案
│   ├── src
│   │   ├── api                 # API 介面層
│   │   ├── const               # 專案常數
│   │   ├── dao                 # 資料存取層
│   │   ├── email               # 郵件接收與處理
│   │   ├── entity              # 資料庫實體
│   │   ├── error               # 自訂例外
│   │   ├── hono                # Web 框架、中介軟體與全域錯誤處理
│   │   ├── i18n                # 多語系
│   │   ├── init                # 資料庫與快取初始化
│   │   ├── model               # 回應資料模型
│   │   ├── security            # 身分驗證與權限控管
│   │   ├── service             # 商業邏輯層
│   │   ├── template            # 訊息範本
│   │   ├── utils               # 工具函式
│   │   └── index.js            # 程式進入點
│   ├── package.json            # 專案相依套件
│   └── wrangler.toml           # Cloudflare Workers 設定
│
└── mail-vue                    # Vue 前端專案
    ├── src
    │   ├── axios               # Axios 設定
    │   ├── components          # 共用元件
    │   ├── echarts             # ECharts 元件
    │   ├── i18n                # 多語系
    │   ├── init                # 前端初始化
    │   ├── layout              # 版面配置元件
    │   ├── perm                # 權限驗證
    │   ├── request             # API 請求
    │   ├── router              # 路由設定
    │   ├── store               # 全域狀態管理
    │   ├── utils               # 工具函式
    │   ├── views               # 頁面元件
    │   ├── App.vue             # 根元件
    │   ├── main.js             # 前端進入點
    │   └── style.css           # 全域樣式
    └── package.json            # 專案相依套件
```

## 授權條款

本專案採用 [MIT](LICENSE) 授權條款。
