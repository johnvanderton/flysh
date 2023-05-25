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
    public get getError() : boolean {
        return this._error;
    }

    /**
     * Setter 'Error'
     * 
     * @param error Contains the 'boolean' value to set in case of successful/unsuccessful process
     */
    public setError(error : boolean) {
        this._error = error;
    }

    /**
     * Getter 'URI'
     * 
     * @returns Returns a 'string' that contains the URI value
     */
    public get URI() : string {
        return this._uri;
    }

    /**
     * Getter 'RecordList'
     * 
     * @returns Returns an array of 'Map' that contains the list of records
     */
    public get recordList() : Array<Map<String,String>> {
        return this._recordList;
    }

    /**
     * Returns the number of records from the current page
     * 
     * @returns Returns the count of records from the record list
     */
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
    get toString() {
        return  'URI : ' + this._uri + '\n' +
                'Error : ' + this._error + '\n' +
                'List of records : ' + this._recordList + '\n';
    }
}