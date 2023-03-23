import { DomElement, InputMessage, NavPane, SPC } from "./model/InputMessage";
import { FlyshException } from "./model/FlyshException";
import { OutputMessage, PageRecords } from "./model/OutputMessage";

const jquery = require("jquery");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

/**
 * Flysh class
 */
export class Flysh  {

    /**
     * Constants
     */
    private readonly CORE_PARSER_FILTER_SELECTOR_SPLITTER_CHILD_POSITION_VALUE = 2;
    private readonly CORE_PARSER_FILTER_SELECTOR_SPLITTER_PARENT_POSITION_VALUE = 1;
    private readonly CORE_PARSER_FILTER_SELECTOR_SPLITTER_SCOPE_POSITION_VALUE = 0;
    private readonly CORE_PARSER_FILTER_SELECTOR_SPLITTED_CHILD_TAG_POSITION_VALUE = 0;
    private readonly CORE_PARSER_FILTER_SELECTOR_SPLITTER_SIZE_VALUE = 3;
    private readonly CORE_PARSER_QUERY_SELECTOR_ALL_NO_MATCH_RESULT_VALUE = 0; 
    private readonly DEFAULT_INSTANCE_JSDOM_OPTIONS_RESSOURCELOADER_PROXY_VALUE = '';
    private readonly DEFAULT_INSTANCE_JSDOM_OPTIONS_RESSOURCELOADER_STRICT_SSL_VALUE = false;
    private readonly DEFAULT_INSTANCE_JSDOM_OPTIONS_RESSOURCELOADER_USER_AGENT_VALUE = 'powered by Flysh Lib!';
    private readonly DEFAULT_INSTANCE_JSDOM_OPTIONS_RUNSCRIPTS_VALUE = 'outside-only';
    private readonly HARVEST_NAVPANE_DOM_STACK_FIRST_OCCURENCE_VALUE = 0;
    private readonly MATRIX_MAPPER_LENGTH_INDEX_VALUE = 0;
    private readonly MFAM_DOM_SCP_MERGING_BUFF_REC_MIN_VALUE = 0;
    private readonly MFAM_DOM_SCP_MIN_OCCURENCE_VALUE = 1;
    private readonly OUTPUTMESSAGE_DEFAULT_ID_INSTANCE_VALUE = -1;
    private readonly OUTPUTMESSAGE_DEFAULT_URI_VALUE = '';
    private readonly PAGERECORD_MERGER_FIRST_OCCURENCE_INDEX_VALUE = 0;
    private readonly PAGERECORD_MERGER_FOUND_ERROR_FLAG_VALUE = true;
    private readonly PAGERECORD_MAPPER_UNDEFINED_FIELD_NUMBER_VALUE = 0;
    private readonly PAGERECORD_MAPPER_UNDEFINED_FIELD_SWAP_VALUE = 1;
    private readonly PAGERECORD_DEFAULT_ERROR_FLAG_VALUE = false;
    private readonly PAGERECORD_ERROR_STATE_FLAG_VALUE = true;
    private readonly PRCLEANER_REGEXP_EXEC_ARRAY_RESULT_INDEX_VALUE = 0;
    private readonly VALIDATION_MINIMUM_SPC_DOMELEMENT_VALUE = 1;
    private readonly VALIDATION_MINIMUM_TIMEOUT_VALUE = 0;

    /**
     * Constants, exception codes
     */
    private readonly EXCEPTION_ID_1500001200_MESSAGE_VALUE = "No any filter selector found";
    private readonly EXCEPTION_ID_1500001300_MESSAGE_VALUE = "No any 'Paginator' found";
    private readonly EXCEPTION_ID_1500001400_MESSAGE_VALUE = "Timeout value cannot be negative";
    private readonly EXCEPTION_ID_1500003100_MESSAGE_VALUE = "Exception occurred during process";
    private readonly EXCEPTION_ID_2000000000_MESSAGE_VALUE = "Request(s) timed out";

    /**
     * Class properties
     */
    private domain : string;
    private done : boolean = false;
    private hasnavpane : boolean = false;
    private filesystem : boolean = true; 
    private id : number;
    private mfpagerecordsbuffer : PageRecords[] = [];
    private navmap : string[] = [];
    private navmapupdated : boolean = false;
    private navpane : DomElement[] = [];
    private outputmessage : OutputMessage;
    private spc : DomElement[] = [];
    private timeout : number;
    private URI : string;
    
