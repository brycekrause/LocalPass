const { invoke } = window.__TAURI__.core;

let h1 = document.getElementById("h1");

const mainContainer = document.getElementById("mainContainer");
const header = document.getElementById("header");
const container = document.getElementById("container");

var currentTab = "Vault";

function new_account(){
    addAccountDiv = document.createElement("div");
    addAccountDiv.className = "addAccountDiv popup";
    addAccountDiv.style.visibility = 'hidden';

    headerDiv = document.createElement("div");
    headerDiv.className = "headerDiv popupHeader";

    windowTitle = document.createElement("h1");
    windowTitle.innerText = "Add account";

    buttonDiv = document.createElement("div");

    saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.className = "saveButton";
    closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.className = "closeButton";

    buttonDiv.appendChild(saveButton);
    buttonDiv.appendChild(closeButton);

    headerDiv.appendChild(windowTitle);
    headerDiv.appendChild(buttonDiv);

    titleLabel = document.createElement("label");
    titleLabel.innerText = 'Title';
    titleInput = document.createElement("input");
    titleInput.placeholder = 'Name of service';

    errorLabel = document.createElement("span");
    errorLabel.innerText = '';

    loginLabel = document.createElement("label");
    loginLabel.innerText = 'Login';
    loginInput = document.createElement("input");
    loginInput.placeholder = 'Username/Email';

    passwordLabel = document.createElement("label");
    passwordLabel.innerText = 'Password';
    passwordInput = document.createElement("input");
    passwordInput.placeholder = 'Password';   

    noteLabel = document.createElement("label");
    noteLabel.innerText = 'Note';
    noteInput = document.createElement("input");
    noteInput.placeholder = 'Additional information';

    titleLabel.appendChild(errorLabel);

    addAccountDiv.appendChild(headerDiv);
    addAccountDiv.appendChild(titleLabel);
    addAccountDiv.appendChild(titleInput);
    addAccountDiv.appendChild(loginLabel);
    addAccountDiv.appendChild(loginInput);
    addAccountDiv.appendChild(passwordLabel);
    addAccountDiv.appendChild(passwordInput);
    addAccountDiv.appendChild(noteLabel);
    addAccountDiv.appendChild(noteInput);

    closeButton.addEventListener("click", function(){
        addAccountDiv.style.visibility = 'hidden';
        titleInput.value = '';
        loginInput.value = '';
        passwordInput.value = '';
        noteInput.value = '';
        errorLabel.innerText = '';
    });

    saveButton.addEventListener("click", function(){
        if (titleInput.value == '' || loginInput.value == '' || passwordInput.value == '') {
            errorLabel.innerText = 'Please fill in all fields';
        }else if (titleInput.value.length > 15){
            errorLabel.innerText = 'Title is too long (15 characters max)';
        }else{
            errorLabel.innerText = '';
            addAccountDiv.style.visibility = 'hidden';
            save_info();
        }
    });
    
    container.appendChild(addAccountDiv);
}

function account_info(){
    infoDiv = document.createElement("div");
    infoDiv.className = "infoDiv popup";
    infoDiv.style.visibility = 'hidden';
    
    infoHeader = document.createElement("div");
    infoHeader.className = "infoHeader popupHeader";

    infoTitle = document.createElement("h1");
    infoTitle.innerText = "Account Information";

    infoLogin = document.createElement("h3");
    infoLogin.innerText = "Login";
    infoLoginValue = document.createElement("p");
    infoLoginValue.innerText = "";

    infoPassword = document.createElement("h3");
    infoPassword.innerText = "Password";
    infoPasswordValue = document.createElement("p");
    infoPasswordValue.innerText = "";

    infoNote = document.createElement("h3");
    infoNote.innerText = "Note";
    infoNoteValue = document.createElement("p");
    infoNoteValue.innerText = "";

    info_buttonDiv = document.createElement("div");

    info_delete_button = document.createElement("button");
    info_delete_button.innerText = "Delete";
    info_delete_button.className = "info_deleteButton";

    info_close_button = document.createElement("button");
    info_close_button.innerText = "Close";
    info_close_button.className = "info_closeButton";

    info_buttonDiv.appendChild(info_delete_button);
    info_buttonDiv.appendChild(info_close_button);

    infoHeader.appendChild(infoTitle);
    infoHeader.appendChild(info_buttonDiv);

    infoDiv.appendChild(infoHeader);
    infoDiv.appendChild(infoLogin);
    infoDiv.appendChild(infoLoginValue);
    infoDiv.appendChild(infoPassword);
    infoDiv.appendChild(infoPasswordValue);
    infoDiv.appendChild(infoNote);
    infoDiv.appendChild(infoNoteValue);

    info_delete_button.addEventListener("click", function(){
        if (info_delete_button.innerText == "Delete"){
            info_delete_button.innerText = "Confirm?";
        }else if(info_delete_button.innerText == "Confirm?"){
            infoDiv.style.visibility = 'hidden';
            info_delete_button.innerText = "Delete";

            invoke("delete_json", {title: infoTitle.innerHTML}).then((response) => {
                if (response == "Data deleted successfully"){
                    while (mainContainer.firstChild){
                        mainContainer.removeChild(mainContainer.firstChild);
                    }                    
                }

                invoke("read_json", {f: "data.json"}).then((response) => {
                    for (let i = 0; i < response.length; i++){
                        appendAccount(response[i].title, response[i].login, response[i].password, response[i].note);
                    }
                }).catch((error) => {
                    h1.textContent = error;
                    console.error("Error: ", error);
                });    

            });
        }    
    });

    info_close_button.addEventListener("click", function(){
        infoDiv.style.visibility = 'hidden';
        info_delete_button.innerText = "Delete";
    });

    container.appendChild(infoDiv);
}

