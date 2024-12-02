#!/bin/bash

# Ukončí skript na první chybu
set -e

# Získání aktuálního adresáře
PARENT="$(pwd)"

# Přesun do složky s React aplikací
cd spa

# Spuštění buildu aplikace
yarn build

# Ověření, že build proběhl úspěšně
if [ $? -ne 0 ]; then
  echo "Build selhal."
  exit 1
fi

# Přesun do složky dist
cd dist

# Vytvoření cílové složky, pokud neexistuje
mkdir -p "$PARENT/public"

# Kopírování souborů do cílové složky
cp -r * "$PARENT/public"

echo "Build a kopírování bylo úspěšné."
