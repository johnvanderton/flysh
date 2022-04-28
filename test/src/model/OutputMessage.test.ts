import { expect } from 'chai';
import { OutputMessage, PageRecords } from '../../../src/class/model/OutputMessage';

/**
 * 'OutputMessage' Main Class Test
 */
describe('_________("OuputMessage" Class Model Tests)_________', () => {

    /**
     * 'OutputMessage' Class Model "Non-Dynamic" Tests
     */
    describe('_________("OutputMessage" Class "Non-Dynamic" Tests)_________', () => {

        describe('>>> Class methods testing, do : ', () => {

            /**
             * Integrity check 'integrityCheck()' method validation
             */
            it('[0001] Expecting "integrityCheck()" method to returns "false" value', () => {    
                let output = new OutputMessage(1,"testdomain.com");
                let pageR1 = new PageRecords("testdomain.com/test1",true);
                let pageR2 = new PageRecords("testdomain.com/test2",true);
                let pageR3 = new PageRecords("testdomain.com/test3",false);
                output.addPageRecords(pageR1);
                output.addPageRecords(pageR2);
                output.addPageRecords(pageR3);
                expect(output.integrityCheck).to.be.false;
            });

            /**
             * Integrity check 'integrityCheck()' method validation
             */
            it('[0002] Expecting "integrityCheck()" method to returns "true" value', () => {    
                let output = new OutputMessage(1,"testdomain.com");
                let pageR1 = new PageRecords("testdomain.com/test1",false);
                let pageR2 = new PageRecords("testdomain.com/test2",false);
                let pageR3 = new PageRecords("testdomain.com/test3",false);
                output.addPageRecords(pageR1);
                output.addPageRecords(pageR2);
                output.addPageRecords(pageR3);
                expect(output.integrityCheck).to.be.true;
            });

            /**
             * Integrity check 'integrityCheck()' method validation
             */
            it('[0003] Expecting "integrityCheck()" method to returns "false" value', () => {    
                let output = new OutputMessage(1,"testdomain.com");
                let pageR1 = new PageRecords("testdomain.com/test1",true);
                let pageR2 = new PageRecords("testdomain.com/test2",true);
                let pageR3 = new PageRecords("testdomain.com/test3",true);
                output.addPageRecords(pageR1);
                output.addPageRecords(pageR2);
                output.addPageRecords(pageR3);
                expect(output.integrityCheck).to.be.false;
            });

            /**
             * Integrity check 'integrityCheck()' method validation
             */
            it('[0004] Expecting "integrityCheck()" method to returns "true" value', () => {    
                let output = new OutputMessage(1,"testdomain.com");
                let pageR1 = new PageRecords("testdomain.com/test1",false);
                output.addPageRecords(pageR1);
                expect(output.integrityCheck).to.be.true;
            });

        });
    });

});