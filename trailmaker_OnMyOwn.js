//Javascript for trailmaker project

var delicious={};
				$(document).ready(function()
				{
					
    				$('#load-bookmarks').submit(function()
					{
					    
    					var username=$('#username').val();
						$('#username').val('');
						
    					$.getJSON('http://feeds.delicious.com/v2/json/'+username+'?callback=?',function(json)
    				{
        				
        				$(json).each(function(index)
        				 {
            				  $('<li></li>').html('<a href="'+this.u+'">'+this.d+'</a>') 
							  .data('extended',this.n)
            				   .data('tags',this.t)
            				   .appendTo('#bookmarks ul');	
    				  	 });
        				$('#bookmarks li').draggable({revert: true});
    				});
					return false;
    				});
				
				
				
				  
				  $('#new-trail').droppable(
				   {
				    accept:'li',
					drop:function(event,ui)
					{
					 $(ui.draggable).draggable('disable').css({top: '0px', left: '0px'}).appendTo('#new-trail ul');
					
				    }
				   }); 

				 $('#new-trail ul').sortable();
				 $('#save-trail').submit(function()
				 {
				
				  $('#new-trail h2').text(prompt('Enter a name for your trail')||'My New Trail');
				  delicious.username=$('#save-username').val();
				  delicious.password=$('#save-password').val();
				  delicious.stepNum=0;
				  saveTrail();
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
		
                // If there are any bookmarks left to save
                // Save the next bookmark in the trail in 1000ms (1 second)
                // We have to wait this period of time to comply with the
                // terms of the Delicious API. If we don't we may have access denied.
                setTimeout(saveTrail, 1000);
            } else {
                // We're done saving the trail
                delicious.password = null; // Don't store the user's password any longer than we need to
                alert ("Your trail has been saved!");
            }
        }
    });
}
			  														    				 																																																				
});