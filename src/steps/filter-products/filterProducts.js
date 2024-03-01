async function filterProducts(products, nutritionQuery, novaQuery) {
  console.log('Filtrando produtos...');
  const hasNutritionQuery = Boolean(nutritionQuery);
  const hasNovaQuery = Boolean(novaQuery);

  const filteredProducts = products.filter((product) => {
    const matchesNutrition =
      !hasNutritionQuery || product.nutrition.score === nutritionQuery;
    const matchesNova =
      !hasNovaQuery || product.nova.score === parseInt(novaQuery);

    return matchesNutrition && matchesNova;
  });

  return filteredProducts;
}

export default filterProducts;
