import { InputMessage } from "../io/InputMessage";
import { OutputMessage } from "../io/OutputMessage";

/**
 * 
 */
export abstract class IOMessagesMapper {

    /**
     *  No boilerplates, just optimized code that maps the input JSON object parameter into `InputMessage` class instance
     * 
     * @param IMM 
     * @returns 
     */
    public static inputMessageMapper(IMM : any) : InputMessage {
        let _retVal = new InputMessage(IMM._domain,IMM._pagepath,IMM.DEFAULT_INSTANCE_TIMEOUT_VALUE);
        for (var i=0; i < IMM._doms.length; i++) {
            if ("spc" === IMM._doms[i]._element) {
                let spcInstance = _retVal.addFilterSelector(IMM._doms[i]._filterselectorsignature);
                for (var j=0; j < IMM._doms[i]._siblings.length; j++) {
                    spcInstance.addField(IMM._doms[i]._siblings[j]._field, 
                                         IMM._doms[i]._siblings[j]._element, 
                                         IMM._doms[i]._siblings[j]._signature,
                                         IMM._doms[i]._siblings[j]._regex);
                }
            } else {//navpane-paginator
                _retVal.addPaginator(IMM._doms[i]._filterselectorsignature,IMM._doms[i]._attribute);
            }
        }
        return _retVal;
    }

    /**
     * 
     * @param inJSON 
     * @returns 
     */
    public static fromJSON(inJSON : string)  {
        return JSON.parse(inJSON);
    }
    
    /**
     * 
     * @param inObjInstance 
     * @returns 
     */
    public static toJSON(inObjInstance : InputMessage | OutputMessage)  {
        return JSON.stringify(inObjInstance);
    }

  }