# Changelog

### 06/01/15 - 08/25/15

- project started
- fixed a bug where children would leave their parent elements when shifting
- added saving/loading capabilities

### 12/06/15

- added basic administration page
- added ability to create a new page from a saved template, passed by get parameters from admin.php
- increased PHP session security by adding "session_unset()" before "session_destroy()"

### 12/07/15

- added experimental mobile-responsive columns, which fixes the bug where inserting a child into a
  column becomes vertically out of line with the other columns
- removed the automatic menu switch when inserting a child
- changed the shiftUp and shiftDown functions to use element.style.cssText instead of looping
  through an array of functions to switch the styles between the elements
- new functions include resetClearFloat and insertClearFloat, which are called from updateSelector
  function

### 12/08/15

- reorganized the directory tree in which templates are saved, it now creates a folder for each
  template and a txt file for each page under that template
- removed function that replaces spaces with underscores when saving template names
- changed event handler for importing items from "click" to "mousedown"
- changed the clear float capability to use element "var" instead of "hr"
- added an if statement in updateSelector that removes the float style from elements that do not
  have a position of relative, solving the issue of elements retaining their float style after being
  changed from a column
- fixed a bug where children were not being retained when shifting elements

### 12/09/15

- fixed a bug where column elements disappear when shifting down
- moved if statement that removes float style from certain changed elements from updateSelector to
  insertClearFloat
- fixed a bug where children that are divided into columns do not insert a clear float
- added a CSS style to the templateItem class to add a scrollbar to the element if the inner
  contents overflow
- added text editing
- added an if statement to showSelection and clearSelection to determine whether the selected
  element is a textBox
- edited the deleteKey function to account for textarea elements in focus
- added an event listener to templateWrapper to call the checkTextEditing function
- new functions include insertTextBox, editText, checkTextEditing, and updateText
- added position and cssFloat to the exportTemplate function
- removed the white-space CSS style from the templateItem class
- the getStyles function now gets the class of the element being performed on
- added an if statement to updateSelector that removes the childItem class from elements if they are
  not a child
- reduced number of regular expressions that exportRaw.php uses for formatting the HTML code to 1

### 12/10/15

- added pagination
- new JS file called loadPages.js, new PHP file called page_list.php
- removed leftover code from an old child node managing function
- fixed the clearSelection function to set the z-index of elements back to 0
- updated exportRaw.php to receive and format the position and float CSS styles
- changed the subMenuOption and menuSection CSS classes from displaying as inline-block to floating
  left
- changed the text editing functions to use the browser's built in rich-text editing capabilites
- added a clearSelection function call at the beginning of the exportTemplate function
- removed an event argument being passed into importItem incorrectly when being called from
  insertNewChild
- added a new function called clearTextSelection to remove text highlighting

### 12/13/15

- began re-designing the entire code structure to use a global object that is instantiated by
  function updateTemplateItems, which replaces updateSelector

### 12/14/15

- continuing re-design of entire code structure

### 12/15/15

- debugging code restructure
- the entire main functions file now uses strict mode
- added isTextBox and isChildItem functions, returns boolean value depending on the object's class
- added containsNbsp and stripNbsp functions, one checks an object for "&nbsp;" in its body and one
  strips it
- clear float elements in the exported code are now formatted correctly
- edited the updateTemplateItems function to delete the reference to the templateItems array to
  reset it
- removed the for loop in shiftUp and shiftDown that replaced resetClearFloat when it was failing

### 12/16/15

- added a randomColor function, replaces the manual color generation in several functions
- fluidWidth function is now called by default on page load to account for tablets and smaller
  screens
- scratch variables are now denoted by "sv" before their name, and anonymous function references are
  now denoted by "anon"
- added custom functions to change text styles: boldText, italicText, underlineText
- added a global variable called originalTextBoxBg and originalTextBoxBorder to reset the background
  color and border styles of edited textboxes to their original styles after finishing editing

### 12/19/15

- fixed a bug where arrow keys used while editing text would shift the element
- fixed a bug where the selection border of textboxes would remain after shifting them and then
  deselecting them
- appending a row now automatically selects the new row
- fixed a bug where inserting a new child into an element with other children automatically selected
  the first child instead of the new child
- fixed a bug where loading a template would break several menu options
- added more text editing options such as font size, color, line height
- edited exportRaw.php to format the HTML code more accurately
- added function refreshTemplateRef to refresh the reference variable pointing to the template
  element

### 12/20/15

- fixed a bug where textboxes in edit mode were being imported on mousedown, letting the original
  background get reset
- changed the bold, italic, and underline text editing functions to only fire if there is editable
  content
- edited the escKey function to cancel text editing if there is editable content
- wrapped the default settings on page load in a function, added a function call for it immediately
  after

### 12/21/15

- inserting columns now imports the selected item before inserting the columns
- edited the fixedWidth and fluidWidth functions to refresh the template reference before continuing
- removed the overflow CSS style from the templateItem class
- changed the default height for inserted children to 100px
- function fixedWidth now appends "px" to numbers passed without a unit
- function saveFont now appends "pt" to numbers typed without a unit
- added a min-height alongside the height to automatically adjust to overflow
- a 10px padding is added to the parent automatically when inserting a textbox
- the 10px padding that is auto-added to parents when inserting a textbox or child is only applied
  if padding does not exist or it it 0

### 12/22/15

- saveFont auto-adds "px" instead of "pt"
- added a templateTooLarge function that alerts the user when the template is too large to export
  and says how many items to remove to make it work
- changed the method of attaching event listeners to input elements from inline to addEventListener
- clearSelection and convertNaN functions skip over the "createHyperlink" input element
- clearing textbox editability is now cleared by clearSelection
- added hyperlinking to text options

### 12/23/15

- fixed a bug where shifting a normal templateItem past a textbox would not remove the textbox event
  listener on the normal item after shifting
