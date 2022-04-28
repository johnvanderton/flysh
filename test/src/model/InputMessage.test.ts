import { FlyshException } from '../../../src/class/model/FlyshException';
import { InputMessage, NavPane, Sibling, SPC } from '../../../src/class/model/InputMessage';

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
                const im_001 = new InputMessage('local','testpage',false,500);
                expect(im_001.timeout).equal(500);
            });

            it('[002] Expecting "_timeout" property equals to the default "800" value', () => {
                const im_001 = new InputMessage('local','testpage',false);
                expect(im_001.timeout).equal(800);
            });

        });

        /**
         * Class initialization
         */
        describe('>>> During Class initialization, do : ', () => {

            it('[001] Expecting "URI" property equals to "https://testdomain/testpage" value', () => {
                const im_001 = new InputMessage('https://testdomain/','testpage',false,10);
                expect(im_001.URI).equal('https://testdomain/testpage');
            });

            it('[002] Expecting "filesystem" property to be false', () => {
                const im_001 = new InputMessage('https://testdomain/','testpage',false,10);
                expect(im_001.filesystem).to.be.false;
            });
        });

        /**
         * Class method testing
         */
        describe('>>> Class methods testing, do : ', () => {

            /**
             * Verifies specific parts of the string returned by 'toString()' function
             */
            it('[001] Expecting "toString()" method returning specific string', () => {
                const im_001 = new InputMessage('https://testdomain/','testpage',false,10);
                im_001.addSPC('scope_tag parent_tag child_tag')
                        .addSibling('column_1','tagName_1','className_1','RegExString_1')
                        .addSibling('column_2','tagName_2','className_2','RegExString_2')
                        .addSibling('column_3','tagName_3','className_3','RegExString_3');
                expect(im_001.toString).to.include('Field : column_3');
                expect(im_001.toString).to.include('Regex : RegExString_2');
                expect(im_001.toString).to.include('Element : tagName_1');
            });

            /**
             * Validates the 'doms' type elements returned by the 'findDOMElement()' function
             */
            it('[002] Expecting "findDOMElement()" method returning 1 "NavPane" and 2 "SCP" class instances', () => {
                const im_001 = new InputMessage('https://testdomain/','testpage',false,10);
                im_001.addSPC('scope_value_1 parent_tag_value_1 child_tag_value_1');
                im_001.addSPC('scope_value_2 parent_tag_value_2 child_tag_value_2');
                im_001.addNavPane('scope_tag_value_1 parent_tag_value_1 child_tag_value_1','dom_element_class');
                expect(im_001.findDOMElement(NavPane)[0] instanceof NavPane).to.be.true;
                expect(im_001.findDOMElement(SPC)[0] instanceof SPC).to.be.true;
                expect(im_001.findDOMElement(SPC)[1] instanceof SPC).to.be.true;
            });

            /**
            * Verifies that the 'addSPC()' function is returning the new added 'SPC' class instance itself
            */
            it('[003] Verifies that the new added "SPC" class instance is having the same filter selector signature and 0 "Sibling" element', () => {
                let IM = new InputMessage('testdomain.com','',false,10);
                let addedSPC_1 = IM.addSPC("somevalue_1 somevalue_2");
                expect(addedSPC_1.getFilterSelector).to.equal("somevalue_1 somevalue_2");
                expect((addedSPC_1.getSiblings.length)).to.equal(0);
            });

            /**
            * Verifies that the 'addSPC()' method is throwing an exception due to a redundant 'SPC' class instance with the same filter selector value
            */
            it('[004] Verifies that the "addSPC()" method is throwing an exception due to a redundant "SPC" class instance with the same filter selector value', () => {
                let err = new FlyshException(0,new Error(),"");
                let IM = new InputMessage('testdomain.com','',false,10);
                 try {
                    IM.addSPC("somevalue_1 somevalue_2");
                    IM.addSPC("somevalue_1 somevalue_2");
                } catch(exception) {
                    err = <FlyshException>exception;
                }
                expect((<FlyshException>err).errorID).to.equal(6500001100);
                expect((<FlyshException>err).message).to.equal(InputMessage.EXCEPTION_ID_6500001100_MESSAGE_VALUE+"\nCause : ");
            });

            /**
            * Verifies that the 'addNavPane()' is throwing an exception due to a already existing 'NavPane' instance
            */
            it('[005] Verifies that the "addNavPane()" is throwing an exception due to a already existing "NavPane" instance', () => {
                let err = new FlyshException(0,new Error(),"");
                let IM = new InputMessage('testdomain.com','',false,10);
                try {
                    IM.addNavPane("somevalue_1 somevalue_2","href");
                    IM.addNavPane("somevalue_1 somevalue_2","href");
                } catch (exception) {
                    err = <FlyshException>exception;
                }
                expect((<FlyshException>err).errorID).to.equal(6500001200);
                expect((<FlyshException>err).message).to.equal(InputMessage.EXCEPTION_ID_6500001200_MESSAGE_VALUE+"\nCause : ");
            });
        });
    });

    /**
     * 'SPC' Main Tests (Inner) Class
     */
    describe('_________("SPC" Class "Non-Dynamic" Tests)_________', () => {

        /**
         * Method testing implementation
         */
        describe('>>> Class method testing, do : ', () => {

            /**
             * Validates the 'field' parameter with the 'addSibling()' method
             */
             it('[001] Expecting "addSibling()" method to throws an exception due to missing mandatory "field"', () => {
                let err = new FlyshException(0,new Error(),"",);
                let dom_1 = new SPC('scope_tag parent_tag', new Array<Sibling>());
                try {
                    dom_1.addSibling('','','','');
                } catch (exception) {
                    err = <FlyshException>exception;
                }
                expect(err.errorID).to.equal(5300000100);
                expect(err.message).to.equal(Sibling.EXCEPTION_ID_5300000100_MESSAGE_VALUE+"\nCause : ");
            });

            /**
             * Validates the 'field' parameters with the 'addSibling()' method
             */
            it('[002] Expecting "addSibling()" method to throws an exception due to already having a "Sibling" with the same filter selector signature', () => {
                let err = new FlyshException(0,new Error(),"");

                let dom_1 = new SPC('scope_tag parent_tag', new Array<Sibling>());
                try {
                    dom_1.addSibling('somefieldnamevalue','','','');
                    dom_1.addSibling('somefieldnamevalue','','','');
                } catch (exception) {
                    err = <FlyshException>exception;
                }
                expect(err.errorID).to.equal(5200000300);
                expect(err.message).to.equal(SPC.EXCEPTION_ID_5200000300_MESSAGE_VALUE+"\nCause : ");
            });

            /**
             * Validates the 'Sibling' instance with the 'addSibling()' method
             */
            it('[003] Expecting "addSibling()" method to returns one element length and a field value that equals "test_value"', () => {
                let dom_1 = new SPC('scope_tag_value parent_tag_value', new Array<Sibling>());
                let scpInstance = dom_1.addSibling("test_value","","","");
                expect(scpInstance.getSiblings.length).to.equal(1);
                expect(scpInstance.getSiblings[0].field).to.equal("test_value");
            });

            /**
             * Validates the 'filter selector' with the 'hasFullFilter()' method
             */
            it('[004] Expecting "hasFullFilter()" method to returns false value', () => {
                let siblings1 = new Array<Sibling>();
                let dom1 = new SPC('scope_tag parent_tag', siblings1);
                expect(dom1.hasFullFilter()).to.be.false;
            });

            /**
             * Validates the 'filter selector' with 'hasFullFilter()' method
             */
             it('[005] Expecting "hasFullFilter()" method to returns true value', () => {
                let siblings1 = new Array<Sibling>();
                let dom1 = new SPC('scope_tag parent_tag child_tag', siblings1);
                expect(dom1.hasFullFilter()).to.be.true;
            });

        });
    });

});