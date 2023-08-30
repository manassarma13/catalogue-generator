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
        let containerSelector;
        let website;

        if (window.location.hostname.includes('amazon')) {
            website = 'amazon';
            containerSelector = '#search'; 
        } else if (window.location.hostname.includes('flipkart')) {
            website = 'flipkart';
            containerSelector = '#container'; 
        }

        if (!containerSelector) {
            return {
                url: window.location.href,
                status: 'Website not recognized',
                content: ''
            };
        }

        const containerElement = document.querySelector(containerSelector);
        const content = containerElement ? containerElement.outerHTML : '';

        return {
            url: window.location.href,
            status: website,
            content: content
        };
    });

    return response;
}

searchAndScrape();
