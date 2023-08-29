const puppeteer = require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function searchAndScrape() {
    rl.question('Enter the search term: ', async (searchTerm) => {
        rl.close();

        const browser = await puppeteer.launch();
        const amazonPage = await browser.newPage();
        const flipkartPage = await browser.newPage();

        await amazonPage.goto(`https://www.amazon.in/s?k=${encodeURIComponent(searchTerm)}`);
        await flipkartPage.goto(`https://www.flipkart.com/search?q=${encodeURIComponent(searchTerm)}`);

        const amazonProducts = await scrapeProducts(amazonPage, 'amazon');
        const flipkartProducts = await scrapeProducts(flipkartPage, 'flipkart');

        console.log('Amazon Products:', amazonProducts);
        console.log('Flipkart Products:', flipkartProducts);

        await browser.close();
    });
}

async function scrapeProducts(page, platform) {
    const products = [];

    if (platform === 'amazon') {
        products.push(page);
    } else if (platform === 'flipkart') {
        products.push(page);
    }

    return products;
}

searchAndScrape();
