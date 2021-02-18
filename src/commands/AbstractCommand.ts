// AbstractCommand -----------------------------------------------------------

// Abstract base class for ts-migrate command implementations.  Concrete
// implementations will generally have a constructor to configure
// command-specific details.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import { configstore } from "../index";
import {
    ConfigurationData,
    MigrationData,
    SettingsData,
} from "../types";

const MIGRATIONS_KEY = "migrations";
const SETTINGS_KEY = "settings";

// Public Objects ------------------------------------------------------------

abstract class AbstractCommand {

    constructor() {
    }

    /**
     * Execute the specified command asynchronously.
     */
    public abstract execute(): Promise<void>;

    /**
     * Return the configuration data for the current project, populating
     * as necessary if information is not yet present.
     */
    protected get configuration(): ConfigurationData {
        const emptyMigrations: MigrationData[] = [];
        let migrationsData: MigrationData[] = configstore.has(MIGRATIONS_KEY)
            ? configstore.get(MIGRATIONS_KEY)
            : emptyMigrations;
        let settingsData: SettingsData = configstore.has(SETTINGS_KEY)
            ? configstore.get(SETTINGS_KEY)
            : {
                migrationsPath: "./src/migrations",
                templatesPath: "./src/templates",
            };
        return {
            migrations: migrationsData,
            settings: settingsData,
        }
    }

    /**
     * Persist the configuration data for the current project
     */
    protected set configuration(configuration: ConfigurationData) {
        configstore.set(MIGRATIONS_KEY, configuration[MIGRATIONS_KEY]);
        configstore.set(SETTINGS_KEY, configuration[SETTINGS_KEY]);
    }

}

export default AbstractCommand;
