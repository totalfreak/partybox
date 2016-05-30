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
          $("#idInput").animate({zIndex: -20, opacity: 0},{duration: 800, queue: false});
          $("#lobbyList").animate({opacity: 1},{duration: 800, queue: false});
          $("#deleteImg").animate({opacity: 1}, {duration: 800, queue: false});
          $("#startGameButt").animate({marginTop: 370},{duration: 800, queue: false});
          $("#nameInput").animate({zIndex: -20, opacity: 0},{duration: 800, queue: false});
          $("#joinGameButt").animate({zIndex: -20, opacity: 0},{duration: 800, queue: false});
          step = 2;
          join = false;
          voted = false;
          ready = false;
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
          $("#lobbyList").animate({opacity: 1},{duration: 800, queue: false});
          $("#deleteImg").animate({opacity: 1}, {duration: 800, queue: false});
          $("#startGameButt").animate({marginTop: 370},{duration: 800, queue: false});
          step = 2;
          join = true;
          voted = false;
          ready = false;
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
      if(step == 2) {
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
                name: myName,
                voted: false,
                votedFor: "",
                points: 0
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
      //creating the room with the given roomId
      firebase.database().ref('rooms/' + roomId + '/playerList/' + myName).update({
        color: myColor,
        name: myName,
        voted: false,
        votedFor: "",
        points: 0
      });
      firebase.database().ref('rooms/' + roomId + '/votings').update({
        drawGame: 0,
        ready: 0
      });
      joined = true;
    }
    if(joined) {
      firebase.database().ref('rooms/' + roomId + '/playerList/').orderByKey().limitToLast(12).on("child_added", function(snapshot) {
        var data = snapshot.val();
        $("#nameInput").prop("disabled", true);
        $(".lobbyName").text("Lobby - " + roomId);
        document.title = "Partybox - " + roomId;
        $("#idInput").remove();
        $("#nameInput").remove();
        $("#joinGameButt").remove();
        $("#startGameButt").text("Join");
        var color = data.color;
        name = data.name;
        $("#nameList").append("<p class='lobbyPlayerName' id='player_"+name+"' style='color: "+color+"'>"+name+"</p>");
        firebase.database().ref('rooms/' + roomId + '/playerList/' + myName).onDisconnect().remove();
      });
      firebase.database().ref('rooms/' + roomId + '/playerList/').on("child_removed", function(snapshot) {
        var remove = document.getElementById("player_" + name);
        $(remove).remove();
        console.log("Removed player '"+name+"' from the lobbyList");
      });
      $("#startGameButt").click(function() {
        $("#startCont").animate({top: "110%"},800);
        $("#startCont").animate({zIndex: -20, opacity: 0},{duration: 800, queue: false});
        $("#drawGame").animate({top: "25%", bottom: "25%", zIndex: 1, opacity: 1},{duration: 800, queue: false, easing: "easeInOutQuart"});
        step = 3;
        step3();
      });
    }
  }
  function step3() {
    if(step == 3) {
      //Defining the variables that will be fetched from the database
      drawGameVotes = null;
      readyVotes = null;
      gameStart = false;
      //Getting the votecount
      firebase.database().ref("rooms/" + roomId + "/votings").on("value", function(snapshot) {
        snapshot = snapshot.val();
        drawGameVotes = snapshot.drawGame;
        readyVotes = snapshot.ready;
        $("#drawGame").children("paper-badge").attr("label", drawGameVotes);
        $("#readyButt").children("paper-badge").attr("label", readyVotes);
        console.log(drawGameVotes);
      });
      //Getting the current clicked gameChoice, and add/remove your vote from that one
      $(".gameChoice").click(function() {
        if(!voted) {
        var clicked = $(this).attr("id");
        console.log(clicked);
        currentVote = $(this).children("paper-badge").attr("label");
        currentVote = parseInt(currentVote);
        currentVote+=1;
        votedFor = clicked;
        console.log("currentVote is " + currentVote);
        if(drawGameVotes != null) {
          firebase.database().ref("rooms/" + roomId + "/votings").update({
            drawGame: currentVote
          });
          voted = true;
          $("#readyButt").animate({top: "70%", zIndex: 1, opacity: 1},{duration: 800, queue: false, easing: "easeInOutQuart"});
        }
      } else {
          console.log("Removing one");
          currentVote-=1;
          firebase.database().ref("rooms/" + roomId + "/votings").update({
            drawGame: currentVote
          });
          voted = false;
      }
      });
      $("#readyButt").click(function() {
        if(!ready) {
          currentReady = $(this).children("paper-badge").attr("label");
          currentReady = parseInt(currentReady);
          currentReady+=1;
          console.log("current readyVotes is " + currentReady);
          if(readyVotes != null) {
            firebase.database().ref("rooms/" + roomId + "/votings").update({
              ready: currentReady
            });
            ready = true;
            console.log("Ready state: " + ready);
          }
        } else {
          currentReady-=1;
          firebase.database().ref("rooms/" + roomId + "/votings").update({
            ready: currentReady
          });
          ready = false;
          console.log("Ready state: " + ready);
        }
      });
      var currentReadyVote = $("#readyButt").children("paper-badge").attr("label");
      console.log("Number of players " + $("#nameList .lobbyPlayerName").length);
      if($("#nameList .lobbyPlayerName").length == currentReadyVote) {
        gameStart = true;
        gameStarting();
      }
    }
  }
  function gameStarting() {
    if(gameStart) {
      console.log("Should start now");
      $("#gamesCont").animate({position: "absolute", top: "110%", opacity: 0, zIndex: -2}, {duration: 800, queue: false, easing: "easeInOutQuart"});
      round = 1;
      firebase.database().ref("rooms/" + roomId + "/playerList").on("value", function(snapshot) {
        data = snapshot.val();
        console.log(data);
      });
    }
  }
});