- a clearFloat element is now added after floating items if they are the only children of their
  parent
- added a new premade template, which is loaded by default when making a new template
- clearing textbox editability is now cleared by escKey and clearSelection

### 12/24/15

- added a dashed border on elements when hovering over them
- selection border updates on scroll
- fixed a bug where inserting a child into an element with text nodes would import the wrong item
- made drag and drop compatible with the code restructure and selection border
- templates are now saved under a folder called "templates" withing the username folder
- re-styled admin.php

### 12/25/15

- added a simple image upload to admin.php
- images are loaded by function loadImages
- images are inserted as children into elements using insertImage
- children are now selected by getting the index attribute of the last child of the selected item's
  parent and passing it to importItem
- fixed a bug where the selection border would remain after shifting elements
- added compatibility for shifting images
- added resize handles to images
- simplified updateSelectionBorder

### 12/27/15

- added complete image resizing on one handle
- new functions added:
    * initiateResize
    * removeResize
    * resizeImg

### 12/28/15

- added a bottom marker to the template
- the global variable borderSpace is now adjusted according to the width and parent of the hovered
  element
- function updateSelectionBorder is now called by functions fixedWidth and fluidWidth
- when images are finished resizing, the item is imported again
- image resizing now uses 3 handles
- fixed a bug where inserting columns into an element right after styling it would revert the style
  changes
- added resizing to all items

### 12/29/15

- reverted the event listeners on the control buttons back to using inline onClick attributes
- added a new function called getUnit to determine the unit of element styles, for example passing
  "1170px" returns "px"
- resizeItem now resizes in percentage if the selected item has a percentage unit
- insertColumns now divides elements according to their unit instead of just percentage

### 01/01/16

- named the program "Triangle"
- restructured the entire file directory

### 01/02/16

- PHP scripts now use a full directory path reference instead of relative path references
- function chooseColor selected the color of the parent if the item selected with the color dropper
  inherits its color
- edited the shiftUp and shiftDown functions to insert a copied element instead of swapping the
  styles

### 01/03/16

- added a delete link button under text styles
- fixed a bug in function insertClearFloats where clearFloat elements were not being inserted
  correctly
- added new methods to the TemplateItem class:
    * TemplateItem.prototype.prevSibling()
    * TemplateItem.prototype.nextSibling()
    * TemplateItem.prototype.isFirstChild()
    * TemplateItem.prototype.isLastChild()
- updated function exportTemplate and exportRaw.php to process the max-width CSS style
- simplified the blankTemplate function
- simplified functions shiftUp and shiftDown
- changed the text tab in the menu to an anchor tag with an href of javascript:void(0) to prevent
  text from being deselected
- added a prototype triangle logo to the login page

### 01/04/16

- added a prototype logo to the admin page
- made a prototype splash page
- added function isClearFloat to check if an element has a clearFloat class
- fixed a bug where text selection in the menu would disappear on mouse up, the mouseup event to
  release drag resizing is now applied to templateWrapper
- text selection is now cleared upon element resize
- added a better UI to admin.php
- the resize handles on the right are now always rendered within easy grabbing range
- fixed a bug where using the color dropper would shift the selection border to the wrong element

### 01/05/16

- fixed a bug where the last element on the page would glitch when resizing vertically
- function importColors now checks if the selected element inherits the background color, and
  imports the parent's background if so

### 01/06/16

- fixed a bug where height wasn't being applied correctly from the menu

### 01/11/16

- all items now have a CSS position of relative
- the size of a parent now limits the ability to resize its child
- hid the "Premade Templates" tab as part of a plan to integrate it with the "Open" tab
- fixed a bug where the selection border was not updating when centering elements
- exporting without any items causes an alert and the export is cancelled
- changed the color of the main option bar and side options
- added option images for aligning elements left, center, and right
- added compatibility for resizing right-aligned elements, aligned elements now have an "align"
  attribute containing their alignment

### 01/12/16

- added the align attribute to the array of style functions so it can be passed when duplicating,
  and to the shifting functions
- added dimension labels to elements that are being resized

### 01/13/16

- clicking the bottom marker now clears the selection
- added a function called oppositeColor that takes a hex color as an argument and returns the
  opposite color
- fixed a bug where clear floats were not being set correctly when inserting a child
- fixed a bug where images where not being left or right aligned properly
- changed the align item functions to use float instead of auto margins
- adjusted which resize handles show on which types of items, for example image items have all the
  left-side handles when aligned right
- using the bold button when the selected item is not selected bolds all the text inside
- commented out the code that turns the background color of text boxes white when editing

### 01/14/16

- exportTemplate now removes the item-align attribute
- added vertical aligning to middle using tables and table-cells
- added compatibility for vertical-align CSS style in exportRaw.php
- created a new function called createAnother, which takes an object as the argument and returns a
  copy of it, used for shifting, duplicating, vertical align
- padding and margin now use pixels by default when entering numbers
- background color input now takes alphanumeric characters up to 6 digits with or without the # sign

### 01/17/16

- fixed a bug where the RegExp that catches background colors would not accept "inherit"

### 01/18/16

- the text cursor now shows when editing a textbox
- created links are now disabled while in the editor
- redesigned the way templates are listed on the admin page
- the cursor is now displayed normally when previewing a template

### 01/19/16

- began adding support for hover effects

### 01/20/16

- added more support for hover effects
- styleFunctions now assign attributes only if the value is present
- added function checkPadding to add padding to the passed object if it has no padding
- added support for uploading and using custom fonts
- added an "effects" tab on the menu

### 01/23/16

- added PHP functions getDirectory and echoDirectory to be included with scripts that read
  directories

### 01/24/16

- fixed a bug where elements couldnt be resized below their min-height after deleting
  vertical-aligned elements
- aligning elements without a display style now changes their display to block

### 01/25/16

