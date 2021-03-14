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

        console.info("UP: Execution begins");
        const configurationData = this.configuration;

        // Load the relevant instances of pending migrations
        const migrations: MigrationData[] =
            this.findPendings(configurationData.migrations, this.name);
        const instances: Object[] = [];
        migrations.forEach(async migration => {
            try {
                console.info("UP: Begin Loading Migration ", migration);
                const instance = await this.loadMigration(configurationData.settings, migration);
                instances.push(instance);
                console.info("UP: End Loading Migration ", migration);
            } catch (error) {
                console.info("UP: Loading Migration Error:", error);
            }
        });
//        console.info(JSON.stringify(migrations));

        // Acquire the context object we will pass to up()
        try {
            console.info("UP: Before loadContext()");
            await this.loadContext();
            console.info("UP: After loadContext()");
        } catch (error) {
            console.info("UP: Error loadContext()", error);
            throw error;
        }

        // Call up() on the relevant migration instances
        console.info("UP: Begin migrations");
        instances.forEach(async (instance: any, inIndex) => {
            const outIndex = this.selectMigration
                (configurationData.migrations, migrations[inIndex].name);
            try {
                console.info("UP: Before up() name=", migrations[inIndex].name);
                await instance.up(this.context);
                console.info("UP: After up() name=", migrations[inIndex].name);
            } catch (error) {
                console.info("UP: Error ", error);
                throw new Error(`UP: Migration '${migrations[inIndex].name}' error: '${error.message}'`);
            }
            if (outIndex >= 0) {
                configurationData.migrations[outIndex].executed = true;
                this.configuration = configurationData;
            } else {
                throw new Error(`UP: Cannot mark migration '${migrations[inIndex].name}' as executed`);
            }
        });
        console.info("UP: End migrations");

        // Unload the context object since we are through with it
        try {
            console.info("UP: Before unloadContext()");
            await this.unloadContext();
            console.info("UP: After unloadContext()");
        } catch (error) {
            console.info("UP: unloadContext() error:", error);
            throw error;
        }
        console.info("UP: Execution ends");

    }

}

export default UpCommand;
