import { Expose } from 'class-transformer';
import { PageRecords } from '../lib/PageRecords';

import "reflect-metadata";

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