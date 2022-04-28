import { ClassLoader } from "./helpers/ClassLoader";
import { ConfigReader } from "./helpers/ConfigReader";
import { Flysh } from "./Flysh";
import { Log4TS } from "./helpers/Log4TS";
import { SimpleClassLoader } from "./helpers/SimpleClassLoader";

/**
* 'Base' class
*/
export class Base {

    classLoader !: ClassLoader;
    simpleCL !: SimpleClassLoader;
    creader !: ConfigReader;
    flysh !: Flysh;
    logger !: Log4TS; 

    /**
     * Initialization
     */
    private init() {
        this.classLoader = new ClassLoader();
        this.simpleCL = new SimpleClassLoader();
        this.creader = new ConfigReader();
        this.logger = new Log4TS();
        //this.logger.log.info("initialization...");
    }

    /**
     * Launch
     */
    private launch() {
        this.classLoader.run();
        this.simpleCL.run();
        //this.logger.log.info("launching...");
    }

    /**
     * Running
     */
    public run() {
        this.init();
        this.launch();
    }

};