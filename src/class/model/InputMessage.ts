import { Expose, Type } from 'class-transformer';
import { FlyshException } from './FlyshException';

import "reflect-metadata";

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
     * Concatenates the '_element' with the '_signature'. 
     * If no '_signature' found then the 'element is only returned 
     * 
     * @returns Returns a 'string' that contains the 'element' with or without a signature
     */
    @Expose()
    get getElementWithSignature() {
        if (this._signature === '') return this._element;
        else return this._element + '.' + this._signature;
    }

    /**
     * Gets the object properties (overridden)
     *
     * @retuns Returns a 'string' that contains all the class properties 
     */
    @Expose()
    get getEntry() {
        return  "Element : " + this._element + "\n" + 
                "Signature : " + this._signature + "\n";
    }

    /**
     * Validates the current 'DOM' type element (overridden)
     */
    @Expose()
    public validate() : void {
    }
}

/**
 * 'Sibling' class model 
 */
 export class Sibling extends DomElement {

    /**
     * Public class constants
     */
    public static readonly EXCEPTION_ID_5300000100_MESSAGE_VALUE = "A 'Sibling' class instance must have a field name";

    /**
     * Class properties
     */
    private _field : string;
    private _regex : string;

    /**
     * Constructor
     * 
     * @param field 'String' that contains the sibling's field  
     * @param element 'String' that contains the element or 'tag'
     * @param signature 'String' that contains the signature of the element
     * @param regex 'String' that contains the regular expression
     */
    constructor(field: string, element: string, signature: string, regex: string) {
        super(element,signature);
        this._field = field;
        this._regex = regex;
    }

    /**
     * Getter 'field' string property
     * 
     * @returns Returns the '_field' class property
     */
    @Expose()
    get field() {
        return this._field;
    }

    /**
     * Getter 'regex' string property
     * 
     * @returns Returns the '_regex' class property
     */
    @Expose()
    get regex() {
        return this._regex;
    }

    /**
     * Get the object properties (overridden)
     * 
     * @returns Returns a 'String' with all the class properties 
     */
    @Expose()
    get getEntry() {
        return super.getEntry +
                "Regex : " + this._regex + "\n" + 
                "Field : " + this._field + "\n";
    } 

    /**
     * Validates the current 'DOM' element type
     */
    @Expose()
    public override validate(): void {
        if (this.field == '') 
            throw new FlyshException(5300000100, new Error, Sibling.EXCEPTION_ID_5300000100_MESSAGE_VALUE);
    }
}

/**
 * 'SPC' class model
 * 
 * Handles the 'Scope', 'Parent' and 'Children' DOM objects.
 *  
 * Contains : - A scope/parent filter selector signature
 *            - Children 'Sibling' elements
 *            - Fields record order
 *
 * TODO : Verifying annotations syntax in case of [] array
 *
 */
export class SPC extends DomElement {

    /**
     * Public class constants
     */
    public static readonly EXCEPTION_ID_5200000100_MESSAGE_VALUE = "A 'SPC' class instance must have a filter selector value, i.e : 'table tr td'";
    public static readonly EXCEPTION_ID_5200000200_MESSAGE_VALUE = "A 'SPC' class instance filter selector must have 2 elements at least";
    public static readonly EXCEPTION_ID_5200000300_MESSAGE_VALUE = "A 'Sibling' class instance is already having the same field";
 
    /**
     * Private class constants
     */
    private readonly DOM_VALIDATION_FILTER_SELECTOR_MIN_PARAMETERS_VALUE = 2;
 
    /**
     * Class constants
     */
    private readonly NUMBER_ARGUMENTS_FILTER_SELECTOR_MAX_VALUE = 3;

    /**
     * Property that defines the full filter selector ('scope'/'parent'/'children')
     * 
     * NOTE : This property might be fully defined or not.
     *        If not full, this signature must be completed by the other 'Sibling' element(s)
     *        
     */
    @Type(() => String)
    private _filterselectorsignature : string;

    /**
     * Contains all the children 'Sibling' class instances
     */
    @Type(() => Sibling)
    private _siblings : Sibling[];

    /**
     * Constructor
     * 
     * @param filterselectorsignature 'String' that contains the filter selector signature
     * @param siblings Array of 'Sibling' instances that contains the current instance
     */
    constructor(filterselectorsignature : string, siblings: Sibling[]) {
        super('','');
        this._filterselectorsignature = filterselectorsignature.trim();
        this._siblings = siblings;
    }