- simplified colorMenu.js
- fixed a bug where hidden libraryItems were increasing the index counter when exporting templates
- added support for font color in the color menu, it can now be used to change the color of
  highlighted text
- fixed a bug where some fonts were not being imported into the menu
- added support for responsive design, elements that get too small on narrow screens are
  automatically calculated
- added a viewport meta tag to exportRaw.php
- fixed a bug where font links were being repeatedly added to the style tag

### 01/26/16

- moved the width and height labels to the top right corner of the page
- exportRaw.php now combines margin, border, padding, and any other left-right-top-bottom styles
  into one line
- added fixed template responsiveness to createResponsive and exportRaw.php
- created a new, simpler method of exporting templates to raw code and previewing, using
  formatCode.php, exportRaw.php, and preview_template.php
- added support for fonts in exportTemplate() and formatCode.php
- moved the style tags in templateWrapper above the other tags
- fixed a bug in Internet Explorer where changing the font color from the color menu was broken

### 01/27/16

- added event removals upon deletion of elements
- the escape key now cancels color dropping
- the I key now activates the color dropper
- improved the createResponsive algorithm
- changes made in the style menu now animate the affected element
- added an anti XSS script for URL security called antiXSS.php

### 01/28/16

- added a RegExp in upload_font.php for security and syntax checking
- fixed a bug where hovering over an element during an active animation would create a selection
  border on the wrong element
- fixed a bug where the wrong width was being displayed in the menu after resizing with a handle
- changed some properties of TemplateItem to a conditional operation instead of an OR operator or
  method
- changed createAnimation() to execute a callback containing anything that needs to happen after the
  animation finishes
- re-designed the color menu using the canvas element

### 01/31/16

- updated support for hover effects with the new formatCode.php and exportTemplate()
- finished the new color menu

### 02/01/16

- fixed a bug where body background color was not saving
- fixed a bug where the border was not being exported correctly
- improved the mobile-optimization algorithm
- improved the menu and applyChanges() function

### 02/02/16

- created a new, animated side menu for saving, opening, images, etc

### 02/03/16

- fixed a bug where margin, padding, and border code was not being formatted correctly on export
- removed all bootstrap-related code from all scripts
- function blankTemplate() now removes all event listeners from the deleted items
- blankTemplate() is now called when loading a new template
- fixed a bug where the hyperlink menu would appear off screen for right-aligned text
- the templateWrapper now fades in upon load
- added up and down arrows to change the font value easily

### 02/04/16

- moved the text editing functions to a separate JS file
- double clicking a text box with "New text box" inside now deletes the text
- added font-family to the array of style functions
- the "save as new page" option is now active
- reworked the save, load, and pages functions/PHP files

### 02/06/16

- added form building support
- fixed a bug where entering a height into the style menu an a table-displayed element would revert
  its height to auto

### 02/07/16

- resizing form fields now snaps to 20px increments

### 02/08/16

- added PHP form creation based on the forms in the template
- fixed a bug where pages were being listed incorrectly when loading the editor without a template
- added page linking from the hyperlink menu

### 03/05/16

- added a button insertion function for forms
- added black and white options in the color menu
- fixed RGB color input support
- bottom marker now adjusts position based on how vertically large the template is

### 03/08/16

- the black and white boxes in the color menu now show up in the preview box

### 03/28/16

- made the bottom marker invisible

### 03/29/16

- added an image library side menu
- began reworking drag and drop
- added a global variable hoveredElem to hold a reference to the currently hovered object

### 03/31/16

- fixed a drag and drop glitch
- formatCode.php now combines items with the same styles into one statement, reducing CSS filesize
  by over 70%
- text selection is now disabled when dragging items

### 04/01/16

- elements can now be dragged into each other, as well as between each other
- added a drag and drop visualizer

### 04/03/16

- improved the drag and drop function
- altered the copy and paste functions to actually paste the copied element instead of overwriting
  the selected element

### 04/04/16

- drag and drop now works on the x-axis
- moved the formatCode.php compression loop into separate functions for the main CSS ad @media, now
  works on @media correctly
- added code to exportRaw.php that replaces image src URLs with "/images/imgName.file"

### 04/05/16

- dragging a left-floating element into a right-floating zone now changes the float accordingly

### 04/07/16

- began adding menu controls for the effects tab
- added dimension snapping to adjacent elements for the Y-axis while dragging to resize elements

### 04/09/16

- tested a JavaScript compilation file instead of including each separate script file on index.php
- added the TRIANGLE namespace and began encapsulating all global functions and variables

### 04/10/16

- continued migrating the entire JavaScript application to the TRIANGLE namespace
- fixed a drag and drop X-axis bug

### 04/14/16

- added a color palette that compiles the color of background, border, and font from all template
  items into one menu

### 04/15/16

- continued migration to TRIANGLE namespace
- fixed a bug where item alignment was not converting upon drag and drop relocation

### 04/16/16

- continued migration to TRIANGLE namespace

### 04/17/16

- completed migration to TRIANGLE namespace
- began organization of methods, first order properties reflect each tab of the menu, general
  functions, and template functions

### 04/18/16

- added number input types in the menu
- added a text function "changeFontSize" in place of increase/decrease font size
- added resizing dimension snapping to the X axis
- added a button to remove item alignment/float

### 04/19/16

- fixed an error that occurred when trying to insert a textbox with no item selected
- replaced several keyup body event listeners with just one listener that determines which key was
  pressed
- added ctrl+C, ctrl+V, and ctrl+X for copying, pasting, and cutting items, respectively
- added shift+T to insert a textbox (may remove the shift key requirement)
- added a remove method to the TemplateItem prototype
- keyM opens the images side menu

### 04/20/16

- esc key now closes the side menu
- colors in the palette are now categorized into background, font, and border depending on their
  origin
- the color palette can now be dragged around the window
- the color dropper now applies the color palette

### 04/21/16

