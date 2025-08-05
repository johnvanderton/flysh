import { Flysh } from "../Flysh";
import { InputMessage } from "../io/InputMessage";
import { PageRecords } from '../model/PageRecords';

/**
 * 'SimpleClassLoader' Class Helper Definition
 * 
 * Loads and runs a 'Flysh' class instance
 */
export class SimpleClassLoader {

        /**
         * Constructor
         */
        public constructor() {}

        /**
         * Runs the 'flysh' class instance
         */
        public async run() {

                let inputMessage = new InputMessage('.','/test/dataset/300.htm');
                inputMessage.addFilterSelector('table tr td');

                let f = new Flysh(inputMessage);
                const results = await f.run();

                console.log('Pages/Total of Records [' + results.numberOfPages + ', ' 
                                                        + results.numberOfRecords + ']' 
                                                        + "\n" + 'Integrity Check ' + ' : ' 
                                                        + results.integrityCheck);
                
                results.pageRecordList.forEach((e: PageRecords)=> {console.log(e);});
                
                console.log("\n### End of process ###\n");

        }

}