import { Flysh } from '../../src/class/Flysh';
import { FlyshException } from '../../src/class/model/FlyshException';
import { InputMessage } from '../../src/class/model/InputMessage';
import { OutputMessage, PageRecords } from '../../src/class/model/OutputMessage';

const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));

/**
 * 'Flysh' main class test
 * 
 * The following tests are using the 'Chai'/'Chai as Promised' libraries
 * 
 *  - `describe()` is commonly known as 'test suites' and merely for grouping, which you can nest as deep
 *  - `it()` is a test case
 *  - `before()`, `beforeEach()`, `after()`, `afterEach()` are hooks to run before/after first/each it() or describe()
 *  - `before()` is run before first it()/describe()
 *
 *  DOC : 'Mochas' https://samwize.com/2014/02/08/a-guide-to-mochas-describe-it-and-setup-hooks/
 *  DOC : 'Chai as Promised' https://www.chaijs.com/plugins/chai-as-promised/
 *  DOC : 'Promise' https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 *  DOC : 'testing' https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2
 */

/**
 * Flysh Class 'Dynamic Tests'
 * 
 * 'Flysh' class functions are also invoked dynamically during Test Suites. Most ot the class methods are set to private which is 
 * making the tests a bit more difficult. Because of their access specifiers, some are thinking that there is no 'quality audit' 
 * to perform at this level. Private elements are not reachable from outside the class for ethical programming reasons. In another 
 * hand, I still believe that quality comes from code implementation and don't have to refer to any data encapsulation or some 
 * exclusive 'callable' functions. Typescript language is allowing to reach private element dynamically, which means that tests 
 * are still possible. As said, this is only a workaround and certainly NOT the best way to perform the tests optimally. Meanwhile, 
 * all the tests can't be performed here for some technical reasons. First because dynamic testing is invoking native code and 
 * doesn't have the same behaviour from real code implementation.
 * 
 * NOTE : It seems that 'dynamic testing' is able to test thrown back native exceptions. Meanwhile, this exception can't be 
 *        directly catched from code implementation either the function itself
 * TODO : Directly test 'pageRecordsCleaner()', 'pageParser()', 'rowsMapper()'
 * TODO : Think to organize 'imbricated test'/'nested suites' 
 */
