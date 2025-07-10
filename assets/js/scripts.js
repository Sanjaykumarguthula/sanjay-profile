/*
Author       : Themesvila
Template Name: Portfx
Version      : 1.0
*/


(function($) {
	'use strict';

		// Counter Js
		jQuery(document).ready(function($) {

			/*Counter */
			// $('.single-counter h4').each(function() { // Old counter, runs on page load
			// 	var $this = $(this);
			// 	var countTo = $this.attr('data-count');
			// 	$this.text('0');
			// 	$({ countNum: 0}).animate({
			// 		countNum: parseFloat(countTo)
			// 	  },
			// 	  {
			// 		duration: 1000,
			// 		easing:'linear',
			// 		step: function() {
			// 		  $this.text(Math.floor(this.countNum));
			// 		},
			// 		complete: function() {
			// 		  $this.text(countTo);
			// 		}
			// 	  });
			// });

			// New Counter using jquery.counterup.min.js and Waypoints
			// Ensure the target elements for counterup have the final number as their text content initially
			// or that counterup is configured to use data-count if it supports it.
			// Standard counterup uses the text content.
			// The HTML has <h4 class="counter-number" data-count="1000">1000</h4>
			// So, we target ".counter-number"
			if ($('.counter-number').length) {
				$('.counter-number').waypoint(function() {
					// The data-count attribute holds the actual number to count to.
					// CounterUp.js usually animates the number present in the text of the element.
					// Let's ensure the text is set from data-count if it's different, or just use it.
					// The current HTML has the same number in text and data-count for base values.
					// For "10M+", data-count="10", text="10". This will animate to 10.
					// We need to adjust data-count to be the full number for "M" values.

					// For CounterUp, the numbers like "10M" should be "10000000" in the HTML text if we want it to count to that.
					// The current custom script handles "data-count" and animates that.
					// Let's try to make the existing custom script waypoint-triggered.

					$('.single-counter').each(function() {
						var $thisCounterContainer = $(this);
						if ($thisCounterContainer.hasClass('animated-counter')) {
							return; // Already animated
						}
						$thisCounterContainer.find('h4').each(function() {
							var $this = $(this);
							var countTo = $this.attr('data-count');
							var originalText = $this.text(); // This is what CounterUp would use. Our custom one uses data-count.

							// Adjust for M (Million) - this logic needs to be applied before animation
							var actualCountTo = parseFloat(countTo);
							var symbolSpan = $this.next('.counter-symbol');
							if (symbolSpan.text().includes('M')) {
								actualCountTo *= 1000000;
							}
							// K for thousand could be added here too if needed.

							$this.text('0');
							$({ countNum: 0}).animate({
								countNum: actualCountTo
							  },
							  {
								duration: 1500, // Slightly longer duration
								easing:'linear',
								step: function() {
								  // Format number with commas for display during animation if it's large
								  if (actualCountTo >= 1000) {
									$this.text(Math.floor(this.countNum).toLocaleString());
								  } else {
									$this.text(Math.floor(this.countNum));
								  }
								},
								complete: function() {
								  // On complete, show the original simple number (like 10 for 10M) or formatted full number
								  // For consistency with the original display of "10" then "M+", we set text to original data-count.
								  // Or, if we want to show the full number always: $this.text(actualCountTo.toLocaleString());
								  // The current HTML design is <h4 data-count="10">10</h4><span>M+</span>
								  // So, it's better to animate to the full 'actualCountTo' but display 'countTo' on complete to match the HTML.
								  // However, counterup usually displays the final animated number.
								  // Let's display the final animated number, formatted.
									$this.text(actualCountTo.toLocaleString());
									$thisCounterContainer.addClass('animated-counter');
								}
							  });
						});
					}, {
						offset: '75%', // Trigger when 75% of the element is visible
						triggerOnce: true // Only trigger once
					});
				});
			}
			
			/* Active Menu */
			$(".mobile_menu").simpleMobileMenu({			
				"menuStyle": "slide"
			});
			
			/*START PROGRESS-BAR JS*/
			$('.skillbar > span').each(function(){
				var $this = $(this);
				var width = $(this).data('percent');
				$this.css({
					'transition' : 'width 2s'
				});
				
				setTimeout(function() {
					$this.appear(function() {
							$this.css('width', width + '%');
					});
				}, 800);
			});
			/*END PROGRESS-BAR JS*/
		
		});
		

		
		/*PRELOADER JS*/
		$(window).on('load', function() { 
			$('.preloader').fadeOut();
			$('.preloader').delay(350).fadeOut('slow'); 
		}); 
		
		
		/*END PRELOADER JS*/		
	

		/* Image Popup */
		 $('.popbtn').magnificPopup({
			 type:'image',
			 gallery:{
				enabled:true
			  }
		});		
		

		 /*START Portfolio*/	
		$('.project-slider').owlCarousel({
			items : 5,
			autoplay: true,
			center: true,
			loop: true,
			navText: ["<svg fill='none' viewBox='0 0 91 16'><path fill='#1C3F39' d='M.289 7.43a1 1 0 00.008 1.413l6.398 6.33a1 1 0 001.407-1.422L2.414 8.125 8.04 2.437a1 1 0 00-1.422-1.406L.29 7.429zm90.704-.786L.995 7.133l.01 2 90-.49-.012-2z'/></svg>" ,"<svg fill='none' viewBox='0 0 91 16'><path fill='#1C3F39' d='M90.707 8.707a1 1 0 000-1.414L84.343.929a1 1 0 10-1.414 1.414L88.585 8l-5.656 5.657a1 1 0 001.414 1.414l6.364-6.364zM0 9h90V7H0v2z'/></svg>"],
			nav: true,
			dots: true,
			margin: 30,
			responsive:{
				0:{
					items:1,
					
				},
				575:{
					items:2,
					
				},
				768:{
					items:3,
					
				},
				1000:{
					items:4,
			
				},
				1200:{
					items:5,
			
				}
			}
		});
		
		/*END Portfolio*/
		
		/*START PARTNER LOGO*/
		$('.client-slider').owlCarousel({
			margin: 30,
			autoPlay: 5000, //Set AutoPlay to 3 seconds
			items : 6,			
			nav: false,
			dots: false,
			loop: true,
			responsive:{
				0:{
					items:2,
					
				},
				575:{
					items:3,
					
				},
				768:{
					items:4,
					
				},
				1000:{
					items:5,
			
				},
				1200:{
					items:6,
			
				}
			}
		});
		/*END PARTNER LOGO*/
		
		 /*START Testimonials*/	
		$('.testimonial-slider').owlCarousel({
			items : 3,
			autoplay: true,
			center: true,
			loop: true,
			navText: ["<svg fill='none' viewBox='0 0 91 16'><path fill='#1C3F39' d='M.289 7.43a1 1 0 00.008 1.413l6.398 6.33a1 1 0 001.407-1.422L2.414 8.125 8.04 2.437a1 1 0 00-1.422-1.406L.29 7.429zm90.704-.786L.995 7.133l.01 2 90-.49-.012-2z'/></svg>" ,"<svg fill='none' viewBox='0 0 91 16'><path fill='#1C3F39' d='M90.707 8.707a1 1 0 000-1.414L84.343.929a1 1 0 10-1.414 1.414L88.585 8l-5.656 5.657a1 1 0 001.414 1.414l6.364-6.364zM0 9h90V7H0v2z'/></svg>"],
			nav: true,
			dots: true,
			margin: 35,
			responsive:{
				0:{
					items:1,
					
				},
				575:{
					items:1,
					
				},
				768:{
					items:2,
					
				},
				1000:{
					items:3,
			
				},
				1200:{
					items:3,
			
				}
			}
		});
		
		/*END Testimonials*/
		
		/* WOW */
		new WOW().init();	
		
})(jQuery);

