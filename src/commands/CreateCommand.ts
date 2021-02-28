// CreateCommand -------------------------------------------------------------

// Create a new Migration file, optionally based on a specified template.
//
// The migration name (which should not include an extension) must be unique
// among all currently defined migrations.
//
// The generated file will be stored in the directory specified by the
// "settings.migrationsPath" configuration value, and in a filename of the form:
// "YYYYMMDD-HHMMSS-{name}.{extension}".  The timestamp will be based on the
// date and time (local time zone) that the migration was created, and will
// be used to determine the order in which migrations should be processed
// by "up" and "down" commands.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AbstractMigrationCommand from "./AbstractMigrationCommand";
import { MigrationData } from "../types";
import {
    JS_CLASS_TEMPLATE,
    JS_OBJECT_TEMPLATE,
    TS_CLASS_TEMPLATE,
    TS_OBJECT_TEMPLATE
} from "../templates";

// Public Objects ------------------------------------------------------------

class CreateCommand extends AbstractMigrationCommand {

    constructor(argv: any) {
        super();
        this.name = argv.name;
        this.template = argv.template ? argv.template : "ts-class";
    }

    name: string;                   // Migration name
    template: string;               // Optional template name ("" means use default)

    public execute = async (): Promise<void> => {

        const configurationData = this.configuration;

        // Validate that the proposed migration name is unique
        configurationData.migrations.forEach(migration => {
            if (this.name === migration.name) {
                throw new Error(`name: Migration '${this.name}' already exists`);
            }
        });

        // Generate template text from either the specified default
        // template name (if there is a match) of from the specified
        // template file (which must include an extension).
        let ext: string = ".ts";
        let text: string = "";
        const defaultTemplate = defaultTemplates.get(this.template);
        if (defaultTemplate) {
            ext = defaultTemplate.extension;
            text = defaultTemplate.generator(this.name);
        } else {
            ext = this.template.substr(this.template.lastIndexOf("."));
            if (!ext.startsWith(".")) {
                throw new Error(`Template '${this.template}' does not have an extension`);
            }
            text = this.readTemplate(configurationData.settings, this.template);
        }

        // Register the new migration
        const migrationData: MigrationData =
            this.writeMigration
                (configurationData.settings, this.name, ext, text);
        configurationData.migrations.push(migrationData);
        this.configuration = configurationData;
        console.info(JSON.stringify(migrationData));

    }

}

// Private Objects -----------------------------------------------------------

/**
 * Generate and return the text for the requested default template, or "" if there
 * is no matching default template pattern.
 *
 * @param name                      Name of the migration to be created
 */
type TemplateGenerator = (name: string) => string;

interface DefaultTemplate {
    generator: TemplateGenerator;   // Generator function for this template
    extension: string;              // Extension (with leading ".") for the migration
}

const defaultTemplates = new Map<string, DefaultTemplate>();
defaultTemplates.set("js-class", { generator: JS_CLASS_TEMPLATE, extension: ".js"});
defaultTemplates.set("js-object", { generator: JS_OBJECT_TEMPLATE, extension: ".js"});
defaultTemplates.set("ts-class", { generator: TS_CLASS_TEMPLATE, extension: ".ts"});
defaultTemplates.set("ts-object", { generator: TS_OBJECT_TEMPLATE, extension: ".ts"});


export default CreateCommand;
