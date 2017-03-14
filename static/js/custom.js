$(document).ready(f => {

	$('.collapsible').collapsible()


	$(window).bind('scroll', f => {
	   	var navHeight = $( window ).height() + 353	 
	   		if ($(window).scrollTop() > navHeight) {
				$('.stone').addClass('fixed')
				$('.img').addClass('afterscroll')
				$('a.fading').fadeIn(1500)
			}
			else {
				$('.stone').removeClass('fixed')
				$('.img').removeClass('afterscroll')
				$('a.fading').fadeOut(1500)
			}
		})
})	