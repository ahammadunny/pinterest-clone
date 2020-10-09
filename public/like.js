(function ($) {
  
  
  'use strict';
  
  
  var socket = io();
  
  // Register event handlers
 $('button.like').on('click',  like1);
  //socket.on('clicked',hate)
  
  
  // Listen for live events
  socket.on('like', onLike);
  socket.on('unlike', onUnlike);
  socket.on('exception', onSocketError);
  
  
  // ----------------------------------------------------------------------------------------------------
  
  
  // Handle when a user like or unlikes a pin
  function like() {
    console.log("button is clicked");
    var data = $(this).data();
    alert(JSON.stringify(data).pinid);
    console.log(JSON.stringify(data));
    socket.emit('like', { pinId: data.pinid, userId: data.userid });
  }
  
 function like1() {
  var count = $(this).next('span');

  $(this).toggleClass('btn-default btn-danger');                                    
  if ($(this).hasClass('btn-default')) {
    count.text('<%=pin.likes.length +1 %>');
  } else {
    count.text('<%= pin.likes.length +1 %>');
  }
} 
  
  
  // Handle socket errors
  function onSocketError(err) {
    alert(err.message);
  }
  
  
  // Handle like events
  function onLike(data) {
    var $pin = $('[data-pinid="' + data.pinId + '"]');
    
    $pin.addClass('btn-danger').removeClass('btn-default');
    $pin.find('.like-count')
      .text(data.total)
      .hide()
      .fadeIn();
    $pin.find('.fa')
      .removeClass('fa-heart-o')
      .addClass('fa-heart')
      .hide()
      .fadeIn();
  }
  
  
  // Handle unlike events
  function onUnlike(data) {
    var $pin = $('[data-pinid="' + data.pinId + '"]');
    
    $pin.addClass('btn-default').removeClass('btn-danger');
    $pin.find('.like-count')
      .text(data.total)
      .hide()
      .fadeIn();
    $pin.find('.fa')
      .removeClass('fa-heart')
      .addClass('fa-heart-o')
      .hide()
      .fadeIn();
  }
  
  
})(jQuery);

