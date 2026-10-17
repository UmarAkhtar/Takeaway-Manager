const { test, expect } = require('@playwright/test');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { logIn } = require('./helpers');

const PORT = 3101;
const BASE_URL = `http://localhost:${PORT}`;

// Starts a second copy of the server that this test can stop and restart
async function startServer() {
    const server = spawn('node', [path.join(__dirname, '..', '..', 'server', 'server.js')], {
        env: {
            ...process.env,
            PORT: String(PORT),
            DATABASE_URL: process.env.TEST_DATABASE_URL,
            SESSION_SECRET: 'test-session-secret',
        },
        stdio: 'ignore',
    });

    for (let i = 0; i < 50; i++) {
        try {
            const response = await fetch(`${BASE_URL}/api/health`);
            if (response.ok) {
                return server;
            }
        } catch {
            // Not ready yet
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
    }
    server.kill();
    throw new Error('The test server did not start');
}

async function stopServer(server) {
    const stopped = new Promise((resolve) => server.once('exit', resolve));
    server.kill();
    await stopped;
}

test('staff stay logged in after the server restarts', async ({ browser }) => {
    const context = await browser.newContext({ baseURL: BASE_URL });
    const page = await context.newPage();

    let server = await startServer();
    try {
        await logIn(page);

        await stopServer(server);
        server = await startServer();

        await page.goto('/staff');
        await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Log in' })).toHaveCount(0);
    } finally {
        await stopServer(server);
        await context.close();
    }
});
