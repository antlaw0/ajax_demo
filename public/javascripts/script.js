
$(function(){

  // Add a listener for input text; listen for Enter key.
  // Send POST request to create new place

  getAllPlaces();

});


function addNewPlaceFormListener() {

  $("#new_place").keypress(function(event){
    var placename = $(this).val();
    if (event.which == 13 && placename ) {   //if user presses Enter and $(this).val has a value
      addNewPlace(placename);
    }
  });

}

// Create elements

function addPlacesToPage(places) {
  //if (!places || places.length == 0){
  //  //todo no places method
  //}

  var parent = $('#place_list');
  for (var i = 0 ; i < places.length ; i++) {
    addPlace(places[i], parent);
  }

  // Remove any old listeners, add listeners

  // Add listener to input checkboxes. As input checkboxes are checked and unchecked,
  // send PUT request to update the visited value of the place with the corresponding _ID
  $('.visited').off().click(checkListener);

  // Add listener to delete buttons. Send DELETE request to delete place when clicked.
  $('.delete').off().click(deleteListener);

}


function addPlace(place, parent) {

  var html = '<div id="' + place._id + '"><span class="placename">' + place.name + '</span><label class="visited_label" for="' + place._id + '_is_visited">Visited?</label>';

  if (place.visited) {
    html += '<span class="controls"><input class="visited" id="' + place._id + '_is_visited" type="checkbox" checked />'
  }
  else {
    html += '<span class="controls"><input class="visited" id="' + place._id + '_is_visited" type="checkbox"/>'
  }

  html += '<button id="'+ place._id +'_delete" class="delete">Delete?</button></span></div>';

  parent.append(html);
}


// Listener functions
function deleteListener() {

  $(this).text('Deleting...');              // Change button text to 'deleting...' Visual feedback for slower connections.
  var elem_id = $(this).attr('id');         // Get the id of the element clicked, expected to be in the format '4_delete' for place _id 4
  var _id = elem_id.replace('_delete', '');  // Cut off the _delete part, left with the number _id
  deletePlace(_id);                          // Make AJAX request to delete the place with this _ID
}


function checkListener() {
  //todo feedback on updated?
  var visited = $(this).is(':checked');   // Is the checkbox checked or unchecked?
  var elem_id = $(this).attr('id');             // Get the checkbox id. For place with _id 4, the _id will be 4_visited
  var _id = elem_id.replace('_is_visited', '');   // Remove the _is_visited part
  updateVisited(_id, visited);                    // make AJAX request to update the place with this _ID to the new visited state.
}


// These functions make AJAX calls

function getAllPlaces(){

  $.ajax({
    method:"GET",
    url:"/all"
  }).done(function(data){
    //Build HTML for each place in list
    addPlacesToPage(data);
    addNewPlaceFormListener();  //Once page is loaded, enable form

  }).fail(function(error){
    console.log("GET error");
    console.log(error);
  });

}


function addNewPlace(placename){

  $.ajax({
    method:"POST",
    url:"/add",

	data: { "name" : placename }
  }).done(function(data){
if (data.key == true)
{

  console.log('POST complete');

    $('#new_place').val('');        // Clear input text box

    var parent = $('#place_list');
    addPlace(data, parent);

    // Update listeners
    var new_checkbox_id = '#' +data._id + '_is_visited';
    var new_delete_id = '#' +data._id + '_delete';

    $(new_checkbox_id).click(checkListener);
    $(new_delete_id).click(deleteListener);
}
else//already exists,
{
	alert("This place already exists");
}

  }).fail(function(error){
    console.log('POST Error');
    console.log(error);
  });

}


function updateVisited(_id, visited) {

  $.ajax({
    method:"PUT",
    url:"/update",
    data:{ "_id":_id, "visited":visited }
  }).done(function(){
    console.log('PUT complete');  // Could update the page here, if needed
  }).fail(function(error){
    console.log('PUT error');
    console.log(error)
  });
}


function deletePlace(_id) {


  console.log('delete', _id)
  $.ajax({
    method: "DELETE",
    url: "/delete",
    data: { '_id': _id }
  }).done(function (data) {
    console.log('DELETE complete', data);
    // Select div containing this item, and remove from page
    var selector_id = '#' + data._id + "";
    console.log(selector_id)
    $(selector_id).fadeOut(function(){
      $(this).remove();
    });
  }).fail(function (error) {
    console.log('DELETE error');
    console.log(error);
  });
}
