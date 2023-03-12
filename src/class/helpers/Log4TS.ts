import { appendFileSync }  from "fs";
import { Logger } from "tslog";

/**
 *  'Log4TS' class helper
 * 
 *  Handles logging activities by using 'tslog' library
 * 
 *  TODO : Ask 'ConfigReader' to provide the logfile location, name, size ?
 *  TODO : Read log file name + path from property file instead
 */
export class Log4TS {

    private static readonly LOGFILE_PATH_VALUE = '.\\logs\\';//was public
    private static readonly LOGFILE_NAME_VALUE = 'flysh.log'//was public
    
    public log = new Logger();
    
    /**
     * Constructor
     */
    public constructor() {
        this.init();
    }

    /**
     * Initialization
     */
    private init() {
        //read from 'ConfigReader' the log files to create (dev/prod)
    }
}