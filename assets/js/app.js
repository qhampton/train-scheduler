//Firebase Confgis and Initialize
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDHyjcJRFLTkbRv4D6vqiwDjrYiafjBxxQ",
    authDomain: "hw-7-73128.firebaseapp.com",
    databaseURL: "https://hw-7-73128.firebaseio.com/",
    projectId: "hw-7-73128",
    storageBucket: "",
    messagingSenderId: "665026269753",
    appId: "1:665026269753:web:a9b287d5bdd238e1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

console.log("ran through firebase");
//adding employees once submit button
$("#addTrain").on("click", function (event) {
    console.log("button was pressed");
    event.preventDefault();
    //grabs user input
    var name = $("#tName").val().trim();
    var place = $("#tWhere").val().trim();
    var starting = $("#tTime").val().trim();
    var frequency = $("#tMinutes").val().trim();
    //stores locally temporarily
    var newTrain = {
        name: name,
        destination: place,
        start: starting,
        frequency: frequency
    }
    //uploads info to databse
    database.ref().push(newTrain);
    //check console log
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);
    //clear inputs for next add
    $("#tName").val("");
    $("#tWhere").val("");
    $("#tTime").val("");
    $("#tMinutes").val("");
});

//create events in Firebase every entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());
    var trainName = childSnapshot.val().name;
    var trainPlace = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainfreq = childSnapshot.val().frequency;
    //time section calculation- Code this app to calculate when the next train will arrive; this should be relative to the current time of the users computer
    //users current time
    var currentTime = moment();
    var nextTrain = "";
    //pull frequency to be used on own
    var currentFre = parseInt(childSnapshot.val().frequency);
    //convert 
    var startTime = moment(trainStart, "HH:mm").subtract(1, "years");
    console.log("Start time: " + trainStart);
    console.log("Converted to: " + startTime);
    //take the time calculated in moments and subtract a year
    var timeCal = moment().subtract(1, "years");
    //find the difference between the minutes in minutes of user's time
    var diffTime = currentTime.diff(moment(startTime), "minutes");
    //how many minutes left
    var tRemainder = diffTime % currentFre;
    var minNum = currentFre - tRemainder;
    //find the difference from the original start time to the converted time
    var betweenTime = moment(startTime).diff(timeCal, "minutes");
    var betweenMinutes = Math.ceil(moment.duration(betweenTime).asMinutes());

    if ((timeCal - startTime) < 0) {
        //train hasnt started/come yet
        nextTrain = childSnapshot.val().start;
        minNum = betweenMinutes;
    } else {
        //put calculation into non military
        nextTrain = moment().add(minNum, "minutes").format("hh:mm A");
        minNum = currentFre - tRemainder;
    }
    //create new row in table
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainPlace),
        $("<td>").text(trainfreq),
        $("<td>").text(nextTrain),
        $("<td>").text(minCount),
    );
    //push to table
    $("#new-trains").append(newRow);
});