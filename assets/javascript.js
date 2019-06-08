$( document ).ready(function() {

    var firebaseConfig = {
        apiKey: "AIzaSyCZEHTeSnlmfqLUPePA2P-KEYrjWqWLf9o",
        authDomain: "train-scheduler-edc7e.firebaseapp.com",
        databaseURL: "https://train-scheduler-edc7e.firebaseio.com",
        projectId: "train-scheduler-edc7e",
        storageBucket: "",
        messagingSenderId: "966169066890",
        appId: "1:966169066890:web:fcab01411dc99347"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // set up firebase connection
    var database = firebase.database();

    // Initial Values
    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = 0;
    var minutesAway = 0;
    var nextArrival = "";

    // Capture Button Click
    $("#submit").on("click", function(event) {
        event.preventDefault();
        console.log("click")

        // take in the values entered and add to variables
            trainName = $("#train-name").val().trim();
            destination = $("#destination").val().trim();
            trainTime = $("#train-time").val().trim();
            frequency = $("#frequency").val().trim();

        // push info into database
            database.ref().push({
                trainName: trainName,
                destination: destination,
                trainTime: trainTime,
                frequency: frequency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP,
            });
    
       

        // update list
        database.ref().once("child_added", function(snapshot) {


            console.log(moment(snapshot.val().dateAdded).format("MM/DD/YY"))

            // calculate the next arrival time and minutes away
            var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
            console.log(firstTimeConverted);

            var currentTime = moment();
            console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            console.log("DIFFERENCE IN TIME: " + diffTime);

            console.log(frequency)
            var remainder = diffTime % frequency;
            console.log(remainder);

            var minutesAway = frequency - remainder;
            console.log("MINUTES TILL TRAIN: " + minutesAway);

            var nextArrival = moment().add(minutesAway, "minutes");
            console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm A"));

            // TRIED THIS...NO LUCK
            // for each new train, add a <row> into the table
            // $("#display").append("<tr><td>" + snapshot.val().trainName + 
            //                 "</td><td>" + snapshot.val().destination +
            //                 "</td><td>" + snapshot.val().frequency +
            //                 "</td><td>" + moment(nextArrival).format("hh:mm") +
            //                 "</td><td>" + minutesAway);
        
            // TRIES THIS TOO... NO LUCK
            // $("#display").append("<div class='well'><span class='member-name'> " +
            // childSnapshot.val().trainName +
            // " </span><span class='member-email'> " + childSnapshot.val().destination +
            // " </span><span class='member-age'> " + childSnapshot.val().frequency +
            // " </span></div>");
    

    
             // ref for html to update display
            $(".train-name-display").append("<td>", snapshot.val().trainName);
            $(".destination-display").append("<td>", snapshot.val().destination);
            $(".frequency-display").append("<td>", snapshot.val().frequency + " minutes");
            $(".next-arrival-display").append("<td>",  moment(nextArrival).format("hh:mm A"));
            $(".minutes-away-display").append("<td>",  minutesAway + " minutes");

            
        // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
            });

            //clear input fields
            $("#train-name").val("");
            $("#destination").val("");
            $("#train-time").val("");
            $("#frequency").val("");
        
    })
 })