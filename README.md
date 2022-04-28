# README

    Document last update : 27/04/2022
    Author : John Van Derton — john@cserv.be 

## What is it ?

    'Flysh' is a preprocessor built over the 'JQuery' library and dedicated to collect predefined set of data from 'HTML' type document.

## How does it work ?

    Shortly, it's all about 'DOM' and how 'HTML/XHTML/XML' pages can be interacted with. But what 'DOM' acronym does mean? The definition given by the W3C consortium is 'Document Object Model', this standard is dedicated to formalize interaction when accessing documents.
        
        "The W3C Document Object Model (DOM) is a platform and language-neutral interface that allows programs and scripts to dynamically access and update the content, structure, and style of a document." Source, https://www.w3schools.com/

    That’s being said, nothing can yet really help the developer to easily manipulate these objects except by using the 'DOM' API (of course). If ‘JavaScript’ already offers the possibility to handle, it is surely not without taking into account the support of the "essentials" such as ‘JQuery’. This way and by opting for powerful solutions, ‘Flysh’ is aiming only one purpose : to help you to collect data efficiently!

## When to use it ?

    Literally, if you wish to process any 'HTML' pages locally or from the internet and if you are looking for specific information at various time frequencies.

## How to use it ?

    The behind philosophy is willing to provide an easy to use and accessible tool. Any usage prerequires a bit of configuration as you need to define the scope of data first and to setup some particular objects. That's it! This section does not summarize all the possibilities but tries to give you a common basis to anticipate further complex combinations. For more concrete examples go to the 'src/class/helpers'. Once in this directory, you can manually execute both 'ClassLoader.ts', 'SimpleClassLoader.ts' classes by simply running the next command "node .\dist\out-tsc\index.js". Note that the 'index.js' file is the artifact generated after compiling the 'index.ts' file; please refer to the "Contribute" section for more details. 

### Simple example
    
    This example shows a simple 'HTML' structure that includes an element called 'table'. The objective here is to locate the 'test' value and to extract it.

    1) The first step you need to do is to target the document that you want to process,

        ''' Local 'HTML' type document sample code ('somefilename.htm')
            <html>
                <body>
                    <table>
                        <tr>
                            <td>
                                test
                            </td>
                        </tr>
                    </table>
                </body>
            </html>

    2) The below code shows you how to invoke the 'Flysh' library and how to set it up properly, 

        ''' Typescript code example
            // Invoke useful libraries
            import { Flysh } from "../Flysh";
            import { InputMessage } from "../model/InputMessage";
            import { OutputMessage, PageRecords } from "../model/OutputMessage";

            // Instanciate the 'InputMessage' class (the local file/filesystem parameter is set to 'true')
            let inputMessage = new InputMessage('.','/some/path/somefilename.htm',true);
            // Add the 'SPC' (Scope/Parent/Child) class instance with a fully defined filter selector i.e : 'table tr td'
            inputMessage.addSPC('table tr td');
            // Instanciate the 'Flysh' class by passing the 'InputMessage' object from parameter
            let f = new Flysh(inputMessage);

            // Run the 'Flysh' class instance
            f.run();
            
    3) How to get the results ? After running the 'Flysh' instance, an object response (promise) is then returned asynchronously. See the example from below, 

        ''' Typescript code example
                flysh.run()
                    .then(() => {
                        let outputMessage : OutputMessage = f.getOutputMessage();
                        console.log('Pages/Total of Records [' + outputMessage.numberOfPages + ', ' 
                                                               + outputMessage.numberOfRecords + ']' 
                                                               + "\n" + 'Integrity Check ' + ' : ' 
                                                               + outputMessage.integrityCheck);
                        outputMessage.pageRecordList.forEach((e: PageRecords)=> {console.log(e);});
                        console.log("\n### End of process ###\n");
                    });

        A list is returned by the 'PageRecords' class getter method and available as follow,

            ''' Typescript code example
                outputMessage.pageRecordList.forEach((e: PageRecords)=> {console.log(e);});

    4) After displaying the content of a 'PageRecords', you will finally obtain the below stack,

        PageRecords {   
            _error: false,
            _page: './test/dom/simple_dom_table.htm',
            _recordList: [ Map { 'name_column_1' => 'test' } ]
        }
    
        The 'PageRecords' object response is having the following fields,
            - 'error' which is being set to 'false' if any record was found faulty during process
            - 'page' that provides the current "URI" (domain/path)
            - 'recordList' which contains the results either from the 'Map' type variable

    5) To conclude, we can notice that the 'SPC' class instance has been configured thanks to the 'addSPC()' method. This implies that,

         - A hierarchical entity has been predefined within the the current page,
            - The entity is composed of,
                - A "Scope", i.e : 'table'
                - A "Parent", i.e : 'tr'
                - A "Child", i.e : 'td'  
            - This entity has been manually identified by the user on the document
         - This method is returning the instanciated 'SPC' class itself
             - Adding new sibling(s) to it is possible thanks to the 'addSibling()' method
                 - This method can be invoked as many times as there are fields. It has the following parameters,
                     - Each field is nameable, i.e : "Product"
                     - Has an "HTML" tag, i.e : "<a>"
                     - Is definable by a class value, i.e : "<a class="xyz">"
                     - Each field is editable by a regular expression, i.e : "[0-9]+[\,]*[0-9]*"
                - Example : addSPC('table tr td').addSibling('Product','a','xyz','[0-9]+[\,]*[0-9]*');