function appendAccount(title, login, password, note){
    accountDiv = document.createElement("div");
    accountDiv.id = "accountDiv";

    accountThumb = document.createElement("img");
    accountThumb.src = "assets/user.png";    
    accountTitle = document.createElement("p");
    accountTitle.innerText = title;

    accountDiv.appendChild(accountThumb);
    accountDiv.appendChild(accountTitle);

    accountDiv.addEventListener("click", function(){
        if (infoDiv.style.visibility == 'visible'){
            infoDiv.style.visibility = 'hidden';
        }else if (addAccountDiv.style.visibility == 'visible'){
            addAccountDiv.style.visibility = 'hidden';
        }
        infoDiv.style.visibility = 'visible';
        infoTitle.innerText = title;
        infoLoginValue.innerText = login;
        infoPasswordValue.innerText = password;
        infoNoteValue.innerText = note;
        h1.innerText = title + login + password + note;
    });

    mainContainer.appendChild(accountDiv);
}

function parseAccountData(){
    
}

async function save_info(){
    await invoke("append_json", {
      title: titleInput.value, 
      login: loginInput.value, 
      password: passwordInput.value,
      note: noteInput.value
    }).catch((error) => {
        h1.textContent = error;
        console.error("Error: ", error);
    });
    if (currentTab == "Vault"){
        appendAccount(titleInput.value, loginInput.value, passwordInput.value, noteInput.value);
    }

    titleInput.value = '';
    loginInput.value = '';
    passwordInput.value = '';
    noteInput.value = '';
}

function erase_data(){
    eraseDataDiv = document.createElement("div");
    eraseDataDiv.className = "eraseDataDiv popup";
    eraseDataDiv.style.visibility = 'hidden';

    eraseDataLabel = document.createElement("h1");
    eraseDataLabel.innerText = "Erase Data";

    eraseDataHeader = document.createElement("div");
    eraseDataHeader.className = "eraseDataHeader popupHeader";

    eraseDataButtonDiv = document.createElement("div");

    eraseDataButton = document.createElement("button");
    eraseDataButton.innerText = "Erase";
    eraseDataButton.className = "confirmEraseButton";

    cancelEraseButton = document.createElement("button");
    cancelEraseButton.innerText = "Cancel";
    cancelEraseButton.className = "cancelEraseButton";

    
    eraseDataButtonDiv.appendChild(eraseDataButton);
    eraseDataButtonDiv.appendChild(cancelEraseButton);

    eraseDataHeader.appendChild(eraseDataLabel)
    eraseDataHeader.appendChild(eraseDataButtonDiv);

    eraseDataDiv.appendChild(eraseDataHeader);

    container.appendChild(eraseDataDiv);

    eraseDataButton.addEventListener("click", function(){
        if (eraseDataButton.innerText == "Erase"){
            eraseDataButton.innerText = "Confirm?";
        }else if(eraseDataButton.innerText == "Confirm?"){
            eraseDataDiv.style.visibility = 'hidden';
            eraseDataButton.innerText = "Erase";
        }

        invoke("erase_json");
    });

    cancelEraseButton.addEventListener("click", function(){
        eraseDataDiv.style.visibility = 'hidden';
        eraseDataButton.innerText = "Erase";
    });

}

// password setup
var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var lowercase_letters = letters.toLowerCase();
var numbers = "1234567890";
var special = "!@#$%^&*";
var all_chars = [];