    /**
     * JSDOM options (RessourceLoader)
     */
     private resourceLoader = new jsdom.ResourceLoader({
        proxy : this.DEFAULT_INSTANCE_JSDOM_OPTIONS_RESSOURCELOADER_STRICT_SSL_VALUE, 
        strictSSL : this.DEFAULT_INSTANCE_JSDOM_OPTIONS_RESSOURCELOADER_PROXY_VALUE,
        userAgent : this.DEFAULT_INSTANCE_JSDOM_OPTIONS_RESSOURCELOADER_USER_AGENT_VALUE
     });

    /**
     * JSDOM options
     * 
     * Note: Behavior should be different either by using 'fromFile()' and 'fromURL()' methods
     */
    private readonly JSDOMOptions = {
        resources : this.resourceLoader,
        runScripts : this.DEFAULT_INSTANCE_JSDOM_OPTIONS_RUNSCRIPTS_VALUE,
        //url:"",
        //storageQuota: 10000000,
        //referrer : '',
        //contentType : "text/html",
        //includeNodeLocations : true
    };

    /**
     * Constructor
     * 
     * @param config Contains the preseted input message 'InputMessage' class instance
     */
    public constructor(config : InputMessage) {
        this.domain = config.domain;
        this.filesystem = config.filesystem;
        this.hasnavpane = config.hasNavpane;
        this.id = config.ID;
        this.navpane = config.findDOMElement(NavPane);
        this.outputmessage = new OutputMessage(this.OUTPUTMESSAGE_DEFAULT_ID_INSTANCE_VALUE, this.OUTPUTMESSAGE_DEFAULT_URI_VALUE);
        this.spc = config.findDOMElement(SPC);
        this.timeout = config.timeout;
        this.URI = config.URI; 
    }

    /**
     * Returns collected records from post-process
     * 
     * @returns Returns the output message 'OutputMessage' class instance
     */
    public getOutputMessage() {
        return this.outputmessage;
    }

    /**
     * Returns 'true' if the instance has finished his run
     * 
     * @returns Returns the 'done' 'boolean' value if the instance has finished his run
     */
    public isDone() : Boolean {
        return this.done;
    }

    /**
     * Starts the class process asynchronously and waits for the parsed data from local/distant document(s)
     */
    public async run() {
        try {
            this.init()
            await this.processing()
                .catch((err) => {
                    console.log(err);
                });
        } catch (err) {
            console.log(err);
        }
        finally {
            this.done = true;
        }
    }

    /**
     * Class initialization 
     */
    private init() {
        this.validation();
        this.outputmessage = new OutputMessage(this.id, this.domain);
    }

    /**
     * Instance properties validation
     */
    private validation() {
        if (this.hasnavpane && this.navpane.length == 0) 
            throw new FlyshException(1500001300, new Error, this.EXCEPTION_ID_1500001300_MESSAGE_VALUE, this.id);
        if (this.spc.length < this.VALIDATION_MINIMUM_SPC_DOMELEMENT_VALUE) 
            throw new FlyshException(1500001200, new Error, this.EXCEPTION_ID_1500001200_MESSAGE_VALUE, this.id);
        if (this.timeout < this.VALIDATION_MINIMUM_TIMEOUT_VALUE) 
            throw new FlyshException(1500001400, new Error, this.EXCEPTION_ID_1500001400_MESSAGE_VALUE, this.id);
    }

    /**
     * Returns the 'JQuery' selector from prefetched 'DOM' object
     * 
     * @param dom Object that contains the 'DOM' structure of the document
     * @returns Returns the 'JQuery' selector
     */
    private createWindowSelector(dom : any) {
        return jquery(dom.window);
    }

    /**
     * Checks if the current parsed pages are elligible for 'MFaM' mode (Multiple Families) parsing
     * 
     * @returns Returns a 'boolean' value set to true if the 'SCP' property is having more than 1 element   
     */
    private isMF() : boolean {
        if (this.spc.length > this.MFAM_DOM_SCP_MIN_OCCURENCE_VALUE) return true;
        else return false;
    }

    /**
     * Adds the 'PageRecords' class instance to the 'outputmessage' message property
     * 
     * TODO : Create two models with records and 'FullListing' two methods 'setOutputMessage()' and 'addRecords(Object rec)'
     *
     * @param pageRecords Contains all the records parsed from a page
     */
    private addHaverstedPages(pageRecords : PageRecords) {
        this.outputmessage.addPageRecords(pageRecords);
    }

