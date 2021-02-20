// AbstractMigrationCommand --------------------------------------------------

// Abstract base class for ts-migrate command implementations that specifically
// deal with migration files.

// External Modules ----------------------------------------------------------

import * as fs from "fs";
import path from "path";

// Internal Modules ----------------------------------------------------------

import AbstractCommand from "./AbstractCommand";
import * as timestamps from "../timestamps";
import { MigrationData, SettingsData } from "../types";

// Public Objects ------------------------------------------------------------

abstract class AbstractMigrationCommand extends AbstractCommand {

    constructor() {
        super();
    }

    /**
     * Create the specified directory (with recursion) if it does not exist.
     *
     * @param pathname Project-relative or absolute pathname of the directory.
     *
     * @returns Resolved pathname of the specified directory
     */
    protected createDirectory(pathname: string): string {
        const resolved = path.resolve(pathname);
        try {
            fs.mkdirSync(resolved, {recursive: true});
        } catch (error) {
            // Ignore error if it already exists
        }
        return resolved;
    }

    /**
     * Read the text of the requested template.  Note that we do not try to
     * create the templates directory, presuming it will already exist.
     *
     * @param settingsData          Configuration settings
     * @param template              Name of the requested template
     *
     * @returns requested template text
     */
    protected readTemplate = (settingsData: SettingsData, template: string): string => {
        const pathname = path.resolve(settingsData.templatesPath, template);
        return fs.readFileSync(pathname, { encoding: "utf8" });
    }

    /**
     * Return the 0-relative index of the specified migration, or -1 if none.
     */
    protected selectMigration(migrationsData: MigrationData[], name: string): number {
        let result = -1;
        migrationsData.forEach((migration, index) => {
            if (migration.name === name) {
                result = index;
            }
        });
        return result;
    }

    /**
     * Return the directory-local filename for the specified migration name.
     *
     * @param settingsData          Configuration settings data
     * @param name                  Migration name to convert
     */
    protected toFilename(settingsData: SettingsData, name: string): string {
        return `${timestamps.nowDateTime()}-${name}`;
    }

    /**
     * Return the absolute pathname for the specified migration directory-local
     * filename.
     *
     * @param settingsData          Configuration settings data
     * @param filename              Directory-local filename of this migration
     */
    protected toPathname(settingsData: SettingsData, filename: string): string {
        return path.resolve(settingsData.migrationsPath, filename);
    }

    /**
     * Write the specified migration, creating the migrations directory if needed.
     *
     * @param settingsData          Configuration settings data
     * @param name                  Name of this migration
     * @param text                  Text of this migration
     *
     * @returns MigrationData for the newly created migration
     */
    protected writeMigration
        (settingsData: SettingsData, name: string, text: string): MigrationData
    {
        this.createDirectory(settingsData.migrationsPath);
        const migrationData: MigrationData = {
            executed: false,
            filename: this.toFilename(settingsData, name),
            name: name
        }
        const pathname = this.toPathname(settingsData, migrationData.filename);
        fs.writeFileSync(pathname, text, { encoding: "utf8" });
        return migrationData;
    }

}

export default AbstractMigrationCommand;