function updateChars(){
    all_chars = [];
    if (document.getElementById("special_check").checked){
        all_chars.push(...special, ...special);
    }
    if (document.getElementById("numbers_check").checked){
        all_chars.push(...numbers);
    }
    if (document.getElementById("uppercase_check").checked){
        all_chars.push(...letters);
    }
    if (document.getElementById("lowercase_check").checked){
        all_chars.push(...lowercase_letters);
    }
}

function generate_password(length){
    updateChars();

    var result = '';
    for (let i = 0; i < length; i++){
        let char = Math.floor(Math.random() * all_chars.length);
        result += all_chars[char];
    }
    
    if (length >= 20){
        passwordOutput.style.fontSize = "22px";
    }else{
        passwordOutput.style.fontSize = "28px";
    }

    passwordOutput.innerText = result;

    return result;
}

function generate_password_window(){
    generatepasswordPopup = document.createElement("div");
    generatepasswordPopup.className = "generatepasswordPopup popup";
    generatepasswordPopup.style.visibility = 'hidden';

    generatepasswordHeader = document.createElement("div");
    generatepasswordHeader.className = "generatepasswordHeader popupHeader";

    generatepasswordLabel = document.createElement("h1");
    generatepasswordLabel.innerText = "Pass Gen";

    generatepasswordButtonDiv = document.createElement("div");

    generatepasswordButton = document.createElement("button");
    generatepasswordButton.innerText = "Generate";
    generatepasswordButton.className = "generatepasswordButton";

    cancelGenerateButton = document.createElement("button");
    cancelGenerateButton.innerText = "Cancel";
    cancelGenerateButton.className = "cancelGenerateButton";

    generatepasswordButtonDiv.appendChild(generatepasswordButton);
    generatepasswordButtonDiv.appendChild(cancelGenerateButton);

    generatepasswordHeader.appendChild(generatepasswordLabel);
    generatepasswordHeader.appendChild(generatepasswordButtonDiv);

    generatepasswordPopup.appendChild(generatepasswordHeader);

    passwordOutput = document.createElement("p");
    passwordOutput.id = "passwordOutput";

    lengthSlider = document.createElement("input");
    lengthSlider.type = "range";
    lengthSlider.min = 6;
    lengthSlider.max = 30;
    lengthSlider.value = 12;
    lengthSlider.id = "lengthSlider";

    lengthSpan = document.createElement("span");
    lengthSpan.id = "lengthSpan";
    lengthSpan.innerText = lengthSlider.value;

    checkboxDiv = document.createElement("div");
    checkboxDiv.id = "checkboxDiv";

    uppercaseCheck = document.createElement("input");
    uppercaseCheck.type = "checkbox";
    uppercaseCheck.id = "uppercase_check";
    uppercaseCheck.checked = true;
    uppercaseLabel = document.createElement("label");
    uppercaseLabel.innerText = "A-Z";

    lowercaseCheck = document.createElement("input");
    lowercaseCheck.type = "checkbox";
    lowercaseCheck.id = "lowercase_check";
    lowercaseCheck.checked = true;
    lowercaseLabel = document.createElement("label");
    lowercaseLabel.innerText = "a-z";

    numbersCheck = document.createElement("input");
    numbersCheck.type = "checkbox";
    numbersCheck.id = "numbers_check";
    numbersCheck.checked = true;
    numbersLabel = document.createElement("label");
    numbersLabel.innerText = "0-9";

    specialCheck = document.createElement("input");
    specialCheck.type = "checkbox";
    specialCheck.id = "special_check";
    specialCheck.checked = true;
    specialLabel = document.createElement("label");
    specialLabel.innerText = "!@#$%^&*";

    checkboxDiv.appendChild(uppercaseCheck);
    checkboxDiv.appendChild(uppercaseLabel);
    checkboxDiv.appendChild(lowercaseCheck);
    checkboxDiv.appendChild(lowercaseLabel);

    checkboxDiv.appendChild(numbersCheck);
    checkboxDiv.appendChild(numbersLabel);
    checkboxDiv.appendChild(specialCheck);
    checkboxDiv.appendChild(specialLabel);

    generatepasswordPopup.appendChild(passwordOutput);
    generatepasswordPopup.appendChild(lengthSlider);
    generatepasswordPopup.appendChild(lengthSpan);
    generatepasswordPopup.appendChild(checkboxDiv); 

    lengthSlider.addEventListener('input', function(){
        generate_password(lengthSlider.value);
        lengthSpan.innerText = lengthSlider.value;
    });

    generatepasswordButton.addEventListener('click', function(){
        generate_password(lengthSlider.value);
    });

    cancelGenerateButton.addEventListener('click', function(){
        generatepasswordPopup.style.visibility = 'hidden';
    });

    container.appendChild(generatepasswordPopup);

    const checkboxes = [specialCheck, lowercaseCheck, uppercaseCheck, numbersCheck]; 
    for (checkbox of checkboxes) {
        checkbox.addEventListener("change", checkboxListener); 
    }

    generatepasswordPopup.addEventListener("DOMContentLoaded", function(){
        generate_password(lengthSlider.value);
    });

    generate_password(lengthSlider.value);
}

