import puppeteer from 'puppeteer';

async function accessWebsite(productId) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(60000);

  if (productId) {
    console.log('Buscando dados do produto...');
    await page.goto(`https://br.openfoodfacts.org/produto/${productId}`);
  } else {
    await page.goto('https://br.openfoodfacts.org/117');
  }

  return { browser, page };
}

export default accessWebsite;
