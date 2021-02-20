// templates -----------------------------------------------------------------

// Default migration templates for various file formats, to be extended
// as needed.  Any migration-specific information will need to be added
// separately.

// Template Constants --------------------------------------------------------

// Javascript
export const JS_TEMPLATE = (name: string): string => {
    return [
        `// Migration "${name}"`,
        "",
        "import { Connection } from \"@craigmcc/ts-database\";",
        "import { Migration, MigrationData } from \"@craigmcc/ts-migrate\";",
        "",
        "exports.down = async (data, context): Promise<void> => {",
        "    throw new Error(\"down() has not been implemented yet\");",
        "}",
        "",
        "exports.up = async (data, context): Promise<void> => {",
        "    throw new Error(\"down() has not been implemented yet\");",
        "}",
    ].join("\n");
}

// Typescript
export const TS_TEMPLATE = (name: string): string => {
    return [
        `// Migration "${name}"`,
        "",
        "import { Connection } from \"@craigmcc/ts-database\";",
        "import { Migration, MigrationData } from \"@craigmcc/ts-migrate\";",
        "",
        "exports.down = async (data: MigrationData, context: Connection): Promise<void> => {",
        "    throw new Error(\"down() has not been implemented yet\");",
        "}",
        "",
        "exports.up = async (data: MigrationData, context: Connection): Promise<void> => {",
        "    throw new Error(\"down() has not been implemented yet\");",
        "}",
    ].join("\n");
}