    /**
     * Getter field(s) array property
     * 
     * @returns Returns a 'String' that contains all the class properties
     */
    @Expose()
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
    @Expose()
    get getFilterSelector() {
        return this._filterselectorsignature;
    }

    /**
     * Getter 'sibling(s)' array property
     * 
     * @returns Returns a 'String' that contains the '_siblings' class property
     */
    @Expose()
    get getSiblings() : Sibling[] {
        return this._siblings;
    }

    /**
     * List all the sibling(s)
     * 
     * @returns Returns a 'String' that contains all the 'Sibling' entrie(s)
     */
    @Expose()
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
     * @returns Returns a 'String' that contains the class filter selector with all the 'Sibling' entrie(s)
     */
    @Expose()
    get getEntry() {
        return  "Filter Selector : " + this._filterselectorsignature + "\n" +
                "Siblings: " + "\n\n" + this.getListAllSiblingEntries + "\n";
    }

    /**
     * Adds a 'Sibling' class instance and returns the current 'SPC' class itself
     * 
     * @param fieldName Contains the name of the field
     * @param tagName Defines the name of the tag (dom element)
     * @param className Has the name of the element class property (<x class=''></x>)
     * @param regEx Defines the regular expression following the field
     * @returns Returns the 'SPC' class instance itself
     */
    @Expose()
    public addSibling(fieldName: string, tagName : string, className : string, regEx : string) : SPC {
        let newSib = new Sibling(fieldName, tagName, className, regEx);
        newSib.validate();
        this.validateSiblings(fieldName);
        this._siblings.push(newSib);
        return this;
    }

    /**
     * Verifies that the filter selector is 'full'. A 'true' value is returned if the filter is having 3 'SPC' members 
     * (Scope/Iterator, Parent and Child). Filter can't be more than 3 arguments
     *
     */
    @Expose()
    public hasFullFilter() : boolean {
        let _retVal = false;

        let splittedFilterLength = this._filterselectorsignature.split(" ", this.NUMBER_ARGUMENTS_FILTER_SELECTOR_MAX_VALUE);
        if (splittedFilterLength.length === this.NUMBER_ARGUMENTS_FILTER_SELECTOR_MAX_VALUE) _retVal = true;

        return _retVal;
    }

    /**
     * Validates the current 'DOM' element type
     */
    @Expose()
    public override validate() : void {
        if (this.getFilterSelector == '') 
            throw new FlyshException(5200000100, new Error, SPC.EXCEPTION_ID_5200000100_MESSAGE_VALUE);
        if (this.getFilterSelector.split(" ").length < this.DOM_VALIDATION_FILTER_SELECTOR_MIN_PARAMETERS_VALUE)
            throw new FlyshException(5200000200, new Error, SPC.EXCEPTION_ID_5200000200_MESSAGE_VALUE);  
    }

    /**
     * Validates the 'Sibling' stack content
     */
     @Expose()
     private validateSiblings(sibFieldName: string) : void {
        for (let elem  of this._siblings)
            if (elem.field == sibFieldName) 
                throw new FlyshException(5200000300, new Error, SPC.EXCEPTION_ID_5200000300_MESSAGE_VALUE);
     }

}

/**
 * 'NavPane' class model
 */
export class NavPane extends DomElement {

    /**
     * Public class constants
     */
     public static readonly EXCEPTION_ID_5100000100_MESSAGE_VALUE = "A 'NavPane' class instance must have a filter selector value, i.e : 'table tr td'";
     public static readonly EXCEPTION_ID_5100000200_MESSAGE_VALUE = "A 'NavPane' class instance filter selector must have 2 elements at least";
     public static readonly EXCEPTION_ID_5100000300_MESSAGE_VALUE = "A 'NavPane' class instance must have an attribute, i.e : 'href'";
 
