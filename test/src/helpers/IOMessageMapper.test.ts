import { IOMessagesMapper } from "../../../src/class/helpers/IOMessagesMapper";
import { InputMessage } from "../../../src/class/io/InputMessage";

const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));

/**
 * 'IOMessageMapper' Helper Main Class Test
 */
describe('_________("IOMessageMapper" Helper Class Tests)_________', () => { 

    /**
     * Testing the statics methods (no mapping)
     */
    describe('_________()_________', () => { 

        /**
         *  
         */
        describe('>>>  : ', () => {

            it('[001] ', () => {
                const IM = new InputMessage('https://testdomain.abc','/testpage');

                IM.addFilterSelector("Scope Parent Child")
                .addField('testField1','testTag','testClassName','[0-9]+[\,]*[0-9]*')
                .addField('testField2','testTag','testClassName');

                IM.addFilterSelector("Scope2 Parent2 Child2")
                .addField('testField11','testTag','testClassName','[0-9]+[\,]*[0-9]*');

                IM.addPaginator('table tr td','href');

                /**
                 * Serializing the 'InputMessage' class instance into string format
                 */
                let jsonIM = IOMessagesMapper.toJSON(IM);

                /**
                 * Deserializing the stringified 'InputMessage' class instance into an 'any' object type class instance
                 */
                let IMM = IOMessagesMapper.fromJSON(jsonIM);

                expect(IMM._doms[0]._siblings[0]._element === "testField1");
                expect(IMM._doms[0]._siblings[0]._regex === "[0-9]+[\,]*[0-9]*");

            });

            it('[002] ', () => {
                const IM = new InputMessage('https://testdomain.abc','/testpage');
    
                IM.addFilterSelector("Scope Parent Child")
                    .addField('testField1','testTag','testClassName','[0-9]+[\,]*[0-9]*')
                    .addField('testField2','testTag','testClassName');
    
                IM.addFilterSelector("Scope2 Parent2 Child2")
                    .addField('testField11','testTag','testClassName','[0-9]+[\,]*[0-9]*');
    
                IM.addPaginator('table tr td','href');
    
                /**
                 * Serializing the 'InputMessage' class instance into string format
                 */
                let jsonIM = IOMessagesMapper.toJSON(IM);
    
                /**
                 * Deserializing the stringified 'InputMessage' class instance into an 'any' object type class instance
                 */
                let IOM = IOMessagesMapper.fromJSON(jsonIM);

                /**
                 * Mapping the JSON class instance with the `inputMessageMapper`static method
                 */
                let IOMM = IOMessagesMapper.inputMessageMapper(IOM);

                //expect(IOMM.getDomsEntries()[0]. ._element === "testField1");
    
            });
        });

    });

    /**
     * Organizing tests in case of Serializing/Deserializing `InputMessage` Class Instance 
     * TODO : test with navpane, MF feature, etc... wait for the inner mapper
     */
    describe('_________(Input Message `InputMessage` class instance Serialization/Deserialization Tests)_________', () => { 

        /**
         * `InputMessage` class Serialization/Deserialization  
         */
        describe('>>> After deserialization of the serialized "InputMessage" class instance do : ', () => {

            it('[001] Verifying the "_element" and "_regex" properties from the first "_doms" "_sibling" JSON object class property', () => {
                const IM = new InputMessage('https://testdomain.abc','/testpage');

                IM.addFilterSelector("Scope Parent Child")
                .addField('testField1','testTag','testClassName','[0-9]+[\,]*[0-9]*')
                .addField('testField2','testTag','testClassName');

                IM.addFilterSelector("Scope2 Parent2 Child2")
                .addField('testField11','testTag','testClassName','[0-9]+[\,]*[0-9]*');

                IM.addPaginator('table tr td','href');

                /**
                 * Serializing the 'InputMessage' class instance into string format
                 */
                let jsonIM = IOMessagesMapper.toJSON(IM);

                /**
                 * Deserializing the stringified 'InputMessage' class instance into an 'any' object type class instance
                 */
                let IMM = IOMessagesMapper.fromJSON(jsonIM);

                expect(IMM._doms[0]._siblings[0]._element === "testField1");
                expect(IMM._doms[0]._siblings[0]._regex === "[0-9]+[\,]*[0-9]*");

            });

            it('[002] Verifying the "_element" and "_regex" properties from the first "_doms" "_sibling" from `InputMessage` class property', () => {
                const IM = new InputMessage('https://testdomain.abc','/testpage');
    
                IM.addFilterSelector("Scope Parent Child")
                    .addField('testField1','testTag','testClassName','[0-9]+[\,]*[0-9]*')
                    .addField('testField2','testTag','testClassName');
    
                IM.addFilterSelector("Scope2 Parent2 Child2")
                    .addField('testField11','testTag','testClassName','[0-9]+[\,]*[0-9]*');
    
                IM.addPaginator('table tr td','href');
    
                /**
                 * Serializing the 'InputMessage' class instance into string format
                 */
                let jsonIM = IOMessagesMapper.toJSON(IM);
    
                /**
                 * Deserializing the stringified 'InputMessage' class instance into an 'any' object type class instance
                 */
                let IOM = IOMessagesMapper.fromJSON(jsonIM);

                /**
                 * Mapping the JSON class instance with the `inputMessageMapper`static method
                 */
                let IOMM = IOMessagesMapper.inputMessageMapper(IOM);

                //expect(IOMM.getDomsEntries()[0]. ._element === "testField1");
    
            });
        });

    });

});