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
							var $this = $(this); // The h4 element
							var dataCountVal = $this.attr('data-count'); // Target display number, e.g., "10", "1000"
							var initialText = $this.text(); // Initial "incorrect" text e.g., "10,000,000" or "1,000"

							// Parse the initial text to a number, removing commas
							var initialNumericValue = parseFloat(initialText.replace(/,/g, ''));
							if (isNaN(initialNumericValue)) {
								initialNumericValue = 0; // Fallback if parsing fails
							}

							var targetNumericValue = parseFloat(dataCountVal); // The actual number to display finally in h4

							// For numbers that had "M" in their "incorrect" start text (e.g. 10,000,000M+),
							// the initialNumericValue is already large.
							// The targetNumericValue is small (e.g. 10).
							// The animation should go from initialNumericValue down to targetNumericValue.
							// However, the visual effect is "10,000,000" counting down to "10" (for the "10M+" case)

							// No need to multiply targetNumericValue by 1,000,000 for animation here,
							// as the animation will be on the displayed number.
							// The final display text for h4 is determined by dataCountVal.

							// Start animation from the initialNumericValue
							$({ countNum: initialNumericValue }).animate({
								countNum: targetNumericValue // Animate to the target value for the h4
							  },
							  {
								duration: 2000, // Slightly longer duration for more complex transitions
								easing:'linear',
								step: function() {
								  // Display the animated number with formatting
								  // For numbers counting down (like 10,000,000 to 10), this will show the reduction
								  // For numbers like 1,000 to 1000, it will just reformat.
								  let currentStepVal = Math.floor(this.countNum);
								  $this.text(currentStepVal.toLocaleString());
								},
								complete: function() {
								  // On complete, set the h4 text to the plain data-count value.
								  // The sibling span provides the "M+" or "+".
								  $this.text(dataCountVal);
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

