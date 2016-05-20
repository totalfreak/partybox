// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDPd2ml0wXLXE5jX8t11GacNuOGBmF66eA",
    authDomain: "partybox-68cd8.firebaseapp.com",
    databaseURL: "https://partybox-68cd8.firebaseio.com",
    storageBucket: "partybox-68cd8.appspot.com",
  };
  firebase.initializeApp(config);
  step = 1;
  $(function() {
    function makeId() {
    roomId = (0|Math.random()*9e6).toString(36);
    }
    if(step == 1) {
      var colArray = ["#F44336", "#E91E63", "#9C27B0", "#3F51B5", "#2196F3", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548"];
      myColor = colArray[Math.floor(Math.random() * colArray.length)];
      //Taking player to start a new room
      $("#startGameButt").click(function() {
        if($("#nameInput").val() != "" && step == 1) {
          myName = $("#nameInput").val();
          console.log("Name: " + myName);
          $("#startCont").animate({width: 700, height: 700}, {duration: 800, queue: false});
          $("#firstChoice").animate({width: 700, height: 700}, {duration: 800, queue: false});
          $("#drawImg").animate({opacity: 1, top: 0, zIndex: 5}, {duration: 800, queue: false});
          //$("#idInput").animate({marginTop: 150},{duration: 800, queue: false});
          $("#idInput").animate({zIndex: -2, opacity: 0},{duration: 800, queue: false});
          $("#joinGameButt").animate({zIndex: -2, opacity: 0},{duration: 800, queue: false});
          $("#nameInput").animate({marginTop: 450},{duration: 800, queue: false});
          $("#lobbyList").animate({opacity: 1},{duration: 800, queue: false});
          step = 2;
          join = false;
          makeId();
          console.log(roomId);
          console.log("You're now at step " + step);
          console.log(myColor);
          step2();
        }
      });
      $("#joinGameButt").click(function() {
        if($("#nameInput").val() != "" && $("#idInput").val() != "" && step == 1) {
          myName = $("#nameInput").val();
          console.log("Name: " + myName);
          $("#startCont").animate({width: 700, height: 700}, {duration: 800, queue: false});
          $("#firstChoice").animate({width: 700, height: 700}, {duration: 800, queue: false});
          $("#drawImg").animate({opacity: 1, top: 0, zIndex: 1}, {duration: 800, queue: false});
          //$("#idInput").animate({marginTop: 150},{duration: 800, queue: false});
          $("#idInput").animate({zIndex: -2, opacity: 0},{duration: 800, queue: false});
          $("#joinGameButt").animate({zIndex: -2, opacity: 0},{duration: 800, queue: false});
          $("#nameInput").animate({marginTop: 450},{duration: 800, queue: false});
          $("#lobbyList").animate({opacity: 1},{duration: 800, queue: false});
          step = 2;
          join = true;
          roomId = $("#idInput").val();
          console.log(roomId);
          console.log("You're now at step " + step);
          console.log(myColor);
          step2();
        }
      });
    }
    //Letting user draw a profile image, and entering the room
    // Only executed our code once the DOM is ready.

	window.onload = function() {
		// Get a reference to the canvas object
		var canvas = document.getElementById('drawImg');
		// Create an empty project and a view for the canvas:
		paper.setup(canvas);
    with(paper) {
		// Create a Paper.js Path to draw a line into it:
		// Give the stroke a color
    var tool = new Tool();
		// Define a mousedown and mousedrag handler
		tool.onMouseDown = function(event) {
			path = new Path();
			path.strokeColor = myColor;
      path.strokeWidth = 5;
			path.add(event.point);
		}
		tool.onMouseDrag = function(event) {
			path.add(event.point);
		}
  }
	}
  function step2() {
    if(join) {
      //Checking if the entered roomId exists in the database
      firebase.database().ref('rooms/').once("value", function(snapshot) {
        data = snapshot.val();
        for(i in data) {
          if(i == roomId) {
            //if(data.numChildren() <= 3) {
              firebase.database().ref('rooms/' + roomId + '/playerList/' + myName).update({
                color: myColor,
                name: myName
              });
            /*} else {
              console.log("Too many players");
              break;
            }*/
            return true;
            break;
          } else {
            console.log("Should restart now, due to no room being found");
          }
        }
      });
      joined = true;
    } else {
      //creating the room with the give roomId
      firebase.database().ref('rooms/' + roomId + '/playerList/' + myName).update({
        color: myColor,
        name: myName
      });
      joined = true;
    }
    if(joined) {
      firebase.database().ref('rooms/' + roomId + '/playerList/').orderByChild("name").limitToLast(12).on("child_added", function(snapshot) {
        var data = snapshot.val();
        $("#lobbyList").text("Lobby - " + roomId);
        var color = data.color;
        var name = data.name;
        $("#lobbyList").append("<p style='color: "+color+"'>"+name+"</p>");
        firebase.database().ref('rooms/' + roomId + '/playerList/' + myName).onDisconnect().remove();
      });
    }
  }
});
