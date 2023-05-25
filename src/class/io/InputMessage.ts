import { Expose, Type } from 'class-transformer';
import { FlyshException } from '../exception/FlyshException';
import { DomElement } from '../model/DomElement';
import { NavPane } from '../model/NavPane'; 
import { Sibling } from '../model/Sibling';
import { SPC } from '../model/SPC';

import "reflect-metadata";

/**
 * 'InputMessage' class model
 */
export class InputMessage {

    /**
    * Public class constants
    */
    public static readonly EXCEPTION_ID_6500001100_MESSAGE_VALUE = "Another filter selector object has the same signature";
    public static readonly EXCEPTION_ID_6500001200_MESSAGE_VALUE = "A 'Paginator' has already been set";
    public static readonly EXCEPTION_ID_6500005100_MESSAGE_VALUE = "Invalid domain value";

    /**
     * Private class constants
     */
    private readonly DEFAULT_INSTANCE_TIMEOUT_VALUE = 1500;
    private readonly DOM_VALIDATION_NAVPANE_MIN_OCCURS_VALUE = 0;
    private readonly ID_GENERATED_FLOOR_FUNC_COMPLEXITY_VALUE = 100000000000;
    private readonly REGEX_FS_URI_VALIDATION_VALUE = /^(www|http:|https:)+[^\s]+[\w]$/;

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
    private _fs : boolean = true;
    private _id : number;
    private _navpane : boolean = false;
    private _pagepath : string;
    private _timeout : number;

    /**
     * Constructor
     * 
     * @param domain Defines the 'URI' domain
     * @param pagepath Contains the 'URI' path 
     * @param timeout Optional parameter that defines the timeout value
     * 
     */
    constructor(domain : string, 
                pagepath : string, 
                timeout ?: number
                ) {
        this._domain = this._domainValidator(domain);
        this._id = Math.floor(Math.random() * Math.floor(this.ID_GENERATED_FLOOR_FUNC_COMPLEXITY_VALUE));
        this._pagepath = pagepath;
        this._timeout = timeout || this.DEFAULT_INSTANCE_TIMEOUT_VALUE;
    }
 
    /**
     * Validates if the domain is only locally based (filesytem) or from the network. If the domain is under an URL format 
     * then the private filesystem property is set to 'false'
     * 
     * @param domain Input 'string' parameter that contains the domain value
     * @returns A 'string' formatted value that contains the passed parameter
     */
    private _domainValidator(domain : string) : string {
        let _retVal = domain;

        // Evaluates if the domain/path is empty
        if ((domain.length === 0))
            throw new FlyshException(6500005100, new TypeError(), InputMessage.EXCEPTION_ID_6500005100_MESSAGE_VALUE);
        
        // Evaluates if the domain is a well formatted URL
        let regEx = new RegExp(this.REGEX_FS_URI_VALIDATION_VALUE);
        if (domain.match(regEx) !== null) this._fs = false;

        return _retVal;
    }

    /**
     * Validates the content of the '_doms' class property
     * 
     *  - 'SPC' class instance, verifies that is no other instance(s) having the same 'filter selector'
     *  - 'NavPane' ('Paginator') class instance, verifies that there is not more than one instance within the stack
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
     * Getter 'hasNavpane' ('Paginator') boolean property
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
     * Returns the newly added 'NavPane' element [deprecated]
     * 
     * @deprecated this method is now deprecated, please use 'addPaginator()' method instead
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
     * Adds a Paginator and returns the newly added 'NavPane' element
     * 
     * Note : For the sake of good reading and interpretation, this function has been publicly renamed ('addNavPane()')
     * 
     * @param filterSelector Defines the 'Paginator' filter selector
     * @param attrib Contains the attrib(ute) of the element/tag (i.e : 'href')
     * @returns Returns the 'Paginator' ('NavPane') class instance itself
     */
    public addPaginator(filterSelector : string, attrib : string) {
        let newPaginator = new NavPane(filterSelector, attrib);
        newPaginator.validate();
        this.domsValidate(newPaginator);
        this.navPane = true;
        return (<NavPane[]>this._doms).push(new NavPane(filterSelector, attrib));
    }

    /**
     * Returns the newly added 'SPC' type element [deprecated]
     * 
     * TODO : (new SPC(filterSelector, new Array<Sibling>())).validate() : returns SPC (this)
     *
     * @deprecated this method is now deprecated, please use 'addFilterSelector()' method instead 
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
     * Returns the newly added Filter Selector ('SPC' type element)
     * 
     * Note : For the sake of good reading and interpretation, this function has been publicly renamed ('addSPC()')
     * 
     * TODO : Implement validate() as (new SPC(filterSelector, new Array<Sibling>())).validate() : returns SPC (this)
     * 
     * @param filterselector Contains the current class filter selector 
     * @returns Returns the 'Filter Selector' ('SPC') class instance itself
     */
    @Expose()
    public addFilterSelector(filterSelector : string) : SPC {
        let newFilterSelector = new SPC(filterSelector, new Array<Sibling>());
        newFilterSelector.validate();
        this.domsValidate(newFilterSelector);
        return (<SPC[]>this._doms)[(<SPC[]>this._doms).push(newFilterSelector)-1];
    }

    /**
     * Returns all the inherited 'DOMElement' instance(s) from the '_doms' stack property that match the 'Class' parameter
     * 
     * NOTE : The returned value in case of 'navpane'/'paginator' should always be 1 element
     * 
     * @param Class Contains the class name to retrieve
     * @return Returns an array of 'DomElement' that contains the found occurrence(s) 
     */
    @Expose()
    public findDOMElement(Class : any) : DomElement [] {
            return this._doms.filter(e => e instanceof Class);
    }
}