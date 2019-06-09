$(document).ready(function() {

    var firebaseConfig = {
        apiKey: "AIzaSyCZEHTeSnlmfqLUPePA2P-KEYrjWqWLf9o",
        authDomain: "train-scheduler-edc7e.firebaseapp.com",
        databaseURL: "https://train-scheduler-edc7e.firebaseio.com",
        projectId: "train-scheduler-edc7e",
        storageBucket: "train-scheduler-edc7e.appspot.com",
        messagingSenderId: "966169066890",
        appId: "1:966169066890:web:fcab01411dc99347"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // set up firebase connection
    var database = firebase.database().ref();

    // Initial Values
    // var trainName = "";
    // var destination = "";
    // var trainTime = "";
    // var frequency = 0;
    // var minutesAway = 0;
    // var nextArrival = "";

    // Capture Button Click
    $("#submit").on("click", function(event) {
        event.preventDefault();
        console.log("click")

        // take in the values entered and add to variables
            var trainName = $("#train-name").val().trim();
            var destination = $("#destination").val().trim();
            var trainTime = $("#train-time").val().trim();
            var frequency = $("#frequency").val().trim();

        // push info into database

        var newTrain = {
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
        };

        database.push(newTrain);

        //clear input fields
        $("#train-name").val("");
        $("#destination").val("");
        $("#train-time").val("");
        $("#frequency").val("");

        return false;
        
    })
                
    
       

        // update list
        database.orderByChild("dateAdded").on("child_added", function(snapshot) {

            var theTrainTime = snapshot.val().trainTime;
            var theFrequency = snapshot.val().frequency;


            console.log(moment(snapshot.val().dateAdded).format("MM/DD/YY"))

            // calculate the next arrival time and minutes away
            var firstTimeConverted = moment(theTrainTime, "HH:mm").subtract(1, "years");
            console.log(firstTimeConverted);

            var currentTime = moment();
            console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            console.log("DIFFERENCE IN TIME: " + diffTime);

            console.log(frequency)
            var remainder = diffTime % theFrequency;
            console.log(remainder);

            var minutesAway = theFrequency - remainder;
            console.log("MINUTES TILL TRAIN: " + minutesAway);

            var nextArrival = moment().add(minutesAway, "minutes");
            console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm A"));
    
            var theTrainName = snapshot.val().trainName;
            var theDestination = snapshot.val().destination;
    
             // ref for html to update display
            $(".train-name-display").append("<td>", theTrainName);
            $(".destination-display").append("<td>", theDestination);
            $(".frequency-display").append("<td>", theFrequency + " minutes");
            $(".next-arrival-display").append("<td>",  moment(nextArrival).format("hh:mm A"));
            $(".minutes-away-display").append("<td>",  minutesAway + " minutes");

            
        // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
            });

   
        
    
 })