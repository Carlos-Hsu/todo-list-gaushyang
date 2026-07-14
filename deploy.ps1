# 自動化部署腳本 (deploy.ps1)
# 此腳本會自動將所有變更加入 Git、提交並推送到 GitHub，觸發 Netlify 自動部署。

$ErrorActionPreference = "Stop"

Write-Host "--- 開始自動部署流程 ---" -ForegroundColor Cyan

# 1. 檢查是否有變更
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "沒有偵測到任何檔案變更，無需部署。" -ForegroundColor Yellow
    Read-Host "按 Enter 鍵退出..."
    exit
}

# 2. 詢問提交訊息
$message = Read-Host "請輸入提交訊息 (留空則使用當前時間作為訊息)"
if ([string]::IsNullOrWhiteSpace($message)) {
    $message = "自動更新: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

# 3. 執行 Git 操作
Write-Host "執行中: git add ." -ForegroundColor Gray
git add .

Write-Host "執行中: git commit -m '$message'" -ForegroundColor Gray
git commit -m "$message"

Write-Host "執行中: git push" -ForegroundColor Gray
git push

Write-Host "--- 部署成功，代碼已推送到 GitHub，Netlify 將在幾十秒內自動完成部署 ---" -ForegroundColor Green
Read-Host "按 Enter 鍵退出..."
