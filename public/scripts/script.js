// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDPd2ml0wXLXE5jX8t11GacNuOGBmF66eA",
    authDomain: "partybox-68cd8.firebaseapp.com",
    databaseURL: "https://partybox-68cd8.firebaseio.com",
    storageBucket: "partybox-68cd8.appspot.com",
  };
  firebase.initializeApp(config);
  $(document).ready(function() {
    step = 1;
    function makeId() {
    roomId = (0|Math.random()*9e6).toString(36);
}
    $("#startGameButt").click(function() {
      if($("#nameInput").val() != "" && step == 1) {
      /*makeId();
      console.log(roomId);
      $("#firstChoice").animate({opacity: "0"});
      $("#firstChoice").animate({left: "60%"});
      */
      $("#joinGameButt").animate({opacity: "0"});
      $("#joinGameButt").animate({right: "80%"});
      //$("#startGameButt").animate({top: "170px"}, {duration: 800, queue: false});
      $("#nameInput").animate({marginTop: "480px"}, {duration: 800, queue: false});
      $("#startCont").animate({width: "700px", height: "650px"}, {duration: 800, queue: false});
      $("#firstChoice").animate({width: "700px", height: "650px"}, {duration: 800, queue: false});
      $("#deleteImg").animate({opacity: 1}, 1000);
      $("#drawImg").animate({opacity: 1, zIndex: 1}, {duration: 2000});
      step = 2;
      console.log(step);
      setTimeout(function(){$("#startGameButt").text("Start");}, 100);
    }
    });
// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
window.addEventListener('load', function () {
  var canvas, context, tool;

  function init () {
    // Find the canvas element.
    canvas = document.getElementById('drawImg');
    if (!canvas) {
      alert('Error: I cannot find the canvas element!');
      return;
    }

    if (!canvas.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }

    // Get the 2D canvas context.
    context = canvas.getContext('2d');
    if (!context) {
      alert('Error: failed to getContext!');
      return;
    }

    // Pencil tool instance.
    tool = new tool_pencil();

    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);
  }

  // This painting tool works like a drawing pencil which tracks the mouse
  // movements.
  function tool_pencil () {
    var tool = this;
    this.started = false;

    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {
        context.beginPath();
        context.strokeStyle = "#df4b26";
        context.lineWidth = 5;
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    };

    // This function is called every time you move the mouse. Obviously, it only
    // draws if the tool.started state is set to true (when you are holding down
    // the mouse button).
    this.mousemove = function (ev) {
      if (tool.started) {
        context.lineTo(ev._x, ev._y);
        context.stroke();
      }
    };

    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
      }
    };
  }

  // The general-purpose event handler. This function just determines the mouse
  // position relative to the canvas element.
  function ev_canvas (ev) {
    if (ev.layerX || ev.layerX == 0) { // Firefox
      ev._x = ev.layerX;
      ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      ev._x = ev.offsetX;
      ev._y = ev.offsetY;
    }

    // Call the event handler of the tool.
    var func = tool[ev.type];
    if (func) {
      func(ev);
    }
  }

  init();
  $("#deleteImg").click(function() {
  if(step == 2) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  });
  $("#startGameButt").click(function() {
    if(step == 2 && $("#startGameButt").text() == "Start") {
      var dataURL = canvas.toDataURL();
      console.log(dataURL);
      makeId();
      console.log(roomId);
      firebase.database().ref('rooms/').push({
        id: roomId,
        players: 0
      });
    }
  });
}, false); }
  });
