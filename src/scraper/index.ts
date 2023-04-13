import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import puppeteer from 'puppeteer';

export type ScraperConfig = {
    headless: boolean;
    dataDir: string;
}



// config params
let config_: ScraperConfig = {
    headless: true,
    dataDir: "data"
}

/**
 * Initialize the scraper with the given config
 * @param config 
 */
export const init = async (config: ScraperConfig) => {
    config_ = { ...config_, ...config }

}

/**
 * Create pupeteer instance and returns the browser
 * @returns 
 */
export const start = async () => {

    const { headless } = config_;

    const browser = await puppeteer.launch({
        headless,
        slowMo: 100,
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920x1080'
        ]
    });
    console.log("Started scraper.");
    return browser;
}

/**
 * Saves provided json data to a file in the data/output directory
 */
export const save = async (data: any, path: string) => {
    const { dataDir } = config_;
    const path_ = resolve(dataDir, path)
    const json = JSON.stringify(data, null, 2);
    // create file if it doesn't exist (recursively create dirs if not exist)
    if (!existsSync(path_)) {
        const dirPath = path_.split("/").slice(0, -1).join("/");
        mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(path_, json);
};