# 專案維護說明 (MAINTENANCE.md)

本檔案記錄高祥電信專案的開發環境、版本控制與部署流程，以便日後維護與團隊協作。

## 1. 開發環境與預覽

專案採用標準 HTML5 + CSS3 + Vanilla JavaScript。

- **編輯器**：推薦使用 VS Code。
- **本地預覽 (Live Server)**：
  1. 安裝 VS Code 的 **Live Server** 插件。
  2. 在 `index.html` 檔案上按滑鼠右鍵，選擇 **"Open with Live Server"**。
  3. 瀏覽器將自動開啟本地伺服器 (`http://127.0.0.1:5500`)，並支援檔案儲存後的自動重整功能。

## 2. 版本控制 (Git 工作流)

本專案已連結至 GitHub 倉庫 (Carlos-Hsu/todo-list-gaushyang)。

**日常開發流程：**

1. **修改與儲存**：完成程式碼異動並存檔。
2. **提交變更**：在終端機 (Terminal) 執行：
   ```bash
   git add .
   git commit -m "描述您的修改內容，例如：更新關於我們文字"
   ```
3. **同步至 GitHub**：
   ```bash
   git push
   ```

## 3. 自動化部署 (Netlify)

專案已連結 Netlify 自動化部署。一旦執行 `git push` 將代碼推送到 GitHub 的 `main` 分支，Netlify 將自動進行部署。

- **部署網站**：[https://gaushyang.netlify.app/](https://gaushyang.netlify.app/)
- **管理後台**：[Netlify App - Gaushyang](https://app.netlify.com/)
- **注意事項**：
  - 若需更改網站名稱，請至 Netlify 後台的 **Site configuration > Site details** 進行修改。
  - 此為持續部署 (Continuous Deployment) 模式，無需手動拖曳上傳檔案。
