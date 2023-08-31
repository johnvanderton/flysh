import { DomElement } from "./DomElement";
import { FlyshException } from "../exception/FlyshException";

/**
 * 'Sibling' class model (Also qualified as 'field')
 */
export class Sibling extends DomElement {

    /**
     * Public class constants
     */
    public static readonly EXCEPTION_ID_5300000100_MESSAGE_VALUE = "A field name must be defined";

    /**
     * Class properties
     */
    private _field : string;
    private _regex : string | undefined;

    /**
     * Constructor
     * 
     * @param field 'String' that contains the sibling's field  
     * @param element 'String' that contains the element or 'tag'
     * @param signature 'String' that contains the signature of the element
     * @param regex 'String' | 'undefined' that contains the regular expression, optional.
     */
    constructor(field: string, element: string, signature: string, regex: string | undefined) {
        super(element,signature);
        this._field = field;
        this._regex = regex;
    }

    /**
     * Getter 'field' string property
     * 
     * @returns Returns the '_field' class property
     */
    get field() {
        return this._field;
    }

    /**
     * Getter 'regex' string property
     * 
     * @returns Returns the '_regex' class property
     */
    get regex() {
        return this._regex;
    }

    /**
     * Get the object properties (overridden)
     * 
     * @returns Returns a 'String' with all the class properties 
     */
    get getEntry() {
        return super.getEntry +
                "Regex : " + this._regex + "\n" + 
                "Field : " + this._field + "\n";
    } 

    /**
     * Validates the current 'DOM' element type
     */
    public override validate(): void {
        if (this.field == '') 
            throw new FlyshException(5300000100, new Error, Sibling.EXCEPTION_ID_5300000100_MESSAGE_VALUE);
    }

}