// check for checked checkboxes. Ensure one checkbox is ALWAYS checked
function checkboxListener(event) {  
    const checkedCheckboxes = checkboxes.filter(id => document.getElementById(id).checked); 
    if (checkedCheckboxes.length === 0 && event.target.checked === false) { 
        event.target.checked = true; 
    } 
    generate_password(lengthSlider.value); 
} 

function info_window(){
    infoPopup = document.createElement("div");
    infoPopup.className = "infoPopup popup";
    infoPopup.style.visibility = 'hidden';

    infoPopupHeader = document.createElement("div");
    infoPopupHeader.className = "infoPopupHeader popupHeader";

    infoPopupLabel = document.createElement("h1");
    infoPopupLabel.innerText = "Info";

    infoPopupButtonDiv = document.createElement("div");

    infoPopupCloseButton = document.createElement("button");
    infoPopupCloseButton.innerText = "Close";
    infoPopupCloseButton.className = "infoPopupCloseButton";

    infoPopupButtonDiv.appendChild(infoPopupCloseButton);

    infoPopupHeader.appendChild(infoPopupLabel);
    infoPopupHeader.appendChild(infoPopupButtonDiv);

    infoPopup.appendChild(infoPopupHeader);

    infoPopupGithub = document.createElement("button");
    infoPopupGithub.href= "https://github.com/brycekrause/local-password-manager";
    infoPopupGithub.innerText = "Github";

    infoPopupText = document.createElement("p");
    infoPopupText.innerText = "This is a simple password manager. You can add, delete and view your account information. You can also generate random passwords. All data is stored locally.";

    infoPopup.appendChild(infoPopupText);

    infoPopupCloseButton.addEventListener("click", function(){
        infoPopup.style.visibility = 'hidden';
    });

    container.appendChild(infoPopup);
}

const vaultButton = document.getElementById("vault_btn");
const settingsButton = document.getElementById("settings_btn");
const tabButtons = document.getElementsByClassName("tab_btn");
const currentTabTitle = document.getElementById("currentTabTitle");

new_account();
account_info();
generate_password_window();
erase_data();
info_window();