- the color palette drag start listener is now attached to the document upon initiation
- added box shadow color to the color palette
- the color palette is now usable, excluding box shadow color

### 04/22/16

- added some hover effects methods and a div container for hover versions of items
- resizing elements now snap to their directly adjacent siblings on the x axis

### 04/25/16

- inserting a form without an item selected now creates a new row and inserts the form there
- fixed a bug where font URLs would be duplicated upon using the same font after reloading a
  template

### 04/26/16

- unused font links are now deleted from the fontData div using TRIANGLE.text.deleteUnusedFonts()
  upon deleting elements
- form fields and buttons can only be shifted using the arrow keys or options menu instead of
  dragging in order to keep it inside the form element
- forms are not allowed to be nested
- added ENABLE object to index.php to specify features that can be toggled, such as animations
- added a button in the images menu to set the selected image as it's parent's background
- added support for exportCode() and formatCode.php to handle background-image style
- fixed a bug where resizing elements in the X direction could go outside of the template fixed
  width
- preview_template.php now removes the CSS include for style.css

### 04/27/16

- pressing D now duplicates the selected item
- inserting multiple buttons into one form is not allowed anymore
- added color palette access in the canvas menu, which applies to whichever property the canvas menu
  is targeting
- improved several color functions by accessing style properties via bracket notation
- imroved several color functions involving box shadow by simplifying the method in which the color
  is extracted from the style property string
- the color palette now updates as elements change (may be removed in the future)

### 04/29/16

- began working on the animation effect studio

### 04/30/16

- changed the color palette to be dragged from a top bar instead of anywhere on the palette
- added an "inside" option to TRIANGLE.dragDrop.createVisBox() and a visual for dragging into other
  elements
- moved the location of function snapXdimension() to the immediate scope of it's parent method to
  satisfy strict mode rules
- changed TRIANGLE.importItem.mainMethod to TRIANGLE.importItem.single in preparation for importing
  multiple elements

### 05/01/16

- added an array to importItem that stores selected element indexes and shift-clicked elements are
  appended
- fixed a bug where the open color palette would get relocated upon opening a canvas color menu

### 05/03/16

- fixed a bug where the importItem group was removing an item from the array when shift-clicking
  even if it is the only one
- editing styles in the menu now applies to all selected items
- inserting columns now applies to multiple items

### 05/06/16

- fixed a bug where a clearFloat would be inserted incorrectly on odd-numbered rows
- simplified the insertClearFloats method
- fixed a bug where the border type was not being imported
- images are now contained in a div container with class imageItem in order to prepare for cropping

### 05/07/16

- added image cropping
- added XY resizing for corner handles
- combined a while loop and for loop to remove items from arrays that are not updated correctly
  (see TRIANGLE.resetClearFloats())

### 05/08/16

- default image dragging functions in FireFox browsers is now prevented
- fixed a bug where the index of a created item was not being imported
- added a prototype image cropping visualization
- added overflow to the styleFunctions

### 05/09/16

- finished upgrading the cropping function, minus some bugs in applyCrop()

### 05/10/16

- fixed a bug where the top handle of the cropping menu could go below the bottom handle
- improved the cropping function

### 05/11/16

- added resize arrow cursors to each crop handle

### 05/13/16

- fixed top margin calculation in the cropping function
- added a no-select CSS class to easily disable user selection highlighting in the HTML
- added a snapYdimension() function inside the resize method to correspond with the snapXdimension()
  function
- resizing items by the corner now snaps in both dimensions
- images can now be inserted directly into the template without an item being selected
- commented out a line that causes Y-axis resizing of form fields to snap to intervals of 20px
- fixed transferring square images to the cropping menu

### 05/14/16

- fixed the height calculation for the selected item when cropping
- added margin left and top of the cropBorder image to the crop-map
- margin percentages of less than 0.5% are set to 0 when cropping
- fixed the style reset when inserting an image into an existing image item
- made the max cropping bounds smoother to reach
- added attribute crop-map to the style functions
- merged document scroll event listeners into one listener
- added whichKey.document and whichKey.item to have different key events available in different
  scenarios
- fixed a bug where the visBox would appear next to the element being dragged
- fixed a bug where dragging an image to resize from a corner would warp the image when snapping to
  an axis
- changed all instances of setAttribute("class") and getAttribute("class") to use className instead
  (JS backup under 05-14-16)
- added TRIANGLE.contentWidth method to compute the width of the element within its padding
- fixed a bug where the width to height ratio of images would be broken when resizing

### 05/15/16

- removed support for editing multiple items (JS backup containing support under 05-14-16)
- fixed animations for applying margin and border styles
- fixed string cleaning when saving template names, non-alphanumeric characters are replaced with an
  underscore
- fixed visBox creation in all areas
- added option images for set image background and crop image

### 05/16/16

- height and width values are now rounded to integers when resizing images
- height and width values are now displayed in the corner labels when resizing images
- applyChanges() only spplies the height or width if the calling input matched the respective choice
- fixed a blinking glitch when resizing elements from the menu
- deleting unused fonts requires
- fixed the document key events being fired when using a text box
- resizing items with a percentage width along the X-axis now snaps on point instead of being off by
  1 pixel (changed floor function to ceiling function)
- children now snap to the X-axis correctly, by using TRIANGLE.resize.contentWidth in some of the
  math calculations
- fixed border color animations when applying from color menu
- fixed a bug where dragging an only child would show a visBox next to itself

### 05/18/16

- the color palette is no longer updated when updating the template items, it was too inconvenient
- the color palette now displays "no colors to display" when there are no template items
- added a side choice for the border section in the color palette

### TRIANGLE version 1.01 completed (05/18/16)

### 05/22/16

- ctrl+V now checks for active inputs before firing

### 05/24/16

- added instances, opening different templates in different windows now create different instances
  so saving/loading do not overlap
- the entire directory of pages is now transferred to the new template name when saving as a new
  template, and the old pages are deleted