    /**
     * Private class constants
     */
     private readonly DOM_VALIDATION_FILTER_SELECTOR_MIN_PARAMETERS_VALUE = 2;

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
        super('','');
        this._filterselectorsignature = fsignature;
        this._attribute = attribute;
    }

    /**
     * Getter 'attribute' property string
     * 
     * @returns Returns the '_attribute' class property
     */
    @Expose()
    get attribute() {
        return this._attribute;
    }

    /**
     * Get the object properties (overridden) 
     * 
     * @returns Returns a 'string' that contains all the class properties
     */
    @Expose()
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
    @Expose()
    get getFilterSelectorSignature() {
        return this._filterselectorsignature;
    }

    /**
     * Validates the current class instance
     */
    @Expose()
    public override validate(): void {
        if (this.getFilterSelectorSignature == '') 
            throw new FlyshException(5100000100, new Error, NavPane.EXCEPTION_ID_5100000100_MESSAGE_VALUE);
        if (this.getFilterSelectorSignature.split(" ").length < this.DOM_VALIDATION_FILTER_SELECTOR_MIN_PARAMETERS_VALUE)
            throw new FlyshException(5100000200, new Error, NavPane.EXCEPTION_ID_5100000200_MESSAGE_VALUE);
        if (this.attribute == '')
            throw new FlyshException(5100000300, new Error, NavPane.EXCEPTION_ID_5100000300_MESSAGE_VALUE);
    }
}

/**
 * 'InputMessage' class model
 */
export class InputMessage {

    /**
    * Public class constants
    */
    public static readonly EXCEPTION_ID_6500001100_MESSAGE_VALUE = "Another 'SCP' class instance has the same filter selector";
    public static readonly EXCEPTION_ID_6500001200_MESSAGE_VALUE = "A 'NavPane' class instance has already been set";

    /**
     * Private class constants
     */
    private readonly ID_GENERATED_FLOOR_FUNC_COMPLEXITY_VALUE = 100000000000;
    private readonly DEFAULT_INSTANCE_TIMEOUT_VALUE = 1100;
    private readonly DOM_VALIDATION_NAVPANE_MIN_OCCURS_VALUE = 0;

    /**
     * Class properties
     */
    private _domain: string;
    @Type(()=> DomElement, {
        discriminator: {
            property: '__type',
            subTypes: [
              { value: NavPane, name: 'navpane' },
              { value: SPC, name: 'spc' }
            ],
          },
    })
    private _doms : DomElement[] | NavPane[] | SPC[] = new Array<DomElement>();
    private _fs : boolean = false;
    private _id : number = Math.floor(Math.random() * Math.floor(this.ID_GENERATED_FLOOR_FUNC_COMPLEXITY_VALUE));
    private _navpane : boolean = false;
    private _pagepath : string;
    private _timeout : number;

    /**
     * Constructor
     * 
     * @param domain Defines the 'URI' domain
     * @param pagepath Contains the 'URI' path 
     * @param fs Sets the filesystem or local file flag to 'true' or 'false'
     * @param timeout Optional parameter that defines the timeout value
     * 
     */
    constructor(domain : string, 
                pagepath : string, 
                fs : boolean,
                timeout ?: number
                ) {
        this._domain = domain;
        this._fs = fs;
        this._pagepath = pagepath;
        this._timeout = timeout || this.DEFAULT_INSTANCE_TIMEOUT_VALUE;
    }

    /**
     * Validates the content of the '_doms' class property
     * 
     *  - 'SPC' class instance, verifies that is no other instance(s) having the same 'filter selector'
     *  - 'NavPane' class instance, verifies that there is not more than one instance within the stack
     * 
     * @param Class Parameter that contains the class name to validate
     */
    @Expose()
    private domsValidate(Class : any) {
        switch (true) {
            case Class instanceof NavPane : {
                if (this.findDOMElement(NavPane).length > this.DOM_VALIDATION_NAVPANE_MIN_OCCURS_VALUE)
                    throw new FlyshException(6500001200, new Error, InputMessage.EXCEPTION_ID_6500001200_MESSAGE_VALUE);
                break;
            }
            case Class instanceof SPC : {
                for (let elem of this.findDOMElement(SPC))
                    if ((<SPC>elem).getFilterSelector == (<SPC>Class).getFilterSelector)
                        throw new FlyshException(6500001100, new Error, InputMessage.EXCEPTION_ID_6500001100_MESSAGE_VALUE);    
                break;
            }
        }
    }

    /**
     * Getter 'ID' number property
     * 
     * @return Returns the '_id' class property
     */
    @Expose()
    public get ID(): number {
        return this._id;
    }

