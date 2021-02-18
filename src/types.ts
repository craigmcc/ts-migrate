// types ---------------------------------------------------------------------

// Public data types for ts-migrate and migration authors.

// Configuration Data --------------------------------------------------------

// Description of a single migration file
// (filename is relative to migrations directory)
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

// Migration Class Definition ------------------------------------------------

