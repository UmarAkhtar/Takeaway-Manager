const fs = require('node:fs');
const path = require('node:path');
const { pool } = require('./db');

async function migrate() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename TEXT PRIMARY KEY,
            run_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    `);

    const done = await pool.query('SELECT filename FROM schema_migrations');
    const alreadyRun = new Set(done.rows.map((row) => row.filename));

    const folder = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(folder).filter((file) => file.endsWith('.sql')).sort();

    for (const file of files) {
        if (alreadyRun.has(file)) {
            continue;
        }

        const sql = fs.readFileSync(path.join(folder, file), 'utf8');
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
            await client.query('COMMIT');
            console.log(`Ran migration ${file}`);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    console.log('Migrations up to date');
}

migrate()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
