import { Flysh } from "../Flysh";
import { InputMessage } from "../model/InputMessage";
import { OutputMessage, PageRecords } from "../model/OutputMessage";

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
                     .then(() => {
                         let outputMessage : OutputMessage = f.getOutputMessage();
                           console.log('Pages/Total of Records [' + outputMessage.numberOfPages + ', ' 
                                                                  + outputMessage.numberOfRecords + ']' 
                                                                  + "\n" + 'Integrity Check ' + ' : ' 
                                                                  + outputMessage.integrityCheck);
                           outputMessage.pageRecordList.forEach((e: PageRecords)=> {console.log(e);});
                           console.log("\n### End of process ###\n");
                        });
        }

}