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
     * migration module.  It will be an object (either the migration object
     * in the specified module, or an instance of that migration task) that
     * is guaranteed to have up() and down() functions available.
     */
    protected async loadMigration
        (settingsData: SettingsData, migrationData: MigrationData): Promise<Object>
    {

        // Load the specified module, and extract its default object
        const migrationPath = this.toPathname(settingsData, migrationData.filename);
        console.info(`Loading migration from '${migrationPath}'`);
        const migrationObject = await import(migrationPath);
        console.info(`  migrationObject:  `, migrationObject);
        const migrationDefault = migrationObject.default;
        console.info(`  migrationDefault: `, migrationDefault);

        // If this module is a class, create a new instance
        let migrationInstance: Object | null = null;
        try {
            migrationInstance = Reflect.construct(migrationDefault, []);
            console.info(`  migrationInstance:  `, migrationInstance);
        } catch (error) {
            migrationInstance = null; // This is not a class
        }

        // If we got an instance, check for the required methods
        if (migrationInstance) {
            if (Reflect.has(migrationInstance, "up")
                && Reflect.has(migrationInstance, "down")) {
                return migrationInstance;
            } else {
                throw new Error(`Migration '${migrationData.name}' missing up() and/or down() methods`);
            }
        }

        // Otherwise, this must be an object, so check for the required functions
        if (migrationObject.up && migrationObject.down) {
            return migrationObject;
        } else {
            throw new Error(`Migration '${migrationData.name}' missing up() and/or down() functions`);
        }

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
