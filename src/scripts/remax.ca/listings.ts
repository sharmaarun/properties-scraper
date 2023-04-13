/**
 * Extracts remax listings from a given page
 */

import { Context, Scraper } from "@/interfaces";
import { replaceVariables } from "../../utils";
import { get } from "request"
export type ListingsConfig = {
    url: string;
    scrapeDomain: string;
}

/**
 * Query Paths
 * Extract Listings Links : Array.from(document.querySelectorAll("#search-gallery > main > div > div > a").values()).map(e=>e.attributes.href.value)
 * 
 */

let ctx: Partial<Context> = {}

export const start = async ({ scraper }: Context, config?: ListingsConfig) => {
    ctx = { scraper }
    if (!config || !config.url) {
        throw new Error("Invalid config");
    }

    const res: any = await fetchListing(config.url);
    const { result } = JSON.parse(res || {})
    const { results } = result || {}

    const urls = [];
    for (let result of results) {
        const { detailUrl } = result;
        const url = "https://" + config?.scrapeDomain + "/" + detailUrl;
        urls.push(url);
    }
    await scrapeProperties(urls, scraper)

    await scraper.save(results, "remax.ca/listings/0-20.json");

}

/**
 * Fetches listings from a given remax.ca listing url
 * @param url 
 * @param page 
 * @returns 
 */
const fetchListing = async (url: string, page: number = 1) => {
    const url_ = replaceVariables(url, { from: (page - 1) * 20 })
    return new Promise((res, rej) => {
        get(url_, (err, ret, body) => {
            if (err) { rej(err) }
            else { res(body) }
        })
    })
}

/**
 * Scrape property from the given remax.ca property urls
 */
export const scrapeProperties = async (urls: string[], scraper: Scraper) => {
    const browser = await scraper.start()
    const page = await browser.newPage();
    for (let url of urls) {
        await page.goto(url);
        await page.waitForSelector("#__next > div.base-layout_root__gpH78.globalBodyPadding > main > div > div.fresnel-container.fresnel-greaterThanOrEqual-laptop");
        await page.click("#__next > div.base-layout_root__gpH78.globalBodyPadding > div.media-buttons_wrapper__BsovA > button.MuiButtonBase-root.MuiButton-root.residentialOutlined.ldp-all-photos-button.media-buttons_mediaButton__exglo.MuiButton-text.remax-button_buttonText__saWK7 > span > div")
    }
    await page.close();
}