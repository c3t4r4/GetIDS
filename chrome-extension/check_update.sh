#!/bin/bash

# URL do arquivo version.txt no GitHub
GITHUB_VERSION_URL="https://github.com/c3t4r4/GetIDS/raw/refs/heads/main/chrome-extension/version.txt"

# Caminho do arquivo local de versão
LOCAL_VERSION_FILE="./version.txt"

# Baixar a versão mais recente do GitHub temporariamente
TEMP_VERSION_FILE=$(mktemp)
curl -s -o "$TEMP_VERSION_FILE" "$GITHUB_VERSION_URL"

# Ler versões
LOCAL_VERSION=$(cat "$LOCAL_VERSION_FILE")
REMOTE_VERSION=$(cat "$TEMP_VERSION_FILE")

# Verificar se há uma nova versão
if [ "$REMOTE_VERSION" != "$LOCAL_VERSION" ]; then
    echo "Nova versão encontrada: $REMOTE_VERSION. Atualizando..."

    # Baixar e sobrescrever os arquivos
    FILES=(
        "background.js"
        "content.js"
        "icon.png"
        "manifest.json"
        "popup.html"
        "popup.js"
        "version.txt"
        "check_update.sh"
        "check_update.bat"
    )

    for file in "${FILES[@]}"; do
        echo "Baixando $file..."
        curl -s -O "https://github.com/c3t4r4/GetIDS/raw/refs/heads/main/chrome-extension/$file"
    done

    # Atualizar a versão local
    mv "$TEMP_VERSION_FILE" "$LOCAL_VERSION_FILE"
    echo "Atualização concluída."
else
    echo "Você já está na versão mais recente: $LOCAL_VERSION."
    rm "$TEMP_VERSION_FILE"
fi
