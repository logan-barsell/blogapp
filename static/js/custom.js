$(document).ready(f => {

	$('.collapsible').collapsible()


	$(window).bind('scroll', f => {
	   	var navHeight = $( window ).height() + 277	 
	   		if ($(window).scrollTop() > navHeight) {
				$('.stone').addClass('fixed')
				$('.palms').addClass('afterscroll')
				$('a.fading').fadeIn(1500)
			}
			else {
				$('.stone').removeClass('fixed')
				$('.palms').removeClass('afterscroll')
				$('a.fading').fadeOut(1500)
			}
		})
})	