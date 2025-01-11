// password validation
const password = document.getElementById("password1");
const password2 = document.getElementById("password2");
password.addEventListener("input", event => {
    password2.pattern = password.value;
});


// form submission
document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const jsonData = Object.fromEntries(formData.entries());

    try{
        const response = await fetch('https://honeyshopweb.onrender.com/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
          })
        const responseJson = await response.json();
        if(response.ok){
            alert("Registration successful!");
            window.location = 'login.html';
        } else if (response.status === 400) {
            const errorsMessage = responseJson.errors.map(error => error.msg).join('\n');
            alert(errorsMessage);
        }
    } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to submit the form.');
    }
});
