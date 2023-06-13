import { Flysh } from "../Flysh";
import { InputMessage } from "../io/InputMessage";
import { OutputMessage } from "../io/OutputMessage";
import { PageRecords } from '../model/PageRecords';

/**
 * 'SimpleClassLoader' class helper
 * 
 * Loads and runs a 'Flysh' class instance
 */
export class SimpleClassLoader {

        /**
         * Constructor
         */
        public constructor() {
        }

        /**
         * Runs the 'flysh' class instance
         */
        public run() {

                let inputMessage = new InputMessage('.','/test/dataset/300.htm');
                inputMessage.addFilterSelector('table tr td');

                let f = new Flysh(inputMessage);
                f.run()
                        .then((results) => {
                                console.log('Pages/Total of Records [' + results.numberOfPages + ', ' 
                                                                       + results.numberOfRecords + ']' 
                                                                       + "\n" + 'Integrity Check ' + ' : ' 
                                                                       + results.integrityCheck);
                                results.pageRecordList.forEach((e: PageRecords)=> {console.log(e);});
                                console.log("\n### End of process ###\n");
                        });

        }

}