    /**
     * Updates the 'navmap' ('Paginator') property with the new URIs parsed from the page's navigation pane 
     * 
     * @param inputData Contains an array of URIs from the navigation ('Paginator') pane
     */
    private updateNavMapURI(inputData : string[]) { 
        inputData.forEach((e) => {this.navmap.push(e);});
    }

    /**
     * Loops on each 'siblings' (fields) signature to overloads the 'filterselector'
     *
     * i.e : - '#scope-id div.product-description' + 'a' provides the full filter selector, '#scope-id div.product-description a'
     *       - '#scope-id div.product-description' + 'span.price' provides the full filter selector, '#scope-id div.product-description span.price'
     *
     * NOTE : The 'JQuery' selector is only able to catch up a precise tag through the page, the parsing method must be invoked multiple times
     * NOTE : If the 'filterselector' is having maximum 3 distinct arguments, it means that it's 'full' and don't need to loop over again
     * NOTE : Full filter means 'auto-mode'
     * 
     * @param dom Document filter selector
     * @param domelement Generic 'DomElement' type class
     * @returns Returns an array of array of 'String' that contains each record collected from the page
     */
    private pageParser(dom : any, domelement: DomElement) : String[][] {

        let _retVal : String[][];

        if ((<SPC>domelement).hasFullFilter()) {
            let tmpData : String[];
            tmpData = this.parser(
                            this.createWindowSelector(dom),
                            (<SPC>domelement).getFilterSelector,// Get the main filter selector
                            ''// Reserved to 'NavPane' ('Paginator') parsing
                        );
            _retVal = this.rowsMapper(tmpData, (<SPC>domelement).getFields.length);
        }
        else {
            // Otherwise let's build up a matrix and 'play it through' vertically (per row)
            let matrix : String[][] = [];
            (<SPC>domelement).getSiblings.forEach((e)=>{
                matrix.push(
                    this.parser(
                        this.createWindowSelector(dom),
                        (<SPC>domelement).getFilterSelector + ' ' + e.getElementWithSignature, // Get the main filter selector
                        ''// Reserved to 'NavPane' ('Paginator') parsing, empty value expected
                    ));    
            }); 
            _retVal = this.matrixMapping(matrix, (<SPC>domelement).getSiblings.length);
        }

        return _retVal;
    }

    /**
     * Cleans each 'PageRecords' (records) with the corresponding sibling's regex (field). For each sibling, the function matches 
     * the right label name and lookups for the corresponding regular expression
     * 
     * NOTE : If the regular expression matches (exec) the content an update will be applied, otherwise it does nothing
     * TOTEST : Don't process in case of undefined/empty regex ('') (no matching sibling (PK? Label ?))
     * 
     * @param pgRecords 'PageRecords' Class instance with original record(s) 
     * @param domE 'DomeElement' Generic type parameter used to retrieve the record field name
     * @returns Returns a 'PageRecords' Class instance with cleaned field(s)
     */
    private pageRecordsCleaner(pgRecords : PageRecords, domE : DomElement) : PageRecords {

        pgRecords.recordList.forEach(e => {
            for (let z of e.keys()) {
                let sib = (<SPC>domE).getSiblings.find(e => e.field === z);
                if (sib !== undefined && sib.regex !== '') {
                    let regex = String(sib.regex);
                    let keyval = e.get(z)!.toString();// Non-null assertion operator
                    let regexp = new RegExp(regex);
                    if (regexp.test(keyval))// Otherwise do not update
                        e.set(z,regexp.exec(keyval)![this.PRCLEANER_REGEXP_EXEC_ARRAY_RESULT_INDEX_VALUE]); // Non-null assertion operator
                }
            } 
        });
        
        return pgRecords;
    }

    /**
     * Maps the received matrix into a 'PageRecords' class instance and validates if the returned content from 
     * the selector is not empty
     * 
     * @param matrix Array of array of string that contains the records 
     * @param domE 'DomeElement' generic type parameter used to retrieve the record field name
     * @param uri String that contains document path from filesystem or network (lan/wan)
     * @returns Returns a 'PageRecords' class instance
     */
    private pageRecordsMapper(matrix : String[][], domE : DomElement, uri : string) : PageRecords {

        let _retVal = new PageRecords(uri,this.PAGERECORD_DEFAULT_ERROR_FLAG_VALUE);
        let mapFieldsRecord = new Map;

        // If the matrix is empty then set the 'PageRecords' on fail/error state (i.e, element(s) not found from selector)
        if (matrix.length == 0) _retVal.setError(this.PAGERECORD_ERROR_STATE_FLAG_VALUE);

        matrix.forEach((e) => {// For each array from the matrix
            for (let z = 0; z < e.length; z++) // Loop on each field 
                mapFieldsRecord.set((<SPC>domE).getFields[z],e[z]);
            _retVal.recordList.push(mapFieldsRecord);
            mapFieldsRecord = new Map();
        });

        return _retVal;
    }

