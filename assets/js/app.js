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

//adding trains once submit button
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
    //pull frequency to be used on own as a integer 
    var currentFrequency = parseInt(childSnapshot.val().frequency);
    //this is a workaround so that unix time is not at a negative start point (giving same start point for all moment times)
    var startTime = moment(trainStart, "HH:mm").subtract(1, "years");
    console.log("Start time: " + trainStart);
    console.log("Converted to: " + startTime);
    //same workaround as above but to current time instead
    var timeCal = moment().subtract(1, "years");
    //find the difference between right now and time calculated at start
    var diffTime = currentTime.diff(moment(startTime), "minutes");
    //the minutes of how long we have to wait for the next train
    var tRemainder = diffTime % currentFrequency;
    //how many minutes left for the next train
    var minNum = currentFrequency - tRemainder;
    //moment between the work around numbers above in minutes to be used in the duration
    var betweenTime = moment(startTime).diff(timeCal, "minutes");
    //what is the minutes ve between the start of the train to the current time in minutes
    var betweenMinutes = Math.ceil(moment.duration(betweenTime).asMinutes());

    //if the train is suppose to come now
    if ((timeCal - startTime) < 0) {
        //minimum = between minutes - so if a train is coming now the next train is the set number minutes between trains
        nextTrain = childSnapshot.val().start;
        minNum = betweenMinutes;
    } else {
        //put calculation into non military of the next train 
        nextTrain = moment().add(minNum, "minutes").format("hh:mm A");
        minNum = currentFrequency - tRemainder;
    }
    //create new row in table
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainPlace),
        $("<td>").text(trainfreq),
        $("<td>").text(nextTrain),
        $("<td>").text(minNum),
    );
    //push to table
    $("#new-trains").append(newRow);
});