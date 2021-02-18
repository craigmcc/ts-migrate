// ExecutedCommand -----------------------------------------------------------

// Return a list of already executed migrations in JSON format.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AbstractCommand from "./AbstractCommand";

// Public Objects ------------------------------------------------------------

class ExecutedCommand extends AbstractCommand {

    constructor() {
        super();
    }

    public execute = async (): Promise<void> => {
        const configurationData = this.configuration;
        const matches =
            configurationData.migrations.filter(migration => migration.executed);
        let texts: string[] = [];
        matches.forEach(match => texts.push(JSON.stringify(match)));
        console.info(`[\n${texts.join(",\n")}]\n`);
    }

}

export default ExecutedCommand;
