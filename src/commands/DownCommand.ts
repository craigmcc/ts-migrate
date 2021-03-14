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

        console.info("0_/DOWN: Execution begins");
        const configurationData = this.configuration;

        // Load the relevant instances of executed migrations
        console.info("1_/DOWN: Load migrations start");
        const migrations: MigrationData[] =
            this.findExecuteds(configurationData.migrations, this.name);
        const instances: Object[] = [];
        migrations.forEach(async migration => {
            try {
                console.info("1A/DOWN: Begin Loading Migration ", migration);
                const instance = await this.loadMigration(configurationData.settings, migration);
                instances.push(instance);
                console.info("1B/DOWN:   End Loading Migration ", migration);
            } catch (error) {
                console.info("1C/DOWN: Loading Migration Error:", error);
                throw error;
            } finally {
                console.info("1D/DOWN: Finally Loading Migration ", migration);
            }
        });
        console.info("1_/DOWN: Load migrations end");

        // Acquire the context object we will pass to down()
        console.info("2_/DOWN: Load context start")
        try {
            console.info("2A/DOWN:  Before loadContext()");
            await this.loadContext();
            console.info("2B/DOWN:  After loadContext()");
        } catch (error) {
            console.info("2C/DOWN: loadContext() error:", error);
            throw error;
        } finally {
            console.info("2D/DOWN: Finally loadContext()");
        }
        console.info("2_/DOWN: Load context end");

        // Call down() on the relevant migration instances
        console.info("3_/DOWN: Call migrations start");
        instances.forEach(async (instance: any, inIndex) => {
            const outIndex = this.selectMigration
                (configurationData.migrations, migrations[inIndex].name);
            try {
                console.info("3A/DOWN: Before down(), name=", migrations[inIndex].name);
                await instance.down(this.context);
                console.info("3B/DOWN:  After down(), name=", migrations[inIndex].name);
            } catch (error) {
                console.info("3C/DOWN: Error ", error);
                throw new Error(`DOWN: Migration '${migrations[inIndex].name}' error: '${error.message}'`);
            } finally {
                console.info("3D/DOWN: Finally name=", migrations[inIndex].name);
            }
            if (outIndex >= 0) {
                configurationData.migrations[outIndex].executed = false;
                this.configuration = configurationData;
            } else {
                throw new Error(`DOWN: Cannot mark migration '${migrations[inIndex].name}' as pending`);
            }
        });
        console.info("3_/DOWN: Call migrations end");

        // Unload the context object since we are through with it
        console.info("4_/DOWN: Unload context start");
        try {
            console.info("4A/DOWN: Before unloadContext()");
            await this.unloadContext();
            console.info("4B/DOWN: After unloadContext()");
        } catch (error) {
            console.info("4C/DOWN: Error unloadContext()", error);
            throw error;
        } finally {
            console.info("4D/DOWN: Finally unloadContext()");
        }
        console.info("4_/DOWN: Execution ends");

    }

}

export default DownCommand;