### 05/25/16

- the save current file and save as new page buttons are now revealed when loading a template
- fixed a bug where the style tag was being removed from the clear float elements upon export
- fixed a bug where opening an empty editor and then saving as a new template would cause the entire
  template directory to be copied to the save destination

### 05/26/16

- fixed a bug where the session variables containing instances information about current templates
  and pages was being manipulated as a string instead of an array
- changed the name of postLoader.js to lazyLoader.js

### 05/27/16

- fixed a bug where the selection border would be recreated on the element that is hovered when
  typing in a textbox

### 05/31/16

- fixed a bug where images being resized by a corner would get distorted when hovering over an
  element directly below
- changed the z-index of the side menu to override the color palette

### 06/05/16

- formatCode.php now uses the current page name as the CSS file name in the exported code
- added instances to create_post_forms.php

### 06/06/16

- fixed images being unresponsive upon export
- fixed font size skipping an integer

### 06/07/16

- removed textbox requirement to apply text align

### 06/08/16

- fixed a bug where duplicate colors would not be added in the color palette if they are from
  different categories
- fixed a bug where styled textbox contents would lose their style upon export
- links now inherit their color, allowing the editing of link colors
- added text-decoration support for export/formatCode, despite having no GUI option to edit the
  style

### 06/09/16

- fixed a bug where saving a template with several pages as a new template would overwrite the index
  page with the currently open page
- the image library is now updated every time the menu is opened, no more refreshing for newly
  uploaded images
- hyperlinks can now be applied to images
- fixed the inconsistent link colors
- dragging floating items into another item now displays the correct visBox

### 06/10/16

- fixed a bug where dragging a floating element into another would display the visBox on a new row
  instead of floating
- fixed a bug where dragging a non-floating element would overlap floating elements when dragging it
  into the same parent
- fixed a bug where dragging a floating element between a floating and non-floating element in the
  same parent would display the visBox on a new row
- the page name is now added to the filename of forms to avoid having duplicate files

### 06/14/16

- added an undo function

### 06/15/16

- fixed several bugs in the undo function
- fixed a bug where dragging elements would not go between other elements on the Y-axis

### 06/16/16

- began creating a JSON encoder

### 06/17/16

- templates are now saved/loaded in JSON format by encoding/decoding the template information

### 06/19/16

- the action attribute in the raw exported code now displays the pagename in the script reference

### 06/20/16

- added user classes, common elements are updated amongst intra-template pages

### 06/21/16

- user classes can now be inserted into the template from a library
- library items are now obtained by GET request in the moment instead of storing the data in the
  document upon template load
- fixed a bug where &nbsp; characters would prevent saving of user classes

### 06/22/16

- hyperlinks of the selected item are now displayed in the text tab, where they can be edited easily
- user classes are now the ID values of their respective elements in exported code
- fixed a bug where the link-to attribute was not being removed when exporting code
- added a confirmation box for uploading
- added a dropdown menu to change the target attribute on text links
- added a confirm exit dialogue when closing the browser window or tab
- added a hyperlink target dropdown selection

### 06/23/16

- added code snippet insertion
- added a bannedInsertion method to the isType object to easily ban certain template items types
  from receiving children from other methods
- fixed a bug where dragging items into an imageItem would actually work, when it is supposed to be
  prevented
- disabled XSS protection in preview_template.php in order to allow code snippets to execute

### 06/25/16

- images retain auto height when resized by the handles, but become skewed when the dimensions are
  edited in the menu
- items with the same hover CSS selector in the exported code are now merged into one statement
- image names append a random number string seeded from time when uploading an image if the filename
  already exists
- fixed a bug where nested user classes would be destroyed

### 06/27/16

- added an auto-size image function, setting it to full width and auto height to maintain its ratio

### 06/28/16

- began writing a PHP script to decode JSON templates without having to open the files in the DOM

### 06/29/16

- dashes (-) are not replaced in saved filenames anymore
- added meta data keywords and descriptions to the developer tab, and support for
  saving/loading/exporting

### 06/30/16

- the user-class attribute is now removed from elements added from the item library if that user
  class already exists in the document
- when defining a user class from the library tab, a number is appended if the user class already
  exists in the document

### 07/01/16

- added a boolean parameter to updateTemplateItems() called repeat, which calls the method again if
  true, solving the double-call issue in most insertion functions

### 07/02/16

- continued adding support for decoding JSON templates with PHP

### 07/03/16

- added a loading screen function
- added an export zip option, works when exporting each page individually, does not zip the contents
  yet

### 07/04/16

- added FTP profile management
- publishing a template now prompts for a selection of an FTP profile, and does not upload images if
  they are already on the server

### 07/05/16

- added a toggle menu for meta data to the developer tab
- a line break is now inserted every 10 items in the canvas color palette
- the canvas color palette now has a max-height of 150px and adds the scrollbar automatically

### 07/06/16

- naming a user class the same as a saved user class that is not necessarily in the document is now
  prevented


### 07/09/16

- added library category dropdowns
- switched the listing of the FTP username and URL from left to right

### 07/11/16

- the HTML of nested elements are now formatted correctly when converting from JSON using
  json_to_html.php
- the CSS is now formatted in a specific order and is now combined correctly when converting from
  JSON using json_to_html.php
- forms are now generated from JSON templates usinge json_to_html.php
- HTML, CSS, images, and forms are all compiled into one directory when exporting as ZIP
- added a catch-all else block in the X-axis drag drop section that inserts the visBox when the
  mouse is in the middle of an element

### 07/12/16

- added an add to cart button to the library in the ecommerce category
- added key event for letter L which opens the library menu
- fixed a bug where the box shadow style was not being imported correctly, and therefore not being
  edited correctly
- changed the directory name of "export_zip" to "export" to be used as a universal exporting
  directory including publish
- updated publish.php to send the template files all at once from the export folder as a single file
  stream
