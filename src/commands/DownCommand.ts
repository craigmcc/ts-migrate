// DownCommand ---------------------------------------------------------------

// Perform a down() call on all executed migrations down to, and including, the
// named migration for this command.

// External Modules ----------------------------------------------------------

import {Connection} from "@craigmcc/ts-database";

// Internal Modules ----------------------------------------------------------

import AbstractModuleCommand from "./AbtractModuleCommand";
import { MigrationData } from "../types";

// Public Objects ------------------------------------------------------------

class DownCommand extends AbstractModuleCommand {

    constructor(argv: any) {
        super();
        this.name = argv.name;
    }

    name: string;                   // Migration name

    public execute = async (): Promise<void> => {

        const configurationData = this.configuration;

        // Accumulate data and load instance for executed migrations
        const migrations: MigrationData[] =
            this.findExecuteds(configurationData.migrations, this.name);
        const instances: Object[] = [];
        migrations.forEach(async migration => {
            const instance = await this.loadMigration(configurationData.settings, migration);
            instances.push(instance);
        });
//        console.info(JSON.stringify(migrations));

        // Acquire context object, call down() on each instance, and release context object
        const context: Connection = await this.loadContext();
        instances.forEach(async (instance: any, inIndex) => {
            const outIndex = this.selectMigration
            (configurationData.migrations, migrations[inIndex].name);
            try {
                await instance.down(context);
            } catch (error) {
                throw new Error(`down: Migration '${migrations[inIndex].name}' error: '${error.message}'`);
            }
            if (outIndex >= 0) {
                configurationData.migrations[outIndex].executed = false;
                this.configuration = configurationData;
            } else {
                throw new Error(`down: Cannot mark migration '${migrations[inIndex].name}' as pending`);
            }
        });
        await this.unloadContext(context);

    }

}

export default DownCommand;
