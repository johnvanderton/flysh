/**
 * 'DomElement' abstract class model
 * 
 * Defines the basic 'DOM' element properties and functions overridden by the extended subclasses
 * 
 */
export abstract class DomElement {

    /**
     * Class properties
     */
    protected _element : string = '';
    protected _signature : string = '';

    /**
     * Constructor
     * 
     * @param element 'String' that contains the 'DOM' element name or the HTML 'tag' name, i.e : '<div>'
     * @param signature 'String' that defines the 'DOM' element class property, i.e : '<div class="someClass">'
     */
    constructor(element : string, signature : string) {
        this._element = element;
        this._signature = signature;
    }

    /**
     * Getter that returns the `_element` property
     */
    get getElement() {
        return this._element;
    }

    /**
     * Getter that returns the `_signature` property
     */
    get getSignature() {
        return this._signature;
    }

    /**
     * Concatenates the '_element' with the '_signature'. If no '_signature' found then the '_element is only returned 
     * 
     * @returns Returns a 'string' that contains the '_element' with or without a signature
     */
    get getElementWithSignature() {
        if (this._signature === '') return this._element;
        else return this._element + '.' + this._signature;
    }

    /**
     * Gets the object properties (overridden)
     *
     * @retuns Returns a 'string' that contains all the class properties 
     */
    get getEntry() {
        return  "Element : " + this._element + "\n" + 
                "Signature : " + this._signature + "\n";
    }

    /**
     * Validates the current 'DOM' type element (overridden)
     */
    public validate() : void {
    }
}