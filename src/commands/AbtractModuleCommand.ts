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

    protected context: Connection | null = null;

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
     * Load the Context object for these migration modules.
     * The connect() method will have already been called.
     * TODO: Genericize object type?
     */
    protected async loadContext(): Promise<void> {

        try {
            console.info("2a/LOADCONT: Before connection() uri=", CONNECTION_URI);
            this.context = await connection(CONNECTION_URI);
            console.info("2b/LOADCONT: After connection() uri=" + CONNECTION_URI);
        } catch (error) {
            console.info("2c/LOADCONT: connection() error", error);
            throw error;
        } finally {
            console.info("2d/LOADCONT: Finally connection() uri=", CONNECTION_URI);
        }

        try {
            console.info("2j/LOADCONT: Before connect() connected=", this.context.connected);
            await this.context.connect();
            console.info("2k/LOADCONT: After connect() connected=", this.context.connected);
        } catch (error) {
            console.info("2l/LOADCONT: connect() error", error);
            throw error;
        } finally {
            console.info("2m/LOADCONT: Finally connect() connected=",
                (this.context ? this.context.connected : "UNDEFINED"));
        }
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

        // Load the specified module and extract default object
        const migrationPath = this.toPathname(settingsData, migrationData.filename);
        let migrationObject: any;
        let migrationDefault: any;
        try {
            console.info(`1a/LOADMIG: Loading from '${migrationPath}`);
            migrationObject = await import(migrationPath);
            console.info(`1b/LOADMIG:  Loaded from '${migrationPath}`);
            migrationDefault = migrationObject.default;
            console.info(`1c/LOADMIG:  Extracted default`);
        } catch (error) {
            console.info("1d/LOADMIG: Load error", error);
            throw error;
        } finally {
            console.info(`1e/LOADMIG: Finished from '${migrationPath}'`);
        }

        // If this module is a class, create a new instance
        let migrationInstance: Object | null = null;
        try {
            console.info(`1j/LOADMIG: Attempting instantiate`);
            migrationInstance = Reflect.construct(migrationDefault, []);
            console.info(`1k/LOADMIG: Instantiation successful`);
        } catch (error) {
            console.info(`1l/LOADMIG: Instantiation failed, so use object`);
            migrationInstance = null; // This is not a class
        } finally {
            console.info(`1m/LOADMIG: Finished instantiate`);
        }

        // If we got an instance, check for the required methods
        if (migrationInstance) {
            if (Reflect.has(migrationInstance, "up")
                && Reflect.has(migrationInstance, "down")) {
                console.info(`1q/LOADMIG: Methods exist on instance, return it`);
                return migrationInstance;
            } else {
                console.info(`1r/LOADMIG: Methods missing on instance, fail it`);
                throw new Error(`Migration '${migrationData.name}' missing up() and/or down() methods`);
            }
        }

        // Otherwise, this must be an object, so check for the required functions
        if (migrationObject.up && migrationObject.down) {
            console.info(`1u/LOADMIG: Functions exist on object, return it`);
            return migrationObject;
        } else {
            console.info(`1v/LOADMIG: Functions missing on object, fail it`);
            throw new Error(`Migration '${migrationData.name}' missing up() and/or down() functions`);
        }

    }

    /**
     * Perform whatever shutdown operations are required on the
     * context object loaded via loadContext().
     */
    protected async unloadContext(): Promise<void> {
        try {
            console.info("4a/UNLOAD: Before disconnect()");
            if (this.context) {
                await this.context.disconnect();
                this.context = null;
            }
            console.info("4b/UNLOAD: After disconnect()");
        } catch (error) {
            console.info("4c/UNLOAD: disconnect() error", error);
            throw error;
        } finally {
            console.info("4d/UNLOAD: Finally disconnect() connected=",
                (this.context ? this.context.connected : "UNDEFINED"));
        }
    }

}

export default AbstractModuleCommand;
