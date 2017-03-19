$(document).ready(f => {

	// Enables collapsible content (for the comments)
	$('.collapsible').collapsible()

	// When the user scrolls down past the stone nav bar, it becomes fixed along with the seachbar as nav content fades in 
	// Palm tree background and messages recieve some CSS alterations to counteract the content in between becoming fixed
	$(window).bind('scroll', f => {
		var navHeight = $('.palms').height() 

   		if ($(window).scrollTop() > navHeight) {
			$('.stone').addClass('fixed')
			$('.searchbar').addClass('fixed').css({'margin-top':'60px'})
			$('.palms').addClass('afterscroll')
			$('.fading').fadeIn(1500)
			$('.messages').css({'margin-top':'120px'})
		}
		else {
			$('.stone').removeClass('fixed')
			$('.palms').removeClass('afterscroll')
			$('.searchbar').removeClass('fixed').css({'margin-top':'0px'})
			$('.fading').fadeOut(1500)
			$('.messages').css({'margin-top':'0px'})
		}
	})

	// Settings to make the webpage responsive
	$(window).resize(f => {
		var w = $(window).width()

		if (w < 1020) {
			$('.input-flex').css({'height':'48','font-size':'20px'})
			$('.card-flex').css({'padding-bottom':'0px'})

		}
		else {
			$('.input-flex').css({'height':'100','font-size':'50px'})
			$('.card-flex').css({'padding-bottom':'24px'})
		}	

		if (w < 993) {
		 	$('h2.brand-logo.n1').css({'margin-left':'0px','padding-right':'66px','padding-left':'0px'})
		 	$('.bottle').css({'margin':'auto','margin-top':'-172px'})
		}
		else{
			$('h2.brand-logo.n1').css({'margin-left':'34.5%','padding-left':'66px'})
			$('.bottle').css({'margin-left':'34.5%'})
		}
		if (w < 500) {
			$('h2.brand-logo.n1').css({'padding-right':'0px'})
			$('.bottle').css({'display':'none'})
		}
		else{
			$('.bottle').css({'display':'block'})
		}
	})
	
	// Enables modal functionality
	$('.modal').modal()
	$('#results').modal({
		// Removes messages from the modal when results are closed, refreshing it for the next search
		complete: f=> {
			$('.results .msg').remove()
		}
	})

	// Event handler for search bar entries
	$('#newsearch').submit( event => {
		event.preventDefault()
		// Opens the modal where the results are to be displayed
		$('#results').modal('open')
		//Sets the value of the search input to a variable
		var input = $('.search').val()
		console.log(input)
		// If a messages content matches the search input it is displayed in the results modal
		$(".msg:contains('"+input+"')").clone().appendTo('.results')
		// If there are no matches "No matches" will be displayed, otherwise the element will be hidden
		if ($('.results').contents().length == 1) {
			console.log("No matches")
			$('.nomatches').show()
		}
		else{
			console.log("Matches found")
			$('.nomatches').hide()
		}
	})


	$('.addlike').submit( event => {
		event.preventDefault()
		$('.likes').find('.addlike#'+event.target.id).hide()
		$('.unlike').show()
		var id = event.target.id
		var likes = $('.addlike').find('input').val()
		$.post('/like', {messageId: id, msgLikes: likes})
		$('.totallikes#'+id).html(likes)
	})

	$('.unlike').submit( event => {
		event.preventDefault()
		$('.likes').find('.unlike#'+event.target.id).hide()
		$('.addlike').show()
		var id = event.target.id
		var likes = $('.unlike').find('input').val()
		$.post('/like', {messageId: id, msgLikes: likes})
		$('.totallikes#'+id).html(likes)
	})
})







