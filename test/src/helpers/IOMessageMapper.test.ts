import { FlyshException } from "../../../src/class/exception/FlyshException";
import { InputMessage } from "../../../src/class/io/InputMessage";
import { IOMessageMapper } from "../../../src/class/helpers/IOMessageMapper";
import { NavPane } from "../../../src/class/model/NavPane";
import { OutputMessage } from "../../../src/class/io/OutputMessage";
import { PageRecords } from "../../../src/class/model/PageRecords";
import { SPC } from "../../../src/class/model/SPC";

const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));

    /**
     * 'IOMessageMapper' Helper Main Class Test
     */
    describe('_________("IOMessageMapper" Helper Main Class Test)_________', () => {

        /**
         * Testing the `InputMessage` class Serialization/Deserialization
         */
        describe('>>> During `InputMessage` Serialization/Deserialization do : ', () => {

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

            it('[002] Verifying all the elements contained into the returned JSON object from the stringified `InputMessage` class instance', () => {
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
                 * Deserializing the previous string value and map it into an `InputMessage` class instance
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
                 * Serializing the 'InputMessage' class instance into a string format
                 */
                const jsonIM = IOMessageMapper.toJSON(IM);
    
                /**
                 * Mapping the JSON class instance thanks to the `doInputMessageMapping()` static method
                 * 
                 * NOTE : As the method has been privately settled, this method is then dynamically reached 
                 */
                const IOMM = IOMessageMapper['doInputMessageMapping'](JSON.parse(jsonIM)) as InputMessage;

                expect((<Array<SPC>>IOMM.doms)[0].getFilterSelector).equals("Scope_1 Parent_1 Child_1");
                expect((<Array<SPC>>IOMM.doms)[0].getSiblings[0].field).equals("testField_1");
                expect((<Array<SPC>>IOMM.doms)[1].getFilterSelector).equals("Scope_2 Parent_2 Child_2");
                expect((<Array<SPC>>IOMM.doms)[1].getSiblings[0].field).equals("testField_11");
                expect((<Array<NavPane>>IOMM.doms)[2].getFilterSelectorSignature).equals("table tr td");
                expect((<Array<NavPane>>IOMM.doms)[2].attribute).equals("href");
    
            });

            it('[004] Catching an exception while passing a `null` value from `InputMessage` parameter', () => {
                let err = new FlyshException(0, new Error(),"");
    
                /**
                 * Mapping the JSON class instance thanks to the `doInputMessageMapping()` static method
                 * 
                 * NOTE : As the method has been privately settled, this one is dynamically called
                 */
                try {
                    IOMessageMapper['doInputMessageMapping'](null) as InputMessage;
                } catch(exception) {
                    err = <FlyshException>exception;
                }
                expect((<FlyshException>err).errorID).to.equal(8500001000);
                expect((<FlyshException>err).message).to.equal(IOMessageMapper.EXCEPTION_ID_8500001000_MESSAGE_VALUE+"\nCause : ");

            });

            it('[005] Catching an exception while passing an `undefined` value from `InputMessage` parameter', () => {
                let err = new FlyshException(0,new Error(),"");

                /**
                 * Passing an `undefined` value to the `doInputMessageMapping()` static method
                 * 
                 * NOTE : As the method is privately set, this method is dynamically called 
                 */
                try {
                    IOMessageMapper['doInputMessageMapping'](undefined) as InputMessage;
                } catch(exception) {
                    err = <FlyshException>exception;
                }
                expect((<FlyshException>err).errorID).to.equal(8500001000);
                expect((<FlyshException>err).message).to.equal(IOMessageMapper.EXCEPTION_ID_8500001000_MESSAGE_VALUE+"\nCause : ");
            
            });

            it('[006] Verifying the content of the stringified `InputMessage` class instance', () => {
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
            
        });

        /**
         * Testing the `OutputMessage` class Serialization/Deserialization
         */
        describe('>>> During `OutputMessage` Serialization/Deserialization do : ', () => {

            it('[001] Verifying the content of the mapped JSON `OutputMessage` class instance', () => {
                const OM = new OutputMessage(-1,"./");
                const PR = new PageRecords("./", false);

                let item = new Map<string,string>();
                item.set("keyTest", "valueTest");
                PR.recordList.push(item, item);
    
                OM.addPageRecords(PR);
                OM.addPageRecords(PR);

                /**
                 * Serializing the 'OutputMessage' class instance into string format
                 */
                const jsonIM = IOMessageMapper.toJSON(OM);

                /**
                 * Deserializing the previous string value and map it into a new `OutputMessage` class instance
                 */
                const OMM = IOMessageMapper.fromJSON(jsonIM) as OutputMessage;

                expect(OMM.domain).equals('./');
                expect(OMM.ID).equals(-1);
                expect(OMM.pageRecordList[0].getError).equals(false);
                expect(OMM.pageRecordList[0].numberRecords).equals(2);
                expect(OMM.pageRecordList[0].recordList[0].has("keyTest")).equals(true);
                expect(OMM.pageRecordList[0].recordList[1].has("keyTest")).equals(true);
                expect(OMM.pageRecordList[0].recordList[1].size).equals(1);
                expect(OMM.pageRecordList[0].recordList.length).equals(2);

            });

            it('[002] Verifying all the elements contained into the returned JSON object from the stringified `OutputMessage` class instance', () => {
                const OM = new OutputMessage(-1,"./");
                const PR = new PageRecords("./", true);

                let item = new Map<string,string>();
                item.set("keyTest", "valueTest");
                
                PR.recordList.push(item, item);
    
                OM.addPageRecords(PR);
                OM.addPageRecords(PR);
    
                /**
                 * Serializing the 'OutputMessage' class instance into string format
                 */
                const jsonOM = IOMessageMapper.toJSON(OM);

                expect(jsonOM).contains("_domain","./");
                expect(jsonOM).contains("_id","-1");
                expect(jsonOM).contains("_error","true");
                expect(jsonOM).contains("value","keyTest");
                expect(jsonOM).contains("value","valueTest");
                
            });

            it('[003] Catching an exception while passing an `undefined` value from `OuptutMessage` parameter', () => {
                let err = new FlyshException(0,new Error(),"");

                /**
                 * Passing an `undefined` value to the `doOutputMessageMapping()` static method
                 * 
                 * NOTE: As the method is privately set, this one is dynamically called 
                 */
                try {
                    const IOMM = IOMessageMapper['doOutputMessageMapping'](undefined) as OutputMessage;
                } catch(exception) {
                    err = <FlyshException>exception;
                }
                expect((<FlyshException>err).errorID).to.equal(8500002000);
                expect((<FlyshException>err).message).to.equal(IOMessageMapper.EXCEPTION_ID_8500002000_MESSAGE_VALUE+"\nCause : ");
            
            });

            it('[004] Catching an exception while passing a `null` value from `OuputMessage` parameter', () => {
                let err = new FlyshException(0,new Error(),"");
    
                /**
                 * Mapping the JSON class instance thanks to the `doOutputMessageMapping()` static method
                 * 
                 * NOTE : As the method is privately set, this one is dynamically called 
                 */
                try {
                    const IOMM = IOMessageMapper['doOutputMessageMapping'](null) as OutputMessage;
                } catch(exception) {
                    err = <FlyshException>exception;
                }
                expect((<FlyshException>err).errorID).to.equal(8500002000);
                expect((<FlyshException>err).message).to.equal(IOMessageMapper.EXCEPTION_ID_8500002000_MESSAGE_VALUE+"\nCause : ");

            });

        });

});