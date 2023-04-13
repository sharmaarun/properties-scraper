import * as scraper from "@/scraper";

/**
 * Context object passed to the start function of each script
 */
export type Context = {
    scraper: typeof scraper
}

/**
 * Scraper interface
 */
export type Scraper  = typeof scraper;