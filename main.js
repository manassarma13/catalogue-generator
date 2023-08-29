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

        const amazonResponse = await getPageResponse(amazonPage);
        const flipkartResponse = await getPageResponse(flipkartPage);

        console.log('Amazon Response:', amazonResponse);
        console.log('Flipkart Response:', flipkartResponse);

        await browser.close();
    });
}

async function getPageResponse(page) {
    const response = await page.evaluate(() => {
        return {
            url: window.location.href,
            status: window.location.href,
            content: document.documentElement.outerHTML
        };
    });

    return response;
}

searchAndScrape();
