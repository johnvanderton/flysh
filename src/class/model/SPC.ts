import { FlyshException } from "../exception/FlyshException";
import { DomElement } from "./DomElement";
import { Sibling } from "./Sibling";

/**
 * 'SPC' class model
 * 
 * Handles the 'Scope', 'Parent' and 'Children' DOM objects. This element is direclty involved with the
 * 'Filter Selector' functionality. 
 *  
 * Contains : - A scope/parent filter selector signature
 *            - Children 'Sibling' elements
 *            - Fields record order
 *
 * TODO : Verifying annotations syntax in case of [] array ()
 *
 */
export class SPC extends DomElement {

    /**
     * Public class constants
     */
    public static readonly EXCEPTION_ID_5200000100_MESSAGE_VALUE = "Empty filter selector, i.e : 'table tr td'";
    public static readonly EXCEPTION_ID_5200000200_MESSAGE_VALUE = "A filter selector must have 2 elements at least";
    public static readonly EXCEPTION_ID_5200000300_MESSAGE_VALUE = "A previous similar field has already been added";
 
    /**
     * Private class constants
     */
    private static readonly DOM_ELEMENT_PRIMITIVE_IDENTIFICATION_NAME_VALUE = "spc"
    private readonly DOM_VALIDATION_FILTER_SELECTOR_MIN_PARAMETERS_VALUE = 2;
 
    /**
     * Class constants
     */
    private readonly NUMBER_ARGUMENTS_FILTER_SELECTOR_MAX_VALUE = 3;

    /**
     * Property that defines the full filter selector ('scope'/'parent'/'children')
     * 
     * NOTE : This property might be fully defined or not. If not full, this signature must be completed by the other '
     *        Sibling' element(s)
     *        
     */
    private _filterselectorsignature : string;

    /**
     * Contains all the children 'Sibling' (fields) class instances
     */
    private _siblings : Sibling[];

    /**
     * Constructor
     * 
     * @param filterselectorsignature 'String' that contains the filter selector signature
     * @param siblings Array of 'Sibling' (field) instances that contains the current instance
     */
    constructor(filterselectorsignature : string, siblings: Sibling[]) {
        super(SPC.DOM_ELEMENT_PRIMITIVE_IDENTIFICATION_NAME_VALUE,'');
        this._filterselectorsignature = filterselectorsignature.trim();
        this._siblings = siblings;
    }

    /**
     * Getter field(s) array property
     * 
     * @returns Returns a 'String' that contains all the class properties
     */
    get getFields() : string[] {
        let _retVal : string[] =[];
        for (let sibling of this._siblings)
            _retVal.push(sibling.field);
        return _retVal;
    }

    /**
     * Getter '_filterSelectorSignature' string property
     * 
     * @returns Returns a 'String' that contains the '_filterselectorsignature' class property
     */
    get getFilterSelector() {
        return this._filterselectorsignature;
    }

    /**
     * Getter 'sibling(s)' array property
     * 
     * @returns Returns an array that contains all the children 'Sibling' (fields) class instances
     */
    get getSiblings() : Sibling[] {
        return this._siblings;
    }

    /**
     * List all the sibling(s)
     * 
     * @returns Returns a 'String' that contains all the 'Sibling' entrie(s)
     */
    get getListAllSiblingEntries() : string {
        let retVal = "";
        this._siblings.forEach((e) => {
            retVal += e.getEntry + "\n";
        });
        return retVal;
    }

    /**
     * Gets the object properties (overridden) 
     * 
     * @returns Returns a 'String' that contains the class filter selector with all the 'Sibling' entrie(s) (field(s))
     */
    get getEntry() {
        return  "Filter Selector : " + this._filterselectorsignature + "\n" +
                "Siblings: " + "\n\n" + this.getListAllSiblingEntries + "\n";
    }

    /**
     * Adds a 'Sibling' class instance and returns the current 'SPC' class itself [deprecated]
     * 
     * @deprecated this method is now deprecated, please use 'addField()' method instead
     * 
     * @param fieldName Contains the name of the field
     * @param tagName Defines the name of the tag (dom element)
     * @param className Has the name of the element class property (<x class=''></x>)
     * @param regEx Defines the regular expression following the field
     * @returns Returns the 'SPC' class instance itself
     */
    public addSibling(fieldName: string, tagName : string, className : string, regEx : string) : SPC {
        let newSib = new Sibling(fieldName, tagName, className, regEx);
        newSib.validate();
        this.validateSiblings(fieldName);
        this._siblings.push(newSib);
        return this;
    }

    /**
     * Adds a field ('Sibling') and returns the current 'SPC' class itself
     * 
     * Note : For the sake of good reading and interpretation, this function has been publicly renamed (cf. 'addSbling()')
     * 
     * @param fieldName Contains the name of the field
     * @param tagName Defines the name of the tag (dom element)
     * @param className Has the name of the element class property (<x class=''></x>)
     * @param regEx Defines the regular expression following the field [optional]
     * @returns Returns the 'field' ('SPC') class instance itself
     */
    public addField(fieldName: string, tagName : string, className : string, regEx ?: string) : SPC {
        let newField = new Sibling(fieldName, tagName, className, regEx);
        newField.validate();
        this.validateSiblings(fieldName);
        this._siblings.push(newField);
        return this;
    }
    
    /**
     * Verifies that the filter selector is 'full'. A 'true' value is returned if the filter selector is having 3 'SPC' members 
     * (Scope/Iterator, Parent and Child). Filter can't be more than 3 arguments
     */
    public hasFullFilter() : boolean {
        let _retVal = false;

        let splittedFilterLength = this._filterselectorsignature.split(" ", this.NUMBER_ARGUMENTS_FILTER_SELECTOR_MAX_VALUE);
        if (splittedFilterLength.length === this.NUMBER_ARGUMENTS_FILTER_SELECTOR_MAX_VALUE) _retVal = true;

        return _retVal;
    }

    /**
     * Validates the current 'DOM' element type
     */
    public override validate() : void {
        if (this.getFilterSelector == '') 
            throw new FlyshException(5200000100, new Error, SPC.EXCEPTION_ID_5200000100_MESSAGE_VALUE);
        if (this.getFilterSelector.split(" ").length < this.DOM_VALIDATION_FILTER_SELECTOR_MIN_PARAMETERS_VALUE)
            throw new FlyshException(5200000200, new Error, SPC.EXCEPTION_ID_5200000200_MESSAGE_VALUE);  
    }

    /**
     * Validates the 'Sibling' (field) stack content
     */
     private validateSiblings(sibFieldName: string) : void {
        for (let elem  of this._siblings)
            if (elem.field == sibFieldName) 
                throw new FlyshException(5200000300, new Error, SPC.EXCEPTION_ID_5200000300_MESSAGE_VALUE);
     }

}