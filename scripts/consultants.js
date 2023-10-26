// Add an observer to check the user's authentication state
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in. Redirect to the dashboard.
        window.location.href = "consultants.html"; // Replace with your dashboard page URL
    } else {
        // No user is signed in. They should log in.
        window.location.href = "login.html"; // Replace with your login page URL
    }
  });


// Function to display existing consultants from Firestore
function displayExistingConsultants() {
    const tbody = document.querySelector('#doctor-section tbody');
    tbody.innerHTML = ''; // Clear existing data

    // Retrieve consultants collection from Firestore
    const firestore = firebase.firestore();
    firestore.collection("consultants").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const doctorData = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctorData.name}</td>
                <td>${doctorData.specialization}</td>
                <td>
                    <button class="btn btn-sm btn-info view-doctor" data-id="${doc.id}">View</button>
                    <button class="btn btn-sm btn-warning edit-doctor" data-id="${doc.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-doctor" data-id="${doc.id}">Delete</button>
                </td>
            `;
            tbody.appendChild(row);

            // Attach event listeners for view, edit, and delete buttons
            const viewButton = row.querySelector('.view-doctor');
            const editButton = row.querySelector('.edit-doctor');
            const deleteButton = row.querySelector('.delete-doctor');

            viewButton.addEventListener('click', () => viewDoctorProfile(doc.id));
            editButton.addEventListener('click', () => editDoctorProfile(doc.id));
            deleteButton.addEventListener('click', () => deleteDoctorProfile(doc.id));
        });
    });
}

// Function to view a doctor's profile
function viewDoctorProfile(doctorId) {
    // Retrieve doctor data from Firestore by doc.id and display it in a modal or a separate page
    // You can use a modal library like Bootstrap Modal or create your own modal for this purpose
    // Display the doctor's name, specialization, and other details
    // Example: Show the data in a Bootstrap modal
}

// Function to edit a doctor's profile
function editDoctorProfile(doctorId) {
    // Retrieve doctor data from Firestore by doc.id and pre-fill the edit form
    const firestore = firebase.firestore();
    firestore.collection("consultants").doc(doctorId).get().then((doc) => {
        if (doc.exists) {
            const doctorData = doc.data();
            document.querySelector('#doctor-name').value = doctorData.name;
            document.querySelector('#doctor-specialization').value = doctorData.specialization;

            // Add an event listener to the update button to save changes
            const updateButton = document.querySelector('#update-doctor-button');
            updateButton.addEventListener('click', () => updateDoctor(doctorId));
        }
    });
}

// Function to update a doctor's profile
function updateDoctor(doctorId) {
    // Retrieve updated data from the form
    const updatedName = document.querySelector('#doctor-name').value;
    const updatedSpecialization = document.querySelector('#doctor-specialization').value;

    // Update the doctor's data in Firestore
    const firestore = firebase.firestore();
    firestore.collection("consultants").doc(doctorId).update({
        name: updatedName,
        specialization: updatedSpecialization
    })
    .then(() => {
        // Clear the form fields
        document.querySelector('#doctor-name').value = '';
        document.querySelector('#doctor-specialization').value = '';

        // Refresh the doctor list
        displayExistingConsultants();
    })
    .catch((error) => {
        console.error("Error updating doctor in Firestore: ", error);
    });
}

// Function to delete a doctor's profile
function deleteDoctorProfile(doctorId) {
    // Delete the doctor's data from Firestore by doc.id
    const firestore = firebase.firestore();
    firestore.collection("consultants").doc(doctorId).delete()
    .then(() => {
        // Refresh the doctor list
        displayExistingConsultants();
    })
    .catch((error) => {
        console.error("Error deleting doctor from Firestore: ", error);
    });
}


// Function to handle doctor registration form submission
function registerDoctor(event) {
    event.preventDefault(); // Prevent form submission

    // Get data from the form
    const doctorName = document.querySelector('#doctor-name').value;
    const doctorSpecialization = document.querySelector('#doctor-specialization').value;

    // Add the new doctor to Firestore (collection: consultants)
    const firestore = firebase.firestore();
    firestore.collection("consultants").add({
        name: doctorName,
        specialization: doctorSpecialization
    })
    .then(() => {
        console.log("Doctor added to Firestore");
        // Clear the form fields
        document.querySelector('#doctor-name').value = '';
        document.querySelector('#doctor-specialization').value = '';
        // Display the updated list of consultants
        displayExistingConsultants();
    })
    .catch((error) => {
        console.error("Error adding doctor to Firestore: ", error);
    });
}

// Attach event listener for doctor registration form submission
document.querySelector('#doctor-registration-form').addEventListener('submit', registerDoctor);

// Initial display of existing consultants
displayExistingConsultants();
