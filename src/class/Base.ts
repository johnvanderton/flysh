import { ClassLoader } from "./helpers/ClassLoader";
import { Flysh } from "./Flysh";
import { SimpleClassLoader } from "./helpers/SimpleClassLoader";

/**
 * 'Base' Class Definition 
 */
export class Base {

    classLoader !: ClassLoader;
    simpleCL !: SimpleClassLoader;
    flysh !: Flysh;

    /**
     * Initialization
     */
    private init() {
        this.classLoader = new ClassLoader();
        this.simpleCL = new SimpleClassLoader();
    }

    /**
     * Launch the class loader and simple class loader
     */
    private launch() {
        this.classLoader.run();
        this.simpleCL.run();
    }

    /**
     * Run the class loader and simple class loader
     */
    public run() {
        this.init();
        this.launch();
    }

};