/**
 * 'FlyshException' class model
 * 
 * This class is instanciated and thrown in case of error. Inherits from the native TypeScript framework 'Error' class
 * 
 */
export class FlyshException extends Error {

    /**
     * Class constants
     */
    private readonly CLASS_INSTANCE_NAME_VALUE = 'FlyshException';
    private readonly CLASS_INSTANCE_LINKED_FLYSH_INSTANCE_ID_VALUE = -1;

    /**
     * Class properties
     */
    private _error_id : number;
    private _instance_id : number | undefined = this.CLASS_INSTANCE_LINKED_FLYSH_INSTANCE_ID_VALUE;
    private _name : string = this.CLASS_INSTANCE_NAME_VALUE;

    /**
     * Constructor
     * 
     * @param errorID Refers to the exception ID value
     * @param err 'Error' type message
     * @param message Internal 'error' message 
     * @param instanceID Linked 'Flysh' instance ID
     */
    constructor(public errorID : number, err : Error, message : string, instanceID ?: number) {
        super(err.message);
        this._error_id = errorID;
        this._instance_id = instanceID;
        this.message = message + "\n" + "Cause : " + this.message;
    }

    /**
     * Getter 'errorIDNumber'
     * 
     * @returns Returns a 'string' that constains the '_error_id' class property
     */
    public get errorIDNumber() : number {
        return this._error_id;
    }

    /**
     * Getter 'instanceID'
     * 
     * @returns Returns a 'string' that contains the '_instance_ID' number class property or 'undefined'
     */
    public get instanceID() : number | undefined {
        return this._instance_id;
    }

    /**
     * Getter 'name'
     * 
     * @returns Returns a 'string' that contains the '_name' class property
     */
    public get name() : string {
        return this._name;
    }

    /**
    * Overrides 'toString()' used by the inherited 'stack' function 
    * 
    * @returns Returns a 'string' that displays all the class instance's properties
    */
     public toString = () : string => {
        return 'Exception ID: ' + this._error_id + ' (Flysh ID: ' + this._instance_id + ')' + '\n' + 'Stack : ' + (<string>this.stack); 
    }

}