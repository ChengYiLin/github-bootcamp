# GitHub Copilot 待辦清單作品集

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App。專案以純前端方式記錄、篩選與管理待辦事項，並透過 GitHub Copilot 的開發工具流程實際練習需求拆解、程式修改、提交與 Pull Request 協作。

## 線上展示

> [`https://<你的帳號>.github.io/<你的repo名稱>/`](https://<你的帳號>.github.io/<你的repo名稱>/)

上列為待部署的 GitHub Pages 預留網址，部署完成後可直接替換為實際帳號與儲存庫名稱。

## 功能

- 新增待辦事項
- 勾選或取消勾選待辦事項的完成狀態
- 刪除單筆待辦事項
- 切換全部、未完成與已完成篩選
- 顯示未完成事項數量
- 在篩選結果為空時顯示對應的提示文字
- 清除所有已完成事項，執行前會顯示瀏覽器確認對話框
- 沒有已完成事項時停用「清除已完成」按鈕
- 切換淺色與深色主題，並記住手動選擇的主題
- 使用瀏覽器的 `localStorage` 儲存待辦事項與主題設定
- 在瀏覽器儲存資料讀取或寫入失敗時顯示提示訊息

## 技術

- 前端：HTML、CSS 與原生 JavaScript
- 資料儲存：瀏覽器 `localStorage`
- 專案不使用前端框架、第三方套件或外部 CDN
- UI 樣式使用 CSS 變數，並提供淺色與深色主題
- 使用 `textContent` 與 `createElement` 建立動態內容，避免直接組合 HTML 字串

## 開發方式

本專案在 GitHub Copilot 實戰工作坊中，透過 Agent Mode 協助分析工作區、讀取需求、規劃修改並執行實作。開發過程結合 MCP 與 GitHub 操作，讀取 Issue、建立修正分支、檢查變更、提交並推送，最後建立 Pull Request。

專案中的 `.github/prompts` 與相關 agentic workflow 指示固定了讀取 Issue、提出計畫、建立分支、進行修改、驗證、提交及開 PR 的執行順序。這套流程讓不同需求能依一致的方式進行處理，也讓程式修改範圍保持明確。

## 我學到什麼

- 如何將 Issue 描述拆解為可驗證的功能與修改範圍
- 如何在既有純前端專案中維護一致的程式與樣式規範
- 如何使用瀏覽器儲存、篩選與重新渲染建立完整的待辦清單互動
- 如何利用 GitHub Copilot Agent Mode、MCP 與工作流程指示協助開發
- 如何驗證變更並透過分支、Commit 與 Pull Request 完成交付
