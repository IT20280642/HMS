// Add an observer to check the user's authentication state
firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        // User is not signed in. Redirect to the login page.
        window.location.href = "login.html"; // Replace with your login page URL
    }
});



// Reference to the "appointments" collection
const appointmentsCollection = firebase.firestore().collection("appointments");

// Function to get the number of appointments in the collection
function getNumberOfAppointments() {
    appointmentsCollection.get().then((querySnapshot) => {
        const numberOfAppointments = querySnapshot.size;
        
        document.getElementById('tAppoinments').textContent = numberOfAppointments ;
    }).catch((error) => {
        console.error("Error getting appointments:", error);
    });
}

// Call the function to get the number of appointments
getNumberOfAppointments();

// Reference to the "appointments" collection
const patientsCollection = firebase.firestore().collection("patients");

// Function to get the number of appointments in the collection
function getNumberOfPatients() {
   patientsCollection.get().then((querySnapshot) => {
        const numberOfPatients = querySnapshot.size;
       
        document.getElementById('tPatients').textContent = numberOfPatients ;
    }).catch((error) => {
        console.error("Error getting appointments:", error);
    });
}

// Call the function to get the number of appointments
getNumberOfPatients();

// Reference to the "appointments" collection
const consultantsCollection = firebase.firestore().collection("consultants");

// Function to get the number of appointments in the collection
function getNumberOfConsultants() {
   patientsCollection.get().then((querySnapshot) => {
        const numberOfConsultants = querySnapshot.size;
       
        document.getElementById('tConsultants').textContent = numberOfConsultants ;
    }).catch((error) => {
        console.error("Error getting appointments:", error);
    });
}

// Call the function to get the number of appointments
getNumberOfConsultants();


const loadConsultants=()=>{

    $('#table-body').empty();

    const firestore = firebase.firestore();
    firestore
        .collection('consultants')
        .get().then((result)=>{
            result.forEach((records)=>{
                const data = records.data();
                const row=`
                <tr>
                   
                    <td>${data.name}</td>
                    <td>${data.specialization}</td>
                    
                </tr>
                `;
                $('#table-body').append(row);
            });
    });



}