    /**
     * Getter 'doms' array property
     * 
     * @return Returns the '_doms' class property
     */
    @Expose()
    get doms() {
        return this._doms;
    }

    /**
     * Getter 'hasNavpane' boolean property
     * 
     * @return Returns the '_navpane' class property
     */
    @Expose()
    public get hasNavpane() : boolean {
        return this._navpane;
    }

    /**
     * Getter 'domain' string property
     * 
     * @return Returns the '_domain' class property 
     */
    @Expose()
    public get domain() : string {
        return this._domain;
    }

    /**
     * Getter 'pagePath' string property
     * 
     * @return Returns the '_pagepath' class property
     */
    @Expose()
    public get pagepath() : string {
        return this._pagepath;
    }

    /**
     * Getter 'filesystem' boolean property
     * 
     * @return Returns the '_filesystem' class property
     */
    @Expose()
    public get filesystem() : boolean {
        return this._fs;
    }

    /**
     * Getter 'timeout' number property
     * 
     * @return Returns the current class timeout value
     */
    @Expose()
    public get timeout() : number {
        return this._timeout;
    }

    /**
     * Returns 'URI/URL' string properties ('_domain' + '_pagePath')
     * 
     * @return Returns the complete 'URI' ('_domain' + '_pagePath')
     */ 
    @Expose()
    public get URI() : string {
        return this._domain + this._pagepath; 
    }

    /**
     * Returns the 'DOM' element(s) list
     * 
     * @return Returns all the 'DOM' element(s) contained within the '_dom' class property
     */
    @Expose()
    get getDomsEntries() {
        let retVal = "";
        this._doms.forEach(e => {
            if (e instanceof NavPane) retVal += ((<NavPane>(e)).getEntry + '\n');
            if (e instanceof SPC) retVal += ((<SPC>(e)).getEntry + '\n');
        });
        return retVal;
    }

    /**
     * 'Stringify' the object properties
     * 
     * @return Returns a string that shows up all all the class properties
     */
    @Expose()
    get toString() {
        return  'ID : ' + this._id + '\n' + 
                'URI : ' + this.URI + '\n' + 
                'FS : ' + this._fs + '\n' +
                'NavPane : ' + this._navpane + '\n' +
                'TimeOut : ' + this._timeout + '\n' +
                'Doms : ' + '\n' + this.getDomsEntries;
    }

    /**
     * Set the '_navpane' property value
     * 
     * @param flag Contains the boolean value that sets the '_navpane' class property 
     */
    public set navPane(flag : boolean) { 
        this._navpane = flag;
    }

    /**
     * Returns the newly added 'NavPane' element
     * 
     * @param filterSelector Defines the 'NavPane' filter selector
     * @param attrib Contains the attrib(ute) of the element/tag (i.e : 'href')
     * @returns Returns the 'NavPane' class instance itself
     */
    public addNavPane(filterSelector : string, attrib : string) {
        let newNavPane = new NavPane(filterSelector, attrib);
        newNavPane.validate();
        this.domsValidate(newNavPane);
        this.navPane = true;
        return (<NavPane[]>this._doms).push(new NavPane(filterSelector, attrib));
    }

    /**
     * Returns the newly added 'SCP' element
     * 
     * TODO : (new SPC(filterSelector, new Array<Sibling>())).validate() : returns SPC (this)
     * TODO : creates an overridded push() func that includes the domsValidates() func 
     * 
     * @param filterselector Contains the current class filter selector 
     * @returns Returns the 'SPC' class instance itself
     */
    @Expose()
    public addSPC(filterSelector : string) : SPC {
        let newSPC = new SPC(filterSelector, new Array<Sibling>());
        newSPC.validate();
        this.domsValidate(newSPC);
        return (<SPC[]>this._doms)[(<SPC[]>this._doms).push(newSPC)-1];
    }

    /**
     * Returns all the inherited 'DOMElement' instance(s) from the '_doms' stack property that match the 'Class' parameter
     * 
     * NOTE : The returned value in case of 'navpane' should always be 1 element
     * 
     * @param Class Contains the class name to retrieve
     * @return Returns an array of 'DomElement' that contains the found occurrence(s) 
     */
    @Expose()
    public findDOMElement(Class : any) : DomElement [] {
            return this._doms.filter(e => e instanceof Class);
    }
}