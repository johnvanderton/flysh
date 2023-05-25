import { FlyshException } from '../../../src/class/exception/FlyshException';
import { InputMessage } from '../../../src/class/io/InputMessage';
import { NavPane } from '../../../src/class/model/NavPane';
import { SPC } from '../../../src/class/model/SPC';

const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));

/**
 * 'InputMessage' Main Class Test
 */
describe('_________("InputMessage" Class Model Tests)_________', () => {    

    /**
     * 'InputMessage' Class Model "Non-Dynamic" Tests
     */
    describe('_________("InputMessage" Class "Dynamic" Tests)_________', () => {
    });

    /**
     * 'InputMessage' Class Model "Non-Dynamic" Tests
     */
    describe('_________("InputMessage" Class "Non-Dynamic" Tests)_________', () => {

        /**
         * Class constructor
         */
         describe('>>> During Class constructor, do : ', () => {

            it('[001] Expecting "_timeout" property equals to "500" value', () => {
                const im = new InputMessage('local','testpage',500);
                expect(im.timeout).equal(500);
            });

            it('[002] Expecting "_timeout" property equals to the default "1500" value', () => {
                const im = new InputMessage('local','testpage');
                expect(im.timeout).equal(1500);
            });

            it('[003] Expecting a throwed exception due to invalid domain (empty)', () => {
                let err = new FlyshException(0, new Error(), "");
                try {
                    new InputMessage('','');
                } catch (exception) {
                    err = <FlyshException>exception;
                }
                expect(err.errorID).to.equal(6500005100);
                expect(err.message).to.equal(InputMessage.EXCEPTION_ID_6500005100_MESSAGE_VALUE+"\nCause : ");
            });

            it('[004] Expecting filesystem property setted to true (local)', () => {
                const im = new InputMessage('.','');
                expect(im.filesystem).equal(true);
                expect(im.URI).equal('.');
            });

            it('[005] Expecting filesystem property setted to true (local)', () => {
                const im = new InputMessage('file.html','');
                expect(im.filesystem).equal(true);
                expect(im.URI).equal('file.html');
            });

            it('[006] Expecting filesystem property setted to true (local)', () => {
                const im = new InputMessage('./file.html','');
                expect(im.filesystem).equal(true);
                expect(im.URI).equal('./file.html');
            });

            it('[007] Expecting filesystem property setted to false (URL)', () => {
                const im = new InputMessage('https://domain.abc','');
                expect(im.filesystem).equal(false);
                expect(im.URI).equal('https://domain.abc');
            });

            it('[008] Expecting filesystem property setted to false (URL)', () => {
                const im = new InputMessage('http://domain.abc','');
                expect(im.filesystem).equal(false);
                expect(im.URI).equal('http://domain.abc');
            });

            it('[009] Expecting filesystem property setted to false (URL)', () => {
                const im = new InputMessage('http://www.domain.abc','');
                expect(im.filesystem).equal(false);
                expect(im.URI).equal('http://www.domain.abc');
            });

            it('[010] Expecting filesystem property setted to false (URL)', () => {
                const IM = new InputMessage('https://www.domain.abc','');
                expect(IM.filesystem).equal(false);
                expect(IM.filesystem).to.be.false;
                expect(IM.URI).equal('https://www.domain.abc');
            });

        });

        /**
         * Class initialization
         */
        describe('>>> During Class initialization, do : ', () => {

            it('[001] Expecting "URI" property equals to "https://testdomain.abc/testpage" value', () => {
                const IM = new InputMessage('https://testdomain.abc','/testpage');
                expect(IM.URI).equal('https://testdomain.abc/testpage');
            });

            it('[002] Expecting "filesystem" property to be false', () => {
                const IM = new InputMessage('https://testdomain.abc','/testpage');
                expect(IM.filesystem).to.be.false;
                expect(IM.filesystem).equal(false);
            });
        });

        /**
         * Class method testing
         */
        describe('>>> Class methods testing, do : ', () => {

            /**
             * Verifies specific parts of the string returned by the 'toString()' method
             */
            it('[001] Expecting "toString()" method returning specific string', () => {
                const im_001 = new InputMessage('https://testdomain.abc','testpage',10);
                im_001.addFilterSelector('scope_tag parent_tag child_tag')
                        .addField('column_1','tagName_1','className_1','RegExString_1')
                        .addField('column_2','tagName_2','className_2','RegExString_2')
                        .addField('column_3','tagName_3','className_3','RegExString_3');
                expect(im_001.toString).to.include('Field : column_3');
                expect(im_001.toString).to.include('Regex : RegExString_2');
                expect(im_001.toString).to.include('Element : tagName_1');
            });

            /**
             * Validates the 'DOM' type elements returned by the 'findDOMElement()' method
             */
            it('[002] Expecting "findDOMElement()" method returning 1 "NavPane" and 2 "SCP" class instances', () => {
                const im_001 = new InputMessage('https://testdomain.abc','testpage',10);
                im_001.addFilterSelector('scope_value_1 parent_tag_value_1 child_tag_value_1');
                im_001.addFilterSelector('scope_value_2 parent_tag_value_2 child_tag_value_2');
                im_001.addPaginator('scope_tag_value_1 parent_tag_value_1 child_tag_value_1','dom_element_class');
                expect(im_001.findDOMElement(NavPane)[0] instanceof NavPane).to.be.true;
                expect(im_001.findDOMElement(SPC)[0] instanceof SPC).to.be.true;
                expect(im_001.findDOMElement(SPC)[1] instanceof SPC).to.be.true;
            });

            /**
            * Verifies that the 'addFilterSelector()' method is returning the new added 'SPC' class instance itself
            */
            it('[003] Verifies that the new added "SPC" class instance is having the same filter selector signature and 0 "Sibling" element', () => {
                let IM = new InputMessage('https://testdomain.abc','',10);
                let addedSPC_1 = IM.addFilterSelector("somevalue_1 somevalue_2");
                expect(addedSPC_1.getFilterSelector).to.equal("somevalue_1 somevalue_2");
                expect((addedSPC_1.getSiblings.length)).to.equal(0);
            });

            /**
            * Verifies that the 'addFilterSelector()' method is throwing an exception due to a redundant 'SPC' class instance with the same filter selector value
            */
            it('[004] Verifies that the "addFilterSelector()" method is throwing an exception due to a redundant "SPC" class instance with the same filter selector value', () => {
                let err = new FlyshException(0,new Error(),"");
                let IM = new InputMessage('https://testdomain.abc','',10);
                 try {
                    IM.addFilterSelector("somevalue_1 somevalue_2");
                    IM.addFilterSelector("somevalue_1 somevalue_2");
                } catch(exception) {
                    err = <FlyshException>exception;
                }
                expect((<FlyshException>err).errorID).to.equal(6500001100);
                expect((<FlyshException>err).message).to.equal(InputMessage.EXCEPTION_ID_6500001100_MESSAGE_VALUE+"\nCause : ");
            });

            /**
            * Verifies that the 'addPaginator()' is throwing an exception due to an already existing 'NavPane' (Paginator) instance
            */
            it('[005] Verifies that the "addPaginator()" is throwing an exception due to a already existing "NavPane" instance', () => {
                let err = new FlyshException(0,new Error(),"");
                let IM = new InputMessage('https://testdomain.abc','',10);
                try {
                    IM.addPaginator("somevalue_1 somevalue_2","href");
                    IM.addPaginator("somevalue_1 somevalue_2","href");
                } catch (exception) {
                    err = <FlyshException>exception;
                }
                expect((<FlyshException>err).errorID).to.equal(6500001200);
                expect((<FlyshException>err).message).to.equal(InputMessage.EXCEPTION_ID_6500001200_MESSAGE_VALUE+"\nCause : ");
            });
        });
    });

});