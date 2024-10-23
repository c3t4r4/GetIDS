@echo off
setlocal enabledelayedexpansion

:: URL do arquivo version.txt no GitHub
set "GITHUB_VERSION_URL=https://github.com/c3t4r4/GetIDS/raw/refs/heads/main/chrome-extension/version.txt"

:: Caminho do arquivo local de versão
set "LOCAL_VERSION_FILE=version.txt"

:: Baixar a versão mais recente do GitHub
curl -s -o temp_version.txt %GITHUB_VERSION_URL%

:: Ler versões
set /p LOCAL_VERSION=<%LOCAL_VERSION_FILE%
set /p REMOTE_VERSION=<temp_version.txt

:: Comparar versões
if NOT "!LOCAL_VERSION!"=="!REMOTE_VERSION!" (
    echo Nova versão encontrada: !REMOTE_VERSION!. Atualizando...

    :: Lista de arquivos a serem baixados
    set FILES=background.js content.js icon.png manifest.json popup.html popup.js tailwind.min.css version.txt check_update.sh check_update.bat

    for %%F in (%FILES%) do (
        echo Baixando %%F...
        curl -s -O "https://github.com/c3t4r4/GetIDS/raw/refs/heads/main/chrome-extension/%%F"
    )

    :: Atualizar a versão local
    move /Y temp_version.txt %LOCAL_VERSION_FILE%
    echo Atualização concluída.
) else (
    echo Você já está na versão mais recente: !LOCAL_VERSION!.
    del temp_version.txt
)

endlocal
