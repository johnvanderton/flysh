import { FlyshException } from "../exception/FlyshException";
import { DomElement } from "./DomElement";

/**
 * 'NavPane' ('Paginator') class model
 */
export class NavPane extends DomElement {

    /**
     * Public class constants
     */
    public static readonly EXCEPTION_ID_5100000100_MESSAGE_VALUE = "A 'Paginator' must have a filter selector value, i.e : 'table tr td'";
    public static readonly EXCEPTION_ID_5100000200_MESSAGE_VALUE = "A 'Paginator' filter selector must have 2 elements at least";
    public static readonly EXCEPTION_ID_5100000300_MESSAGE_VALUE = "A 'Paginator' must have an attribute, i.e : 'href'";
 
    /**
     * Private class constants
     */
    private static readonly DOM_ELEMENT_PRIMITIVE_IDENTIFICATION_NAME_VALUE = "navpane"
    private static readonly DOM_VALIDATION_FILTER_SELECTOR_MIN_PARAMETERS_VALUE = 2;

    /**
     * Class properties
     */
    private _attribute : string;
    private _filterselectorsignature : string;

    /**
     * Constructor
     * 
     * @param fsignature Defines the filter signature
     * @param attribute Contains the attribute (i.e : 'href')
     */
    constructor(fsignature: string, attribute: string) {
        super(NavPane.DOM_ELEMENT_PRIMITIVE_IDENTIFICATION_NAME_VALUE,'');
        this._filterselectorsignature = fsignature;
        this._attribute = attribute;
    }

    /**
     * Getter 'attribute' property string
     * 
     * @returns Returns the '_attribute' class property
     */
    get attribute() {
        return this._attribute;
    }

    /**
     * Get the object properties (overridden) 
     * 
     * @returns Returns a 'string' that contains all the class properties
     */
    get getEntry() {
        return  super.getEntry +
                "Filter Selector Signature : " + this._filterselectorsignature + "\n" + 
                "Attribute : " + this._attribute + "\n" ;
    }

    /**
     * Getter 'filterSelectorSignature' property 'string'
     * 
     * @returns Returns the '_filterselectorsignature' class property
     */
    get getFilterSelectorSignature() {
        return this._filterselectorsignature;
    }

    /**
     * Validates the current class instance
     */
    public override validate(): void {
        if (this.getFilterSelectorSignature == '') 
            throw new FlyshException(5100000100, new Error, NavPane.EXCEPTION_ID_5100000100_MESSAGE_VALUE);
        if (this.getFilterSelectorSignature.split(" ").length < NavPane.DOM_VALIDATION_FILTER_SELECTOR_MIN_PARAMETERS_VALUE)
            throw new FlyshException(5100000200, new Error, NavPane.EXCEPTION_ID_5100000200_MESSAGE_VALUE);
        if (this.attribute == '')
            throw new FlyshException(5100000300, new Error, NavPane.EXCEPTION_ID_5100000300_MESSAGE_VALUE);
    }
}