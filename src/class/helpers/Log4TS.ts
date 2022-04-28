import { appendFileSync }  from "fs";
import { ILogObject, Logger } from "tslog";

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
     * Synchronously appends data to a file, creating the file if it does not exist
     * 
     * @param logObject 
     */
    private logToTransport(logObject: ILogObject) {
        appendFileSync(Log4TS.LOGFILE_PATH_VALUE+Log4TS.LOGFILE_NAME_VALUE, JSON.stringify(logObject) + "\n");
    }

    /**
     * Initialization
     */
    private init() {
        //read from 'ConfigReader' the log files to create (dev/prod)
        this.log.attachTransport({
              silly: this.logToTransport,
              debug: this.logToTransport,
              trace: this.logToTransport,
              info: this.logToTransport,
              warn: this.logToTransport,
              error: this.logToTransport,
              fatal: this.logToTransport,
            },
            "debug"
          );
    }
}