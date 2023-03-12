import { Expose } from 'class-transformer';

import "reflect-metadata";

/**
 * 'PageRecords' class model
 * 
 * The class is instanciated and filled by the 'Flysh' class during page(s) parsing. The data collection is structured 
 * as an array of 'Map'. In case of exception during process, the 'error' flag is set to true (i.e: timeout, crash,...).
 * 
 * Example of the output data format sent back after page(s) parsing,
 *      [
 *          ['item_name' : 'some name', 'item_description' : 'some description',...],
 *          ['item_name' : 'some name', 'item_description' : 'some description',...],
 *          ...
 *      ]
 */
 export class PageRecords {

    /**
     * Class properties
     */
    private _error : boolean = false;
    private _recordList : Array<Map<String,String>> = new Array<Map<String,String>>();
    private _uri : string;

    /**
     * Constructor
     * 
     * @param uri Contains the full 'URI' address
     * @param error Value being set in case of error (timeout, exception,...)
     */
    constructor(uri : string, error : boolean) {
        this._error = error;
        this._uri = uri;
    }

    /**
     * Getter 'Error'
     * 
     * @returns Returns a 'boolean' value setted to true in case of error
     */
    @Expose()
    public get getError() : boolean {
        return this._error;
    }

    /**
     * Setter 'Error'
     * 
     * @param error Contains the 'boolean' value to set in case of successful/unsuccessful process
     */
    @Expose()
    public setError(error : boolean) {
        this._error = error;
    }

    /**
     * Getter 'URI'
     * 
     * @returns Returns a 'string' that contains the URI value
     */
    @Expose()
    public get URI() : string {
        return this._uri;
    }

    /**
     * Getter 'RecordList'
     * 
     * @returns Returns an array of 'Map' that contains the list of records
     */
    @Expose()
    public get recordList() : Array<Map<String,String>> {
        return this._recordList;
    }

    /**
     * Returns the number of records from the current page
     * 
     * @returns Returns the count of records from the record list
     */
    @Expose()
    public get numberRecords() : number {
        let tot : number = 0;
        for (let ref of this._recordList) tot += ref.size
        return tot;
    }

    /**
     * 'Stringify' the class instance
     * 
     * @returns Returns a 'string' that contains all the class properties
     */
    @Expose()
    get toString() {
        return  'URI : ' + this._uri + '\n' +
                'Error : ' + this._error + '\n' +
                'List of records : ' + this._recordList + '\n';
    }
}

/**
 * 'OutputMessage' class model
 * 
 * Includes all the 'PageRecords' generated from a same domain. 
 * Once filled, this class instance is sent back asynchronously
 * 
 */
export class OutputMessage {

    /**
     * Class properties
     */
    private _domain : string;
    private _id : number; 
    private _pageRecordList : Array<PageRecords> = new Array<PageRecords>();

    /**
     * Constructor 
     * 
     * @param id Defines the current flysh ID instance
     * @param domain Contains the domain name (i.e : 'www.abcd.efg')
     */
    constructor(id : number, domain : string) {
        this._domain = domain;
        this._id = id;
    }

    /**
     * Add a 'PageRecords' class instance
     * 
     * @param pageRec Contains the records collected from the current page 
     */
    @Expose()
    public addPageRecords(pageRec : PageRecords) : void {
        this._pageRecordList.push(pageRec);
    }

    /**
     * Getter 'Domain'
     * 
     * @returns Returns a 'string' that contains the '_domain' class property
     */
    @Expose()
    public get domain() : string {
        return this._domain;
    }

    /**
     * Performs an 'Integrity Check' from the 'pageRecordList' class property. 
     * If any error(s) are found into the record lists then a 'false' value is returned
     * 
     * @returns Returns a 'boolean' value after 'PageRecords 'Integrity Check'
     */
    @Expose()
    public get integrityCheck() : boolean {
        let _retVal = true;
        for (let pr of this.pageRecordList) 
            if (pr.getError === true) _retVal = false;  
        return _retVal;
    }

    /**
     * Getter 'ID'
     * 
     * @returns Returns the instance 'ID' number
     */
    @Expose()
    public get ID() : number {
        return this._id;
    }

    /**
     * Getter number of pages
     * 
     * @returns Returns the counts number of 'PageRecords' from the 'pagerecordList' class property
     */
    @Expose()
    public get numberOfPages() : number {
        return this.pageRecordList.length;
    }

    /**
     * Getter number of records
     * 
     * @returns Returns a 'number' that contains the total of records from all the 'PageRecords' ('pageRecordList')
     */
     @Expose()
    public get numberOfRecords() : number {
        let _retVal = 0
        for (let pr of this.pageRecordList)
            _retVal += pr.numberRecords;
        return _retVal;
    }

    /**
     * Getter 'pageRecordList'
     * 
     * @returns Returns a 'string' that contains the '_pageRecordList' class property
     */
    @Expose()
    public get pageRecordList() : Array<PageRecords> {
        return this._pageRecordList;
    }

    /**
     * 'Stringify' the class instance 
     * 
     * @returns Returns a 'string' that contains all the class properties
     */
    @Expose()
    get toString() {
        return  'ID : ' + this._id + '\n';
    }
}