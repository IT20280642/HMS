firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
      // User is not signed in. Redirect to the login page.
      window.location.href = "login.html"; // Replace with your login page URL
  }
});


    // Get the patient ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');

    // Use the patient ID to fetch and display patient details
    const firestore = firebase.firestore();
    firestore.collection('patients')
        .doc(patientId)
        .get()
        .then((snapshot) => {
            if (snapshot.exists) {
                const patientData = snapshot.data();
                // Display patient details on the page
               
                document.getElementById('patientName').textContent = patientData.pName;
                document.getElementById('patientEmail').textContent = patientData.pMail;
                document.getElementById('patientNic').textContent = patientData.pNic;
                document.getElementById('patientContact').textContent = patientData.pContact;
                document.getElementById('patientGender').textContent = patientData.pGender;
                document.getElementById('patientMedicalHistory').textContent = patientData.pExtraInfo;
                
            } else {
                // Handle the case where the patient does not exist
            }
        })
        .catch((error) => {
            console.error(error);
        });


// Function to handle document upload
function uploadDocument() {
    var pdf = document.getElementById("addStudent_docSelect").files;
  
    if (pdf.length === 0) {
      alert("Please select one or more documents to upload.");
      return;
    }
  
    var storageRef = firebase.storage().ref("document/" + patientId);
  
    for (var i = 0; i < pdf.length; i++) {
      var file = pdf[i];
      var documentRef = storageRef.child(file.name);
  
      documentRef.put(file).then(function (snapshot) {
        // File successfully uploaded
        displayUploadedDocument(snapshot.ref.name);
      }).catch(function (error) {
        // Handle upload error
        console.error("Error uploading document: ", error);
      });
    }
  }
  
  
//   // Function to display uploaded documents
// function displayUploadedDocument(documentName) {
//     var uploadedDocuments = document.getElementById("uploadedDocuments");
  
//     // Create a link element for downloading the document
//     var downloadLink = document.createElement("a");
//     downloadLink.textContent = documentName;
//     downloadLink.href = "#"; // Set an initial href, which can be updated later
//     downloadLink.setAttribute("download", documentName);
  
//     // When the link is clicked, set the href to the actual download URL
//     downloadLink.addEventListener("click", function () {
//       var storageRef = firebase.storage().ref("document");
//       var documentRef = storageRef.child(documentName);
//       documentRef.getDownloadURL().then(function (url) {
//         downloadLink.href = url;
//       });
//     });
  
//     // Create a list item and append the download link
//     var listItem = document.createElement("li");
//     listItem.appendChild(downloadLink);
//     uploadedDocuments.appendChild(listItem);
//   }
  
//-----------------------------------------------------------------------------------
// Function to load earlier added documents for a patient
function loadEarlierDocuments(patientId) {
    var storageRef = firebase.storage().ref("document/" + patientId);
  
    storageRef
      .listAll()
      .then(function (result) {
        var uploadedDocuments = document.getElementById("uploadedDocuments");
        result.items.forEach(function (itemRef) {
          displayUploadedDocument(itemRef.name, itemRef.fullPath);
        });
      })
      .catch(function (error) {
        console.error("Error loading earlier documents: ", error);
      });
  }
  
  // Function to display uploaded documents
  function displayUploadedDocument(documentName, fullPath) {
    var uploadedDocuments = document.getElementById("uploadedDocuments");
    var listItem = document.createElement("li");
    var downloadLink = document.createElement("a");
    downloadLink.href = "#"; // Set the link's href to "#" for now
    downloadLink.textContent = documentName;
    downloadLink.onclick = function () {
      // When clicked, trigger the download
      downloadDocument(fullPath);
    };
    listItem.appendChild(downloadLink);
    uploadedDocuments.appendChild(listItem);
  }
  
  // Function to trigger the download of a document
  function downloadDocument(documentPath) {
    var storageRef = firebase.storage().ref();
    var documentRef = storageRef.child(documentPath);
  
    documentRef
      .getDownloadURL()
      .then(function (url) {
        // Redirect the user to the download URL
        window.open(url, "_blank");
      })
      .catch(function (error) {
        console.error("Error getting document download URL: ", error);
      });
  }
  
  // Call loadEarlierDocuments when the page is loaded (you need to provide the patientId)
  document.addEventListener("DOMContentLoaded", function () {
    var patientId = "patient123"; // Replace with the actual patient ID
    loadEarlierDocuments(patientId);
  });
   
  