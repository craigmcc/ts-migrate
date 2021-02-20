// CreateCommand -------------------------------------------------------------

// Create a new Migration file, optionally based on a specified template.
//
// Requirements for the Migration name:
// - Must be unique among all currently defined migrations.
// - Must include the extension (such as ".ts") for the desired file type.
//
// The generated file will be stored in the directory specified by the
// "settings.migrationsPath" configuration value, and in a filename of the form:
// "YYYYMMDD-HHMMSS-{name}" (which includes the file type extension.  The
// timestamp will be based on the date and time (local time zone) that the
// migration was created, and will be used to determine the order in which
// migrations should be processed by "up" and "down" commands.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AbstractMigrationCommand from "./AbstractMigrationCommand";
import * as templates from "../templates";
import { MigrationData } from "../types";

// Public Objects ------------------------------------------------------------

class CreateCommand extends AbstractMigrationCommand {

    constructor(argv: any) {
        super();
        this.name = argv.name;
        this.template = argv.template ? argv.template : "";
    }

    name: string;                   // Migration name
    template: string;               // Optional template name ("" means use default)

    public execute = async (): Promise<void> => {

        const configurationData = this.configuration;

        // Validate that the migration name has a valid extension
        const ext = this.name.substr(this.name.lastIndexOf("."));
        if (!ext.startsWith(".")) {
            throw new Error(`Migration '${this.name}' does not have a valid extension`);
        }

        // Validate that the proposed migration name is unique
        configurationData.migrations.forEach(migration => {
            if (this.name === migration.name) {
                throw new Error(`name: Migration '${this.name}' already exists`);
            }
        });

        // Retrieve the default or specified migration text
        const templateText: string = (this.template === "")
            ? this.defaultTemplate(this.name, ext)
            : this.readTemplate(configurationData.settings, this.template);

        // Create and register the new migration
        const migrationData: MigrationData =
            this.writeMigration(configurationData.settings, this.name, templateText);
        configurationData.migrations.push(migrationData);
        this.configuration = configurationData;
        console.info(JSON.stringify(migrationData));

    }

    /**
     * Return the default template for the specified extension.
     *
     * @param name                  Name of the migration to be created
     * @param ext                   Extension used to pick a default
     *
     * @returns default template text
     */
    private defaultTemplate = (name: string, ext: string): string => {
        switch (ext) {
            case ".js":
                return templates.JS_TEMPLATE(name);
            case ".ts":
                return templates.TS_TEMPLATE(name);
            default:
                throw new Error(`Migration '${name}' does not have a supported extension`);
        }
    }

}

export default CreateCommand;
