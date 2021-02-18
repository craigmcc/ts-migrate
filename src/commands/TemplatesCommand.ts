// TemplatesCommand ----------------------------------------------------------

// Set the project-relative directory to contain templates.  Returns all
// settings in JSON format.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AbstractCommand from "./AbstractCommand";

// Public Objects ------------------------------------------------------------

class TemplatesCommand extends AbstractCommand {

    constructor(argv: any) {
        super();
        this.templatesPath = argv.directory;
    }

    templatesPath: string;         // New directory to contain templates

    public execute = async (): Promise<void> => {
        const configurationData = this.configuration;
        // TODO - validate new directory?  create it?
        configurationData.settings.templatesPath = this.templatesPath;
        this.configuration = configurationData;
        console.info(JSON.stringify(configurationData.settings, null, 2));
    }

}

export default TemplatesCommand;
