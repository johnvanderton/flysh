import { FlyshException } from "../exception/FlyshException";
import { InputMessage } from "../io/InputMessage";
import { OutputMessage } from "../io/OutputMessage";
import { PageRecords } from "../model/PageRecords";

/**
 * The `IOMessageMapper` is an abstract class designed for serializing and deserializing I/O classes such as `InputMessage` and `OutputMessage`
 */
export abstract class IOMessageMapper {

    /**
     * Constants
     */
    private static readonly DOM_SPC_ELEMENT_IDENTIFIER_VALUE = "spc";
    private static readonly MAPPING_HELPER_REVIVER_MAP_DATATYPE_VALUE = "Map";
    private static readonly MAPPING_HELPER_REVIVER_OBJECT_DATATYPE_VALUE = "object";

    /**
     * Constants, exception codes
     */
    public static readonly EXCEPTION_ID_8500001000_MESSAGE_VALUE = "Exception during `InputMessage` serializing process (`IOMessageMapping`)";
    public static readonly EXCEPTION_ID_8500002000_MESSAGE_VALUE = "Exception during `OuputMessage` serializing process (`IOMessageMapping`)";

    /**
     *  No boilerplates, just optimized code !
     *  Method that helps to map the input `JSON` object parameter into an `InputMessage` class instance
     * 
     * @param {any} IMM type input parameter known as `JSON` object
     * @returns {InputMessage} an `InputMessage` class instance
     */
    private static doInputMessageMapping(IMM : any) : InputMessage {
        if (IMM === null || IMM === undefined )
            throw new FlyshException(8500001000, new Error, IOMessageMapper.EXCEPTION_ID_8500001000_MESSAGE_VALUE, -1);

        let _retVal = new InputMessage(IMM._domain,IMM._pagepath, IMM.DEFAULT_INSTANCE_TIMEOUT_VALUE);
        for (var i=0; i < IMM._doms.length; i++) {
            if (IOMessageMapper.DOM_SPC_ELEMENT_IDENTIFIER_VALUE === IMM._doms[i]._element) {
                let spcInstance = _retVal.addFilterSelector(IMM._doms[i]._filterselectorsignature);
                for (var j=0; j < IMM._doms[i]._siblings.length; j++) {
                    spcInstance.addField(IMM._doms[i]._siblings[j]._field, 
                                         IMM._doms[i]._siblings[j]._element, 
                                         IMM._doms[i]._siblings[j]._signature,
                                         IMM._doms[i]._siblings[j]._regex);
                }
            } else //else add an `navpane-paginator`
                _retVal.addPaginator(IMM._doms[i]._filterselectorsignature,IMM._doms[i]._attribute);
        }
        return _retVal;
    }

    /**
     *  No boilerplates, just optimized code !
     *  Method that helps to map the input `JSON` object parameter into an `OutputMessage` class instance
     * 
     * @param {any} OMM `any` type input parameter known as `JSON` object
     * @returns {OutputMessage} an `OutputMessage` class instance
     */
    private static doOutputMessageMapping(OMM : any) : OutputMessage {
        if (OMM === null || OMM === undefined)
            throw new FlyshException(8500002000, new Error, IOMessageMapper.EXCEPTION_ID_8500002000_MESSAGE_VALUE, -1);

        let _retVal = new OutputMessage(OMM._id, OMM._domain);

        /**
         * For each `PageRecordList` element(s) 
         */
        for (var i=0; i < OMM._pageRecordList.length; i++) {
            let PR = new PageRecords(OMM._pageRecordList[i]._uri, OMM._pageRecordList[i]._error);

            /**
             * For each `RecordList` push the `Map` element(s) into the current PageRecord's recordList
             */
            for (var j=0; j < OMM._pageRecordList[i]._recordList.length; j++) 
                PR.recordList.push(OMM._pageRecordList[i]._recordList[j]);

            _retVal.addPageRecords(PR);
        }

        return _retVal;
    }

    /**
     * "Wrapper" that either redirect to the `doOutputMessageMapping()` or `doInputMessageMapping()` method
     * 
     * @param {string} inJSON Content string to map
     * @returns {InputMessage, OutputMessage} an `InputMessage`or `OutputMessage`class instance
     */
    private static doMessageMapping(inJSON : string) : InputMessage | OutputMessage {
            let inJSONObj = JSON.parse(inJSON, this.reviver);
            return inJSONObj._pageRecordList ? IOMessageMapper.doOutputMessageMapping(inJSONObj) : IOMessageMapper.doInputMessageMapping(inJSONObj);
    }

    /**
     * Method that help in case of "stringifying" an ES6 `Map` type into a JSON format
     * 
     * @param {any} _key (not used)
     * @param {any} value An `any` type value that might containing the targeted `Map` value
     * @returns {any, Map} An `any` or a 'Map' type value
     */
    private static replacer(_key : any, value : any) {
        if (value instanceof Map)
            return {
                dataType: IOMessageMapper.MAPPING_HELPER_REVIVER_MAP_DATATYPE_VALUE,
                value: Array.from(value.entries()), // or with spread: value: [...value]
            };
        else return value;
    }

    /**
     * Method used in case of an ES6 `Map` JSON parsing
     * 
     * @param {any} _key (not used)
     * @param {any} value An `any` type value that might containing the targeted `Map` value
     * @returns {any, Map} An `any` or a 'Map' type value
     */
    private static reviver(_key : any, value : any) {
        if (typeof value === IOMessageMapper.MAPPING_HELPER_REVIVER_OBJECT_DATATYPE_VALUE && value !== null) {
          if (value.dataType === IOMessageMapper.MAPPING_HELPER_REVIVER_MAP_DATATYPE_VALUE) 
            return new Map(value.value);
        } 
        return value;
    }

    /**
     * Static method that returns a string after the JSON `stringify()` function
     * 
     * @param {InputMessage, OutputMessage} strClass `InputMessage` or `OutputMessage` input type parameter
     * @returns {string} A 'string' type value representing of an `InputMessage` or `OutputMessage` class instance
     */
    public static toJSON(strClass : InputMessage | OutputMessage) : string {
        return (strClass instanceof InputMessage) ? JSON.stringify(strClass) : JSON.stringify(strClass, this.replacer);
    }

    /**
     * Static method that returns from a JSON input string an `InputMessage` or `OutputMessage` class instance
     * 
     * @param {string} JSONinst `string` input type parameter
     * @returns {InputMessage, OutputMessage} An `InputMessage` or `OutputMessage` class instance
     */
    public static fromJSON(JSONinst : string) : InputMessage | OutputMessage {
        return this.doMessageMapping(JSONinst);
    }

  }