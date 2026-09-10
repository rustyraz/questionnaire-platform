import { AppDataSource } from "./data-source.js";

const revert = process.argv.includes('--revert');

const run = async (): Promise<void> => {
    await AppDataSource.initialize();
    if (revert) {
        await AppDataSource.undoLastMigration();
        console.log('Reverted last migration.');
    } else {
        const applied = await AppDataSource.runMigrations();
        console.log(`Applied ${applied.length} migration(s).`)
    }
    await AppDataSource.destroy();
};

run().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});