    /**
     * Swaps arrays into array of array of 'string' (matrix)
     * 
     * @param arrayRecords Array of string that contains record(s)
     * @param fieldsNumber Number value that indicates the current field number
     * @returns Returns an array of array of string
     */
    private rowsMapper(arrayRecords : String[], fieldsNumber : number) : String[][] {
   
        let _retVal : String[][] = [];
        let arrayTemp : String[] = [];

        /**
         * Conditional statement in case of no sibling/field definition (returns flat results)
         * !! QUID about the 'auto-mode' in case of multiple siblings with a same tag?
         * !! >> This case there is no sibling then (fieldnumber == 0) 
         *      >> Current limitation : need to add sibling to delimitates recors (all fields)
         *      >> Further release : if full filter and no sibling, then auto-mode OR something else...
         */
        if (fieldsNumber == this.PAGERECORD_MAPPER_UNDEFINED_FIELD_NUMBER_VALUE) 
            fieldsNumber = this.PAGERECORD_MAPPER_UNDEFINED_FIELD_SWAP_VALUE;  

        let i = 0;
        for (let z = 0; z < arrayRecords.length; z++) {
            if (i < fieldsNumber) {
                arrayTemp.push(arrayRecords[z]);
                i++;
            }
            if (i == fieldsNumber) {
                _retVal.push(arrayTemp);
                arrayTemp = [];
                i = 0;
            } 
        }

        return _retVal;
    }

    /**
     * Swaps the initial matrix grid into array of array of 'string'
     * 
     * NOTE : 
     *      matrix[0][0] +':'+ matrix[1][0] +':'+ matrix[2][0]);
     *      matrix[0][1] +':'+ matrix[1][1] +':'+ matrix[2][1]);
     *      matrix[0][2] +':'+ matrix[1][2] +':'+ matrix[2][2]);
     * 
     * @param matrix Array of array of 'string' that contains the records
     * @param fieldsNumber Number of the current field
     * @returns Returns an ordered (field) array of array of 'string'
     */
    private matrixMapping(matrix : String[][], fieldsNumber : number) : String[][] {

        let _retVal : String [][] = [];

        let j = 0;
        let arrayTmp = [];
        for (let z = 0; z <  matrix[this.MATRIX_MAPPER_LENGTH_INDEX_VALUE].length; z++) {// Loops on all records
            for (let i = 0; i < fieldsNumber; i++) // By fields number
                arrayTmp.push(matrix[i][j]);
            _retVal.push(arrayTmp);
            arrayTmp = []; 
            j++;
        }

        return _retVal;
    }

