// DeleteCommand -------------------------------------------------------------

// Delete an existing Migration file, which must NOT be executed.  If you need
// to delete an executed Migration, execute "down" on it first.

// External Modules ----------------------------------------------------------

import fs from "fs";

// Internal Modules ----------------------------------------------------------

import AbstractMigrationCommand from "./AbstractMigrationCommand";
import { MigrationData } from "../types";

// Public Objects ------------------------------------------------------------

class DeleteCommand extends AbstractMigrationCommand {

    constructor(argv: any) {
        super();
        this.name = argv.name;
    }

    name: string;                   // Migration name

    public execute = async (): Promise<void> => {

        // Validate the specified migration name
        const configurationData = this.configuration;
        const selectedIndex = this.selectMigration(configurationData.migrations, this.name);
        if (selectedIndex < 0) {
            throw new Error(`name: Migration ${this.name}' does not exist`);
        }
        const migration = configurationData.migrations[selectedIndex];
        if (migration.executed) {
            throw new Error(`name: Migration '${this.name}' has been executed, run \"down\" on it first`);
        }

        // Remove the selected migration file, if it exists
        const pathname = this.toPathname(configurationData.settings, migration.filename);
        fs.rmSync(pathname, { force: true });

        // Update migration settings to omit the removed migration
        const remaining: MigrationData[] = [];
        configurationData.migrations.forEach((migration, index) => {
            if (index !== selectedIndex) {
                remaining.push(migration);
            }
        })
        configurationData.migrations = remaining;
        this.configuration = configurationData;
        console.info(JSON.stringify(migration));

    }

}

export default DeleteCommand;
