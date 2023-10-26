const register=()=>{

    const email = $('#email').val();
    const password = $('#password').val();
    const confirmPassword = $('#cPassword').val();
    if (password == confirmPassword) {
        firebase
        .auth()
        .createUserWithEmailAndPassword(email,password)
        .then((cred)=>{
            // document.getElementById("Password").value = "";
            document.getElementById("cPassword").value = "";
            document.getElementById("errorMessage").textContent = "Successfully Regitered.";
            window.location.replace('dashboard.html');
        })
        .catch((error)=>{
            alert(error)
        });
        document.getElementById("errorMessage").textContent = "";
        // Clear the input fields
        email.value = "";
    } else {
        document.getElementById("errorMessage").textContent = "Passwords do not match.";
        document.getElementById("cPassword").value = "";
    }

        
}

const alreadyHaveAnAccount=()=>{
    window.location.replace('login.html');
}