- cropped images are now resized according to the crop ratio when auto-sizing

### 07/13/16

- began writing the credit card processing script for ecommerce
- began creating library items for ecommerce
- changed insert_library_item.php to remove white space in order to improve readability of library
  item files
- added ecommerce prototype functions to the TemplateItem class to simplify editing ecommerce item
  details
- styled menu textboxes in index-style.css
- added a sanitize function to insert_library_item.php
- added sanitize_string.php to be required at the top of other PHP scripts, contains a string
  cleaning function
- added ecommerce catalog items, with editable details in the ecommerce menu tab

### 07/14/16

- ecommerce components are now non-deletable
- added catalogs to contain all ecommerce items
- added a method prototype to the TemplateItem class called searchParentTree, which takes a string
  as an argument and checks if the item has
  an ancestor with that class
- ecommerce itemIDs are now generated on updateTemplateItems based on how many there are and
  formatted to 6 digits with leading zeroes
- added an attribute for ecommerce items called replace-ecom-id in order to set itemID values as
  they come into the template
- fixed the removeClass method for the TemplateItem class
- the cart page is generated if it does not already exist, and any user classes in the parent tree
  of the cart are removed
- the user-class attribute is now removed from duplicated and pasted items

### 07/15/16

- deprecated the JS version of exportTemplate.format

### 07/16/16

- began transferring from a flatfile database system to mySQL
- added db_query.php
- added session variable "email", which is defined upon login, and used in create_post_forms.php
- defined the maximum length for username, password, template names, page names, and use class names
  as 32 characters
- added an optional max length integer parameter to the sanitize string function

### 07/17/16

- fixed the full template transfer when saving a multi-page template under a new name
- admin.php now queries the database for templates, fonts, and FTP profiles
- added a delete button for templates on the admin page, uses delete_template.php
- added the library table to the database
- fixed a bug with WAMP where trying to insert a row without defining one of the columns would throw
  an error

### 07/18/16

- continued transfer to mySQL database
- user classes are now transferred to the new template when saving an existing template as a new
  name
- exportZip now creates a zip folder in username/download
- fixed a bug where form fields had the wrong height upon export
- added user registration
- fixed a bug where forms were not being created upon export
- directory files are now deleted when deleting a template

### 07/19/16

- began integrating PayPal as the gateway for ecommerce templates
- fixed a bug where the cart page was not being created upon save
- fixed a bug where inserting an ecommerce library item would not be contained in a catalog
- added more system default fonts to the font list in the text tab, such as Times New Roman,
  Helvetica, and Courier
- both double quotes and single quotes are removed from font family names when importing the style
  into the menu
- passwords are now checked for banned characters when registering
- removed the gray border from the register button
- fixed a bug in json_to_html.php where the children were not being nested correctly
- fixed a bug where saving an existing template as a new template would not export correctly in the
  same instance
- the correct page is now loaded when refreshing after saving a new template

### 07/20/16

- began integrating USPS shipping API
- all ecommerce items are now logged into the database
- changed the "selectedObject" property of TRIANGLE.TemplateItem to "objRef"
- removed headers from AJAX requests with GET type
- added resources directory to content directory, contains thrid party resources like PayPal
- the ecommerce plugin is now implemented as a testing phase

### 07/21/16

- the ecommerce resources are only added to the zip folder if the cart page exists
- publishing sites now split the FTP profile URL into 2 parts based on the first occurrence of a '/'
  character, using the first half as the host and the seocnd half as the directory root
- preview_template.php now sleeps if the preview URL is not done compiling
- zip files are now deleted after being downloaded
- added .htaccess files throughout the users directory to prevent directory tree exploration

### 07/22/16

- fixed a bug where inserting a child would not update the clearfloats
- preview template is delayed 500ms to allow export_zip.php to finish
- TRIANGLE.checkPadding() now only adds padding to items with no padding at all instead of items
  with at least one unpadded side
- add to cart buttons now insert the item IDs into a cookie
- the instance counter now starts at 1 instead of 0 to avoid error in internet explorer
- a checkout page is now created along with the cart page

### 07/23/16

- item prices are now calculated on the cart page
- the item database is now an included external PHP file

### 07/24/16

- item quantities are now editable in the cart
- items are now removable from the cart

### 07/25/16

- fixed a bug where URLs were being split in the CSS formatting function in json_to_html.php
- 1's and 0's are now passed as boolean values in POST and GET data in order to boolval them
- text boxes that are editable now have a dashed border
- inserting a textbox now checks if the background is black and adjusts the font color accordingly

### 07/26/16

- tax and shipping are calculated using AJAX on the checkout page of ecommerce templates
- improved the responsive algorithm by accounting for small elements on a medium screen
- added business_profiles table to the database
- changed the admin page font to Roboto
- business profiles can now be added and edited
- fixed a bug where some items would not set a responsive style, and would throw an unset variable
  error in json_to_html.php

### 07/27/16

- added TRIANGLE.json object to hold the JSON methods such as encoding and decoding templates
- added TRIANGLE.refreshTemplateItems() method that sets TRIANGLE.templateItems to null before
  resetting it to getElementsByClassName("templateItem")
- cleaned up the JSON conversion methods, old JS file under 07-27-16
- removed index from password column in user_creds table
- added user 'triangle' that contains the preset templates
- admin accounts can now load, save, and export everyone's templates (not yet instanced)
- admin accounts can search templates by username

### 07/28/16

- added PayPal API keys to the business profile menu on the admin page
- sandbox API keys are used when previewing, and live API keys are used when exporting to zip
- a business profile is now chosen in the ecommerce tab
- generated forms are now put into the correct pseudouser directory
- added a top margin to the hr element on the admin page for a beautiful spacing improvement
- fixed an incorrect line break in the login form on login.php
- customer addresses are now compared to the business location address to calculate tax
- added a JS AJAX class to be included before other scripts
- business profiles can now be deleted from the admin menu
- converted all AJAX calls to use the new script on the admin page
- began converting AJAX calls to use the new script in TRIANGLE.js

