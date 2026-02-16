import app, { setupPromise } from "../server/index";

export default async function handler(req: any, res: any) {
    // Wait for the app to be fully setup (routes registered, static middleware ready)
    await setupPromise;

    // Forward request to the express app
    app(req, res);
}
