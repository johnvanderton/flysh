import { FlyshException } from "../exception/FlyshException";
import { InputMessage } from "../io/InputMessage";
import { OutputMessage } from "../io/OutputMessage";

/**
 * The `IOMessageMapper` is an abstract class designed for serializing and deserializing specific IO classes such as `InputMessage`
 */
export abstract class IOMessageMapper {

    /**
     * Constants
     */
    private static readonly DOM_SPC_ELEMENT_IDENTIFIER_VALUE = "spc";

    /**
     * Constants, exception codes
     */
    public static readonly EXCEPTION_ID_8500001000_MESSAGE_VALUE = "Exception during `InputMessage` serializing process (`IOMessaEgeMapping`)";

    /**
     *  No boilerplates, just optimized code !
     *  Method that helps to map the input `JSON` object parameter into an `InputMessage` class instance
     * 
     * @param IMM `any` type input parameter known as `JSON` object
     * @returns an `InputMessage`class isntance
     */
    private static inputMessageMapper(IMM : any) : InputMessage {
        if (IMM === null || IMM === undefined )
            throw new FlyshException(8500001000, new Error, IOMessageMapper.EXCEPTION_ID_8500001000_MESSAGE_VALUE, -1);

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
     * Static method that returns the result of the JSON `stringify()` function
     * 
     * @param strClass `InputMessage` input type parameter (`OutputMessage` is not yet implemented)
     * @returns 'string' value from initial parameter(s)
     */
    public static toJSON(strClass : InputMessage | OutputMessage)  {
        return JSON.stringify(strClass);
    }

    /**
     * Static method that returns the mapping of the output of the JSON `parse()` function
     * 
     * @param JSONinst `string` input type parameter
     * @returns 'any' class instance or the `JSON` object of the initial string sent from parameter
     */
    public static fromJSON(JSONinst : string)  {
        return this.inputMessageMapper(JSON.parse(JSONinst));
    }

  }