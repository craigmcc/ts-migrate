// UpCommand -----------------------------------------------------------------

// Perform an up() call on all pending migrations up to, and including, the
// named migration for this command.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AbstractModuleCommand from "./AbtractModuleCommand";
import {Migration, MigrationData} from "../types";
import {Connection} from "@craigmcc/ts-database";

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

        // Acquire context object, call up() on each instance, and release context object
/*
        const context: Connection = await this.loadContext();
        instances.forEach(async (instance, inIndex) => {
            const outIndex =
                this.selectMigration(configurationData.migrations, migrations[inIndex].name);
            await instance.up(migrations[inIndex], context);
            if (outIndex >= 0) {
                configurationData.migrations[outIndex].executed = true;
                this.configuration = configurationData;
            } else {
                throw new Error(`name: Cannot mark migration '${migrations[inIndex].name}' as executed`);
            }
        });
        await this.unloadContext(context);
*/

    }

}

export default UpCommand;
