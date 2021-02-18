// MigrationsCommand ---------------------------------------------------------

// Set the project-relative directory to contain migrations.  Returns all
// settings in JSON format.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AbstractCommand from "./AbstractCommand";

// Public Objects ------------------------------------------------------------

class MigrationsCommand extends AbstractCommand {

    constructor(argv: any) {
        super();
        this.migrationsPath = argv.directory;
    }

    migrationsPath: string;         // New directory to contain migrations

    public execute = async (): Promise<void> => {
        const configurationData = this.configuration;
        // TODO - validate new directory?  create it?
        configurationData.settings.migrationsPath = this.migrationsPath;
        this.configuration = configurationData;
        console.info(JSON.stringify(configurationData.settings, null, 2));
    }

}

export default MigrationsCommand;
