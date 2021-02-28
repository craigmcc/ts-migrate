// templates -----------------------------------------------------------------

// Default migration templates for various file formats, to be extended
// as needed.  Any migration-specific information will need to be added
// separately.

// Template Constants --------------------------------------------------------

// Javascript - Class Based Template
export const JS_CLASS_TEMPLATE = (name: string): string => {
    const className = toClassName(name);
    return [
        `class ${className} {`,
        "",
        "    async down(data, context) {",
        `        console.info("${className}.down() not yet implemented");`,
        "    }",
        "",
        "    async up(data, context) {",
        `        console.info("${className}.up() not yet implemented");`,
        "    }",
        "",
        "}",
    ].join("\n") + "\n";
}

// Javascript - Object Based Template
export const JS_OBJECT_TEMPLATE = (name: string): string => {
    const objectName = toClassName(name);
    return [
        "exports.down = async (data, context) => {",
        `        console.info("${objectName}.down() not yet implemented");`,
        "    }",
        "",
        "exports.up = async (data, context) => {",
        `        console.info("${objectName}.up() not yet implemented");`,
        "    }",
    ].join("\n") + "\n";
}

// Typescript - Class Based Template
export const TS_CLASS_TEMPLATE = (name: string): string => {
    const className = toClassName(name);
    return [
        "import { Connection } from \"@craigmcc/ts-database\";",
        "import { Migration, MigrationData } from \"@craigmcc/ts-migrate\";",
        "",
        `class ${className} extends Migration {`,
        "",
        "    constructor() {",
        "        super();",
        "    }",
        "",
        "    public async down(data: MigrationData, context: Connection): Promise<void> {",
        `        console.info("${className}.down() not yet implemented");`,
        "    }",
        "",
        "    public async up(data: MigrationData, context: Connection): Promise<void> {",
        `        console.info("${className}.up() not yet implemented");`,
        "    }",
        "",
        "}",
        "",
        `export default ${className};`,
    ].join("\n") + "\n";
}

// Typescript - Object Based Template
export const TS_OBJECT_TEMPLATE = (name: string): string => {
    const objectName = toClassName(name);
    return [
        "import { Connection } from \"@craigmcc/ts-database\";",
        "import { MigrationData } from \"@craigmcc/ts-migrate\";",
        "",
        "exports.down = async (data: MigrationData, context: Connection): Promise<void> => {",
        `        console.info("${objectName}.down() not yet implemented");`,
        "    }",
        "",
        "exports.up = async (data: MigrationData, context: Connection): Promise<void> => {",
        `        console.info("${objectName}.up() not yet implemented");`,
        "    }",
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
