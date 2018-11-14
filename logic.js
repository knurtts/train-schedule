
  var config = {
    apiKey: "AIzaSyDTF0k1tTB-g8rP30L5-oc5_JehgK7yoE0",
    authDomain: "train-schedule-90fa6.firebaseapp.com",
    databaseURL: "https://train-schedule-90fa6.firebaseio.com",
    projectId: "train-schedule-90fa6",
    storageBucket: "train-schedule-90fa6.appspot.com",
    messagingSenderId: "854158776541"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = "";
  var frequency = "";
  var destination = "";

  $("#submit").on("click", function (event) {
    event.preventDefault();

    trainName = $("#trainName").val().trim();
    frequency = $("#trainFreq").val().trim();
    destination = $("#trainDestination").val().trim();

    database.ref("/trains").push({ 
        train: trainName,
        frequency: frequency,
        destination: destination
    }, (data) => {
        
            $("#trainName").val("");
            $("#trainFreq").val("");
            $("#trainDestination").val("");

    });
});

database.ref("/trains").on("child_added", function(childSnapshot) {
    snapVal = childSnapshot.val();
    console.log(snapVal.train);
    console.log("FREQUENCY: " + snapVal.frequency);
    console.log(snapVal.destination);

    var currentTime = moment().format("hh:mm");
    console.log("CURRENT TIME: " + moment(currentTime));
    
    var time = "12:00";

    var startTime = moment(time, "hh:mm").subtract(1, "days");
    console.log("start time: " + startTime);
    
    var difference = parseInt(moment().diff(startTime, "minutes"));
    console.log("DIFFERENCE: " + difference);
    
    var remainder = difference % snapVal.frequency;
    console.log("REMAINDER:" + remainder);
    
    var minutesTil = snapVal.frequency - remainder;
    console.log("minutes til: " + minutesTil);
    
    var nextTrain = moment().add(minutesTil, "minutes");
    console.log("next: " + moment(nextTrain).format("hh:mm"));
    
    $("#full-train-list").append(
        "<div class='row'><div class='col-md-2'>" + snapVal.train + "</div>"
        + "<div class='col-md-2'>" + snapVal.destination + "</div>"
        + "<div class='col-md-2'>" + snapVal.frequency + "</div>"
        + "<div class='col-md-2'>" + moment(nextTrain).format("hh:mm a") + "</div>"
        + "<div class='col-md-2'>" + minutesTil + "</div></div><hr>"

    );
});