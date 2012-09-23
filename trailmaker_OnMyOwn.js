//Javascript for trailmaker project

var delicious={};
				$(document).ready(function()
				{
				
					$('#drag').hide();
					
					//CLEAR ALL TEXT BOXES
					$('#searchTitle').val("");
					$('#searchTags').val("");
					$('#searchText').val("");
					$('#save-username').val("");
					$('#save-password').val("");
					$('#username').val("");
					
    				$('#load-bookmarks').submit(function()
					{
					    
    					var username=$('#username').val();
						$('#username').val('');
						$('#drag').show();
			

    					$.getJSON('http://feeds.delicious.com/v2/json/'+username+'?callback=?',function(json)
    				{
        				
        				$(json).each(function(index)
        				 {
	
							  $('<li></li>').html('<div id="links"><b>Link:</b> <a href="'+this.u+'">'+this.d+'</a></div><div id="tags"> <b><i>Tags:</b>'+this.t+'</i></div>') 
							  .data('extended',this.n)
            				   .data('tags',this.t)
            				   .appendTo('#bookmarks ul')	
						  	   
							
    				  	 });
						 
						 makeBoxesSameHeight();
						
						 $('#bookmarks li').draggable({revert: true});
				
						 //change text on page for better UX
						$('#load-bookmarks h2').text('Now add bookmarks from another user');
						$('#Get-submit').attr('value','Add Bookmarks');
						$('#enter').text("Enter another username to add more bookmarks to the list");
						
						
    				});
					
					return false;
    				});
					function makeBoxesSameHeight()
				{
				 		//Make boxes of the same height
						heightOfB=$('#bookmarks').height();
						heightOfN=$('#new-trail').height();
						if (heightOfB < heightOfN)
						{
						 $('#bookmarks').css("height",heightOfN);
						 }
						 else
						 {
						  $('#new-trail').css("height",heightOfB);
						 }

				}
					//SEARCH FUNCTIONALITY- SEARCH TITLES
				$('#searchTitle').keyup(function(event) {
													   var search_text = $('#searchTitle').val();
													

														$('#bookmarks ul li #links').each(function(index){
														
                 														if($(this).html().toLowerCase().indexOf(search_text) < 0) {
																		
                																							 $(this).parent().hide();
																											 //HIDE THE TAGS PART
																											 //$(this).siblings().hide();
                 																							
                																							
                																							 }	
                														else {
                                                                				
                                                                				
																				$(this).parent().show();
																				//SHOW THE TAGS PART
																				 //$(this).siblings().show();
                                                                				
                                                                			}
                                                        		
                                                        	});
															makeBoxesSameHeight();
                                                        });
 
					
				//SEARCH FUNCTIONALITY- SEARCH TAGS
				$('#searchTags').keyup(function(event) {
													   var search_text = $('#searchTags').val();
													

														$('#bookmarks ul li #tags').each(function(index){
														
                 														if($(this).html().toLowerCase().indexOf(search_text) < 0) {
                																							 $(this).parent().hide();
																											 //HIDE THE LINKS PART
																											 //$(this).siblings().hide();
                 																							
                																							
                																							 }	
                														else {
                                                                				
                                                                				
																				$(this).parent().show();
																				//SHOW THE LINKS PART
																				 //$(this).siblings().show();
                                                                				
                                                                			}
                                                        		
                                                        	});
															makeBoxesSameHeight();
                                                        });
 
              					
				//SEARCH FUNCTIONALITY- SEARCH ALL
				$('#searchText').keyup(function(event) {
													   var search_text = $('#searchText').val();
													

														$('#bookmarks li' ).each(function(index){
													
														
                 														if( $(this).html().toLowerCase().indexOf(search_text) < 0 ) {
                																							 $(this).hide();
                 																							
                																							
                																							 }	
                														else {
                                                                				
                                                                				
																				$(this).show();
																				
                                                                				
                                                                			}
                                                        		
                                                        	});
															makeBoxesSameHeight();
                                                        });
 
				$('#new-trail').droppable(
				{
				accept:'li',
				drop:function(event,ui)
					{
					 $(ui.draggable).css({top:'0px',left:'0px'}).appendTo('#new-trail ul');
					 //HIDING TAGS PART OF THE LINK
					 (($(ui.draggable).children('#tags'))).hide();
					 
					 
					 
					makeBoxesSameHeight();
				    }
				   }); 
				   
				   $('#bookmarks').droppable(
				{
				accept:'li',
				drop:function(event,ui)
					{
					
					 $(ui.draggable).css({top:'0px',left:'0px'}).appendTo('#bookmarks ul');
					 //SHOWING TAGS PART OF THE LINK
					 (($(ui.draggable).children('#tags'))).show();
					 
					 
					makeBoxesSameHeight();
				    }
				   }); 
				
				  
					 $('#new-trail ul').sortable();
				 $('#save-trail').submit(function()
				 {
				//Saving a new trail to a new username
				  $('#new-trail h2').text(prompt('Enter a name for your trail')||'My New Trail');
				  delicious.username=$('#save-username').val();
				  delicious.password=$('#save-password').val();
				  delicious.stepNum=0;
				  saveTrail();
				  
				  //RESETTING NEW TRAIL HEADING TO DEFAULT
				  $('#new-trail h2').text('New Trail');
				  return false;
				 });
				 function saveTrail()
				 {
				
				
				  delicious.stepNum++;
				  var newTrailName='trail:'+$('#new-trail h2').text().toLowerCase().replace(/ /g,'_');
				
				  var bookmark=$('#new-trail li:first');
				  var postData={
				  	  url:bookmark.find('a').attr('href'),
					  description:bookmark.find('a').html(),
					  extended:bookmark.data('extended'),
					  tags: (bookmark.data('tags') == "" ? "" : bookmark.data('tags').join(',') + ',') + newTrailName + ',' + 'step:' + delicious.stepNum,
                    method: 'posts/add',
					  username:delicious.username,
					  password:delicious.password
					  };
				 
				 $.getJSON('http://courses.ischool.berkeley.edu/i290-iol/f10/resources/delicious_proxy.php?callback=?',  postData, function(rsp){
				
        if (rsp.result_code === "access denied") {
            alert('The provided Delicious username and password are incorrect.');
        } else if (rsp.result_code === "something went wrong") {
            alert('There was an unspecified error communicating with Delicious.');
        } else if (rsp.result_code === "done") {
            // Bookmark was saved properly
            $('#new-trail li:first').remove(); // Remove the bookmark we just saved
            if ($('#new-trail li').length > 0) {
		
              
                setTimeout(saveTrail, 1000);
            } else {
               
                delicious.password = null; // Don't store the user's password any longer than we need to
                alert ("Your trail has been saved!");
            }
        }
    });
}
			  														    				 																																																				
});