### 07/29/16

- added custom emails per form, if it is blank then the Triangle account email is used

### 08/01/16

- calculating tax is now a per-item option
- added handling fee option to shipping

### 08/02/16

- tax is now calculated upon checkout page load instead of using AJAX
- shipping now takes the highest estimate as the base, and adds handling fees on top
- fixed a bug where the padding was removed from elements after inserting a library item then
  applying a style
- ecommerce item IDs are now checked against the existing array for duplicates before being assigned

### 08/03/16

- added a popUp method to organize the darkWrapper boxes easier to interact with
- added a shipping setup dialogue, and a shipping_setup column in the ecommerce_items table
- added ctrl+S key event, which saves the current template if possible
- shipping settings are now added to the item database for ecommerce sites
- fixed a bug where the blank editor would not load correctly
- transferred all AJAX calls to new script method
- links are not text-decorated, but underlined when applied, making the underline removable

### 08/04/16

- fixed a bug where the border style was not being imported correctly

### 08/05/16

- added a small JSON compression algorithm for saving/loading templates

### 08/06/16

- moved the compression algorithm to a specific method, and added a decompression method
- responsive styles are now compressed

### 08/07/16

- improved the compression algorithm
- fixed a bug where json_to_html.php would check for the wrong value type in an isset function
- exported templates that are unsaved are now named 'untitled'
- fixed a bug where ctrl+S would not read the display style of the current template button correctly
- ctrl+S now saves as new template if saving current is not an option
- added a dialogue to tell when the template is saved
- added errors to exporting ecommerce templates, the pages are not functional until everything is
  correctly set up
- loaded templates are now gzipped before being sent to the client
- custom shipping is now one global price applied per order
- added vertical-align to the CSS styles processed by json_to_html.php
- fixed a bug where upload_font.php would not take subdomains
- cleaned up publish.php and fixed a big where the images directory was not being created on the
  FTP server
- default fonts are now loaded on all accounts from the triangle profile in the database
- fonts added from admin accounts are added to the triangle profile

### 08/08/16

- fixed a bug where links didn't work anywhere on the editor page
- added flat rate/other USPS options
- added a favicon
- improved account security by using password_hash and password_verify functions instead of a custom
  salt and hash when registering and logging in
- updated mySQL account password to a 64-character string
- improved security for FTP profiles

### 08/09/16

- session IDs are now regenerated upon register and login to combat against session hijacking
  attacks
- ecommerce attributes are now URI encoded instead of converted to NVP
- changed the max character length for page names to 64
- continued adding USPS shipping support
- if the template name is default, then ctrl+S saves as new
- fixed a bug where box-shadow styles were being compressed incorrectly
- changed the PayPal module to store cart data in session variables instead of cookies
- added an email form to the library
- fixed a bug where business profile values were not being updated correctly
- an error message is now displayed if PayPal API keys are not set up for an ecommerce site
- PayPal API keys are now encrypted

### 08/10/16

- added an alert box for adding to cart
- items with vertical aligned elements are now banned from receiving insertions
- fixed a bug in unlink_dir.php where the removed directory was trying to be removed twice
- added a receipt page for forms and payments

### 08/11/16

- added multi-file upload support for images on the admin page
- lazyloading is now implemented if there are more than 5 images on a page
- fixed lazyLoader.js so it works smoothly on the admin page
- shortened the lazy loader data URI and changed the format to GIF
- images can now be deleted from the admin page
- background images can now be removed

### 08/12/16

- improved encryption, accounts are now assigned a surrogate key to encrypt/decrypt their content
- fixed a bug where lazyloaded images were not being exported correctly
- fixed a bug where user classes were not being updated when acting as a pseudouser

### 08/14/16

- added a 5 failed attempt limit for logins to protect against brute force attacks

### 08/15/16

- Triangle API keys are now generated upon user registration
- added a new database to contain users ecommerce item information, they are granted read-only
  permissions
- added an API directory to contain various functions that may need to be executed on Triangle's
  databases or servers
- fixed a bug where item IDs were not being set correctly
- added inventory stock tracking

### 08/16/16

- text nodes are now counted when deselecting a text box to check for blank
- a default template is now generated for each user upon registration, pulled from triangle account
- added page deletion from the side menu

### 08/17/16

- fixed a bug where lazyload was being applied to tags other than img, causing loading issues
- added ctrl+Z to undo
- added a favicon.ico include into json_to_html.php
- the canvas menu is now closed on deselect
- repositioned the crop apply/cancel buttons

### 08/18/16

- fixed a bug where all pages of the premade templates were being displayed in the library
- improved input focus clearing upon deselect
- improved ctrl+Z recognition at the right times
- simplified the responsive algorithm and improved medium screen calculation
- fixed a bug where user classes did not have responsive styles
- added a CSS styles and  hover styles access panel in the developer tab to manually code CSS styles
- admin accounts now display their templates by default instead of everyone's
- edited .htaccess to prevent directory index listings of user directories
- all text inputs now have the required attribute in forms
- added an option to db_query for multiple statement executions, requires a multidimensional array
- fixed a bug in uploadFonts where the string was being sanitized, causing regex issues

### 08/19/16

- drag and drop now takes the client dimensions as the measurements for the grabbed element to
  prevent huge visboxes
- added a web design request form, will be synced with the senders Triangle account

### 08/20/16

- fixed buggy drag and drop behavior

### 08/21/16

- various speed enhancements
- users are now prevented from creating usernames containing both admin(istrator) and triangle in
  the same name, and brayden and gregerson in the same name

### 08/22/16

- fixed a bug where login attempts would prevent logins no matter how many there were
- added a change password interface to the admin page
- fixed a bug where exporting a template would read the first template with the required name,
  without checking the username
