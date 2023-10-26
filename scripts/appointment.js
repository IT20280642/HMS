// Add an observer to check the user's authentication state
firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        // User is not signed in. Redirect to the login page.
        window.location.href = "login.html"; // Replace with your login page URL
    }
});
// Function to populate patient dropdown with registered patients
const populatePatientDropdown=()=>{

    const patientSelect = document.querySelector('#patient-select');

    const firestore = firebase.firestore();
    firestore
        .collection('patients')
        .get().then((result)=>{
            result.forEach((doc)=>{
                // const data = records.data();
                const patientData = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = patientData.pName;
                patientSelect.appendChild(option);
                
            });
            
    });



}


// Function to populate doctor dropdown with registered doctors
function populateDoctorDropdown() {
    const doctorSelect = document.querySelector('#doctor-select');

    // Retrieve doctors collection from Firestore
    const firestore = firebase.firestore();
    firestore.collection("consultants").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const doctorData = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doctorData.name;
            doctorSelect.appendChild(option);
        });
        
    });
    
}

// Function to display existing appointments from Firestore
function displayExistingAppointments() {
    const tbody = document.querySelector('#appointments-section tbody');
    tbody.innerHTML = ''; // Clear existing data
    
    
                

    // Retrieve appointments collection from Firestore
    const firestore = firebase.firestore();
    firestore.collection("appointments").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const appointmentData = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${doc.id}</td>
            <td id="patient-name">${appointmentData.pName}</td>
            <td id="doctor-name">${appointmentData.name}</td>
            <td id="appointment-date">${appointmentData.date}</td>
            <td id="appointment-time">${appointmentData.time}</td>
            <td id="totalCharge">${appointmentData.totalCharge}</td>
            <td>
                <button class="btn btn-sm btn-danger cancel-appointment" data-id="${doc.id}">Cancel</button>
                <button class="btn btn-primary newUser" onclick="printDiv('${doc.id}')">Print</button>
            </td>
            `;
            tbody.appendChild(row);
            

            // Attach event listener for cancel appointment button
            const cancelButton = row.querySelector('.cancel-appointment');
            cancelButton.addEventListener('click', () => cancelAppointment(doc.id));
        });
    });
}

consultantId=undefined;
const updateData=(id)=>{
    consultantId=id;
    const firestore = firebase.firestore();
    firestore
        .collection('consultants')
        .doc(consultantId)
        .get().then((response)=>{
            if (response.exists) {
                const data = response.data();
                $('#name').val(data.pname);
                $('#specialization').val(data.name);
                $('#contact').val(data.date);
                $('#consultantCharge').val(data.time);
                $('#consultantCharge').val(data.totalCharge);
                

            }
    })
}

// Function to populate the consultant charge when a consultant is selected
function populateConsultantCharge() {
    const doctorSelect = document.querySelector('#doctor-select');
    const consultantChargeInput = document.querySelector('#consultantCharge');
    const totalChargeInput = document.querySelector('#totalCharge');


    // Listen for changes in the consultant dropdown
    doctorSelect.addEventListener('change', (event) => {
        const selectedDoctorId = event.target.value;

        // Retrieve the selected consultant's charge from Firestore
        const firestore = firebase.firestore();
        firestore.collection("consultants").doc(selectedDoctorId).get()
            .then((doc) => {
                if (doc.exists) {
                    const consultantData = doc.data();
                    const consultantCharge = parseFloat(consultantData.consultantCharge);
                    const hospitalFee = 500;
                const totalCharge = consultantCharge + hospitalFee;

                    // Update the consultant charge input field
                    consultantChargeInput.value = consultantCharge;
                    totalChargeInput.value =totalCharge;
                } else {
                    console.error("Doctor data not found.");
                }
            })
            .catch((error) => {
                console.error("Error loading consultant data from Firestore: ", error);
            });
    });
}
const doctorSelect = document.querySelector('#doctor-select');
        let selectedDoctorName = '';

        doctorSelect.addEventListener('change', (event) => {
            selectedDoctorName = event.target.options[event.target.selectedIndex].text;
        });

// // Call the populateConsultantCharge function when the DOM is ready
// document.addEventListener("DOMContentLoaded", () => {
//     populateConsultantCharge();
// });


// Function to handle appointment booking form submission
// function bookAppointment(event) {
//     event.preventDefault(); // Prevent form submission

//     // Get data from the form
//     const patientId = document.querySelector('#patient-select').value;
//     const doctorId = document.querySelector('#doctor-select').value;
//     const appointmentDate = document.querySelector('#appointment-date').value;
//     const appointmentTime = document.querySelector('#appointment-time').value;

//     // Check for appointment conflicts here (e.g., another appointment at the same time)

    

//     // Add the new appointment to Firestore (collection: appointments)
//     firestore.collection("appointments").add({
//         patientId: patientId,
//         doctorId: doctorId,
//         date: appointmentDate,
//         time: appointmentTime,
//         totalCharge: totalCharge // Add total charge to the appointment
//     })
//     .then(() => {
//         // Clear the form fields
//         document.querySelector('#appointment-date').value = '';
//         document.querySelector('#appointment-time').value = '';

//         // Refresh the appointment list
//         displayExistingAppointments();
//     })
//     .catch((error) => {
//         console.error("Error booking appointment in Firestore: ", error);
//     });
// }

// Function to handle appointment booking form submission
function bookAppointment(event) {
    event.preventDefault(); // Prevent form submission

    // Get data from the form
    const patientId = document.querySelector('#patient-select').value;
    const doctorId = document.querySelector('#doctor-select').value;
    const appointmentDate = document.querySelector('#appointment-date').value;
    const appointmentTime = document.querySelector('#appointment-time').value;
    const totalCharge = document.querySelector('#totalCharge').value;

    // Get the selected patient and doctor names
    const patientSelect = document.querySelector('#patient-select');
    const doctorSelect = document.querySelector('#doctor-select');
    const selectedPatientName = patientSelect.options[patientSelect.selectedIndex].text;
    const selectedDoctorName = doctorSelect.options[doctorSelect.selectedIndex].text;

    const firestore = firebase.firestore();

    // Load consultant charge from the consultant's collection
    firestore.collection("consultants").doc(doctorId).get()
        .then((doc) => {
            if (doc.exists) {

                // Check for appointment conflicts
    const appointmentsCollection = firestore.collection("appointments");
    const conflictQuery = appointmentsCollection
        .where("doctorId", "==", doctorId)
        .where("date", "==", appointmentDate)
        .where("time", "==", appointmentTime);

    conflictQuery.get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // There is a conflict; show an error message or take appropriate action
                alert(" Another appointment exists at the same time!Please try another time");
            } else {
                // No conflict; proceed to add the appointment
                // Add the new appointment to Firestore (collection: appointments)
                firestore.collection("appointments").add({
                    patientId: patientId,
                    doctorId: doctorId,
                    date: appointmentDate,
                    time: appointmentTime,
                    totalCharge: totalCharge, // Add total charge to the appointment
                    pName: selectedPatientName, // Add selected patient name
                    name: selectedDoctorName, // Add selected doctor name
                })
                .then(() => {
                    // Clear the form fields
                    document.querySelector('#appointment-date').value = '';
                    document.querySelector('#appointment-time').value = '';

                    // Refresh the appointment list
                    location.reload();
                    alert('Appoinment Placed')

                    
                })
                .catch((error) => {
                    console.error("Error booking appointment in Firestore: ", error);
                });
            }
        })
        .catch((error) => {
            console.error("Error checking for appointment conflicts: ", error);
        });
                
                
            } else {
                console.error("Doctor data not found.");
            }
        })
        .catch((error) => {
            console.error("Error loading consultant data from Firestore: ", error);
        });
}


// Function to cancel an appointment
function cancelAppointment(appointmentId) {
    // Delete the appointment data from Firestore by doc.id
    const firestore = firebase.firestore();
    firestore.collection("appointments").doc(appointmentId).delete()
    .then(() => {
        // Refresh the appointment list
        displayExistingAppointments();
    })
    .catch((error) => {
        console.error("Error canceling appointment in Firestore: ", error);
    });
}

// Attach event listener for appointment booking form submission
document.querySelector('#appointment-booking-form').addEventListener('submit', bookAppointment);

// Initial display of existing appointments
displayExistingAppointments();

// Populate patient and doctor dropdowns
document.addEventListener("DOMContentLoaded", function() {
    populatePatientDropdown();
    populateDoctorDropdown();
    populateConsultantCharge();

});



//----------------------------------------------
function printDiv(appointmentId) {
    const invoiceUrl = `invoice.html?appointmentId=${appointmentId}`;
    const newWindow = window.open(invoiceUrl, '_blank');

    if (newWindow) {
        newWindow.focus();
    }
}

