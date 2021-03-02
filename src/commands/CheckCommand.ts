// CheckCommand --------------------------------------------------------------

// Check whether the specified migration can be successfully compiled.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AbstractModuleCommand from "./AbtractModuleCommand";

// Public Objects ------------------------------------------------------------

class CheckCommand extends AbstractModuleCommand {

    constructor(argv: any) {
        super();
        this.name = argv.name;
    }

    name: string;                   // Migration name

    public execute = async (): Promise<void> => {
        const configurationData = this.configuration;
        const index = this.selectMigration(configurationData.migrations, this.name);
        if (index < 0) {
            throw new Error(`name: Migration '${this.name}' does not exist`);
        }
//        console.info(`Checking migration '${this.name}'`);
        const migration = await this.loadMigration
            (configurationData.settings, configurationData.migrations[index]);
        console.info(JSON.stringify(configurationData.migrations[index]));
    }

}

export default CheckCommand;
