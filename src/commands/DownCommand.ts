// DownCommand ---------------------------------------------------------------

// Perform a down() call on all executed migrations down to, and including, the
// named migration for this command.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AbstractModuleCommand from "./AbtractModuleCommand";

// Public Objects ------------------------------------------------------------

class DownCommand extends AbstractModuleCommand {

    constructor(argv: any) {
        super();
        this.name = argv.name;
    }

    name: string;                   // Migration name

    public execute = async (): Promise<void> => {
        console.info("DownCommand is not yet implemented");
    }

}

export default DownCommand;
