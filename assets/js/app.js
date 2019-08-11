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
$("#addTrain").on("click", function(event) {
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
    $("#tStart").val("");
    $("#tMinutes").val("");
});

//create events in Firebase every entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    var trainName = childSnapshot.val().name;
    var trainPlace = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainfreq = childSnapshot.val().frequency;
    //time section calculation- Code this app to calculate when the next train will arrive; this should be relative to the current time.

    //create new row in table
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainPlace),
        $("<td>").text(trainStart),
        $("<td>").text(trainfreq),
        // $("<td>").text(empfrequency),
        // $("<td>").text(empBilled)
    );
    //push to table
    $("#new-trains").append(newRow);
});
