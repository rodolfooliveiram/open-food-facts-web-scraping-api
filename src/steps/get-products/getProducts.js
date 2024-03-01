import accessWebsite from '../access-website/accessWebsite.js';
import filterProducts from '../filter-products/filterProducts.js';

export async function getProducts(req, res) {
  console.log('Acessando o site https://br.openfoodfacts.org...');

  const { browser, page } = await accessWebsite();

  const hasQueryParams = req.query.nutrition || req.query.nova ? true : false;
  const nutritionQuery = hasQueryParams ? req.query.nutrition : null;
  const novaQuery = hasQueryParams ? req.query.nova : null;

  console.log('Buscando produtos...');

  let products = [];
  let isNextButtonDisabled = false;

  while (!isNextButtonDisabled) {
    const productsHandles = await page.$$('.list_product_a');

    for (const productHandle of productsHandles) {
      const id = await page.evaluate((element) => {
        const productIdRegex = /\/(?<id>\d+)\/*/;
        const productHref = element.getAttribute('href');
        const productIdMatch = productHref.match(productIdRegex);
        return productIdMatch.groups.id;
      }, productHandle);

      const name = await page.evaluate(
        (element) => element.querySelector('.list_product_name').innerText,
        productHandle
      );

      const nutrition = await page.evaluate((element) => {
        const productScoresRegex =
          /(?<score>desconhecido|não calculada|[A-E1-4])\s*-\s*(?<title>.*)/;
        const nutritionScoreTitle = element
          .querySelector('.list_product_sc > img:nth-child(1)')
          .getAttribute('title');
        const nutritionMatch = nutritionScoreTitle.match(productScoresRegex);
        return {
          score: nutritionMatch.groups.score,
          title: nutritionMatch.groups.title,
        };
      }, productHandle);

      const nova = await page.evaluate((element) => {
        const productScoresRegex =
          /(?<score>desconhecido|não calculada|[A-E1-4])\s*-\s*(?<title>.*)/;
        const novaScoreTitle = element
          .querySelector('.list_product_sc > img:nth-child(2)')
          .getAttribute('title');
        const novaMatch = novaScoreTitle.match(productScoresRegex);
        return {
          score:
            novaMatch.groups.score === 'não calculada'
              ? 'não calculada'
              : parseInt(novaMatch.groups.score),
          title: novaMatch.groups.title,
        };
      }, productHandle);

      const product = {
        id,
        name,
        nutrition,
        nova,
      };

      products.push(product);
    }

    const isBtnAvailable =
      (await page.$('#pages.pagination > li > a[rel="next$nofollow"]')) !==
      null;

    isNextButtonDisabled = !isBtnAvailable;

    if (isBtnAvailable) {
      await Promise.all([
        page.click('#pages.pagination > li > a[rel="next$nofollow"]'),
        page.waitForNavigation(),
      ]);
    }
  }

  if (hasQueryParams) {
    products = await filterProducts(products, nutritionQuery, novaQuery);
  }

  await browser.close();

  console.log(`${products.length} produto(s) encontrado(s).`);
  console.log('Listando produtos...');
  console.log(products);

  return res.send(products);
}

export async function getProductById(req, res) {
  console.log('Acessando o site https://br.openfoodfacts.org...');

  const productId = req.params.id;
  const { browser, page } = await accessWebsite(productId);

  const productHandle = await page.$('.main-product');

  const title = await page.evaluate(
    (element) => element.querySelector('.title-1').innerText,
    productHandle
  );

  const quantity = await page.evaluate(
    (element) => element.querySelector('#field_quantity_value').innerText,
    productHandle
  );

  const ingredients = await page.evaluate((element) => {
    const hasIngredientsAnalysis =
      element.querySelector('#panel_ingredients_analysis') !== null;

    const hasIngredientsList =
      element.querySelector('#panel_ingredients_content') !== null;
    const ingredientsEvaluationRegex = /_(?<evaluation>\D*)_/;

    let hasPalmOil = null;
    let isVegan = null;
    let isVegetarian = null;
    let list = [];

    if (hasIngredientsAnalysis) {
      const palmOilEvaluation = element.querySelector(
        '#panel_ingredients_analysis_content > ul:nth-child(1) h4'
      ).className;
      const palmOilEvaluationMatch = palmOilEvaluation.match(
        ingredientsEvaluationRegex
      );
      hasPalmOil = palmOilEvaluationMatch.groups.evaluation;

      const veganEvaluation = element.querySelector(
        '#panel_ingredients_analysis_content > ul:nth-child(2) h4'
      ).className;
      const veganEvaluationMatch = veganEvaluation.match(
        ingredientsEvaluationRegex
      );

      if (veganEvaluationMatch.groups.evaluation !== 'unknown') {
        isVegan =
          veganEvaluationMatch.groups.evaluation === 'good' ? true : false;
      } else {
        isVegan = veganEvaluationMatch.groups.evaluation;
      }

      const vegetarianEvaluation = element.querySelector(
        '#panel_ingredients_analysis_content > ul:nth-child(3) h4'
      ).className;
      const vegetarianEvaluationMatch = vegetarianEvaluation.match(
        ingredientsEvaluationRegex
      );

      if (vegetarianEvaluationMatch.groups.evaluation !== 'unknown') {
        isVegetarian =
          vegetarianEvaluationMatch.groups.evaluation === 'good' ? true : false;
      } else {
        isVegetarian = vegetarianEvaluationMatch.groups.evaluation;
      }
    }

    if (hasIngredientsList) {
      const ingredientsListElements = element.querySelectorAll(
        '#panel_ingredients_content .panel_text'
      );

      for (const ingredient of ingredientsListElements) {
        list.push(ingredient.innerText);
      }
    }

    return {
      hasPalmOil,
      isVegan,
      isVegetarian,
      list,
    };
  }, productHandle);

  const nutrition = await page.evaluate((element) => {
    let score;
    let values = [];
    let servingSize = null;
    let data = {};
    const scoreRegex = /_(?<score>\D*)_/;
    const scoreTitle = element.querySelector('#panel_nutriscore h4').className;

    const scoreMatch = scoreTitle.match(scoreRegex);
    score = scoreMatch.groups.score.toUpperCase();

    const hasNutrientsValues =
      element.querySelector('#panel_nutrient_levels_content') !== null;

    if (hasNutrientsValues) {
      const nutrientsList = element.querySelectorAll(
        '#panel_nutrient_levels_content .panel_title'
      );

      for (const nutrient of nutrientsList) {
        const nutrientEvaluationRegex = /(?<evaluation>\b[a-z]+)\.svg/;
        const nutrientImgSrc = nutrient.children[0].src;
        const nutrientEvaluationMatch = nutrientImgSrc.match(
          nutrientEvaluationRegex
        );
        const nutrientEvaluation = nutrientEvaluationMatch.groups.evaluation;

        const nutrientEvaluationTitle = nutrient.children[1].innerText;

        values.push([nutrientEvaluation, nutrientEvaluationTitle]);
      }
    }

    const hasServingSize =
      element.querySelector('#panel_serving_size_content') !== null;

    if (hasServingSize) {
      const servingSizeRegex = /\b\d.*/;
      const servingSizeContent = element.querySelector(
        '#panel_serving_size_content .panel_text'
      ).innerText;
      servingSize = servingSizeContent.match(servingSizeRegex)[0];
    }

    const dataNutritionFacts = [
      'Energia',
      'Gorduras/lípidos',
      'Carboidratos',
      'Fibra alimentar',
      'Proteínas',
      'Sal',
    ];

    const nutritionFactsList = element.querySelectorAll(
      '#panel_nutrition_facts_table_content tbody > tr'
    );

    for (const nutritionFact of nutritionFactsList) {
      const nutritionFactTitle = nutritionFact.children[0].innerText;
      const per100g = nutritionFact.children[1].innerText;
      const perServing = nutritionFact.children[2].innerText;

      const isNutritionFactRequired = dataNutritionFacts.includes(
        nutritionFact.children[0].innerText
      );

      if (isNutritionFactRequired) {
        data[nutritionFactTitle] = {
          per100g: per100g,
          perServing: perServing,
        };
      }
    }

    return {
      score,
      values,
      servingSize,
      data,
    };
  }, productHandle);

  const nova = await page.evaluate((element) => {
    const novaRegex = /\b\d/;
    const novaScoreImgSrc = element.querySelector('#panel_nova img').src;
    const novaMatch = novaScoreImgSrc.match(novaRegex);
    let score;

    if (novaMatch) {
      score = parseInt(novaMatch[0]);
    } else {
      score = 'não calculada';
    }

    const title = element.querySelector('#panel_nova h4').innerText;

    return {
      score: score,
      title: title,
    };
  }, productHandle);

  const product = {
    title,
    quantity,
    ingredients,
    nutrition,
    nova,
  };

  await browser.close();

  console.log('Listando dados do produto...');
  console.log(product);
  return res.send(product);
}
