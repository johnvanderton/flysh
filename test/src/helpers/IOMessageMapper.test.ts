import { FlyshException } from "../../../src/class/exception/FlyshException";
import { InputMessage } from "../../../src/class/io/InputMessage";
import { IOMessageMapper } from "../../../src/class/helpers/IOMessageMapper";
import { NavPane } from "../../../src/class/model/NavPane";
import { SPC } from "../../../src/class/model/SPC";

const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));

    /**
     * 'IOMessageMapper' Helper Main Class Test
     */
    describe('_________("IOMessageMapper" Helper Main Class Test)_________', () => {

        /**
         *  Testing Serialization/Deserialization and mapping methods
         */
        describe('>>> During Serialization/Deserialization do : ', () => {

            it('[001] Verifying the content of the stringified `InputMessage` class instance', () => {
                const IM = new InputMessage('https://testdomain.abc','/testpage');

                IM.addFilterSelector("Scope_1 Parent_1 Child_1")
                    .addField('testField_1','testTag_1','testClassName_1','[0-9]+[\,]*[0-9]*')
                    .addField('testField_2','testTag_2','testClassName_2');
    
                IM.addFilterSelector("Scope_2 Parent_2 Child_2")
                    .addField('testField_11','testTag_11','testClassName_11','[0-9]+[\,]*[0-9]*');
    
                IM.addPaginator('table tr td','href');

                /**
                 * Serializing the 'InputMessage' class instance into string format
                 */
                const IMString = JSON.stringify(IM);

                expect(IMString).contains("DEFAULT_INSTANCE_TIMEOUT_VALUE",1500);
                expect(IMString).contains("_domain","https://testdomain.abc");
                expect(IMString).contains("_element","testField_2");
                expect(IMString).contains("_element","testField_11");
                expect(IMString).contains("_regex","[0-9]+[\,]*[0-9]*");
                expect(IMString).contains("_filterselectorsignature","table tr td");

            });

            it('[002] Verifying all the elements contained into the returned JSON object from the stringified class instance', () => {
                const IM = new InputMessage('https://testdomain.abc','/testpage');

                IM.addFilterSelector("Scope_1 Parent_1 Child_1")
                    .addField('testField_1','testTag_1','testClassName_1','[0-9]+[\,]*[0-9]*')
                    .addField('testField_2','testTag_2','testClassName_2');
    
                IM.addFilterSelector("Scope_2 Parent_2 Child_2")
                    .addField('testField_11','testTag_11','testClassName_11','[0-9]+[\,]*[0-9]*');
    
                IM.addPaginator('table tr td','href');

                /**
                 * Serializing the 'InputMessage' class instance into string format
                 */
                const jsonIM = IOMessageMapper.toJSON(IM);

                /**
                 * Deserializing the stringified 'InputMessage' class instance and map it into an `InputMessage` class instance
                 */
                const IMM = IOMessageMapper.fromJSON(jsonIM) as InputMessage;

                expect(IMM.timeout).equals(1500);
                expect(IMM.domain).equals('https://testdomain.abc');
                expect((IMM.doms[0] as SPC).getSiblings[0].field).equals('testField_1');
                expect((IMM.doms[0] as SPC).getSiblings[0].getElement).equals('testTag_1');
                expect((IMM.doms[0] as SPC).getSiblings[0].regex).equals('[0-9]+[\,]*[0-9]*');
                expect((IMM.doms[1] as SPC).getSiblings[0].regex).equals('[0-9]+[\,]*[0-9]*');
                expect((IMM.doms[1] as SPC).getFilterSelector).equals('Scope_2 Parent_2 Child_2');
                expect(IMM.hasNavpane).equals(true);

            });

            it('[003] Verifying the content of the mapped JSON `InputMessage` class instance', () => {
                const IM = new InputMessage('https://testdomain.abc','/testpage');

                IM.addFilterSelector("Scope_1 Parent_1 Child_1")
                    .addField('testField_1','testTag_1','testClassName_1','[0-9]+[\,]*[0-9]*')
                    .addField('testField_2','testTag_2','testClassName_2');
    
                IM.addFilterSelector("Scope_2 Parent_2 Child_2")
                    .addField('testField_11','testTag_11','testClassName_11','[0-9]+[\,]*[0-9]*');
    
                IM.addPaginator('table tr td','href');
    
                /**
                 * Serializing the 'InputMessage' class instance into string format
                 */
                const jsonIM = IOMessageMapper.toJSON(IM);
    
                /**
                 * Mapping the JSON class instance thanks to the `inputMessageMapper()` static method
                 * 
                 * NOTE : As the method has been privately settled this method is then dynamically reached 
                 */
                const IOMM = IOMessageMapper['inputMessageMapper'](JSON.parse(jsonIM)) as InputMessage;

                expect((<Array<SPC>>IOMM.doms)[0].getFilterSelector).equals("Scope_1 Parent_1 Child_1");
                expect((<Array<SPC>>IOMM.doms)[0].getSiblings[0].field).equals("testField_1");
                expect((<Array<SPC>>IOMM.doms)[1].getFilterSelector).equals("Scope_2 Parent_2 Child_2");
                expect((<Array<SPC>>IOMM.doms)[1].getSiblings[0].field).equals("testField_11");
                expect((<Array<NavPane>>IOMM.doms)[2].getFilterSelectorSignature).equals("table tr td");
                expect((<Array<NavPane>>IOMM.doms)[2].attribute).equals("href");
    
            });

            it('[004] Catching an exception while passing a null value from parameter', () => {
                let err = new FlyshException(0,new Error(),"");
                const IM = new InputMessage('https://testdomain.abc','/testpage');

                IM.addFilterSelector("Scope_1 Parent_1 Child_1")
                    .addField('testField_1','testTag_1','testClassName_1','[0-9]+[\,]*[0-9]*')
                    .addField('testField_2','testTag_2','testClassName_2');
    
                IM.addFilterSelector("Scope_2 Parent_2 Child_2")
                    .addField('testField_11','testTag_11','testClassName_11','[0-9]+[\,]*[0-9]*');
    
                IM.addPaginator('table tr td','href');
    
                /**
                 * Mapping the JSON class instance thanks to the `inputMessageMapper()` static method
                 * 
                 * NOTE : As the method has been privately settled, this one is dynamically called
                 */
                try {
                    const IOMM = IOMessageMapper['inputMessageMapper'](null) as InputMessage;
                } catch(exception) {
                    err = <FlyshException>exception;
                }
                expect((<FlyshException>err).errorID).to.equal(8500001000);
                expect((<FlyshException>err).message).to.equal(IOMessageMapper.EXCEPTION_ID_8500001000_MESSAGE_VALUE+"\nCause : ");

            });

            it('[005] Catching an exception while passing an undefined value from parameter', () => {
                let err = new FlyshException(0,new Error(),"");
                const IM = new InputMessage('https://testdomain.abc','/testpage');

                IM.addFilterSelector("Scope_1 Parent_1 Child_1")
                    .addField('testField_1','testTag_1','testClassName_1','[0-9]+[\,]*[0-9]*')
                    .addField('testField_2','testTag_2','testClassName_2');
    
                IM.addFilterSelector("Scope_2 Parent_2 Child_2")
                    .addField('testField_11','testTag_11','testClassName_11','[0-9]+[\,]*[0-9]*');
    
                IM.addPaginator('table tr td','href');
    
                /**
                 * Passing an undefined value to the `inputMessageMapper()` static method
                 * 
                 * NOTE : As the method is privately set, this one is dynamically called 
                 */
                try {
                    const IOMM = IOMessageMapper['inputMessageMapper'](undefined) as InputMessage;
                } catch(exception) {
                    err = <FlyshException>exception;
                }
                expect((<FlyshException>err).errorID).to.equal(8500001000);
                expect((<FlyshException>err).message).to.equal(IOMessageMapper.EXCEPTION_ID_8500001000_MESSAGE_VALUE+"\nCause : ");

            });

        });

});