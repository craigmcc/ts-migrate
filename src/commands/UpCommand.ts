// UpCommand -----------------------------------------------------------------

// Perform an up() call on all pending migrations up to, and including, the
// named migration for this command.

// External Modules ----------------------------------------------------------

import { Connection } from "@craigmcc/ts-database";

// Internal Modules ----------------------------------------------------------

import AbstractModuleCommand from "./AbtractModuleCommand";
import { MigrationData } from "../types";

// Public Objects ------------------------------------------------------------

class UpCommand extends AbstractModuleCommand {

    constructor(argv: any) {
        super();
        this.name = argv.name;
    }

    name: string;                   // Migration name

    public execute = async (): Promise<void> => {

        const configurationData = this.configuration;

        // Accumulate data and load instances for pending migrations
        const migrations: MigrationData[] =
            this.findPendings(configurationData.migrations, this.name);
        const instances: Object[] = [];
        migrations.forEach(async migration => {
            const instance = await this.loadMigration(configurationData.settings, migration);
            instances.push(instance);
        });
//        console.info(JSON.stringify(migrations));

        // Acquire context object, call up() on each instance, and release context object
        const context: Connection = await this.loadContext();
        instances.forEach(async (instance: any, inIndex) => {
            const outIndex = this.selectMigration
                (configurationData.migrations, migrations[inIndex].name);
            try {
                await instance.up(context);
            } catch (error) {
                throw new Error(`up: Migration '${migrations[inIndex].name}' error: '${error.message}'`);
            }
            if (outIndex >= 0) {
                configurationData.migrations[outIndex].executed = true;
                this.configuration = configurationData;
            } else {
                throw new Error(`up: Cannot mark migration '${migrations[inIndex].name}' as executed`);
            }
        });
        await this.unloadContext(context);

    }

}

export default UpCommand;
