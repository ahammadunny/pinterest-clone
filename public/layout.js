(function($) {
  
  
  'use strict';
  
  
  var $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
  });
  
  $grid.imagesLoaded().progress(function() {
    $grid.masonry('layout');
  });
  
  $('.grid img').on('error', function() {
    this.src ='https://dummyimage.com/400x300/DE0000/ffffff&text=+I+AM+ERROR+';
  });
  
  
})(jQuery);