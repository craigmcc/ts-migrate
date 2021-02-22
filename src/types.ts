// types ---------------------------------------------------------------------

// Public data types for ts-migrate and migration authors.

// External Modules ----------------------------------------------------------

// Configuration Data --------------------------------------------------------

// Description of a single migration file
// (filename is relative to migrations directory)

import { Connection } from "@craigmcc/ts-database";

export interface MigrationData {
    executed: boolean;              // true === executed, false === pending
    filename: string;               // Filename with prefix timestamp and ".ts" suffix
    name: string;                   // Migration name with no prefix or suffix
}

// Individual configuration settings
export interface SettingsData {
    migrationsPath: string          // Project-relative path to migrations directory
    templatesPath: string           // Project-relative path to templates directory
}

// Configuration Storage Information
export interface ConfigurationData {
    migrations: MigrationData[];    // All defined migrations
    settings: SettingsData;         // Configuration settings
}

// Migration Interface -------------------------------------------------------

/**
 * Defines the operations performed by this Migration.
 */
export abstract class Migration {

    /**
     * Gracefully undo the modifications made by the corresponding up() method.
     *
     * @param data      Read-only copy of the descriptive data for this migration
     * @param context   Database connection to use for our modifications
     */
    abstract down(data: MigrationData, context: Connection): Promise<void>;

    /**
     * Modify the database (or other persistent state information) as required.
     *
     * @param data      Read-only copy of the descriptive data for this migration
     * @param context   Database connection to use for our modifications
     */
    abstract up(data: MigrationData, context: Connection): Promise<void>;

}
