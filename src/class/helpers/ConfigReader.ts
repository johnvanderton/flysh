/**
 * 'ConfigReader' class helper 
 * 
 * Read the settings found from configuration file
 *  
 * Note: 'ENV' variables might be overridden by 'properties.cnf' by 'launch.json', 'tasks.json' and command line (OS).
 */
export class ConfigReader {
    public readonly ENVIRONMENT_KEY_VAUE = 'NODE_ENV';
    public readonly CONFIG_FILE_PATH_VALUE = './properties.cnf';
    public readonly CONFIG_FILE_SECTION_DATABASE_NAME = 'database';
    public readonly CONFIG_FILE_SECTION_INSTANCE_NAME = 'instance';
    public readonly CONFIG_FILE_SECTION_MAIN_NAME = 'main';
    public readonly CONFIG_FILE_PROPERTIES_CURRENT_ENVIRONMENT_NAME = 'current.environment';

    propertiesReader = require('properties-reader');

    properties : any;
    environment : any;

    /**
     * Constructor
     */
    public constructor() {
        this.init();
    }

    /**
     * Loads the environment and configuration file to the class properties
     */
    private init() {
        this.properties =  this.propertiesReader(this.CONFIG_FILE_PATH_VALUE);
        this.environment = this.getENVMode();
    }

    /**
     * Sets the environment from configuration file then eventually overload it by the preseted 'NODE_ENV' value(s). 
     * This means that 'properties.cnf', 'launch.json' and 'tasks.json' will be overridden as well
     * 
     * @returns Returns the current mode environment
     */
    private getENVMode () {
        let retVal = this.properties.get(this.CONFIG_FILE_SECTION_MAIN_NAME+'.'+
                                         this.CONFIG_FILE_PROPERTIES_CURRENT_ENVIRONMENT_NAME);
        if (process.env[this.ENVIRONMENT_KEY_VAUE]) retVal = process.env[this.ENVIRONMENT_KEY_VAUE];
        return retVal;
    }

    /**
     * Returns the "section" from 'properties' class attribute (ENV)
     * 
     * @param section 'String' that contains the section to read
     * @returns Returns a 'map' value that contains the right section
     * @deprecated
     */
    public getPropSettings(section: string) {
        let retMap = new Map();
        this.properties.each((key: String, value: String) => {
            if (key.match(section+"."+this.environment)) 
                retMap.set(key.substring(key.lastIndexOf(".")+1,key.length), value);
        });
        return retMap;
    }

    /**
     * Returns the "section" from 'properties' class attribute
     * 
     * @param section 'String' that contains the "section" to read
     * @returns Returns a 'map' value that contains the right "section"
     */
    public getProperties(section: string) {
        let retMap = new Map();
        this.properties.each((key: String, value: String) => {
            if (key.match(section)) 
                retMap.set(key.substring(key.lastIndexOf(".")+1,key.length), value);
        });
        return retMap;
    }

};