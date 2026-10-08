# 資料分析專題作品集網站

純 HTML、CSS、JavaScript 製作，沒有套件安裝或建置步驟。網頁呈現 `finalproj` 的 ETL、資料驗證、Google Cloud SQL（SQL Server）、ERD、Streamlit 分析成果，以及依同一份資料重新計算的數據洞察。

網站展示：https://vanyachen88-rgb.github.io/finalproj-pages/

## 修改位置

| 檔案 | 內容 |
|---|---|
| `index.html` | 首頁標題、摘要、數字、四項重點發現（靜態文字，利於 SEO）、方法說明、聯絡區 |
| `content.js` | 五段流程、八張資料表、**五個數據洞察分頁**（文字、數字、圖表資料） |
| `styles.css` | 色彩與排版（顏色集中於 `:root`）、響應式規則 |
| `script.js` | 分頁、圖表元件（bars / pairs / columns / table / checks / cards）、手機選單 |

## 響應式斷點

`1000px`（雙欄改單欄）、`860px`（洞察區塊單欄）、`700px`（手機選單）、`640px`（表格轉卡片）、`560px`（版面精簡）、`380px`（極窄螢幕）。

## 數據說明

洞察數字依 `finalproj/data/clean` 重新計算，基準日 2026-10-08；資料為模擬資料，含部分未來日期，詳見網站「資料品質與預測」分頁。
