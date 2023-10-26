// Add an observer to check the user's authentication state
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
      // User is not signed in. Redirect to the login page.
      window.location.href = "login.html"; // Replace with your login page URL
  }
});

// const createPatient = () => {
//     if (!validateForm()) {
//         return; // Stop execution if the form is not valid
//     }

//     const pName = $('#pName').val();
//     const pMail = $('#pMail').val();
//     const pNic = $('#pNic').val();
//     const pContact = $('#pContact').val();
//     const pGender = $('#pGender').val();
//     const pExtraInfo = $('#pExtraInfo').val();
    

   

//     // Rest of your code to add the patient to the database
//     const tempPatient = {
//         pName: pName,
//         pMail: pMail,
//         pNic: pNic,
//         pContact: pContact,
//         pGender: pGender,
//         pExtraInfo: pExtraInfo
//     };
//     setTimeout(function() {
//         console.log(tempPatient);
//     }, 2000);

   

//     const database = firebase.firestore();
//     database
//         .collection('patients')
//         .add(tempPatient)
//         .then((response) => {
//             console.log(response);
//             toastr.success('Patient Added Successfully');
//             setTimeout(function() {
//                 location.reload();
//             }, 2000);
//         })
//         .catch((error) => {
//             console.log(error);
//             toastr.error('Something Went Wrong');
//             location.reload();
//         });
// };
//---------------------------------------------------------
const createPatient = () => {
  if (!validateForm()) {
      return; // Stop execution if the form is not valid
  }

  const pName = $('#pName').val();
  const pMail = $('#pMail').val();
  const pNic = $('#pNic').val();
  const pContact = $('#pContact').val();
  const pGender = $('#pGender').val();
  const pExtraInfo = $('#pExtraInfo').val();

  // Check if the NIC number already exists in the patient collection
  const firestore = firebase.firestore();
  firestore
      .collection('patients')
      .where('pNic', '==', pNic)
      .get()
      .then((querySnapshot) => {
          if (!querySnapshot.empty) {
              toastr.error('NIC number already exists a patient Profile.Please check NIC.');
          } else {
              // NIC number doesn't exist, you can proceed to add the patient
              const tempPatient = {
                  pName: pName,
                  pMail: pMail,
                  pNic: pNic,
                  pContact: pContact,
                  pGender: pGender,
                  pExtraInfo: pExtraInfo
              };

              console.log(tempPatient);

              // Add the patient to the database
              firestore
                  .collection('patients')
                  .add(tempPatient)
                  .then((response) => {
                      console.log(response);
                      toastr.success('Patient Added Successfully');
                      location.reload();
                  })
                  .catch((error) => {
                      console.log(error);
                      toastr.error('Something Went Wrong');
                      location.reload();
                  });
          }
      })
      .catch((error) => {
          console.log(error);
      });
};


// Form validation function
const validateForm = () => {
    const pName = $('#pName').val();
    const pMail = $('#pMail').val();
    const pNic = $('#pNic').val();
    const pContact = $('#pContact').val();
    const pGender = $('#pGender').val();

    // Regular expressions for validation
    const nameRegex = /^[a-zA-Z\s]+$/;
    const contactRegex = /^\d{10}$/;
    const nicRegex = /^\d{12}$/; 
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // Perform validation checks
    if (pName === '' || pMail === '' || pNic === '' || pContact === '' || pGender === 'null') {
        toastr.error('Please fill in all required fields.');
        return false; // Prevent form submission
    }

    if (!nameRegex.test(pName)) {
        toastr.error('Full name should contain only letters and spaces.');
        return false; // Prevent form submission
    }

    if (!contactRegex.test(pContact)) {
        toastr.error('Contact No should contain only numbers.');
        return false; // Prevent form submission
    }

    if (!emailRegex.test(pMail)) {
      toastr.error('Invalid email format');
      return false; // Prevent form submission
  }

  // Add the NIC validation check to the form validation function
  if (!nicRegex.test(pNic)) {
      toastr.error('NIC should contain exactly 12 digits.');
      return false; // Prevent form submission
  }

    return true; // Form is valid, allow submission
};


