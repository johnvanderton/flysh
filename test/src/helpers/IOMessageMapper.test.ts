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
                 * Deserializing the stringified 'InputMessage' class instance into an 'any' object type class instance
                 */
                const IMM = IOMessageMapper.fromJSON(jsonIM);

                expect(IMM.DEFAULT_INSTANCE_TIMEOUT_VALUE).equals(1500);
                expect(IMM._domain).equals('https://testdomain.abc');
                expect(IMM._doms[0]._siblings[0]._element).equals("testTag_1");
                expect(IMM._doms[0]._siblings[0]._regex).equals("[0-9]+[\,]*[0-9]*");
                expect(IMM._doms[1]._filterselectorsignature).equals("Scope_2 Parent_2 Child_2");
                expect(IMM._doms[1]._siblings[0]._regex).equals("[0-9]+[\,]*[0-9]*");
                expect(IMM._doms[0]._siblings[0]._element).equals("testTag_1");
                expect(IMM._navpane).equals(true);

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
                 * Deserializing the stringified 'InputMessage' class instance into an 'any' object type class instance
                 */
                const IOM = IOMessageMapper.fromJSON(jsonIM);

                /**
                 * Mapping the JSON class instance with the `inputMessageMapper` static method
                 */
                const IOMM = IOMessageMapper.inputMessageMapper(IOM) as InputMessage;

                expect((<Array<SPC>>IOMM.doms)[0].getFilterSelector).equals("Scope_1 Parent_1 Child_1");
                expect((<Array<SPC>>IOMM.doms)[0].getSiblings[0].field).equals("testField_1");
                expect((<Array<SPC>>IOMM.doms)[1].getFilterSelector).equals("Scope_2 Parent_2 Child_2");
                expect((<Array<SPC>>IOMM.doms)[1].getSiblings[0].field).equals("testField_11");
                expect((<Array<NavPane>>IOMM.doms)[2].getFilterSelectorSignature).equals("table tr td");
                expect((<Array<NavPane>>IOMM.doms)[2].attribute).equals("href");
    
            });

        });

});