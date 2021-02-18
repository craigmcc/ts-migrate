#!/usr/bin/env ts-node-script
// ts-migrate ----------------------------------------------------------------

// Typescript-based database migration tool.

// Public Type Declarations --------------------------------------------------

import Configstore from "configstore";

export {
    ConfigurationData,
    MigrationData,
    SettingsData,
} from "./types";

// External Modules ----------------------------------------------------------

require("ts-node/register");
import fs = require("fs");
const path = require("path");
const packagePath = path.resolve(".");
require("custom-env").env(packagePath);
const packageJson = require(path.resolve(packagePath, "package.json"));
export const configstore = new Configstore(`${packageJson.name}/ts-migrate`);

// Database Connection Environment -------------------------------------------

// TODO - Figure out how we can await so we can use connection from ts-database,
// TODO - and do the connect() call so migrations do not have to.
const CONNECTION_URI = process.env.TS_MIGRATE_CONNECTION_URI
    ? process.env.TS_MIGRATE_CONNECTION_URI
    : "UNKNOWN";
import connection from "@craigmcc/ts-database-postgres";
import SettingsCommand from "./commands/SettingsCommand";
const db = connection(CONNECTION_URI);

// Command Line Processor ----------------------------------------------------

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

yargs(hideBin(process.argv))
    .command({
        command: "migrations <directory>",
        describe: "Set project-relative directory for migrations",
        handler: async (argv: any) => {
            console.info(`TODO: migrations ${argv.directory}`);
        },
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
            console.info(`TODO: templates ${argv.directory}`);
        },
    })
    .demandCommand()
    .option("template", {
        default: "ts-database",
        describe: "Template (for create command)",
        type: "string",
    })
    .wrap(80)
    .help()
    .argv;

// Private Methods -----------------------------------------------------------