### Simple example with a pagination table ('NavPane')

    The pagination table stores all the page result into a visible 'HTML' array. These pages are stored with references (URI) and can be retrieved by 'Flysh'. Once identified, the address values are stored in a stack and scanned one after another. The data are then collected and saved into a list of 'PageRecords' objects. In order to obtain these data, and as seen previously, a data scope area must be identified beforehand. Once the filter selector correctly defined, it will be necessary to configure the object in charge of data repatriation and to attach it to the main 'InputMessage' object. This attachment is done by the 'addNavPane()' method.

        Source code of a pagination table ('NavPane'),

            ''' 'HTML' code sample example
                <span class="nav_pagination_control_class">
                    <span>1</span>
                        <a class="nav_textlink_class" href="somedomain/somepath/page_2.htm">2</a>
                        <a class="nav_textlink_class" href="somedomain/somepath/page_3.htm">3</a>
                </span>

    The parsing of this 'HTML' part of code produce additional results by scanning all the contained pages. To do this, it will be necessary to inform the instantiated class 'InputMessage' that there is a pagination table ('navpane'). See example from below,

         ''' Typescript code sample example
            let IM = new InputMessage('somedomain','/somepath/page_root.htm',true);
            IM.addNavPane('span.nav_pagination_control_class a','href');
            ...
            let f = new Flysh(IM);
            ...

    The source code from above informs the 'Flysh' instance that the input message 'InputMessage' has been linked with an object of type 'NavPane'. The 'addNavPane()' method has two parameters which include the filter selector that identifies the data area to process and the tag attribute parameter of the underlying 'child' elements. This attribute/property contains the path to the next page to browse and so on.  

