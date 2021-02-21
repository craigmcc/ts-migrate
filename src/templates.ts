// templates -----------------------------------------------------------------

// Default migration templates for various file formats, to be extended
// as needed.  Any migration-specific information will need to be added
// separately.

// Template Constants --------------------------------------------------------

// Javascript
export const JS_TEMPLATE = (name: string): string => {
    const className = toClassName(name);
    return [
        "import { Connection } from \"@craigmcc/ts-database\";",
        "import { Migration, MigrationData } from \"@craigmcc/ts-migrate\";",
        "",
        `class ${className} extends Migration {`,
        "",
        "    async down(data, context) {",
        "        throw new Error(\"down() not yet implemented\");",
        "    }",
        "",
        "    async up(data, context) {",
        "        throw new Error(\"up() not yet implemented\");",
        "    }",
        "",
        "}",
        "",
        `export default ${className};`,
    ].join("\n") + "\n";
}

// Typescript
export const TS_TEMPLATE = (name: string): string => {
    const className = toClassName(name);
    return [
        "import { Connection } from \"@craigmcc/ts-database\";",
        "import { Migration, MigrationData } from \"@craigmcc/ts-migrate\";",
        "",
        `class ${className} extends Migration {`,
        "",
        "    public async down(data: MigrationData, context: Connection): Promise<void> {",
        "        throw new Error(\"down() not yet implemented\");",
        "    }",
        "",
        "    public async up(data: MigrationData, context: Connection): Promise<void> {",
        "        throw new Error(\"up() not yet implemented\");",
        "    }",
        "",
        "}",
        "",
        `export default ${className};`,
    ].join("\n") + "\n";
}

const toClassName = (name: string): string => {
    const extIndex = name.lastIndexOf(".");
    const baseName = (extIndex >= 0)
        ? name.substr(0, extIndex)
        : name;
    const segments = baseName.split("-");  // TODO - regexp with other choices?
    segments.forEach((segment, index) => {
        segments[index] = segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    return segments.join("");
}
