import express, { json } from 'express';
import puppeteer from 'puppeteer';

const server = express();
const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.get('/products', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://br.openfoodfacts.org/');

  const nutritionQuery = req.query ? req.query.nutrition : null;
  const novaQuery = req.query ? req.query.nova : null;

  const products = await page.evaluate(
    (nutritionQuery, novaQuery) => {
      const productsFinal = [];
      const productsList = document.querySelectorAll('.list_product_a');

      const productScoresRegex =
        /(?<score>desconhecido|não calculada|[A-E1-4])\s*-\s*(?<title>.*)/;
      const productIdRegex = /[0-9]+/g;

      function createProductObject(
        productHref,
        productContent,
        nutriScoreContent,
        novaContent
      ) {
        const productId = productHref.match(productIdRegex)[0];

        const productName = productContent.childNodes[1].innerText;

        const nutritionContentMatch =
          nutriScoreContent.match(productScoresRegex);
        const novaContentMatch = novaContent.match(productScoresRegex);

        const nutritionScore = nutritionContentMatch.groups.score;
        const nutritionTitle = nutritionContentMatch.groups.title;

        const novaScore =
          novaContentMatch.groups.score === 'não calculada'
            ? 'não calculada'
            : parseInt(novaContentMatch.groups.score);
        const novaTitle = novaContentMatch.groups.title;

        return {
          id: productId,
          name: productName,
          nutrition: {
            score: nutritionScore,
            title: nutritionTitle,
          },
          nova: {
            score: novaScore,
            title: novaTitle,
          },
        };
      }

      const hasNutritionQuery = Boolean(nutritionQuery);
      const hasNovaQuery = Boolean(novaQuery);

      productsList.forEach((product) => {
        const productContent = product.childNodes[0];
        const productScores = productContent.childNodes[2];

        const nutriScoreContent =
          productScores.childNodes[0].attributes[2].textContent;
        const novaContent =
          productScores.childNodes[1].attributes[2].textContent;

        const matchesNutrition =
          !hasNutritionQuery ||
          nutriScoreContent.includes(`Nutri-Score ${nutritionQuery}`);
        const matchesNova =
          !hasNovaQuery || novaContent.includes(`NOVA ${novaQuery}`);

        if (matchesNutrition && matchesNova) {
          const productInfo = createProductObject(
            product.href,
            productContent,
            nutriScoreContent,
            novaContent
          );
          productsFinal.push(productInfo);
        }
      });

      return {
        list: productsFinal,
      };
    },
    nutritionQuery,
    novaQuery
  );

  await browser.close();

  console.log(products.list.length);
  console.log('teste');

  return res.send(products.list);
});
