#!/usr/bin/env ts-node-script
// ts-migrate ----------------------------------------------------------------

// Typescript-based database migration tool.

// Public Type Declarations --------------------------------------------------

export {
    ConfigurationData,
    Migration,
    MigrationData,
    SettingsData,
} from "./types";

// External Modules ----------------------------------------------------------

//require("ts-node/register");
require("custom-env").env(true);
const path = require("path");

import Configstore from "configstore";
export const configstore = new Configstore("ts-migrate", {
    settings: {
        migrationsPath: "./src/migrations",
        templatesPath: "./src/templates"
    },
    migrations: [],
}, {
    configPath: path.resolve(".", "ts-migrate.json")
});

// Command Line Processor ----------------------------------------------------

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

import CheckCommand from "./commands/CheckCommand";
import CreateCommand from "./commands/CreateCommand";
import DeleteCommand from "./commands/DeleteCommand";
import DownCommand from "./commands/DownCommand";
import ExecutedCommand from "./commands/ExecutedCommand";
import MigrationsCommand from "./commands/MigrationsCommand";
import PendingCommand from "./commands/PendingCommand";
import SettingsCommand from "./commands/SettingsCommand";
import TemplatesCommand from "./commands/TemplatesCommand";
import UpCommand from "./commands/UpCommand";

yargs(hideBin(process.argv))
    .command({
        command: "check <name>",
        describe: "Check whether the specified migration can be successfully compiled",
        handler: async (argv: any) => {
            await (new CheckCommand(argv)).execute();
        }
    })
    .command({
        command: "create <name>",
        describe: "Create a new migration with the specified name",
        handler: async (argv: any) => {
            await (new CreateCommand(argv)).execute();
        }
    })
    .command({
        command: "delete <name>",
        describe: "Delete an existing migration that has not been executed",
        handler: async (argv: any) => {
            await (new DeleteCommand(argv)).execute();
        }
    })
    .command({
        command: "down <name>",
        describe: "Execute down() on executed migrations down to, and including, the specified one",
        handler: async (argv: any) => {
            try {
                console.info(`down ${argv.name}: Before execute()`);
                const command = new DownCommand(argv);
                await command.execute();
                console.info(`down ${argv.name}: After execute()`);
            } catch (error) {
                console.info(`down ${argv.name}: error`, error);
            }
        }
    })
    .command({
        command: "executed",
        describe: "Report already executed migrations",
        handler: async (argv: any) => {
            await (new ExecutedCommand()).execute();
        }
    })
    .command({
        command: "migrations <directory>",
        describe: "Set project-relative directory for migrations",
        handler: async (argv: any) => {
            await (new MigrationsCommand(argv)).execute();
        },
    })
    .command({
        command: "pending",
        describe: "Report not yet executed migrations",
        handler: async (argv: any) => {
            await (new PendingCommand()).execute();
        }
    })
    .command({
        command: "settings",
        describe: "Report configuration settings",
        handler: async (argv: any) => {
            await (new SettingsCommand()).execute();
        },
    })
    .command({
        command: "templates <directory>",
        describe: "Set project-relative directory for templates",
        handler: async (argv: any) => {
            await (new TemplatesCommand(argv)).execute();
        },
    })
    .command({
        command: "up <name>",
        describe: "Execute up() on pending migrations up to, and including, the specified one",
        handler: async (argv: any) => {
            try {
                console.info(`up ${argv.name}: Before execute()`);
                const command = new UpCommand(argv);
                await command.execute();
                console.info(`up ${argv.name}: After execute()`);
            } catch (error) {
                console.info(`up ${argv.name} error:`, error);
            }
        }
    })
    .demandCommand()
    .option("template", {
        describe: "Template (for create command)",
        type: "string",
    })
    .wrap(80)
    .help()
    .argv;

// Private Methods -----------------------------------------------------------

