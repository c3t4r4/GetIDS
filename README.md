# Chrome GetIDS - Facebook and Instagram

## Download ZIP

[Baixar GetIDS.zip](https://github.com/c3t4r4/GetIDS/raw/refs/heads/main/chrome-extension.zip)

# DEV

## Instalando Pacotes

```sh
npx install
```

## Compilando CSS

```sh
npx tailwindcss -i ./input.css -o ./chrome-extension/tailwind.min.css
```

## Gerar Zip

```sh
rm -rf chrome-extension.zip && zip -r chrome-extension.zip chrome-extension/
```

## Atualizar o Version

```sh
jq -r '.version' chrome-extension/manifest.json > chrome-extension/version.txt
```

## Comando Unificado para Atualizar Versão e Recompilar

```sh
jq '.version |= (split(".") | .[-1] = (.[-1] | tonumber + 1 | tostring) | join("."))' chrome-extension/manifest.json > temp.json && \
mv temp.json chrome-extension/manifest.json && \
jq -r '.version' chrome-extension/manifest.json > chrome-extension/version.txt && \
version=$(cat chrome-extension/version.txt) && \
sed -i '' -E "s|(href=\"tailwind\.min\.css\?v=)[^\"]*|\1${version}|g; s|(src=\"popup\.js\?v=)[^\"]*|\1${version}|g" chrome-extension/popup.html && \
npx tailwindcss -i ./input.css -o ./chrome-extension/tailwind.min.css && \
rm -rf chrome-extension.zip && \
zip -r chrome-extension.zip chrome-extension/
```
