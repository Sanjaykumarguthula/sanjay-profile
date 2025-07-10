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

			// Counter Animation Logic
			if ($('.single-counter').length) {
				$('.single-counter').each(function() {
					var $thisCounterContainer = $(this);
					$thisCounterContainer.waypoint(function(direction) {
						if ($thisCounterContainer.hasClass('animated-counter-v2')) {
							return; // Already animated this container
						}

						$thisCounterContainer.find('h4.counter-number').each(function() {
							var $thisH4 = $(this);
							var originalFullText = $thisH4.text(); // e.g., "$10M+", "1000+", "5+"

							// Regex to extract prefix (optional, like $), number, and suffix (optional, like M, K, +)
							// It captures:
							// 1. Optional non-digit prefix (e.g., "$")
							// 2. The number part
							// 3. The suffix part including M, K, + and any other characters
							var parts = originalFullText.match(/^(\D*)(\d+)(.*)$/);

							if (!parts) {
								// If no match, it might be a simple number or something unexpected.
								// Keep existing text and don't animate.
								console.warn("Could not parse counter text:", originalFullText);
								return;
							}

							var prefix = parts[1] || ""; // e.g., "$" or ""
							var numberStr = parts[2];    // e.g., "10", "1000", "5"
							var suffix = parts[3] || "";   // e.g., "M+", "+", ""

							var targetNumericValue = parseFloat(numberStr);
							if (isNaN(targetNumericValue)) {
								console.warn("Parsed number is NaN for:", originalFullText);
								return; // Skip if number is not valid
							}

							// Adjust target based on suffix
							if (suffix.includes('M')) {
								targetNumericValue *= 1000000;
							} else if (suffix.includes('K')) {
								targetNumericValue *= 1000;
							}

							// Set initial display
							$thisH4.text(prefix + '0');

							$({ countNum: 0 }).animate({
								countNum: targetNumericValue
							},
							{
								duration: 2000,
								easing: 'linear',
								step: function() {
									let currentStepVal = Math.floor(this.countNum);
									$thisH4.text(prefix + currentStepVal.toLocaleString());
								},
								complete: function() {
									$thisH4.text(originalFullText); // Restore original full text
									$thisCounterContainer.addClass('animated-counter-v2');
								}
							});
						});
					}, {
						offset: '90%',
						triggerOnce: true
					});
				});
			}
			/* End Counter Animation Logic */

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

