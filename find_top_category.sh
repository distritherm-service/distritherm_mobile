#!/bin/bash

# Configuration
API_BASE_URL="http://localhost:3000"
CATEGORIES_ENDPOINT="$API_BASE_URL/categories"
PLATFORM_HEADER="x-platform: web"

echo "🔍 Recherche de la catégorie avec le plus de produits..."
echo

# Récupérer toutes les catégories
echo "📥 Récupération de la liste des catégories..."
categories=$(curl -s -H "$PLATFORM_HEADER" "$CATEGORIES_ENDPOINT")

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la récupération des catégories"
    exit 1
fi

# Extraire les IDs et noms des catégories
category_ids=$(echo "$categories" | jq -r '.categories[].id')

if [ -z "$category_ids" ]; then
    echo "❌ Aucune catégorie trouvée"
    exit 1
fi

echo "📊 Analyse de $(echo "$category_ids" | wc -l) catégories..."
echo

max_count=0
top_category_id=""
top_category_name=""
total_products=0

# Pour chaque catégorie, récupérer le nombre de produits
for id in $category_ids; do
    echo -n "   Catégorie $id: "
    
    # Récupérer les produits de cette catégorie
    response=$(curl -s -H "$PLATFORM_HEADER" "$API_BASE_URL/products/category/$id?limit=1")
    
    if [ $? -eq 0 ]; then
        count=$(echo "$response" | jq -r '.count // 0')
        category_name=$(echo "$response" | jq -r '.category.name // "Nom inconnu"')
        
        echo "$count produits ($category_name)"
        
        # Ajouter au total
        total_products=$((total_products + count))
        
        # Vérifier si c'est le maximum
        if [ "$count" -gt "$max_count" ]; then
            max_count=$count
            top_category_id=$id
            top_category_name="$category_name"
        fi
    else
        echo "❌ Erreur"
    fi
done

echo
echo "📈 RÉSULTATS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏆 Catégorie avec le plus de produits:"
echo "   ID: $top_category_id"
echo "   Nom: $top_category_name"
echo "   Nombre de produits: $max_count"
echo
echo "📊 Statistiques globales:"
echo "   Total des produits: $total_products"

if [ "$total_products" -gt 0 ] && [ "$max_count" -gt 0 ]; then
    percentage=$(echo "scale=1; $max_count * 100 / $total_products" | bc -l 2>/dev/null || echo "N/A")
    echo "   Pourcentage de la catégorie leader: $percentage%"
else
    echo "   Pourcentage de la catégorie leader: N/A"
fi

echo
echo "💡 Commande curl pour reproduire:"
echo "   curl -H \"x-platform: web\" \"$API_BASE_URL/products/category/$top_category_id\""
echo
