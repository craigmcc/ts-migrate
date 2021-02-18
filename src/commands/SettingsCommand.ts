// SettingsCommand -----------------------------------------------------------

// Return the currently configured settings for this project in JSON format.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AbstractCommand from "./AbstractCommand";

// Public Objects ------------------------------------------------------------

class SettingsCommand extends AbstractCommand {

    constructor() {
        super();
    }

    public execute = async (): Promise<void> => {
        const configurationData = this.configuration;
        console.info(JSON.stringify(configurationData.settings, null, 2));
    }

}

export default SettingsCommand;