    /**
     * Parses the current document with his corresponding selector, this function is the nearest core caller 
     * from the 'Jquery' library
     * 
     * TODO : element.innerHTML less efficient than element.textContent ?
     * 
     * DOC : JQuery core selector dev style 1 (https://learn.jquery.com/using-jquery-core/traversing/)
     * DOC : JQuery core selector dev style 2 (http://net-informations.com/jq/iq/parent.htm)
     * 
     * @param $ 'Jquery Document Selector' related to the current Document page (DOM)
     * @param filterselector 'String' type that defines the 'Filter Selector' content
     * @param attribute 'String' type that defines the attribute to read (optional : to optimize ?) (i.e : 'href')
     * @returns Returns a generic object array either filled by a string, a null or an 'undefined' value
     */
    private parser($ : any, filterselector : string, attribute : string) : any[] {

        /**
         * 'Flysh' main core logic, version 0.2
         * ====================================
         * 
         * A new update is improving the core parsing accuracy.
         * 
         * These improvements are focusing on,
         *      - Detection of missing elements
         *      - Detection of empty/unusable nodes
         * 
         * 'Flysh' main core logic, version 0.1
         * ====================================
         * 
         * This first version is overriding the document selector and 
         * his returned content.
         */

        let _retVal : any[] = [];

        // Check parsing a navigation panel ('navpane'/'Paginator')
        if (attribute) $(filterselector).each((index : number, element : Element) => {_retVal.push(element.getAttribute(attribute));});
        else {// page parsing
            let fs_split = filterselector.split(" ",this.CORE_PARSER_FILTER_SELECTOR_SPLITTER_SIZE_VALUE); 
            $(fs_split[this.CORE_PARSER_FILTER_SELECTOR_SPLITTER_SCOPE_POSITION_VALUE] + ' ' + fs_split[this.CORE_PARSER_FILTER_SELECTOR_SPLITTER_PARENT_POSITION_VALUE]).each((index : any, element : Element) => {
                let nodeList = element.querySelectorAll(fs_split[this.CORE_PARSER_FILTER_SELECTOR_SPLITTER_CHILD_POSITION_VALUE]);
                // If no 'child' found in the current parent node
                if (nodeList?.length === this.CORE_PARSER_QUERY_SELECTOR_ALL_NO_MATCH_RESULT_VALUE) {
                    // Then perform a new 'all' query selector (@ n+1 level)
                    let parentNodeList = element.parentElement?.querySelectorAll(fs_split[this.CORE_PARSER_FILTER_SELECTOR_SPLITTER_CHILD_POSITION_VALUE]);
                    // If this kind of 'child' has been found into another 'parent' node(s) ?
                    if ((parentNodeList?.length) && (parentNodeList?.length > this.CORE_PARSER_QUERY_SELECTOR_ALL_NO_MATCH_RESULT_VALUE)) { 
                        // Then check if the first child of this parent node is having an identical 'tag'
                        if ((element.firstElementChild?.tagName.toUpperCase() === fs_split[this.CORE_PARSER_FILTER_SELECTOR_SPLITTER_CHILD_POSITION_VALUE].split(".",undefined)[this.CORE_PARSER_FILTER_SELECTOR_SPLITTED_CHILD_TAG_POSITION_VALUE].toUpperCase()))
                            // Then this is probably a missing child ('undefined')
                            _retVal.push(undefined); 
                    }
                } else nodeList.forEach((elem) => {_retVal.push(elem.innerHTML);});
            });
        }

        return _retVal;

    }

    /**
     * Fetches and returns the DOM document either from a distant URI or from the filesystem  
     * 
     * @param uri String that contains document path from filesystem or network (lan/wan)
     * @returns Returns a 'Promise' which contains the DOM structure from document (filsesystem/network)
     */
    private async fetchDOM (uri : string) : Promise<any> {

        let jsdomPromise : Promise<typeof JSDOM>;

        let timer = new Promise((resolve, reject) => {
            setTimeout(() => reject(new FlyshException(2000000000,new Error(),this.EXCEPTION_ID_2000000000_MESSAGE_VALUE + ' (' + this.timeout + ' ms)',this.id)), this.timeout);
        });

        /**
         * implement a private function that evaluates if the target is on a filesystem or not
         * TODO - where and when evalutes the uri (or previously just the domain ? (not the path ?) or both)
         *      - remove the flysh _fs property ?
         *      - not possible to remove fs from parameter (timeout is already optional...)
         *      - how to identify the domain regex match http protocol check ? see best practise and standard
         *      - think to add a flag or function (.forceFS()) to override auto check...
         */

        if (this.filesystem) jsdomPromise = JSDOM.fromFile(uri, this.JSDOMOptions);
        else jsdomPromise = JSDOM.fromURL(uri, this.JSDOMOptions);

        return Promise.race([jsdomPromise, timer]);
    }

    /**
     * Merges the "scrapped" pages into one 'PageRecords' object instance. The mapping is the processing between the 
     * 'recordList' returned from the 'PageRecords' instance and the current "scraps" objects
     * 
     * @param scraps Array of 'PageRecords' which contain all "scrapped" records from a page
     * @returns Returns a unique 'PageRecords' containing all the "scrapped" records
     */
    private pageRecordsMerger(scraps : PageRecords[]) : PageRecords {
        // Initialization of the new 'PageRecords' by taking the 'page' property from the first 'PageRecords' scrap occurence
        let _retVal = new PageRecords(scraps[this.PAGERECORD_MERGER_FIRST_OCCURENCE_INDEX_VALUE].URI,this.PAGERECORD_DEFAULT_ERROR_FLAG_VALUE);

        scraps.forEach(scrap => {// For each scrapped 'PageRecords' to melt
            // If any error flag encountered from scraps then update the error flag of returned value
            if (scrap.getError) _retVal.setError(this.PAGERECORD_MERGER_FOUND_ERROR_FLAG_VALUE);
            // If '_retVal.recordList' stack already filled by maps, then merge all the next one
            if (_retVal.recordList.length > this.MFAM_DOM_SCP_MERGING_BUFF_REC_MIN_VALUE) {
                let i=0;
                for (let rlMap of _retVal.recordList) {
                    // Merging items from 'recordList[i]' into 'map'
                    scrap.recordList[i].forEach((value, key) => rlMap.set(key, value));
                    i++;
                }
            } else // If '_retVal' is not yet initialized then push the first maps into it 
                scrap.recordList.forEach(item => {
                    _retVal.recordList.push(item);
                });

        });

        return _retVal;
    }

