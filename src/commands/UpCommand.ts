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

        console.info("0_/UP: Execution begins");
        const configurationData = this.configuration;

        // Load the relevant instances of pending migrations
        console.info("1_/UP: Load migrations start");
        const migrations: MigrationData[] =
            this.findPendings(configurationData.migrations, this.name);
        const instances: Object[] = [];
        migrations.forEach(async migration => {
            try {
                console.info("1A/UP: Begin Loading Migration ", migration);
                const instance = await this.loadMigration(configurationData.settings, migration);
                instances.push(instance);
                console.info("1B/UP:   End Loading Migration ", migration);
            } catch (error) {
                console.info("1C/UP: Loading Migration Error:", error);
                throw error;
            } finally {
                console.info("1D/UP: Finally Loading Migration ", migration);
            }
        });
        console.info("1_/UP: Load migrations end");

        // Acquire the context object we will pass to up()
        console.info("2_/UP: Load context start");
        try {
            console.info("2A/UP: Before loadContext()");
            await this.loadContext();
            console.info("2B/UP: After loadContext()");
        } catch (error) {
            console.info("2C/UP: Error loadContext()", error);
            throw error;
        } finally {
            console.info("2D/UP: Finally loadContext()");
        }
        console.info("2_/UP: Load context end");

        // Call up() on the relevant migration instances
        console.info("3_/UP: Call migrations start");
        instances.forEach(async (instance: any, inIndex) => {
            const outIndex = this.selectMigration
                (configurationData.migrations, migrations[inIndex].name);
            try {
                console.info("3A/UP: Before up() name=", migrations[inIndex].name);
                await instance.up(this.context);
                console.info("3B/UP:  After up() name=", migrations[inIndex].name);
            } catch (error) {
                console.info("3C/UP: Error ", error);
                throw new Error(`UP: Migration '${migrations[inIndex].name}' error: '${error.message}'`);
            } finally {
                console.info("3D/UP: Finally name=", migrations[inIndex].name);
            }
            if (outIndex >= 0) {
                configurationData.migrations[outIndex].executed = true;
                this.configuration = configurationData;
            } else {
                throw new Error(`3E/UP: Cannot mark migration '${migrations[inIndex].name}' as executed`);
            }
        });
        console.info("3_/UP: Call migrations end");

        // Unload the context object since we are through with it
/*
        console.info("4_/UP: Unload context start");
        try {
            console.info("4A/UP: Before unloadContext()");
            await this.unloadContext();
            console.info("4B/UP: After unloadContext()");
        } catch (error) {
            console.info("4C/UP: unloadContext() error:", error);
            throw error;
        } finally {
            console.info("4D/UP: Finally unloadContext()");
        }
        console.info("4_/UP: Unload context end");
*/

        console.info("5_/UP: Execution ends");

    }

}

export default UpCommand;
