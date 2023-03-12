import { Flysh } from "../Flysh";
import { InputMessage } from "../model/InputMessage";
import { OutputMessage, PageRecords } from "../model/OutputMessage";

/**
 * 'ClassLoader' class helper 
 * 
 * Loads and runs 'flysh' class instance(s)
 */
export class ClassLoader {
        private mappedInputMessagesObjects : InputMessage[];
        private preloadedFlyshInstances : Flysh[];

        /**
         * Constructor
         */
        public constructor() {
                this.mappedInputMessagesObjects = new Array();
                this.preloadedFlyshInstances = new Array();
        }

        /**
         * Initialize instance(s)
         */
        private init() {
                this.loadInputMessage();
        }

        /**
         * Loads 'InputMessage' instance(s)
         * 
         * ###
         * ### Here, you can add some tests to execute from command line (tasks.json)
         * ###
         * ### ~ $ node ${workspaceRoot}\\dist\\out-tsc\\index.js
         * ###
         * 
         */
        private loadInputMessage() {

                /**
                 * Simple table example
                 */
                let inputMessage_1 = new InputMessage('.','/test/dataset/100.htm',true);
                inputMessage_1.addFilterSelector('table tr td')
                        .addField('column_1','tr','cls','');

                /**
                 * Simple table example, field undefined (no sibling)
                 */
                let inputMessage_2 = new InputMessage('.','/test/dataset/300.htm',true);
                inputMessage_2.addFilterSelector('table tr td');

                /**
                 * Complex 'dom' with defined field/siblings 
                 */
                let inputMessage_3 = new InputMessage('.','/test/dataset/10005.htm',true);
                inputMessage_3.addPaginator('span.nav_pagination_control_class a','href');
                inputMessage_3.addFilterSelector('#table_1_id tr.tr_class_1 td.td_class_1')
                        .addField('column_1','','','')
                        .addField('column_2','','','')
                        .addField('column_3','','','');

                /**
                 * Complex 'dom' with defined field/sibling
                 */
                let inputMessage_4 = new InputMessage('.','/test/dataset/30003.htm',true);
                inputMessage_4.addFilterSelector('#list_items_id span.item_field_span_class')
                        .addField('column_1','p','item_name.item_class','');
                inputMessage_4.addFilterSelector('#list_items_id ul.item_field_ul_class li')
                        .addField('column_2','','','');
                inputMessage_4.addFilterSelector('#list_items_id div.item_field_div_class')
                        .addField('column_3','p','','');

                /**
                 * Push input message(s) into 'flysh' class instance
                 */
                this.mappedInputMessagesObjects.push(inputMessage_1);
                //this.mappedInputMessagesObjects.push(inputMessage_2);
                //this.mappedInputMessagesObjects.push(inputMessage_3);
                //this.mappedInputMessagesObjects.push(inputMessage_4);
        }

        /**
         * Preloads a stack with preseted 'flysh' class instance(s) 
         */
        private preloadClassInstances() {
                this.mappedInputMessagesObjects.forEach((inputMessage) => {
                        this.preloadedFlyshInstances.push(new Flysh(inputMessage));
                });
        }

        /**
         * Starts each preloaded instance(s) then waits for each object callback(s)
         */
        private startPreloadedClassInstances() {
                this.preloadedFlyshInstances.forEach((flyshInstance) => {
                        flyshInstance.run()
                                .then(() => {
                                        this.collectingLaunchedClassInstances(flyshInstance);
                                        });
                });
        }

        /**
         * Invoked by the asynchronous instances once they've finished their jobs
         * 
         * @param f 'Flysh' class to instanciate
         */
        private collectingLaunchedClassInstances(f : Flysh) {
                let outputMessage : OutputMessage = f.getOutputMessage();
                console.log('Pages/Total of Records, [' + outputMessage.numberOfPages + ', ' 
                                                       + outputMessage.numberOfRecords + ']' 
                            + "\n" + 'Integrity Check : ' + outputMessage.integrityCheck
                            + "\n" + 'Instance ID : ' + outputMessage.ID 
                            );
                outputMessage.pageRecordList.forEach((e: PageRecords)=> {console.log(e);});
                console.log("\n### End of process ###\n");
        }

        /**
         * Intitializes configuration, preloads and starts class instance(s)
         */
        public run() {
                this.init();
                this.preloadClassInstances();
                this.startPreloadedClassInstances();
        }
}