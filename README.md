PubJS
----

`PubJS` is a simple, super lightweight tool for embedding PDF books, magazines, and other multi-page documents in a website. Tools like Issuu look nice, but offer minimal styling, require a paid subscription to remove ads, and rely on Flash (uck). PubJS is one small Javascript, CSS, and PHP file, allowing for easy customization.

#### LIVE DEMO  
See an example of PubJS in action here: [http://www.jeffreythompson.org/pubjs](http://www.jeffreythompson.org/pubjs)

#### JQUERY
PubJS does require `JQuery`, which handles Ajax calls and some other messy tasks. Want to port a version that doesn't require it? That would be super!

#### CREATING PAGE IMAGES  
The only step required to setup your book is to create an image file of each page, all inside a folder. This can be done by hand, but `ImageMagick` (with `Ghostscript` installed) works even better and is much easier for large documents. To convert a PDF to images, go to your PDF's directory and run the following:

    convert -geometry 900x900 -quality 100 -density 300 input.pdf page_%03d.jpg

Creates a series of images named `page_000.jpg` at 900px in the largest dimension and high quality. File sizes should be approximately 100-400k each.

#### BASICS  
To place your book, just make an empty `div` with the class `PubJS`. You also need to list a path to where the page images (created in the previous step) are located using the `data-pages` attribute.

    <div class="pubjs" data-pages="path/to/pages"></div>

#### OPTIONAL ATTRIBUTES  
You can set a byline, start page, and other settings using optional attributes:

    data-byline           manually created byline, can include HTML
    data-title            sets title of book (to auto-generate a byline)
    data-author           set author of book
    data-url              URL, attached to the title
    data-datePublished    string date, shown in parentheses
    data-startPage        integer for starting page (default 0 (front cover))
    data-numJump          number of pages to jump (default 10)
    data-moveSinglePage   move one page at a time, instead of spreads (default = false)
    data-addCredit        add pubjs credit at bottom? (default = 'false')

Links can be placed inside these elements! Used to link to an author's page, Creative Commons license, etc:

    data-byline="<em>Field Guide</em>, a book by Jeff Thompson (&copy; 2012)"
    data-author="<a href='http://www.jeffreythompson.org'>Jeff Thompson</a>"
    data-datePublished="<a href='http://creativecommons.org/licenses/by-nc-sa/3.0/'>2012</a>"

#### STYLING  
Styling can be modified with your own CSS, overriding the basic style used in `pubjs.css`. Simply import your own styles after pubjs.css to make sure they get used.

#### RESPONSIVE  
PubJS is by default responsive, with the book div set to 100% of its container. Pages resize nicely, though at a certain point they will be too small to easily read. You can always create your own custom breakpoints.

#### TODO  
- fullscreen mode?
