[![lang](https://img.shields.io/badge/Language-Typescript-Blue.svg?color=007acc&style=flat-square)](https://www.typescriptlang.org)
![License](https://img.shields.io/github/license/johnvanderton/flysh)
[![npm version](https://img.shields.io/npm/v/flysh?color=7c2cc7&style=flat-square)](https://www.npmjs.com/package/flysh) 

# **README**

- Document last update : 15/05/2023
- Author : **John Van Derton** — **john@cserv.be** 

## **What is it ?**

**Flysh** is a preprocessor built over the **JQuery** library and dedicated to collect data from **HTML** documents.

## **How does it work ?**

Shortly, it's all about **DOM** and how **HTML/(XHTML/XML)** pages can be interacted with. But what **DOM** acronym does mean? The definition given by the **W3C** consortium is 'Document Object Model', this standard is dedicated to formalize interaction when accessing documents.

> "The W3C Document Object Model (DOM) is a platform and language-neutral interface that allows programs and scripts to dynamically access and update the content, structure, and style of a document." (https://www.w3schools.com/)

That’s being said, nothing yet can really help the developer to easily manipulate these objects except by using the native **DOM** API. If JavaScript already integrates the routines for the use of this API, it is surely without counting the support of tools such as `JQuery`. This way and by opting for the best solution, **Flysh** is aiming only one purpose: **to help you to collect data efficiently!**

## **When to use it ?**

Literally, if you wish to parse any **HTML** pages locally or from the internet and if you are looking for specific information at various time frequencies.

## **How to use it ?**

The behind philosophy is willing to provide an easy to use and accessible tool. Any usage prerequires a bit of configuration as you need to define the scope of data first and to set up particular objects afterwards. **That's all!** This section does not summarize all the possibilities but tries to give you a common basis to anticipate more complex combinations. 

For concrete examples, please go to the `src/class/helpers` folder. Once in this directory, you can manually execute both `ClassLoader.ts`, `SimpleClassLoader.ts` classes by simply running the next command `node .\dist\out-tsc\index.js`. Note that the `index.js` file is the artifact generated after compiling `index.ts`. Please refer to the **Contribute** section for more details.

## **Examples**

This section is describing several different use cases thanks to the below examples. 

### **Simple example**
    
This is showing a simple **HTML** structure that includes an element called `table`. The objective here is to locate the 'test' value and to extract it.

1) The first step you need to do is to identify the document that you want to process, i.e `somefilename.htm`

```html
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
```

2) The below code shows how to invoke the **Flysh** library and how to set it up properly, 

```typescript
// Invoke useful libraries
import { Flysh, InputMessage, OutputMessage, PageRecords, FlyshException } from 'Flysh';

// Instantiate the 'InputMessage' class
// Note : A third optional parameter can preset 6a timeout value (default 1500ms)
let inputMessage = new InputMessage('.','/somepath/somefilename.htm');
// Add the 'SPC' (Scope/Parent/Child) class instance with a fully defined filter selector i.e : 'table tr td'
// Note : the 'addSPC()' method is now deprecated -> 'addFilterSelector()'
inputMessage.addFilterSelector('table tr td');
// Instantiate the 'Flysh' class by passing the 'InputMessage' object from parameter
let f = new Flysh(inputMessage);

// Run the 'Flysh' class instance
f.run();
```
            
3) How to get the results ? After running the **Flysh** instance, an object response or `promise` is then returned asynchronously. 

See the example from below, 

```typescript
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

//A list is returned by the 'pageRecords()' getter method and available as follow,
outputMessage.pageRecordList.forEach((e: PageRecords)=> {console.log(e);});
```

4) After displaying the content of a `PageRecords` class instance, you will finally obtain the below stack,

```typescript
PageRecords {   
    _error: false,
    _page: './test/dom/simple_dom_table.htm',
    _recordList: [ Map { 'name_column_1' => 'test' } ]
}
```

The **`PageRecords`** object response is having the following fields,
- `error` which is being set to 'false' if any record was found *faulty* during process
- `page` that provides the current 'URI' (domain/path)
- `recordList` which contains the results either from the `Map` type variable

5) To conclude, we can notice that the **SPC** class instance has been configured thanks to the `addFilterSelector()` method. Which implies,

    - A hierarchical entity has been predefined within the current page,
    - This entity is composed of,
        - A "**scope**", i.e : `table`
        - A "**parent**", i.e : `tr`
        - A "**child**", i.e : `td`  
    - This entity has been manually identified by the user on the document
    - The `addFilterSelector()` method is returning the instantiated **SPC** class itself
        - Adding new field(s) (sibling(s)) to it is possible thanks to the `addField()` method,
            - This method can be invoked as many times as there are fields. It has the following parameters,
                - A field name, i.e : "Product"
                - An "HTML" tag name, i.e : `<a>`
                - A class name value, i.e : `<a class="xyz">`
                - A regular expression value, i.e : `[0-9]+[\,]*[0-9]*`
    - **Example** : `addFilterSelector('table tr td').addField('Product','a','xyz','[0-9]+[\,]*[0-9]*');`

### **Simple example with a pagination table (`Paginator`/`NavPane`)**

A pagination table or `Paginator` stores all the page links into a visible **HTML** navigation bar. These pages are stored with references (URI) and can be retrieved by **Flysh**. Once identified, the address values are stored into a stack and scanned sequentially. The data are then collected and saved into a list of `PageRecords` objects. In order to obtain these data, and as seen previously, a data scope area must be identified beforehand. Once the filter selector correctly defined, it will be necessary to configure the object in charge of the data collection by storing it to the main `InputMessage` class instance. This is done thanks to the `addPaginator()` method.

Source code of a pagination table,

```html
<span class="nav_pagination_control_class">
    <span>1</span>
        <a class="nav_textlink_class" href="somedomain/somepath/page_2.htm">2</a>
        <a class="nav_textlink_class" href="somedomain/somepath/page_3.htm">3</a>
</span>
```

The parsing of this **HTML** code additionally produces result by scanning all the linked pages. In order to do this properly, it must inform the instantiated `InputMessage` class that there is a pagination table (**paginator**). See the example from below,

```typescript
let IM = new InputMessage('.','/somepath/somefilename.htm');
IM.addPaginator('span.nav_pagination_control_class a','href');
...
let f = new Flysh(IM);
```

The source code from above informs the **Flysh** instance that the input message `InputMessage` has been linked with a `NavPane` class instance. The `addPaginator()` method has two parameters which include the filter selector that identifies the data area to process and the tag attribute of the underlying 'child' elements. This attribute contains the path to the next page to browse.

### **'Complex' example**

This section will attempt to demonstrate the ability to manage different structures in the same **HTML** document. The next case example shows when the data, logically nested, cannot be retrieved from a single treatment. Instead, it becomes necessary to instantiate several `SPC` type classes thanks to the `addFilterSelector()` method.

```html
    <table id="list_items_id" style="width:100%; text-align: left">
        ...
        <tr class="item_class">
          <td><span class='item_field_span_class'><p class='item_name item_class'>row_0_field_0_value</p></span></td>
          <td><ul class='item_field_ul_class'><li>row_0_field_1_value</li></ul></td>
          <td><div class='item_field_div_class'><p>row_0_field_2_value</p></div></td>
        </tr>
        ...
    </table>
```

We can observe from below that the three fields have their own definition. By successively recreating the three objects related to each field, it becomes possible to properly achieve the data processing. Note that the new `addField()` method is now replacing `addSibling()`.

```typescript
    let IM = new InputMessage('.','/somepath/somefilename.htm');
    
    IM.addFilterSelector('#list_items_id span.item_field_span_class')
        .addField('column_1','p','item_name.item_class','');
    IM.addFilterSelector('#list_items_id ul.item_field_ul_class li')
        .addField('column_2','','','');
    IM.addFilterSelector('#list_items_id div.item_field_div_class')    
        .addField('column_3','p','','');

    const f = new Flysh(IM);
```

**Flysh** is able to perform complex combinations by nesting multiple `SPC` classes. The given example from above is NOT exhaustive but nevertheless provides an overview of the current library capabilities.

## **Settings and configuration**

This section explain how to configure particular objects in order to properly use the library.

### **Configuration of the `InputMessage` class instance**

The `InputMessage` class is defining the various information which will be provided to the `Flysh` instance.

#### **Timeout setting**

The `timeout` default value is defined from the `InputMessage` class. This value can be changed by modifying the field provided for this purpose. If no value is set, then the default one will be applyed. The below example shows the `TIMEOUT_VALUE` value as an optional numeric variable.

```Typescript
 	new InputMessage('domain', 'path', DOCUMENT_ACCESS,TIMEOUT_VALUE);
```

### **How to define the filter selector ?**

#### **What is a filter selector ?**

Flysh is entirely relying on the **JQuery** library and, in a same time, fully inherits from its powerful 'selector' feature. Specificly designed to perform **DOM** operations, **Flysh** is only using a part of what **JQuery** can do. For more informations please refer to the next references, https://api.jquery.com/multiple-selector/ and https://api.jquery.com/descendant-selector/
 
**Simple example,**

Based on the JQuery API's 'descendant selector' selector pattern, we can split the filter as follow,

    ['scope/iterator' + 'parent' + 'children' (sibling)]

The first `scope/iterator` element represents the domain where all the elements to be processed are located. The second `parent` element, which can be recursive, represents the element containing fields. Finally, the last element `children` represents the attributes or values that can potentially be kept. For example, it is possible to define these elements accordingly to their `tag` and `class` if necessary. 

The below filter allows to parse a `table` structure,

    [#id_content_value tr.tr_class_value td.td_class_value]

See the below HTML code,

```html
<table id="id_content_value" style="width:100%">
    <tr class="tr_class_1">
        <th>column_1</th>
        ...
    </tr>
    <tr class="tr_class_value">
        <td id="td_row_1_column_1_id" class="td_class_value">
            row_1_column_1_value
        </td>
        ...
    </tr>
    ...
    </table>
```
_This filter definition is important as it completely relies on how the data scope is structured._

#### **What 'data scope' does mean ?**

It is important to get a good definition of the environment and the area where the data will be processed. It will depend on the hierarchy related to the specific architecture of the **HTML** objects and how it is organized. Going back to the `table` example, we know that this element has a hierarchy on which we can make an assumption. On this basis, we can consider that the highest element is `table` which can be defined as the **scope** and its underlying elements, hierarchically lower, can be repetitive. In this case, the `tr` element is the direct child of `table` and parent of the `td` element. From this predicate, we can therefore conclude that the `tr` element has a role of parent related to its subclass `td` but can also be repetitive just like its descendant(s).

    'table' element -[has one or more]- 'tr' element(s) -[has one or more]- 'td' element(s)

The purpose of the `SPC` (Scope-Parent-Child) class filter selector is to define this hierarchy in order to best identify the data to extract. To this end, the filter can be represented as follow (**table tr td**) but also in another way (**table tr**). This last representation tells the selector to only focusing on the `table` (scope) and the parent `tr` element without having to define first the 'child' element. Thanks to the `addField()` method, it becomes possible to provide more details regarding the extraction of the 'child' element by defining:

- A field value, i.e: 'Product'
- An 'HTML' tag definition, i.e: `tr` 
- A 'class' name property, i.e: `class=xyz`
- A post-filtering regular expression (i.e, `'[0-9]+[\,]*[0-9]*'`).

This method is accessible from the `SPC` instance and can be invoked as many times as there are child/sibling elements. 

For example:

```html
<table>	
    <tr class=’class_parent’>
        <td class=’class_product’>product_item</td>
        <td class=’class_description’>description_item</td>
    </tr>
    <tr>
        <td>...</td>
        ...
    </tr>
    ...
</table>
```
This **HTML** code can be processed by **Flysh** as follow,

    addFilterSelector(‘table tr’)
        .addField(‘product’,’td’,’class_product’,’<REGEX_VALUE>’)
        .addField(‘description’,’td’,’class_description’,’’);

or,

    addFilterSelector(‘table tr’)
        .addField(‘product’,’td’,’’,’’)
        .addField(‘description’,’td’,'’,’’);

or even,

    addFilterSelector(‘table tr td’);

You will notice that it is possible to do it in different ways. Generally a precise definition of the data structure will providing you a better quality during their collection. Beforehand, this data identification can be done manually only. However, the user can benefit from tools to help to identify the data scope area such as "DevTools" (**Chrome**), "FireBugs" (**Mozilla**) and many more.

## **Project contribution**

If you wish to contribute to the **Flysh** project, you can invoke some useful commands to keep the project up to date. 

    npm update
    npm outdated

Oh, and if you're experiencing some 'bumps' or even having any thoughs about new functional requirements, feel free to share them on [**GitHUB**](https://github.com/johnvanderton/flysh) 

Thanks!

### **Installation**

You can manually install the library from **NPM** by doing the next command,

    npm install flysh

### **Commands**

All the commands are available from the `tasks.json` file.

**Console commands [Windows\Linux]**
- **clean binaries**, `rimraf .\dist\*`
- **compile**, `tsc -p .\tsconfig.json`
- **test**, [windows], `mocha -r ts-node/register test/**/*.test.ts`
- **test**, [linux], `mocha -r ts-node/register test/**/*.test.ts test/**/**/*.test.ts test/src/**/*.test.ts`
- **run**, `node .\dist\out-tsc\index.js`

### Framework dependencies

This current version library has been implemented, built and tested on,

- **EcmaScript** = `ES2019`
- **EcmaScript** (ESM Module) = `ESNEXT`
- **EcmaScript** (Types Module) = `ESNEXT`
- **Jquery** = `3.7.0`
- **Jsdom** = `22.0.0`
- **NodeJS** >= `20.1.0`
- **NPM** >= `9.1.1`
- **TypeScript** >= `5.0.2`

### **Exceptions list**

The below list is showing all the current exceptions handled by **Flysh**,

    ID '1500001200', 'Flysh' Class', "No any filter selector found"
    ID '1500001300', 'Flysh' Class', "No any 'Paginator' found"
    ID '1500001400', 'Flysh' Class', "Timeout value cannot be negative"
    ID '1500003100', 'Flysh' Class', "Exception occurred during process"
    ID '2000000000', 'Flysh' Class', "Request(s) timed out"
    ID '5100000100', 'NavPane' (Paginator) Class, "A 'Paginator' must have a filter selector value, i.e : 'table tr td'"
    ID '5100000200', 'NavPane' (Paginator) Class, "A 'Paginator' filter selector must have 2 elements at least"
    ID '5100000300', 'NavPane' (Paginator) Class, "A 'Paginator' must have an attribute, i.e : 'href'"
    ID '5200000100', 'SPC' (Filter Selector) Class, "Empty filter selector, i.e : 'table tr td''"
    ID '5200000200', 'SPC' (Filter Selector) Class, "A filter selector must have 2 elements at least"
    ID '5200000300', 'SPC' (Filter Selector) Class, "A previous similar field has already been added"
    ID '5300000100', 'Sibling' (Field) Class, "A field name must be defined"
    ID '6500001100', 'InputMessage' Class, "Another filter selector object has the same signature"
    ID '6500001200', 'InputMessage' Class, "A 'Paginator' has already been set"

### **Appendices**

The below files are parts of the project library,

- **`.vscode/launch.json`** contains the script used when debugging
- **`.vscode/tasks.json`** defines tasks such as `clean`, `build` and `tests`
- **`properties.cnf`** is the property file that help to set all the configurable values
- **`test/listing.csv`** lists all the **HTML** file dataset used by set of tests classes 

## **License**

Copyright (C) 2020 — 2023, **John Van Derton**

Please read the ['LICENCE'](./LICENSE) file for more information.

## **Donate**

Thanks for support ! 

BTC, [bc1q84seqrs0tvzy22gekx3u98xf92ujxvju0jsqrl](bitcoin://bc1q84seqrs0tvzy22gekx3u98xf92ujxvju0jsqrl)