import { InputMessage } from "../io/InputMessage";
import { OutputMessage } from "../io/OutputMessage";

/**
 * The `IOMessageMapper` is an abstract class designed for serializing and deserializing specific IO class such as `InputMessage`
 */
export abstract class IOMessageMapper {

    private static readonly DOM_SPC_ELEMENT_IDENTIFIER_VALUE = "spc";

    /**
     *  No boilerplates! Just optimized code to map the input `JSON` object parameter into an `InputMessage` class instance
     * 
     * @param IMM `any` type input parameter as `JSON` object
     * @returns an `InputMessage`class isntance
     */
    public static inputMessageMapper(IMM : any) : InputMessage {
        let _retVal = new InputMessage(IMM._domain,IMM._pagepath,IMM.DEFAULT_INSTANCE_TIMEOUT_VALUE);
        for (var i=0; i < IMM._doms.length; i++) {
            if (IOMessageMapper.DOM_SPC_ELEMENT_IDENTIFIER_VALUE === IMM._doms[i]._element) {
                let spcInstance = _retVal.addFilterSelector(IMM._doms[i]._filterselectorsignature);
                for (var j=0; j < IMM._doms[i]._siblings.length; j++) {
                    spcInstance.addField(IMM._doms[i]._siblings[j]._field, 
                                         IMM._doms[i]._siblings[j]._element, 
                                         IMM._doms[i]._siblings[j]._signature,
                                         IMM._doms[i]._siblings[j]._regex);
                }
            } else {//else add an navpane-paginator
                _retVal.addPaginator(IMM._doms[i]._filterselectorsignature,IMM._doms[i]._attribute);
            }
        }
        return _retVal;
    }

    /**
     * Static method that returns the result of the JSON `parse()` function
     * 
     * @param JSONinst `string` input type parameter
     * @returns 'any' class instance or the `JSON` object of the initial string sent from parameter
     */
    public static fromJSON(JSONinst : string)  {
        return JSON.parse(JSONinst);
    }
    
    /**
     * Static method that returns the result of the JSON `stringify()` function
     * 
     * @param inObjInstance `InputMessage` input type parameter
     * @returns 'string' value from initial parameter(s)
     */
    public static toJSON(strClass : InputMessage | OutputMessage)  {
        return JSON.stringify(strClass);
    }

  }