describe('_________(Flysh Class "Dynamic Tests")_________', () => {

     describe('>>> Before parsing the current page document, do : ', () => {

        it('[001] Throws an exception because of invalid (URL), "fetchDOM()"', async () => {
            const f = new Flysh(new InputMessage('','',false,800));
            let pageRecNotFaulted : PageRecords = new PageRecords('', false);
            let pageRecFaulted : PageRecords = new PageRecords('', true);
            let pglist = new Array<PageRecords>();
            pglist.push(pageRecFaulted);
            pglist.push(pageRecNotFaulted);
            pglist.push(pageRecNotFaulted);
            await expect(f['fetchDOM']("")).to.be.rejectedWith(TypeError,"Invalid URL");
        });

        it('[002] Throws an exception because of file not found (empty), invalid directory (ENOENT), "harvesting()"', async () => {
            const f = new Flysh(new InputMessage('','',true,800));
            let pageRecNotFaulted : PageRecords = new PageRecords('', false);
            let pageRecFaulted : PageRecords = new PageRecords('', true);
            let pglist = new Array<PageRecords>();
            pglist.push(pageRecFaulted);
            pglist.push(pageRecNotFaulted);
            pglist.push(pageRecNotFaulted);
            await expect(f['harvesting']("")).to.be.rejectedWith(FlyshException,"Exception occured during process\nCause : ENOENT: no such file or directory, open \'\'");
        });

        it('[003] Throws an exception because of invalid URL (empty), harvesting()', async () => {
            const f = new Flysh(new InputMessage('','',false,800));
            let pageRecNotFaulted : PageRecords = new PageRecords('', false);
            let pageRecFaulted : PageRecords = new PageRecords('', true);
            let pglist = new Array<PageRecords>();
            pglist.push(pageRecFaulted);
            pglist.push(pageRecNotFaulted);
            pglist.push(pageRecNotFaulted);
            await expect(f['harvesting']("")).to.be.rejectedWith(FlyshException,"Exception occured during process\nCause : Invalid URL: ");
        });

        it('[004], Expects harvesting() method to be fulfilled', async () => {
            const f = new Flysh(new InputMessage('','',true,800));
            await expect(f['harvesting']("./test/dataset/100.htm")).to.be.fulfilled;
        });
    });

    describe('>>> After parsing "MF, Multi Family" type page, do : ', () => {

        it('[001] Detects any fault while scraps merging, pageRecordsMerger()', () => {
            const f = new Flysh(new InputMessage('','',false,800));
            let pageRecNotFaulted : PageRecords = new PageRecords('test', false); 
            let pageRecFaulted : PageRecords = new PageRecords('test', true);
            let pglist = new Array<PageRecords>();
            pglist.push(pageRecFaulted);
            pglist.push(pageRecNotFaulted);
            pglist.push(pageRecNotFaulted);
            expect(f['pageRecordsMerger'](pglist).getError).to.be.true;
            });

        it('[002] Expects the URL page name from the first pushed "PageRecord" element, pageRecordsMerger()', () => {
            const f = new Flysh(new InputMessage('','',false,800));
            let pageRecNotFaulted : PageRecords = new PageRecords('testPageNotFaulted', false); 
            let pageRecFaulted : PageRecords = new PageRecords('testPageFaulted', true);
            let pglist = new Array<PageRecords>();
            pglist.push(pageRecFaulted);
            pglist.push(pageRecNotFaulted);
            pglist.push(pageRecNotFaulted);
            expect(f['pageRecordsMerger'](pglist).URI).to.be.equal("testPageFaulted");
            });
    });
});

/**
 * Flysh Class 'Non Dynamic Tests' scenarios
 * 
 * Cases are organised from public methods only
 * 
 * BUG : Seems that 'describe' doesn't receive if passing 'asynch' parameter
 * 
 */
