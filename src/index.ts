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

require("ts-node/register");
import Configstore from "configstore";
const path = require("path");
const packagePath = path.resolve(".");
const packageJson = require(path.resolve(packagePath, "package.json"));
require("custom-env").env(packagePath);
export const configstore = new Configstore(`${packageJson.name}/ts-migrate`);

// Database Connection Environment -------------------------------------------

// TODO - Figure out how we can await so we can use connection from ts-database,
// TODO - and do the connect() call so migrations do not have to.
const CONNECTION_URI = process.env.TS_MIGRATE_CONNECTION_URI
    ? process.env.TS_MIGRATE_CONNECTION_URI
    : "UNKNOWN";
import connection from "@craigmcc/ts-database-postgres";
const db = connection(CONNECTION_URI);

// Command Line Processor ----------------------------------------------------

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

import CreateCommand from "./commands/CreateCommand";
import DeleteCommand from "./commands/DeleteCommand";
import ExecutedCommand from "./commands/ExecutedCommand";
import MigrationsCommand from "./commands/MigrationsCommand";
import PendingCommand from "./commands/PendingCommand";
import SettingsCommand from "./commands/SettingsCommand";
import TemplatesCommand from "./commands/TemplatesCommand";

yargs(hideBin(process.argv))
    .command({
        command: "create <name>",
        describe: "Create a new migration with the specified name (must include extension)",
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
    .demandCommand()
    .option("template", {
//        default: "ts-database",
        describe: "Template (for create command)",
        type: "string",
    })
    .wrap(80)
    .help()
    .argv;

// Private Methods -----------------------------------------------------------

