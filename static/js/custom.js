$(document).ready(f => {
	$('.collapsible').collapsible()
	var counting = 0
	$('ul.collapsible').click(f=> {
		counting ++
		if (counting%2){
			$('.collapsible-header').html('Hide Comments')
		}else {
			$('.collapsible-header').html('Show Comments')
		}
	})
})	
// var counting = 0
//  	$('ul.collapsible').click(f => {
// 		counting++
//  		if (counting%2){
//  			$(this).html('Hide Comments')
//  		}else{
//  			$(this).html('Show Comments')
// 		}
// 	})    if ($('ul.collapsible > li').hasClass('active')) {
// 		console.log('Yes, it worked!')
// 		$('.collapsible-header').html('Hide Comments')
//     } else {
//     	$('.collapsible-header').html('Show Comment')
//     }