const loadPatients = () => {
  $("#table-body").empty();

  const firestore = firebase.firestore();
  firestore
    .collection("patients")
    .get()
    .then((result) => {
      result.forEach((records) => {
        const data = records.data();
        const row = `
                <tr>
                    <td>${records.id}</td>
                    <td>${data.pName}</td>
                    <td>${data.pMail}</td>
                    <td>${data.pNic}</td>
                    <td>${data.pContact}</td>
                    <td>${data.pGender}</td>
                    <td>${data.pExtraInfo}</td>
                    <td>
                        <button class="btn btn-success" onclick="updateData('${records.id}')" data-bs-toggle="modal" data-bs-target="#readData"><i class="bi bi-eye"></i></button>

                        <button class="btn btn-danger btn-sm" onclick="deleteData('${records.id}')"><i class="bi bi-trash"></i></button> |
                        <button class="btn btn-success btn-sm" onclick="updateData('${records.id}'),updatePatient()"data-bs-toggle="modal" data-bs-target="#userForm"><i class="bi bi-pencil-square"></i></button>
                    </td>
                   
                </tr>
                `;
        $("#table-body").append(row);
      });
    });
};
patientId = undefined;
const updateData = (id) => {
  patientId = id;
  const firestore = firebase.firestore();
  firestore
    .collection("patients")
    .doc(patientId)
    .get()
    .then((response) => {
      if (response.exists) {
        const data = response.data();
        $("#pName").val(data.pName);
        $("#pMail").val(data.pMail);
        $("#pNic").val(data.pNic);
        $("#pContact").val(data.pContact);
        $("#pGender").val(data.pGender);
        $("#pExtraInfo").val(data.pExtraInfo);
        //btnStatsElemet.innerText = "Update";
        // updateRecord();
      }
    });
};
const updateRecord = () => {
  if (patientId) {
    const firestore = firebase.firestore();
    firestore
      .collection("patients")
      .doc(patientId)
      .update({
        pName: $("#pName").val(),
        pMail: $("#pMail").val(),
        pNic: $("#pNic").val(),
        pContact: $("#pContact").val(),
        pGender: $("#pGender").val(),
        pExtraInfo: $("#pExtraInfo").val(),
      })
      .then(() => {
        toastr.success('Patient Data Updated Successfully');
        
        patientId = undefined;
        setTimeout(function() {
            location.reload()
        }, 2000);
        loadPatients();
      });
      console.log(running)
  }
};

const deleteData = (id) => {
  if (confirm("Are you sure?")) {
    const firestore = firebase.firestore();
    firestore
      .collection("patients")
      .doc(id)
      .delete()
      .then(() => {
        toastr.options.closeMethod = "fadeOut";
        toastr.options.closeDuration = 300;
        toastr.options.closeEasing = "swing";

        toastr.success("Deleted!", "success!");
        patientId = undefined;
        loadPatients();
        
      });
  }
};



const searchPatientByNIC = () => {
    const searchNicValue = $('#searchNic').val();

    const firestore = firebase.firestore();
    firestore.collection('patients')
        .where('pNic', '==', searchNicValue)
        .get()
        .then((result) => {
            result.forEach((record) => {
                // Redirect to the patient profile page with the patient's ID
                const patientId = record.id;
                window.location.href = `patientProfile.html?id=${patientId}`;
            });
        })
        .catch((error) => {
            console.error(error);
        });
};


function addNewPatient(){
  const btn = document.getElementById('patientDataUpdate');
  btn.classList.add('d-none');
}
function updatePatient(){
  const btn = document.getElementById('newPatientSubmit');
  btn.classList.add('d-none');
}