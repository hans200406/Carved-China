@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动《版上山河》本地网页……
start "版上山河本地服务器" /min python -m http.server 8038 --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start "" msedge "http://127.0.0.1:8038"
echo 已尝试在 Microsoft Edge 中打开：http://127.0.0.1:8038
echo 如未自动打开，请复制上方地址到 Edge。
pause
