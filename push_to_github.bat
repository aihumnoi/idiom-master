@echo off
chcp 65001 >nul
echo ==============================================
echo   Push Idiom-Master to GitHub (Automatic)
echo ==============================================
echo.

echo [1/5] Setting up Git Identity...
git config user.name "aihumnoi"
git config user.email "aihumnoi@users.noreply.github.com"

echo [2/5] Adding files...
git add .

echo [3/5] Committing changes...
git commit -m "feat: setup idiom-master and capacitor android apk build"

echo [4/5] Setting main branch and remote URL...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/aihumnoi/idiom-master.git

echo [5/5] Pushing to GitHub...
echo (If a GitHub login window appears, please authorize or sign in)
echo.
git push -u origin main

echo.
echo ==============================================
echo   Done!
echo   Go to GitHub Actions to download your APK:
echo   https://github.com/aihumnoi/idiom-master/actions
echo ==============================================
echo.
pause
