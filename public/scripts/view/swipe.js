//Event handlers to listen for swiping on recipe-result class

var xDown = null;
var yDown = null;

function handleTouchStart(event) {
  xDown = event.touches[0].clientX;
  yDown = event.touches[0].clientY;
};

function handleTouchMove(event) {
  if ( ! xDown || ! yDown ) {
    return;
  }

  var xUp = event.touches[0].clientX;
  var yUp = event.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
    if ( xDiff > 10 ) {
          /* left swipe */
      $(this).hide('slide', { direction: 'left' }, 200);
      //TODO:Get next recipe
      app.Recipe.getNextRecipe($(event.target).closest('div'));
    } else if ( xDiff < -10 ) {
      /* right swipe */
      $(this).hide('slide', { direction: 'right' }, 200);
      //TODO:get previous recipe
      app.Recipe.getPreviousRecipe($(event.target).closest('div'));
    }
  }

  xDown = null;
  yDown = null;
};