    /**
     * Checks if a page is either a "scrap" or not. This method evaluates when to set a new 'PageRecords' to the 'outputmessage' 
     * class property. It uses a 'PageRecords' type buffer (from scraps) with a size which equals the number of 'SCP' objects (fields). 
     * If the configuration is set to "MF/MultiFamily", the buffer will be filled till his maximum size. Once full, 
     * a new 'PageRecords' page will be created and being filled with the other 'PageRecords'. If the page is not considered 
     * as "MF/MultiFamily", the reference will simply be returned.
     * 
     * @param pr 'PageRecords' class instance that contains the parsed records from a page 
     */
    private pageRecordsHandler(pr : PageRecords) {
        let prTmp : PageRecords;

        if (this.isMF()) {// If 'MultiFamilly' page type
            // Then fecth the 'mfpagerecordsbuffer' buffer stack property 
            this.mfpagerecordsbuffer.push(pr);// Push 'pageRecords' into buffer before merging
            if (this.mfpagerecordsbuffer.length == this.spc.length) {// If buffer full
                // Merge records from buffer
                prTmp = this.pageRecordsMerger(this.mfpagerecordsbuffer);
                // Adding the 'PargeRecords' instance into the 'outputmessage' property
                this.addHaverstedPages(prTmp);
                // Buffer reset
                this.mfpagerecordsbuffer = [];
            }
        } else this.addHaverstedPages(pr);// Otherwise add the 'PageRecords' into the 'outputmessage' property
    }

    /**
     * Returns a 'Promise' that contains the parsed data from a window (dom.window). Each 'Promise' is either identified as a 
     * new 'PargeRecords' either a filepath/URIs to add
     * 
     * NOTE : In case of multiple 'NavPane' ('Paginator') elements, the first occurrence will only be taken into account
     * 
     * @param uri String that contains document path from filesystem or network (lan/wan)
     * @returns Returns a 'Promise' that contains the parsed datas from the 'window' (dom.window)
     */
    private async harvesting(uri : string) {
        return this.fetchDOM(uri)
                   .then(dom => {// Fulfilled (settled)
                        if (this.hasnavpane && !this.navmapupdated) {// In case of 'navmap'/'paginator'
                            this.updateNavMapURI(
                                this.parser(// Returns array of parsed URI
                                    this.createWindowSelector(dom),
                                    (<NavPane>(this.navpane)[this.HARVEST_NAVPANE_DOM_STACK_FIRST_OCCURENCE_VALUE]).getFilterSelectorSignature,
                                    (<NavPane>(this.navpane)[this.HARVEST_NAVPANE_DOM_STACK_FIRST_OCCURENCE_VALUE]).attribute));
                            this.navmapupdated = true;
                        };
                        this.spc.forEach(element => {
                            this.pageRecordsHandler(
                                this.pageRecordsCleaner(
                                    this.pageRecordsMapper(
                                        this.pageParser(dom, element),
                                        element, 
                                        uri), 
                                    element));
                        });
                        dom.window.close();// Closes the document with all the running timers and any event listeners on the window and document
                    })
                    .catch((exception) => {// Rejected (settled)
                       throw new FlyshException(1500003100,exception,this.EXCEPTION_ID_1500003100_MESSAGE_VALUE,this.id);
                    })
                    .finally();
    }

    /**
     * Processing the page(s) preseted within the 'navmap'/'paginator' property
     * 
     * NOTE : 'foEach()' method seems not handling a 'Promise' callback
     * NOTE : Each back 'Promise' are stored from properties and available from getter functions
     */
    private async processing() {
        await this.harvesting(this.URI)// Resolves the first page (reaching the domain and potentially creating the 'navmap' ('Paginator'))
                  .then(async () => {
                    for (const e of this.navmap)// In case of any other URI page to parse
                        await this.harvesting(e);
                    })
    }

}