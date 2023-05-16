import { Flysh } from '../../../src/class/Flysh';
import { FlyshException } from '../../../src/class/exception/FlyshException';
import { InputMessage } from '../../../src/class/io/InputMessage';
import { PageRecords } from '../../../src/class/lib/PageRecords';
import { Sibling } from '../../../src/class/lib/Sibling';
import { SPC } from '../../../src/class/lib/SPC';

const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));

/**
 * 'SPC' Main Tests (Inner) Class
 */
describe('_________("SPC" Class "Non-Dynamic" Tests)_________', () => {

    /**
     * Testing methods
     */
    describe('>>> Class method testing, do : ', () => {

        describe('>>> Class "addField()" method testing, do : ', () => {

            /**
             * Validates the 'Sibling' instantiation by identifying an unique element (field)
             */
            it('[001] Expecting "addField()" method to returns one element length and a field value that equals "test_value"', () => {
                let dom_1 = new SPC('scope_tag_value parent_tag_value', new Array<Sibling>());
                let scpInstance = dom_1.addField("test_value","","","");
                expect(scpInstance.getSiblings.length).to.equal(1);
                expect(scpInstance.getSiblings[0].field).to.equal("test_value");
            });

            /**
             * Validates the 'field' parameter by raising an exception due to no parameters
             */
            it('[002] Expecting "addField()" method to throws an exception due to missing mandatory "field"', () => {
                let err = new FlyshException(0,new Error(),"",);
                let dom_1 = new SPC('scope_tag parent_tag', new Array<Sibling>());
                try {
                    dom_1.addField('','','','');
                } catch (exception) {
                    err = <FlyshException>exception;
                }
                expect(err.errorID).to.equal(5300000100);
                expect(err.message).to.equal(Sibling.EXCEPTION_ID_5300000100_MESSAGE_VALUE+"\nCause : ");
            });

            /**
             * Validates the 'field' parameter by raising up an exception due to a record redundancy 
             */
            it('[003] Expecting "addField()" method to throws an exception due to already having a "Sibling" with the same filter selector signature', () => {
                let err = new FlyshException(0,new Error(),"");

                let dom_1 = new SPC('scope_tag parent_tag', new Array<Sibling>());
                try {
                    dom_1.addField('somefieldnamevalue','','','');
                    dom_1.addField('somefieldnamevalue','','','');
                } catch (exception) {
                    err = <FlyshException>exception;
                }
                expect(err.errorID).to.equal(5200000300);
                expect(err.message).to.equal(SPC.EXCEPTION_ID_5200000300_MESSAGE_VALUE+"\nCause : ");
            });

        });   

        /**
         * Complementary tests about the optional 'regex' field
        */
        describe('>>> Class "addField()" method extended "regex" tests, do : ', () => {

            /**
             * Validates the optional 'regex' parameter to be equal to a string value (empty)
             */
            it('[001] Expecting "addField()" method fourth "regex" parameter to be equal to empty value', () => {
                let dom_1 = new SPC('scope_tag_value parent_tag_value', new Array<Sibling>());
                let scpInstance = dom_1.addField("fieldname","","","");
                expect(scpInstance.getSiblings[0].regex).to.equal("");
            });

            /**
             * Validates the optional 'regex' parameter emptied optional parameter that equals "undefined"
             */
            it('[002] Expecting "addField()" method to omit the fourth optional "regex" parameter', () => {
                let dom_1 = new SPC('scope_tag_value parent_tag_value', new Array<Sibling>());
                let scpInstance = dom_1.addField("fieldname_value","","");
                expect(scpInstance.getSiblings[0].regex).to.equal(undefined);
            });

            /**
             * Validates the optional 'regex' parameter to be equal to a string value (regular expression)
             */
            it('[003] Expecting "addField()" method fourth "regex" parameter to be equal to a regular expression', () => {
                let dom_1 = new SPC('scope_tag_value parent_tag_value', new Array<Sibling>());
                let scpInstance = dom_1.addField("fieldname","","","^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$");
                expect(scpInstance.getSiblings[0].regex).to.equal("^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$");
            });

            /**
             * Performs a dynamic test with the "pageRecordsCleaner()" cleaning method. Regular expression should extract 
             * the number 9 from alphanumeric field                       
             */
            it('[004] Validates the optional "regex" parameter to be equal to a string value', async () => {
                const f = new Flysh(new InputMessage('domainTest','pathTest'));
                let pgRecord = new PageRecords("uriTest",false);
                let mapArr = new Map<String, String>();
                mapArr.set("testField","fir9stTest");
                pgRecord.recordList.push(mapArr);
                let sibArr = new Array<Sibling>();
                sibArr.push(new Sibling("testField","","","[0-9]+[\,]*[0-9]*"));
                let sibA = new SPC("filterSelectorSignatureTest", sibArr);
                await expect((f['pageRecordsCleaner'](pgRecord,sibA)).recordList[0].get("testField")).to.equal("9");
            });

            /**
             * Performs a dynamic test with "pageRecordsCleaner()" cleaning method. Regular expression should extract 
             * the number 00 from alphanumeric field                         
             */
            it('[005] Validates the optional "regex" parameter to be equal to a string value', async () => {
                const f = new Flysh(new InputMessage('domainTest','pathTest'));
                let pgRecord = new PageRecords("uriTest",false);
                let mapArr = new Map<String, String>();
                mapArr.set("testField","00fir9stTest");
                pgRecord.recordList.push(mapArr);
                let sibArr = new Array<Sibling>();
                sibArr.push(new Sibling("testField","","","[0-9]+[\,]*[0-9]*"));
                let sibA = new SPC("filterSelectorSignatureTest", sibArr);
                await expect((f['pageRecordsCleaner'](pgRecord,sibA)).recordList[0].get("testField")).to.equal("00");
            });

            /**
             * Performs a dynamic test with "pageRecordsCleaner()" cleaning method. Regular expression should extract
             * the number 2 from alphanumeric field
             */
            it('[006] Validates the optional "regex" parameter to be equal to a string value', async () => {
                const f = new Flysh(new InputMessage('domainTest','pathTest'));
                let pgRecord = new PageRecords("uriTest",false);
                let mapArr = new Map<String, String>();
                mapArr.set("testField","abc0002");
                pgRecord.recordList.push(mapArr);
                let sibArr = new Array<Sibling>();
                sibArr.push(new Sibling("testField","","","[1-9]\d{0,2}$"));
                let sibA = new SPC("filterSelectorSignatureTest", sibArr);
                await expect((f['pageRecordsCleaner'](pgRecord,sibA)).recordList[0].get("testField")).to.equal("2");
            });

        });

        describe('>>> Class "hasFullFilter()" method testing, do : ', () => {

            /**
             * Validates the 'filter selector' with the 'hasFullFilter()' method
             */
            it('[001] Expecting "hasFullFilter()" method to returns false value', () => {
                let siblings1 = new Array<Sibling>();
                let dom1 = new SPC('scope_tag parent_tag', siblings1);
                expect(dom1.hasFullFilter()).to.be.false;
            });

            /**
             * Validates the 'filter selector' with the 'hasFullFilter()' method
             */
            it('[002] Expecting "hasFullFilter()" method to returns true value', () => {
                let siblings1 = new Array<Sibling>();
                let dom1 = new SPC('scope_tag parent_tag child_tag', siblings1);
                expect(dom1.hasFullFilter()).to.be.true;
            });

        });   

    });
});