- added an option to compress code on export

### 08/23/16

- fixed a bug where PayPal was refusing the server TLS version incorrectly
- <?php ?> tags are now commented out in JSONtoHTML as a security measure
- added a label that appears by the mouse cursor when hovering over items with isType.itemLabel, or
  a user class
- changed the background and font color of textareas that display code in the menu
- false CSS styles are now filtered out

### 08/24/16

- added template preview buttons to the admin page for quicker access and a way to access the
  existing export
- fixed a bug in the responsive algorithm where incorrect widths were being assigned
- fixed a bug where too many spaces were being removed when compressing on export

### 08/25/16

- changed user classes to user IDs to reflect CSS syntax more accurately
- added user classes to easily change

### 08/26/16

- the current template and page is now highlighted in the side menu
- improved export compression by collapsing multiple spaces to one space

### 08/27/16

- fixed a bug where saving as a new template would not work
- fixed a bug where the template width style was not being saved correctly
- began moving the responsive algorithm to the backend
- the export compression checkbox now maintains its state upon clearing selection
- responsive algorithm is now backend
- fixed a bug in db_query where selecting multiple rows with multiple statements in one query would
  only return the results of the first statement

### 08/28/16

- fixed bugs occurring when using innerText instead of innerHTML
- improved export speed by ignoring files that have not changed

### 08/29/16

- began re-working universal user-id updates

### 08/30/16

- user IDs are now updated universally
- fixed a bug where the selection border was not being updated after inserting a user ID

### 08/31/16

- moved to domain trianglecms.com
- fixed a bug where user ids were not being exported in the correct order

### 09/01/16

- fixed various bugs with PayPal from domain transition
- fixed a bug where form attributes would get scrambled on export
- fixed a bug where user fonts were not loading in the editor
- textboxes can now be inserted directly into the template

### 09/05/16

- made setting an image background more intuitive, and now applicable to body

### 09/07/16

- fixed a bug where hyperlinks were not blocked in IE
- any link is now editable
- uploading images now displays the uploaded images with a success caption

### 09/08/16

- underline is now removed when deleting hyperlinks
- user classes are now insertable from the side menu with My Items
- hyperlinks on images are now displayed as the mouse label
- began converting menu icons to SVG
- added margin dragging

### 09/09/16

- fixed a bug where dragging elements into other elements was difficultversion

### 09/10/16

- improved compression by including CSS in a style tag instead of an external file
- fonts are now deferred

### 09/11/16

- added an import website as template function
- ctrl+left and ctrl+up change the opacity of the template

### 09/12/16

- fixed a bug where the CSS styles of imported websites were scrambled
- added margin drag snapping

### 09/15/16

- items with percentage widths now snap to critical values 33.33%, 50%, and 66.66%
- fixed a bug where the last element in a row would not snap to its previous sibling when resizing
  the margin
- fixed a bug where the border would be applied incorrectly when inserting columns depending on the
  alignment of the element
- fixed a bug where item alignment was not transferring when inserting columns

### 09/19/16

- fixed a bug where item IDs would not be inserted with a premade template
- added top margin dragging handle to images

### 09/27/16

- text selection is now disabled when resizing margins

### 10/31/16

- disabled PHP error display on the production server

### 11/13/16

- fixed space occurring below images

### 11/16/16

- added a style tag and script tag editing box in the developer tab for easier custom code

### 12/14/16

- added a limit of 100 templates loaded from the database to administrator accounts
- added a larger and more convenient code editor
- added support for inserting tabs into textareas
- disabled browser spellchecking on text input elements

### 12/28/16

- added a create hyperlink button to the options tab
- hyperlinks can now be applied to any element

### 12/29/16

- added a new page button in the page list menu
- deleting a page now loads the index page by default if the deleted page is loaded in the editor

### 01/02/17

- opening a template within the editor now directs to a new url instead of loading through AJAX
- added an icon for the hyperlink option in the options tab
- temporarily removed ecommerce options until further testing and development
- fixed a bug where the margin handles would remain on the page after using undo

### 01/03/17

- added a transparency background to the image library in the editor and reformatted the shape and
  size of the images displayed to squares
- the code editor is now fixed below the menu, and the marginFix adjusts to the height upon resize
- the code editor is now opened by default when selecting style or script tag

### 01/04/17

- fixed a bug where user IDs would not nest correctly when exporting
- fixed a bug where using the code editor would overwrite the wrong source
- fixed a bug where typing CSS styles in the developer tab would not be applied

### 01/05/17

- enlarged code boxes to fit popular CSS style that would split into 2 lines

### 01/09/17

- users are now given a list of template choices when using the new template button
- saving as a new template now changes the URL to that template and page
- added variable TRIANGLE.unsaved to contain a boolean describing whether or not there are unsaved
  changes to prevent leaving the window without saving
- fixed a bug where exporting an unsaved template would result in an error, templates must be saved
  before exporting now
- added a transparency background to images on the admin page
- fixed a bug where rgba was removed when editing other styles

### 01/10/17

- fixed a bug where images would not resize correctly after resizing with the handles then changing
  the height to auto
- added an apply all sides button for repetitive styles such as padding and margin

### 01/11/17

- fixed a bug where IDs and classes could not be applied to the same item on export

### 01/17/17

- fixed a bug where user IDs would not nest correctly when they have a next sibling

### 01/18/17

- fixed a bug where the save template name input would pop up at the wrong time when exporting
- fixed a bug where saving as a new page would reload to a blank page

### 01/23/17

- added global style and script tags
- slightly improved menu button appearance next to textareas

### 01/24/17

- fixed a bug where body background images would not save or load
- cleaned up template export code
- exporting templates is now much smoother
- added a prototype for clearing formatted text upon paste

### 02/01/17

- pages are now listed alphabetically in the menu

### 02/20/17

- images cropped within triangle are now truly cropped upon export