### How to define the filter selector (Data scope) ?

   It is important to get a good definition of the environment and the area where the data will be extracted. It will depend on the hierarchy related to the specific architecture of the 'HTML' objects and the way it is organized. Going back to the 'table' example, we know that this element has a hierarchy on which we can make an assumption. On this basis, we can consider that the highest element is 'table' which can be defined as the 'Scope' and its underlying elements, hierarchically lower, can be repetitive. In this case, the 'tr' element is the direct child of 'table' and parent of the 'td' element. By this predicate, we can therefore conclude that the 'tr' element has a role of parent related to its subclass 'td' but can also be repetitive just like its descendant(s).
        
                'table' element -[has one or more]- 'tr' element(s) -[has one or more]- 'td' element(s)

    The purpose of the 'SPC' (Scope-Parent-Child) class filter selector is to define this hierarchy in order to best identify the data to extract. To this end, the filter can be represented in the following way ('table tr td') but also in another way ('table tr'). This last representation tells the selector to only focusing on the 'table' (scope) and the parent 'tr' element without having to define first the 'child' element. Through the 'addSibling()' method, it becomes possible to provide more details regarding the extraction of the 'child' element by assigning it its field values (i.e, 'Product'), its 'HTML' tag definition (i.e, 'tr'), its 'class' name property (i.e, 'class=xyz') and its possible post-filtering via a regular expression (i.e, '[0-9]+[\,]*[0-9]*'). This method is accessible from the 'SPC' instance and can be invoked as many times as there are child/sibling elements, for example:

            <table>	
                <tr class=’class_ parent’>
                    <td class=’class_product’>product_item</td>
                    <td class=’class_description’>description_item</td>
                </tr>
                <tr>
                    <td>...</td>
                    ...
                </tr>
                ...
            </table>
            
            This HTML code is 'parsable' by Flysh as follow,
            _______________________________________________________________________
            addSPC(‘table tr’)
                .addSibling(‘product’,’td’,’class_product’,’<REGEX_VALUE>’)
                .addSibling(‘description’,’td’,’class_description’,’’);
        or  _______________________________________________________________________
            addSPC(‘table tr’)
                .addSibling(‘product’,’td’,’’,’’)
                .addSibling(‘description’,’td’,'’,’’);
        or  _______________________________________________________________________
            addSPC(‘table tr td’);

    You will notice that it is possible to go through in different ways. In general, the more you provide about the structure, the more precision you will have while collecting information. Beforehand this data identification can be done manually only, however the user can benefit from several tools helping to identify the data scope area. Not to mention them, there are several including "DevTools" from Chrome and "FireBugs" from Mozilla.

## Contribution

    If you wish to contribute to the 'Flysh' project, you can invoke some useful commands to keep the project up to date. Oh and if you're experiencing some 'humps' or even having any thoughs about new functional requirements, feel free to share on https://github.com/johnvanderton/flysh thanks!

        ''' NPM commands
            npm update
            npm outdated

### Installation

    You can manually install the library from "NPM" by doing the following command,

        ''' NPM command
            npm install flysh

### Commands

    All the commands are available from the 'tasks.json' file. Among the most important and runnable from the root project folder,

        ''' Console command [Windows\Linux]
            - cleaning binaries : "rimraf .\dist\*"
            - compiling : "tsc -p .\tsconfig.json"
            - testing : "mocha -r ts-node/register test/**/*.test.ts test/**/**/*.test.ts test/src/**/*.test.ts"
            - running : "node .\dist\out-tsc\index.js"

### Framework dependencies

    This current version library has been implemented and tested on, 
        - NodeJS >= v12.13.0
        - 'ES6' EcmaScript 

### Exceptions list

    ID '1500001200', 'Flysh' Class', "No qualified 'SPC DomElement' instance(s) found"
    ID '1500001300', 'Flysh' Class', "No qualified 'NavPane DomElement' instance(s) found"
    ID '1500001400', 'Flysh' Class', "Timeout value cannot be negative"
    ID '1500003100', 'Flysh' Class', "Exception occured during process"
    ID '2000000000', 'Flysh' Class', "Request(s) timed out"
    ID '5100000100', 'NavPane' Class, "A 'NavPane' class instance must have a filter selector value, i.e : 'table tr td'"
    ID '5100000200', 'NavPane' Class, "A 'NavPane' class instance filter selector must have 2 elements at least"
    ID '5100000300', 'NavPane' Class, "A 'NavPane' class instance must have an attribute, i.e : 'href'"
    ID '5200000100', 'SPC' Class, "A 'SPC' class instance must have a filter selector value, i.e : 'table tr td'"
    ID '5200000200', 'SPC' Class, "A 'SPC' class instance filter selector must have 2 elements at least"
    ID '5200000300', 'SPC' Class, "A 'Sibling' class instance is already having the same field"
    ID '5300000100', 'Sibling' Class, "A 'Sibling' class instance must have a mandatory field"
    ID '6500001100', 'InputMessage' Class, "Another 'SCP' class instance has the same filter selector"
    ID '6500001200', 'InputMessage' Class, "A 'NavPane' class instance has already been set"

### Appendices

    The below files are parts of the project library,

        - '.vscode/launch.json' contains the script used when debugging
        - '.vscode/tasks.json' defines tasks such as 'clean', 'build' and 'tests'
        - 'properties.cnf' is the property file that help to set all the configurable values
        - 'test/listing.csv' lists all the 'HTML' file dataset used by set of tests classes 

## Licence

    Copyright (C) 2020 — 2022, John Van Derton
    [MIT] https://choosealicense.com/licenses/mit/

    Please read the 'LICENCE' file for more information

## Support

    Feel free to support, thanks!
    [BTC] bc1q84seqrs0tvzy22gekx3u98xf92ujxvju0jsqrl