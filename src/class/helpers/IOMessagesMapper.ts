import { InputMessage } from "../io/InputMessage";

/**
 * Class that inherits from `AutoMapper` library and helps to do serializing/deserializing 
 * both InputMessage and OutputMessage class instances
 */
export class IOMessagesMapper {

    /**
     * 
     * @param inJSON 
     * @returns 
     */
    private static fromJSON(inJSON : string)  {
        return JSON.parse(inJSON);
    }
    
    /**
     * 
     * @param inObjInstance 
     * @returns 
     */
    public toJSON(inObjInstance : InputMessage)  {
        return JSON.stringify(inObjInstance);
    }

    /**
     * 
     * @param inJSON 
     * @returns 
     */
    public fromJSON2(inJSON : string) {
        let JSONObj = IOMessagesMapper.fromJSON(inJSON);
        return JSON.parse(inJSON);
    }
  }