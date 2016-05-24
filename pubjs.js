
// PUBJS
var container = document.getElementsByClassName('pubjs')[0];

// number of pages to jump (can be set as attribute)
var numJump = 10;
if (container.hasAttribute('data-numJump')) {
	numJump = container.getAttribute('data-numJump');
}

// optional: move forward by only one page
// default = false (move by spreads)
var moveSinglePage = false;
if (container.hasAttribute('data-moveSinglePage')) {
	if (container.getAttribute('data-moveSinglePage') == 'true') moveSinglePage = true;
}

// optional: specify a starting page 
// default = 0 (cover), can be set as attribute
var page = 0;
if (container.hasAttribute('data-startPage')) {
	page = container.getAttribute('data-startPage');
}

// optional: show page numbers in nav UI
// default = false
var showPageNums = false;
if (container.hasAttribute('data-showPageNums')) {
	if (container.getAttribute('data-showPageNums') == 'true') showPageNums = true;
}

// load list of pages from folder
var pageSource = container.getAttribute('data-pages');
var pages = [];
$.ajax({
	url: 'pubjs.php',
	type: 'POST',
	data: { pageSource: pageSource },
	cache: false,
	dataType: 'json',
	success: function(result) {
		for (var key in result) {
			pages.push(result[key]);
		}
		// run basic setup stuff once images are loaded
		setup();
	}
});

// setup stuff
function setup() {

	// add container divs for page images and navigation
	var leftPage =  '<div id="leftPage" class="pubjsPage">';
	leftPage += 	'   <div id="pubjsBackwardNav">';          // arrows for navigation
	leftPage +=     '       <p>&larr;</p>';
	leftPage +=     '       <p><a href="javascript:void(0);" onclick="jumpAhead(' + (-numJump) + ');" title="Jump back ' + numJump + ' pages">&#8606;</a></p>';
	leftPage +=     '       <p class="fullJump"><a href="javascript:void(0);" onclick="jumpAhead(' + (-pages.length) + ');" title="Jump to beginning">&#8620;</a></p>';
    if (showPageNums) {
    	leftPage += '		<p id="pageNumsLeft">' + (page+1) + '/' + (pages.length) + '</p>';
    }
    leftPage +=     '   </div>';                                // end nav
	leftPage += 	'   <img>';                                 // the actual page image
    leftPage +=     '</div>';                                   // end page container
    $(container).append(leftPage);

	var rightPage = '<div id="rightPage" class="pubjsPage">';
    rightPage +=    '    <img>';
	rightPage +=    '    <div id="pubjsForwardNav">';
	rightPage +=    '       <p>&rarr;</p>';
	rightPage +=    '       <p><a href="javascript:void(0);" onclick="jumpAhead(' + numJump + ');" title="Jump ahead ' + numJump + ' pages">&#8608;</a></p>';
	rightPage +=    '       <p class="fullJump"><a href="javascript:void(0);" onclick="jumpAhead(' + (pages.length) + ');" title="Jump to end">&#8619;</a></p>';
    if (showPageNums) {
    	rightPage += '		<p id="pageNumsRight">' + (page+1) + '/' + (pages.length) + '</p>';
    }
    rightPage +=    '   </div>';
	rightPage += 	'</div>';
	$(container).append(rightPage);
	
	// load up first set of pages
	updatePages();
	
	// manually created byline, if listed
    // this overrides any other info supplied
	if (container.hasAttribute('data-byline')) {
		var byline = '<p id="pubjsByline">';
		byline += container.getAttribute('data-byline');
		byline += '</p>';
		$(container).after(byline);
	}

	// if no manual byline but title present, create a byline
	else if (container.hasAttribute('data-title')) {
		var byline = '<p id="pubjsByline">';
		if (container.hasAttribute('data-url')) byline += '<a href="' + container.getAttribute('data-url') + '">';
		byline += '<em>' + container.getAttribute('data-title') + '</em>';
		if (container.hasAttribute('data-url')) byline += '</a>';
		if (container.hasAttribute('data-author')) byline += ', by ' + container.getAttribute('data-author');
		if (container.hasAttribute('data-datePublished')) byline += ' (' + container.getAttribute('data-datePublished') + ')';
		byline += '</p>';
		$(container).after(byline);
	}

	// pubjs credit line, if specified
	if (container.hasAttribute('data-addCredit')) {
		if (container.getAttribute('data-addCredit') == 'true') {
		$(container).append('<p id="credit">powered by <a href="htttps://github.com/jeffthompson/pubjs">pubjs</a></p>');
		}
	}
}

// click page or use arrow keys to go forward/backward
$(document).on('click', '#rightPage', function(e) {
	forward();
});
$(document).on('click', '#leftPage', function(e) {
	backward();
});
$(document).keydown( function(e) {
	switch (e.which) {
		case 39:  			// right = forward
			forward();
			break;
		case 37:  			// left = backward
			backward();
			break;
		default: 
            return;	        // ignore all other keys
	}
	e.preventDefault();
});

// move to new page, either by 1 page, spread, or N pages
function forward() {
	if (page == 0 || moveSinglePage) page += 1;	 // cover to first page or page-by-page specified
	else page += 2;								 // otherwise, jump by spread
	updatePages('forward');						 // pass for transition to/from cover
}
function backward() {
	if (page == pages.length-1 || moveSinglePage) page -= 1;
	else page -= 2;
	updatePages('backward');
}
function jumpAhead(n) {
    page += n;
    if (page > numPages.length-1) page = numPages.length-1;
    else if (page < 0) page = 0;
    if (n >= 0) {
        updatePages('forward');
    } else {
        updatePages('backward');
    }
}

// update which pages are visible
function updatePages(dir) {
	$('#leftPage').css('visibility', 'visible');
	$('#rightPage').css('visibility', 'visible');

	// transition to/from front cover
	if (page == 1 && dir == 'forward') page += 1;
	else if (page == 1 && dir == 'backward') page = 0;
	
	// front cover (page 0)
	// L = blank, R = cover
	if (page <= 0) {
        page = 0;
		$('#leftPage img').attr('src', pages[page]);	// so it has a width...
		$('#leftPage').css('visibility', 'hidden'); 	// but is hidden :)
		$('#rightPage img').attr('src', pages[page]);
	}

	// back cover (page n-1)
	// L = cover, R = blank
	else if (page >= pages.length-1) {
        page = pages.length-1;
		$('#leftPage img').attr('src', pages[page]);
		$('#rightPage img').attr('src', pages[page]);
		$('#rightPage').css('visibility', 'hidden');
	}		

	// everything else
	// L = page -1, R = page
	else {
		$('#leftPage img').attr('src', pages[page-1]);
		$('#rightPage img').attr('src', pages[page]);
	}

	// update page numbers
	$('#pageNumsLeft').text((page) + '/' + (pages.length));
	$('#pageNumsRight').text((page+1) + '/' + (pages.length));
}
