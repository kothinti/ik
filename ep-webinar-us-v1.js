var experiment_type, exitintent_freecourse;

$(document).ready(function() {
var int_phone3;
  
  $('.webinar-lightbox-close').click(function(e) {
      if(experiment_type == "ExitIntent"){
        $('.webinar__lightbox-card').css('display','none');
        $('.webinar__lightbox-exit-intent').css('display','block');
      }else if(exitintent_freecourse == true){
        $('.webinar__lightbox-card').css('display','none');
        $('.webinar__lightbox-free-course').css('display','block');
	      $('.exitintent-fc-email').val($(".email").val());
        
        dataLayer.push({
          'event': 'exit_intent',
          'eventCategory': 'exit_intent_free_course',
          'eventAction': 'exit_intent_free_course',
          'eventLabel': 'form triggered'
         });
        
      }else{
        $('.webinar__lightbox').css('display','none');
        $('body').css('overflow','auto');
                          
          if($('.is_exit_intent_popup').val() == "On Scroll"){
            dataLayer.push({
              'event': 'exit_intent',
              'eventCategory': 'exit_intent_scroll',
              'eventAction': 'exit_intent_scroll',
              'eventLabel': 'close'
            });
          }
          
          if($('.is_exit_intent_popup').val() == "Browser Tab"){
            dataLayer.push({
              'event': 'exit_intent',
              'eventCategory': 'exit_intent_browser_tab_close_gesture',
              'eventAction': 'exit_intent_browser_tab_close_gesture',
              'eventLabel': 'close'
            });
          }
        
      }
  });
  
  $('.btn-getaccess').click(function(e) {
	e.preventDefault();
	let email_regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	
	 $(".exitintent-fc-email").keypress(function() {
             $('.exitintent-fc-email-error').addClass('hide');
         });
    	
        $(".exitintent-fc-email").focus(function() {
             $('.exitintent-fc-email-error').addClass('hide');
    	});
	  
	if((!email_regex.test($(".exitintent-fc-email").val()) || $(".exitintent-fc-email").val().length == 0)){
		$('.exitintent-fc-email-error').removeClass('hide');
	}else{
		$('.exit-intent-free-course-form').submit();
		dataLayer.push({
		  'event': 'exit_intent',
		  'eventCategory': 'exit_intent_free_course',
		  'eventAction': 'exit_intent_free_course',
		  'eventLabel': 'form submitted'
	      });
		$('.webinar-lightbox-exitintent-freecourse-close').hide();
		setTimeout(function(){
		    $('.webinar__lightbox').css('display','none');
		    $('.webinar__lightbox-free-course').css('display','none');
		    $('.webinar__lightbox-card').css('display','flex');
		    $('body').css('overflow','auto');
		    $('.exit-intent-free-course-form').css("display","block");
		    $('.success-message-9').css("display","none");
		    $('.webinar-lightbox-exitintent-freecourse-close').show();
		 }, 2000);
	}
  });
	
  $('.webinar-lightbox-exitintent-freecourse-close').click(function(e) {
    $('.webinar__lightbox').css('display','none');
    $('.webinar__lightbox-free-course').css('display','none');
    $('.webinar__lightbox-card').css('display','flex');
    $('body').css('overflow','auto');
	dataLayer.push({
          'event': 'exit_intent',
          'eventCategory': 'exit_intent_free_course',
          'eventAction': 'exit_intent_free_course',
          'eventLabel': 'close'
        });
  });
  
  $('.bc-popup-cta1').click(function(e) {
      $('.webinar__lightbox-card').css('display','flex');
      $('.webinar__lightbox-exit-intent').css('display','none');
  });
	
  $('.bc-popup-cta2').click(function(e) {
      $('.webinar__lightbox-card').css('display','flex');
      $('.webinar__lightbox-exit-intent').css('display','none');
      $('.webinar__lightbox').css('display','none');
      $('body').css('overflow','auto');
  });
  
 
  $.getJSON("https://get.geojs.io/v1/ip/geo.json",function(t){}).done(function(t){
	
  let forceUSwebinarFlag = getAllUrlParams();
    
  if((t.country_code3 == "IND") && (forceUSwebinarFlag['forceuswebinar'] == undefined)){
	  TimerHandler('IST');
	  createWebinarSlotsList("IND",t.timezone);
	}else{
	  TimerHandler('America/New_York');
	  createWebinarSlotsList("USA",t.timezone);
	}
	 
  }).fail(function(t){
    TimerHandler('America/New_York');
    createWebinarSlotsList("USA","US/Pacific");
  });
  
  function createWebinarSlotsList(country, timezone){
  
    const t_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let v_timezone_formatted  = timezone.replace("+", "%2B");
    
    console.log("webinar type: "+webinarType);
    webinarType = (webinarType == undefined) ? "REGULAR" : "SWITCH_UP";

    let api_url = "https://uplevel.interviewkickstart.com/api/webinar-slot/upcoming-slots/?country="+country+"&program=Backend&timezone="+v_timezone_formatted+"&type="+webinarType;

    let xhr = new XMLHttpRequest();
      xhr.open('GET',api_url,true);
      xhr.setRequestHeader("Authorization","1Cgx6oYXkOlWkNDn7_tXO");
      var tz = new Date().toString().match(/\((.+)\)/);
        if (tz[1].includes(" ")) {
          tz = tz[1]
            .split(" ")
            .map(([first]) => first)
            .join("");
        }

      xhr.onload = function(){
        if(this.status == 200){
          let resobj = JSON.parse(this.response);
          if(resobj.length == 0){
            registration_type = "calendly";
          }else{
            registration_type = "byecalendly";
          }
          let noslots = (resobj.length > 6) ? 6 : resobj.length;

        for (i=0;i<noslots;i++){
          var hdate = resobj[i].weekday +", "+ resobj[i].day + " " + t_months[parseInt(resobj[i].month)-1] + " "+ resobj[i].year + " | " + resobj[i].hour +":" + resobj[i].minute +" "+resobj[i].am_or_pm;
          var radiohtml = '<label class="select-webinar-slot w-radio"><input type="radio" name="start-date" value="'+ resobj[i].start_time +'" data-endtime="'+resobj[i].end_time+'" data-invitee_starttime="'+ resobj[i].invitee_start_time +'" data-invitee_endtime="'+ resobj[i].invitee_end_time +'" data-name="'+ resobj[i].start_time +'" class="w-form-formradioinput select-webinar-radio-btn w-radio-input"><span class="w-form-label" for="start-date-'+i+'">'+hdate+'</span></label>';
          $('.webinar__slots').append(
            $(radiohtml)
          );
        }
      }else{
        registration_type = "calendly";
      }
    }
    xhr.onerror = function(){
      registration_type = "calendly";
    }
    xhr.send();
  }

	if($('.bye-calendly-type').val() != "NoPhoneInTheFirstStep"){
		int_phone3 = window.intlTelInput(document.querySelector("#webinar_pnumber"), {
		initialCountry: "auto",
		 geoIpLookup: function(callback) {
		    $.get('https://get.geojs.io/v1/ip/country.json', function() {}, "json").always(function(resp) {
		      var countryCode = (resp && resp.country) ? resp.country : "us";
		      callback(countryCode);
		    });
		  },
		hiddenInput: "full",
		utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js"
	      });
	}
      
     $('.btn-back-to-step1').click(function(e) {
      	$('.webinar__registration-form1').show();
        $('.webinar__registration-success').hide();
     		$('.webinar__registration-form1-block').show();
        $('.webinar__registration-form2-block').hide();
     });

     $('.bc__btn-select-webinar-slot-v2').click(function(e) {
  	e.preventDefault();
      	setHiddenFields();
    
        //let fullphonenumber3 = int_phone3.getNumber(intlTelInputUtils.numberFormat.E164);
       // $("input[name='phone_number[intphone_full]'").val(fullphonenumber3);
        //$(".tno1").val(fullphonenumber3);
        
        $( ".first-name, .last-name, .email" ).keypress(function() {
             $('.first-name-error, .last-name-error,.email-id-error').addClass('hide');
          });
    	
        $( ".first-name, .last-name, .email" ).focus(function() {
             $('.first-name-error, .last-name-error,.email-id-error').addClass('hide');
    		});
        
        //let active_visit = read_cookie("v_latest");
        let name_regex = new RegExp("^[a-zA-Z ]+$");
        let email_regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        //let phone_regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;
                
        if( 
            ($(".first-name").val().length == 0) &&
            ($(".last-name").val().length == 0) &&
            ($(".email").val().length == 0)){
             $('.first-name-error, .last-name-error,.email-id-error').removeClass('hide');
        }
    		else if (!name_regex.test($(".first-name").val()) || $(".first-name").val().length == 0){
            $('.first-name-error').removeClass('hide');
        }else if (!name_regex.test($(".last-name").val()) || $(".last-name").val().length == 0){
        	$('.last-name-error').removeClass('hide');
        }else if (!email_regex.test($(".email").val()) || $(".email").val().length == 0){
        	$('.email-id-error').removeClass('hide');
        }else{
          $('.webinar__loadingbar').css("display","flex");
          $('.wr__firstname').val($(".first-name").val());
          $('.wr__lastname').val($(".last-name").val());
          $('.wr__email').val($(".email").val());

          dataLayer.push({
              'event': 'new_webinar_registration_form_submitted',
              'webinar_name': (document.querySelector('.webinar__lightbox-title').innerHTML)
          });
          
          if($('.is_exit_intent_popup').val() == "On Scroll"){
            dataLayer.push({
              'event': 'exit_intent',
              'eventCategory': 'exit_intent_scroll',
              'eventAction': 'exit_intent_scroll',
              'eventLabel': 'form submitted'
            });
          }
          
          if($('.is_exit_intent_popup').val() == "Browser Tab"){
            dataLayer.push({
              'event': 'exit_intent',
              'eventCategory': 'exit_intent_browser_tab_close_gesture',
              'eventAction': 'exit_intent_browser_tab_close_gesture',
              'eventLabel': 'form submitted'
            });
          }
          
          //Zap end point for step 1
          var step1Data = {
            "First Name": $('.wr__firstname').val(), 
            "Last Name": $('.wr__lastname').val(),
            "Email Address": $('.email').val(),
            "ByeCalendlyType": $('.bye-calendly-type').val(),
            "webinar-type": $('.webinar-type').val(),
            
            "utm_source": $('.utm_source').val(),
            "utm_medium": $('.utm_medium').val(),
            "utm_campaign": $('.utm_campaign').val(),
            "utm_content": $('.utm_content').val(),
            "utm_adset": $('.utm_adset').val(),
            "utm_term": $('.utm_term').val(),
            
            "gclid": $('.gclid').val(),
            "msclkid": $('.msclkid').val(),
            "fbclid": $('.fbclid').val(),
            "user_id": $('.user_id').val(),
            
            "cta_page_url": $('.cta_page_url').val(),
            "landing_page_url": $('l_page_url').val(),
            "event_name": "How to Nail your next Technical Interview",
            "user_timezone": $('.user_timezone').val(),
            "page_url": $('.page_url').val(),
            "site_url": $('.site_url').val(),
            "v_country": $('.v_country').val(),
            "salesforce_uuid": $('.salesforce_uuid').val(),
            "phone_number_full": $('.tno1').val(),
            "is_exit_intent_popup": $('.is_exit_intent_popup').val()
          };
          
          $.ajax({
            type: "POST",
            url: "https://hooks.zapier.com/hooks/catch/11068981/34c9jjz/",
            data: step1Data,
            success: function (e) {
              if(e.status == "success"){
                console.log("Step 1 submitted successfully!");
              }
            }
          });    	
          
        	$('.webinar__registration-form1').submit();
          
          $('.webinar__registration-form1-block').hide();
          	setTimeout(function(){
              $('.webinar__registration-form2-block').show();
          		$('.webinar__loadingbar').hide();
            }, 200);
         
        }
          $("input:radio[name='start-date']:first").attr("checked", true);
          $('.wr__event-start-time').val($("input:radio[name='start-date']:first").val());
   				$('.wr__event-end-time').val($("input:radio[name='start-date']:first").data('endtime'));
          $('.wr__invitee-start-time').val($("input:radio[name='start-date']:first").data('invitee_starttime'));
   				$('.wr__invitee-end-time').val($("input:radio[name='start-date']:first").data('invitee_endtime'));
   });
  
  $('.bc__btn-select-webinar-slot').click(function(e) {
  	e.preventDefault();
      	setHiddenFields();
       
        //let fullphonenumber3 = int_phone3.getNumber(intlTelInputUtils.numberFormat.E164);
        //$("input[name='phone_number[intphone_full]'").val(fullphonenumber3);
        //$(".tno1").val(fullphonenumber3);
        
        $( ".full-name,.email" ).keypress(function() {
            $('.full-name-error,.email-id-error').addClass('hide');
        });
    	
        $( ".full-name, .email" ).focus(function() {
            $('.full-name-error,.email-id-error').addClass('hide');
    	  });
        
        let name_regex = new RegExp("^[a-zA-Z ]+$");
        let email_regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        //let phone_regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;
                
        if( 
            ($(".full-name").val().length == 0) &&
            ($(".email").val().length == 0)){
             $('.full-name-error,.email-id-error').removeClass('hide');
        }else if (!name_regex.test($(".full-name").val()) || $(".full-name").val().length == 0){
            $('.full-name-error').removeClass('hide');
        }else if (!email_regex.test($(".email").val()) || $(".email").val().length == 0){
        	$('.email-id-error').removeClass('hide');
        }else{
          $('.webinar__loadingbar').css("display","flex");
          let fullname = $(".full-name").val();

          if(fullname.substring(0, fullname.indexOf(' ')) == ''){
            $('.wr__firstname').val(fullname.substring(fullname.indexOf(' ') + 1));
            $('.wr__lastname').val("IK");
          }else if(fullname.substring(fullname.indexOf(' ') + 1) == ''){
            $('.wr__firstname').val(fullname.substring(0, fullname.indexOf(' ')));
            $('.wr__lastname').val(fullname.substring(0, fullname.indexOf(' ')));
          }else{
            $('.wr__firstname').val(fullname.substring(0, fullname.indexOf(' ')));
            $('.wr__lastname').val(fullname.substring(fullname.indexOf(' ') + 1));
          }
	  
          $('.wr__email').val($(".email").val());
		
          dataLayer.push({
              'event': 'new_webinar_registration_form_submitted',
              'webinar_name': (document.querySelector('.webinar__lightbox-title').innerHTML)
          });
                    
          if($('.is_exit_intent_popup').val() == "On Scroll"){
            dataLayer.push({
              'event': 'exit_intent',
              'eventCategory': 'exit_intent_scroll',
              'eventAction': 'exit_intent_scroll',
              'eventLabel': 'form submitted'
            });
          }
          
          if($('.is_exit_intent_popup').val() == "Browser Tab"){
            dataLayer.push({
              'event': 'exit_intent',
              'eventCategory': 'exit_intent_browser_tab_close_gesture',
              'eventAction': 'exit_intent_browser_tab_close_gesture',
              'eventLabel': 'form submitted'
            });
          }
          
        	$('.webinar__registration-form1').submit();
          $('.webinar__registration-form1-block').hide();
          	setTimeout(function(){
              $('.webinar__registration-form2-block').show();
          		$('.webinar__loadingbar').hide();
            }, 200);
         
        }
          $("input:radio[name='start-date']:first").attr("checked", true);
          $('.wr__event-start-time').val($("input:radio[name='start-date']:first").val());
   				$('.wr__event-end-time').val($("input:radio[name='start-date']:first").data('endtime'));
          $('.wr__invitee-start-time').val($("input:radio[name='start-date']:first").data('invitee_starttime'));
   				$('.wr__invitee-end-time').val($("input:radio[name='start-date']:first").data('invitee_endtime'));
     });
  
     $('.bc__btn-2nd-step').click(function(e) {
     	e.preventDefault();
        if($("input:radio[name='start-date']").is(":checked")) {
            let estarttime = $('input[name="start-date"]:checked').val();
            let eendtime = $('input[name="start-date"]:checked').data('endtime');
            let utmm = visitor_id+":"+v_country;
            let sf_uuid= v_timezone +":ik.com"+cta_lp+":ik.com"+getCookie("ik-landingpage-v2");
            let utmstring = "?utm_source="+$('.utm_source').val()+"&assigned_to=Interview Kickstart&invitee_first_name="+$('.wr__firstname').val()+"&invitee_last_name="+$('.wr__lastname').val()+"&invitee_email="+$('.wr__email').val()+"&answer_1="+$('.wr__phone').val()+"&event_start_time="+estarttime+"&event_end_time="+eendtime+"&utm_medium="+utmm+"&salesforce_uuid="+sf_uuid;
            
	    let finalurl;
		
	    if($('.bye-calendly-type').val() == "NoPhoneInTheFirstStep"){
	    	finalurl = "https://www.interviewkickstart.com/signup-final-step-v6"+utmstring;
	    }else{
	    	finalurl = "https://www.interviewkickstart.com/signup-final-step"+utmstring;
	    }
	
	    $('.wr__event-start-time').val(estarttime);
    		$('.wr__event-end-time').val(eendtime);
            $('.wr__invitee-start-time').val($("input[name='start-date']:checked").data('invitee_starttime'));
   		$('.wr__invitee-end-time').val($("input[name='start-date']:checked").data('invitee_endtime'));
            $('.webinar__loadingbar').show();
            $('.webinar__registration-form2').submit();
            
            bake_cookie("v_history","");
            bake_cookie("v_latest","");
          
            if(singlesignup != true){
              setTimeout(function(){
                location.href = finalurl;
              }, 800);
            }else{
              $('.webinar__loadingbar').hide();
              $('.webinar__registration-form2-block').hide();
              $('.webinar__registration-form3-block').show();
            }
        }
     });
});
