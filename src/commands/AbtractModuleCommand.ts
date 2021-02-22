// AbstractModuleCommand -----------------------------------------------------

// Abstract base class for ts-migrate command implementations that specifically
// deal with Migration modules and the associated context parameter.

// External Modules ----------------------------------------------------------

import { connection, Connection } from "@craigmcc/ts-database";

// Internal Modules ----------------------------------------------------------

import AbstractMigrationCommand from "./AbstractMigrationCommand";
import { Migration, MigrationData, SettingsData} from "../types";

const CONNECTION_URI = process.env.TS_MIGRATE_CONNECTION_URI
    ? process.env.TS_MIGRATE_CONNECTION_URI
    : "UNKNOWN:UNKNOWN";

// Public Objects ------------------------------------------------------------

abstract class AbstractModuleCommand extends AbstractMigrationCommand {

    constructor() {
        super();
    }

    context: Connection | null = null;

    /**
     * Find and return MigrationData for all executed migrations from the
     * last one down to, and including, the specified one.  Throw an error
     * if the specified migration cannot be found, or has not been executed.
     *
     * @param migrations            // MigrationData[] for all migrations
     * @param name                  // Name of the targeted migration
     *
     * @returns executeds           // MigrationData[] for executed migrations
     *                              // down to (and including) the targeted one
     *
     * @throws Error if the targeted migration does not exist or has not been executed
     */
    protected findExecuteds(migrations: MigrationData[], name: string): MigrationData[] {
        const executeds: MigrationData[] = [];
        let found = false;
        migrations.slice().reverse().forEach(migration => {
            if (!found) {
                if (migration.executed) {
                    executeds.push(migration);
                }
                if (migration.name === name) {
                    found = true;
                }
            }
        });
        if (!found) {
            throw new Error(`name: No executed migration '${name}' has been found`);
        }
        return executeds;
    }

    /**
     * Find and return MigrationData for all pending migrations up to,
     * and including, the specified one.  Throw an error if the specified
     * migration cannot be found, or has already been executed.
     *
     * @param migrations            // MigrationData[] for all migrations
     * @param name                  // Name of the targeted migration
     *
     * @returns pendings            // MigrationData[] for pending migrations
     *                              // up to (and including) the targeted one
     *
     * @throws Error if the targeted migration does not exist or has been executed
     */
    protected findPendings(migrations: MigrationData[], name: string): MigrationData[] {
        const pendings: MigrationData[] = [];
        let found = false;
        migrations.forEach(migration => {
            if (!found) {
                if (!migration.executed) {
                    pendings.push(migration);
                }
                if (migration.name === name) {
                    found = true;
                }
            }
        });
        if (!found) {
            throw new Error(`name: No pending migration '${name}' has been found`);
        }
        return pendings;
    }

    /**
     * Load and return the Context object for these migration modules.
     * The connect() method will have already been called.
     * TODO: Genericize object type?
     */
    protected async loadContext(): Promise<Connection> {
        this.context = await connection(CONNECTION_URI);
        await this.context.connect();
        return this.context;
    }

    /**
     * Load and return a new instance of the specified
     * migration module.
     */
    protected async loadMigration
        (settingsData: SettingsData, migrationData: MigrationData): Promise<Migration>
    {
        const migrationPath = this.toPathname(settingsData, migrationData.filename);
        console.info(`Loading module from ${migrationPath}`);
        const { default: migrationClass } = await import(migrationPath);
        console.info("Loaded class:     ", migrationClass);
        const migrationInstance = new migrationClass();
        console.info("Loaded migration: ", migrationInstance);
        return migrationInstance;
    }

    /**
     * Perform whatever shutdown operations are required on the
     * context object loaded via loadContext().
     */
    protected async unloadContext(context: Connection): Promise<void> {
        context.disconnect();
    }

}

export default AbstractModuleCommand;
