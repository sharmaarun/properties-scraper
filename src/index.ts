import { getTypescriptFiles } from "@/utils";
import { Context } from "./interfaces"
import * as scraper from "@/scraper";
import config from "../config.json"



/**
 * Initialize the app and return the context
 */
const init = async (): Promise<Context> => {
    await scraper.init(config.scraper)
    const ctx: Context = {
        scraper
    }
    return ctx;
}

/**
 * Starts the scraping app
 */
const start = async (ctx: Context) => {
    let scriptIndex: number = 0;
    while (scriptIndex > -1) {
        // Read all scripts
        const scripts = getTypescriptFiles(__dirname, "scripts");

        if (scripts.length <= 0) {
            console.log("No scripts found");
            console.log("Please add a script to the scripts folder");
            process.exit(0);
        }
        console.log("Please choose the script you want to run (enter 0 to exit): ");
        scripts.forEach((script, index) => {
            console.log(`${index + 1}. ${script}`);
        });

        scriptIndex = await new Promise<number>((resolve, reject) => {
            process.stdin.on("data", (data) => {
                const index = parseInt(data.toString());
                if (isNaN(index)) {
                    reject("Invalid script index");
                } else {
                    resolve(index);
                }
            });
        });

        if (scriptIndex === 0) {
            break;
        }

        const script = scripts[scriptIndex - 1];
        if (!script) {
            console.log("Invalid script index");
            process.exit(0);
        }

        const { start } = await import(`./scripts/${script}`);
        const config_ = (config.scripts as any)[script]

        console.log("Running script...");
        await start(ctx, config_);
        console.log("Script completed successfully");
    }

    if (scriptIndex === 0) {
        console.log("Exiting...");
        process.exit(0);
    }


}

/**
 * Start the app
 */
const appStart = async () => {
    // Initialize the app
    const ctx = await init();
    // Start the app
    start(ctx);
}
appStart()
