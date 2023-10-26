// Add an observer to check the user's authentication state
firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        // User is not signed in. Redirect to the login page.
        window.location.href = "login.html"; // Replace with your login page URL
    }
});

// Wait for the document to be fully loaded before running the code
document.addEventListener("DOMContentLoaded", function () {
    // Get the appointment ID from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const appointmentId = urlParams.get('appointmentId');
console.log(appointmentId )



// Function to load appointment details based on the appointment ID
function loadAppointmentDetails() {
    const firestore = firebase.firestore();
    const appointmentsCollection = firestore.collection('appointments');

    appointmentsCollection.doc(appointmentId).get().then((doc) => {
        if (doc.exists) {
            const appointmentData = doc.data();
            // Use appointmentData to populate the invoice content
            document.getElementById('patient-name').textContent = appointmentData.pName;
            document.getElementById('doctor-name').textContent = appointmentData.name;
            document.getElementById('appointment-date').textContent = appointmentData.date;
            document.getElementById('appointment-time').textContent = appointmentData.time;
            document.getElementById('total-charge').textContent = appointmentData.totalCharge;
        } else {
            console.error('Appointment document not found.');
        }
    });
}

// Call the loadAppointmentDetails function when the invoice page loads
loadAppointmentDetails();


});
function printDiv(divId) {
    const printContent = document.getElementById(divId);

    if (printContent) {
        const bodyContent = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = bodyContent;
    } else {
        console.error('Element with ID ' + divId + ' not found.');
    }
}
function redirectToDashboard() {
    // Redirect to the dashboard.html page
    window.location.href = "dashboard.html";
}