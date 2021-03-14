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

        // Lod the relevant instances of executed migrations
        const migrations: MigrationData[] =
            this.findExecuteds(configurationData.migrations, this.name);
        const instances: Object[] = [];
        migrations.forEach(async migration => {
            const instance = await this.loadMigration(configurationData.settings, migration);
            instances.push(instance);
        });
//        console.info(JSON.stringify(migrations));

        // Initialize the context object we will pass to down()
        try {
            console.info("DOWN:  Before loadContext()");
            await this.loadContext();
            console.info("DOWN:  After loadContext()");
        } catch (error) {
            console.info("DOWN: loadContext() error:", error);
            throw error;
        }

        // Call down() on the relevant migration instances
        instances.forEach(async (instance: any, inIndex) => {
            const outIndex = this.selectMigration
                (configurationData.migrations, migrations[inIndex].name);
            try {
                console.info("DOWN: Before down(), name=", migrations[inIndex].name);
                await instance.down(this.context);
                console.info("DOWN: After down(), name=", migrations[inIndex].name);
            } catch (error) {
                console.info("DOWN: Error ", error);
                throw new Error(`DOWN: Migration '${migrations[inIndex].name}' error: '${error.message}'`);
            }
            if (outIndex >= 0) {
                configurationData.migrations[outIndex].executed = false;
                this.configuration = configurationData;
            } else {
                throw new Error(`DOWN: Cannot mark migration '${migrations[inIndex].name}' as pending`);
            }
        });

        // Unload the context object since we are through with it
        try {
            console.info("DOWN: Before unloadContext()");
            await this.unloadContext();
            console.info("DOWN: After unloadContext()");
        } catch (error) {
            console.info("DOWN: Error unloadContext()", error);
            throw error;
        }

    }

}

export default DownCommand;