describe('_________(Flysh Class "Non Dynamic Tests")_________', () => {

    describe('>>> Flysh Class "Initialization" Tests', () => {

        it('[001] Expects "flysh" class status "done" not true during instanciation', () => {
            const f = new Flysh(new InputMessage('test','test',false,800));
            expect(f.isDone()).to.be.false;
        });

        it('[002] Expects empty "OutputMessage" object', () => {
            const f = new Flysh(new InputMessage('test','test',false,800));
            let retObj = f.getOutputMessage();
            expect((<OutputMessage>retObj).pageRecordList).to.be.empty;
        });

    });

    describe('>>> Flysh Class "Exceptions" Tests', () => {
        it('[001] Expected flysh class "done" status not true during instanciation', () => {
            const f = new Flysh(new InputMessage('test','test',false,800));
            expect(f.isDone()).to.be.false;
        });

        it('[002] Expected empty "OutputMessage"', () => {
            const f = new Flysh(new InputMessage('test','test',false,800));
            let retObj = f.getOutputMessage();
            expect((<OutputMessage>retObj).pageRecordList).to.be.empty;
        });

    });

    /**
     *  NOTE : Some fields are repetitive because of their visibility (hidden or not)
     *         -> all the fields are currently taken
     */
    describe('>>> "Flysh" Class preseted local datasets', () => {
 
        /**
         * Dataset "100.htm" [Regular] (Used as example from 'README.md' file)
         */
         describe('>>> >>> Regular testing, field delimited with sibling(s) [Dataset "100.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/100.htm',true,800);
            IM.addSPC('table tr td').addSibling('column_1','','','');
            const f = new Flysh(IM);

            it('Expects 1 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(1);
                });
            });

            it('Expects preseted data values from the first page, first row, first column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].get('column_1')).to.be.equal("row_0_column_0_value");
                });
            });
        });

        /**
         * Dataset "100.htm" [Regular] (Used as example from 'README.md' file)
         */
        describe('>>> >>> Regular testing, field undelimited with no sibling(s) [Dataset "100.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/100.htm',true,800);
            IM.addSPC('table tr td');
            const f = new Flysh(IM);

            it('Expects 1 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(1);
                });
            });

            it('Expects preseted data values from the first page, first row, first column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].values().next().value).to.be.equal('row_0_column_0_value');
                });
            });
        });

        /**
         * Dataset "10001.htm" [Regular]
         */
         describe('>>> >>> [Dataset "10001.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/10001.htm',true,800);
            IM.addSPC('table tr td')
                .addSibling('column_1','','','')
                .addSibling('column_2','','','')
                .addSibling('column_3','','','');

            const f = new Flysh(IM);

            it('Expects 6 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(6);
                });
            });

            it('Expects preseted data values from the first page, second row, third column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[1].get('column_3')).to.be.equal("row_2_column_3_value");
                });
            });

            it('Expects preseted data values from the first page, first row, second column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].get('column_2')).to.be.equal("row_1_column_2_value");
                });
            });

        });

        /**
         * Dataset "10002.htm" [Regular]
         */
        describe('>>> >>> [Dataset "10002.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/10002.htm',true,800);
            IM.addSPC('#table_1_id tr td')
                .addSibling('column_1','','','')
                .addSibling('column_2','','','')
                .addSibling('column_3','','','');

            const f = new Flysh(IM);

            it('Expects 6 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(6);
                });
            });

            it('Expects preseted data values from the first page, second row, third column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[1].get('column_3')).to.be.equal("row_2_column_3_value");
                });
            });

            it('Expects preseted data values from the first page, first row, second column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].get('column_2')).to.be.equal("row_1_column_2_value");
                });
            });

         });

        /**
         * Dataset "10003.htm" [Regular]
         */
        describe('>>> >>> [Dataset "10003.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/10003.htm',true,800)
            IM.addSPC('#table_1_id tr.tr_class_1 td')
                .addSibling('column_1','','','')
                .addSibling('column_2','','','')
                .addSibling('column_3','','','');

            const f = new Flysh(IM);

            it('Expects 6 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(6);
                });
            });

            it('Expects preseted data values from the first page, second row, third column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[1].get('column_3')).to.be.equal("row_2_column_3_value");
                });
            });

            it('Expects preseted data values from the first page, first row, second column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].get('column_2')).to.be.equal("row_1_column_2_value");
                });
            });

         });

        /**
         * Dataset "10004.htm" [Regular]
         */
        describe('>>> >>> [Dataset "10004.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/10004.htm',true,800)
            IM.addSPC('#table_1_id tr.tr_class_1 td.td_class_1')
                .addSibling('column_1','','','')
                .addSibling('column_2','','','')
                .addSibling('column_3','','','');

            const f = new Flysh(IM);

            it('Expects 6 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(6);
                }); 
            });

            it('Expects preseted data values from the first page, second row, third column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[1].get('column_3')).to.be.equal("row_2_column_3_value");
                });
            });

            it('Expects preseted data values from the first page, first row, second column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].get('column_2')).to.be.equal("row_1_column_2_value");
                });
            });

        });

        /**
         * Dataset "10005.htm" [Regular]
         */
         describe('>>> >>> [Dataset "10005.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/10005.htm',true,800);
            IM.addNavPane('span.nav_pagination_control_class a','href');
            IM.addSPC('#table_1_id tr.tr_class_1 td.td_class_1')
                .addSibling('column_1','','','')
                .addSibling('column_2','','','')
                .addSibling('column_3','','','');

            const f = new Flysh(IM);

            it('Expects 6 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(6);
                });
            });

            it('Expects preseted data values from the first page, second row, third column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[1].get('column_3')).to.be.equal("row_2_column_3_value");
                });
            });

            it('Expects preseted data values from the first page, first row, second column', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].get('column_2')).to.be.equal("row_1_column_2_value");
                });
            });

            it('Expects multiple pages to parse from navigation page (3x)', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).numberOfPages).to.be.equal(3);
                });
            });

            it('Expects total number of records equal to 18', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).numberOfRecords).to.be.equal(18);
                });
            });

        });

        /**
         * Dataset "30000.htm" [Complex]
         */
        describe('>>> >>> [Dataset "30000.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/30000.htm',true,800);
            IM.addSPC('#list_items_id div.item_class')
                .addSibling('column_1','a','','regExBrand')
                .addSibling('column_2','span','item_description_rec_class','regExDescription')
                .addSibling('column_3','span','item_detail_rec_class','regExDescription');

            const f = new Flysh(IM);

            it('Expects 6 records returned from the list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(6);
                });
            });

            it('Expects preseted data values from the first page, second item, second field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[1].get('column_2')).to.be.equal("item_1_description_value");
                });
            });

            it('Expects preseted data values from the first page, first item, third field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].get('column_3')).to.be.equal("item_0_detail_value");
                });
            });

            it('Expects multiple pages to parse from navigation page (1x)', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).numberOfPages).to.be.equal(1);
                });
            });

        });

        /**
         * Dataset "30001.htm" [Complex]
         */
        describe('>>> >>> [Dataset "30001.htm"]', () => {

                let IM = new InputMessage('.','/test/dataset/30001.htm',true,800);
                IM.addNavPane('span.nav_pagination_control_class a','href');
            IM.addSPC('#list_items_id div.item_class')
                .addSibling('column_1','a','','regExBrand')
                .addSibling('column_2','span','item_description_rec_class','regExDescription')
                .addSibling('column_3','span','item_detail_rec_class','regExDescription');

            const f = new Flysh(IM);

            it('Expects 6 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(6);
                });
            });

            it('Expects preseted data values from the first page, second item, second field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[1].get('column_2')).to.be.equal("item_1_description_value");
                });
            });

            it('Expects preseted data values from the first page, first item, third field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].get('column_3')).to.be.equal("item_0_detail_value");
                });
            });

            it('Expects preseted data values from the second page, first item, third field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[1].recordList[0].get('column_3')).to.be.equal("item_0_detail_value");
                });
            });

            it('Expects preseted data values from the third page, first item, third field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[2].recordList[0].get('column_3')).to.be.equal("item_0_detail_value");
                });
            });

            it('Expects multiple pages to parse from navigation page (3x)', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).numberOfPages).to.be.equal(3);
                });
            });

        });

        /**
         * Dataset "30002.htm" [Complex]
         */
        describe('>>> >>> [Dataset "30002.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/30002.htm',true,800);
            IM.addSPC('#list_items_class tr.item_row_class')
                .addSibling('column_1','span','item_class','')
                .addSibling('column_2','span','span_subfield_1_class','')
                .addSibling('column_3','span','span_subfield_2_class','')
                .addSibling('column_4','span','span_subfield_3_class','');

            const f = new Flysh(IM);

            it('Expects one page to parse', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).numberOfPages).to.be.equal(1);
                });
            });

            it('Expects 36 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(36);
                });
            });

            it('Expects preseted data values from the first page, second item, second field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[1].get('column_2')).to.be.equal("item_row_0_column_1_detail_1_value");
                });
            });

            it('Expects preseted data values from the first page, first item, third field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].get('column_3')).to.be.equal("item_row_0_column_0_detail_2_value");
                });
            });

            it('Expects preseted data values from the first page, fifth item, fourth field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[5].get('column_4')).to.be.equal("item_row_1_column_2_detail_3_value");
                });
            });

            it('Expects preseted data values from the first page, seventh field, second field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[7].get('column_2')).to.be.equal("item_row_2_column_1_detail_1_value");
                });
            });

        });

        /**
         * Dataset "30003.htm" 'MF - MultiFamilies' [Complex]
         */
        describe('>>> >>> [Dataset "30003.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/30003.htm',true,800); 

            IM.addSPC('#list_items_id span.item_field_span_class').addSibling('column_1','p','item_name.item_class','');
            IM.addSPC('#list_items_id ul.item_field_ul_class li').addSibling('column_2','','','');
            IM.addSPC('#list_items_id div.item_field_div_class').addSibling('column_3','p','','');

            const f = new Flysh(IM);

            it('Expects one page to parse', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).numberOfPages).to.be.equal(1);
                });
            });

            it('Expects 12 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(12);
                });
            });

            it('Expects preseted data values from the first page, second item, second field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[1].get('column_2')).to.be.equal("row_1_field_1_value");
                });
            });

            it('Expects preseted data values from the first page, first item, third field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].get('column_3')).to.be.equal("row_0_field_2_value");
                });
            });

            it('Expects preseted data values from the first page, fourth item, third field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[3].get('column_3')).to.be.equal("row_3_field_2_value");
                });
            });

        });

        /**
         * Dataset "60001.htm" [Special]
         */
        describe('>>> >>> [Dataset "60001.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/60001.htm',true,800);
            IM.addSPC('table tr')
                .addSibling('column_1','td','td_class_1','')
                .addSibling('column_2','td','td_class_2','')
                .addSibling('column_3','td','td_class_3','');

            const f = new Flysh(IM);

            it('Expected 9 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(9);
                });
            });

            it('Expected preseted data values from the first page, second item, second field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[1].get('column_2')).to.be.equal("row_2_column_3_value");
                });
            });

            it('Expected preseted data values from the first page, third item, first field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[2].get('column_1')).to.be.equal("row_3_column_2_value");
                });
            });

        });

        /**
         * Dataset "60002.htm" [Special]
         */
        describe('>>> >>> [Dataset "60002.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/60002.htm',true,800);
            IM.addSPC('table tr')
                .addSibling('column_1','td','td_class_1','')
                .addSibling('column_2','td','td_class_2','')
                .addSibling('column_3','td','td_class_3','');

            const f = new Flysh(IM);

            it('Expected 9 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(9);
                });
            });

            it('Expected preseted data values from the first page, second item, first field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[1].get('column_1')).to.be.equal(undefined);
                });
            });

            it('Expected preseted data values from the first page, third item, third field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[2].get('column_3')).to.be.equal("row_3_column_3_value");
                });
            });
    
        });

        /**
         * Dataset "60003.htm" [Special]
         */
         describe('>>> >>> [Dataset "60003.htm"]', () => {

            let IM = new InputMessage('.','/test/dataset/60003.htm',true,800);
            IM.addSPC('table tr')
                .addSibling('column_1','td','td_class_1','')
                .addSibling('column_2','td','td_class_2','')
                .addSibling('column_3','td','td_class_3','');

            const f = new Flysh(IM);

            it('Expected 1 page of records', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).numberOfPages).to.be.equal(1);
                });
            });

            it('Expected 12 records returned from the first page list', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].numberRecords).to.be.equal(12);
                });
            });

            it('Expected preseted data values from the first page, first item, first field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[0].get('column_1')).to.be.equal('row_1_column_1_value');
                });
            });

            it('Expected preseted data values from the first page (undefined), third item, second field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[2].get('column_2')).to.be.equal(undefined);
                });
            });

            it('Expected preseted data values from the first page (undefined), fourth item, first field', async () => {
                await f.run().then(() => {
                    expect((<OutputMessage>f.getOutputMessage()).pageRecordList[0].recordList[3].get('column_1')).to.be.equal(undefined);
                });
            });
    
        });

    });
});