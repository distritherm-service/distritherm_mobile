#!/bin/bash

# Script pour rebuilder Android après des modifications des assets
echo "🧹 Nettoyage du build Android..."
cd android
./gradlew clean
cd ..

echo "🔨 Rebuilding Android avec les nouveaux assets..."
npx expo prebuild --platform android

echo "🚀 Lancement du build Android..."
npx expo run:android

echo "✅ Rebuild Android terminé !"