document.addEventListener("DOMContentLoaded", function(){
    invoke("read_json", {f: "data.json"}).then((response) => {
        for (let i = 0; i < response.length; i++){
            appendAccount(response[i].title, response[i].login, response[i].password, response[i].note);
        }
    }).catch((error) => {
        h1.textContent = error;
        console.error("Error: ", error);
    });

    document.getElementById("new_btn").addEventListener("click", function(){
        addAccountDiv.style.visibility = 'visible';
        if (infoDiv.style.visibility == 'visible'){
            infoDiv.style.visibility = 'hidden';
        }else if(eraseDiv.style.visibility == 'visible'){
            eraseDiv.style.visibility = 'hidden';
        }else if(generatepasswordPopup.style.visibility == 'visible'){
            generatepasswordPopup.style.visibility = 'hidden';
        }else if(infoPopup.style.visibility == 'visible'){
            infoPopup.style.visibility = 'hidden';
        }
    });

    document.getElementById("search").addEventListener("input", function(){
        while (mainContainer.firstChild){
            mainContainer.removeChild(mainContainer.firstChild);
        }
        invoke("read_json", {f: "data.json"}).then((response) => {
            for (let i = 0; i < response.length; i++){
                if (response[i].title.toLowerCase().includes(document.getElementById("search").value.toLowerCase())){
                    appendAccount(response[i].title, response[i].login, response[i].password, response[i].note);
                }
            }
        }).catch((error) => {
            h1.textContent = error;
            console.error("Error: ", error);
        });
    });

    // sidebar buttons
    for (let i = 0; i < tabButtons.length; i++){
        tabButtons[i].addEventListener("click", function(){
            for (let j = 0; j < tabButtons.length; j++){
                tabButtons[j].classList.remove("active");
            }
        });
    }

    switch(currentTab){
        case "Vault":
            vaultButton.classList.add("active");
            break;
        case "Settings":
            settingsButton.classList.add("active");
            break;
    }

    vaultButton.addEventListener("click", function(){
        currentTab = "Vault";
        vaultButton.classList.add("active");
        settingsButton.classList.remove("active");
        generatepasswordPopup.style.visibility = 'hidden';
        eraseDataDiv.style.visibility = 'hidden';
        infoPopup.style.visibility = 'hidden';
        document.getElementById("search").disabled = false;

        while (mainContainer.firstChild) { mainContainer.removeChild(mainContainer.firstChild); }

        currentTabTitle.innerText = currentTab;

        invoke("read_json", {f: "data.json"}).then((response) => {
            for (let i = 0; i < response.length; i++){
                appendAccount(response[i].title, response[i].login, response[i].password, response[i].note);
            }
        }).catch((error) => {
            h1.textContent = error;
            console.error("Error: ", error);
        });
    
    });

    settingsButton.addEventListener("click", function(){
        currentTab = "Settings";
        settingsButton.classList.add("active");
        vaultButton.classList.remove("active");

        infoDiv.style.visibility = 'hidden';
        addAccountDiv.style.visibility = 'hidden';
        generatepasswordPopup.style.visibility = 'hidden';
        eraseDataDiv.style.visibility = 'hidden';
        infoPopup.style.visibility = 'hidden';
        titleInput.value = '';
        loginInput.value = '';
        passwordInput.value = '';
        noteInput.value = '';
        document.getElementById("search").value = '';
        document.getElementById("search").disabled = true;

        while (mainContainer.firstChild) { mainContainer.removeChild(mainContainer.firstChild); }

        currentTabTitle.innerText = "Settings";

        generatepasswordDiv = document.createElement("div");
        generatepasswordDiv.id = "generatepasswordDiv";
        
        generatepasswordImage = document.createElement("img");
        generatepasswordImage.src = "assets/generate.png";
        generatepasswordText = document.createElement("p");
        generatepasswordText.innerText = "Pass Gen";

        generatepasswordDiv.appendChild(generatepasswordImage);
        generatepasswordDiv.appendChild(generatepasswordText);

        eraseDiv = document.createElement("div");
        eraseDiv.id = "eraseDiv";

        eraseImage = document.createElement("img");
        eraseImage.src = "assets/eraser.png";
        eraseText = document.createElement("p");
        eraseText.innerText = "Erase Data";

        eraseDiv.appendChild(eraseImage);
        eraseDiv.appendChild(eraseText);

        infoButton = document.createElement("div");
        infoButton.id = "infoButton";

        infoImage = document.createElement("img");
        infoImage.src = "assets/info.png";
        infoText = document.createElement("p");
        infoText.innerText = "Info";

        infoButton.appendChild(infoImage);
        infoButton.appendChild(infoText);

        mainContainer.appendChild(generatepasswordDiv);
        mainContainer.appendChild(eraseDiv);
        mainContainer.appendChild(infoButton);

        generatepasswordDiv.addEventListener("click", function(){
            generatepasswordPopup.style.visibility = 'visible';
            if (eraseDataDiv.style.visibility == 'visible'){
                eraseDataDiv.style.visibility = 'hidden';
            }else if (infoDiv.style.visibility == 'visible'){
                infoDiv.style.visibility = 'hidden';
            }else if(addAccountDiv.style.visibility == 'visible'){
                addAccountDiv.style.visibility = 'hidden';
            }else if(infoPopup.style.visibility == 'visible'){
                infoPopup.style.visibility = 'hidden';
            }
            generate_password(lengthSlider.value);
        });

        eraseDiv.addEventListener("click", function(){
            eraseDataDiv.style.visibility = 'visible';
            if (generatepasswordPopup.style.visibility == 'visible'){
                generatepasswordPopup.style.visibility = 'hidden';
            }else if (infoDiv.style.visibility == 'visible'){
                infoDiv.style.visibility = 'hidden';
            }else if(addAccountDiv.style.visibility == 'visible'){
                addAccountDiv.style.visibility = 'hidden';
            }else if(infoPopup.style.visibility == 'visible'){
                infoPopup.style.visibility = 'hidden';
            }
        });

        infoButton.addEventListener("click", function(){
            infoPopup.style.visibility = 'visible';
            if (generatepasswordPopup.style.visibility == 'visible'){
                generatepasswordPopup.style.visibility = 'hidden';
            }else if (infoDiv.style.visibility == 'visible'){
                infoDiv.style.visibility = 'hidden';
            }else if(addAccountDiv.style.visibility == 'visible'){
                addAccountDiv.style.visibility = 'hidden';
            }else if(eraseDataDiv.style.visibility == 'visible'){
                eraseDataDiv.style.visibility = 'hidden';
            }
        });

    });
    
});