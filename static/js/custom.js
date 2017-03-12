$(document).ready(f => {
	$('.collapsible').collapsible()

    if ($('ul.collapsible.center > li').hasClass('active')) {
		console.log('Yes, it worked!')
		$('.collapsible-header').html('Hide Comments')
    }
})
