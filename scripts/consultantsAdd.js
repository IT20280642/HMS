// Add an observer to check the user's authentication state
firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        // User is not signed in. Redirect to the login page.
        window.location.href = "login.html"; // Replace with your login page URL
    }
});


const createConsultant=()=>{

    const name = $('#name').val();
    const specialization = $('#specialization').val();
    const contact = $('#contact').val();
    const consultantCharge = $('#consultantCharge').val();

    if (!validateForm(name, specialization, contact, consultantCharge)) {
        return; // If the form is not valid, do not proceed
    }

    const tempCustomer = {
        name: $('#name').val(),
        specialization: $('#specialization').val(),
        contact: $('#contact').val(),
        consultantCharge: $('#consultantCharge').val()
    };

    console.log(tempCustomer);

    const database = firebase.firestore();
    database
        .collection('consultants')
        .add(tempCustomer)
        .then((response)=>{
            console.log(response);
            toastr.success('consultant Added Successfully');
            location.reload()
            
        }).catch((error)=>{
        console.log(error);
    });

}

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
                <td>${records.id}</td>
                    <td>${data.name}</td>
                    <td>${data.specialization}</td>
                    <td>${data.contact}</td>
                    <td>${data.consultantCharge}</td>
                    <td>
                        <button class="btn btn-success" onclick="updateData('${records.id}'),addNewConsultant(),updateConsultant()" data-bs-toggle="modal" data-bs-target="#userForm"><i class="bi bi-eye"></i></button>

                        <button class="btn btn-danger btn-sm" onclick="deleteData('${records.id}')"><i class="bi bi-trash"></i></button> |
                        <button class="btn btn-success btn-sm" onclick="updateData('${records.id}'),updateConsultant()"data-bs-toggle="modal" data-bs-target="#userForm"><i class="bi bi-pencil-square"></i></button>
                    </td>
                </tr>
                `;
                $('#table-body').append(row);
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
                $('#name').val(data.name);
                $('#specialization').val(data.specialization);
                $('#contact').val(data.contact);
                $('#consultantCharge').val(data.consultantCharge);
                

            }
    })
}
const updateRecord=()=>{
    if (consultantId){

        const name = $('#name').val();
        const specialization = $('#specialization').val();
        const contact = $('#contact').val();
        const consultantCharge = $('#consultantCharge').val();

        if (!validateForm(name, specialization, contact, consultantCharge)) {
            return; // If the form is not valid, do not proceed
        }
        const firestore = firebase.firestore();
        firestore
            .collection('consultants')
            .doc(consultantId)
            .update({
                name: $('#name').val(),
        specialization: $('#specialization').val(),
        contact: $('#contact').val(),
        consultantCharge: $('#consultantCharge').val()
        
            }).then(()=>{
               
                
                
                alert('consultant Data Updated Successfully');
                //toastr.success('consultant Data Updated Successfully');
            consultantId=undefined;
            location.reload()
            loadConsultants();
        })
    }
}

const deleteData=(id)=>{
    if (confirm('Are you sure?')){
        const firestore = firebase.firestore();
        firestore
            .collection('consultants')
            .doc(id)
            .delete()
            .then(()=>{

                toastr.options.closeMethod = 'fadeOut';
                toastr.options.closeDuration = 300;
                toastr.options.closeEasing = 'swing';

                toastr.success('Deleted!', 'success!')
                consultantId=undefined;
                location.reload()
                
            })
    }
}


//validate form
const validateForm = (name, specialization, contact, consultantCharge) => {
    // Check if the name contains only letters
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name.match(nameRegex)) {
        toastr.error("Name should contain only letters and spaces.");
       
        return false;
    }

    // Check if the consultantCharge contains only numbers
    const consultantChargeRegex = /^\d+$/;
    if (!consultantCharge.match(consultantChargeRegex)) {
        toastr.error("Consultant Charge should contain only numbers.");
        
        return false;
    }

    // Check if other fields are empty
    if (!name || !specialization || !contact || !consultantCharge) {
        toastr.error("All fields are required. Please fill in all the information.");
        
        return false;
    }

    return true; // Form is valid
}

function addNewConsultant(){
    const btn = document.getElementById('consultantDataUpdate');
    btn.classList.add('d-none');
  }
  function updateConsultant(){
    const btn = document.getElementById('newConsultantSubmit');
    btn.classList.add('d-none');
  }