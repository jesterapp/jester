
const getById = (id) => {
    return document.getElementById(id);
}

const postUpdate = () => {
    let today = getById('today').value;
    let yesterday = getById('yesterday').value;
    let blockers = getById('blockers').value;
    let team = localStorage.getItem('team');
    let name = localStorage.getItem('name');

    if (!today || !yesterday || !blockers || !team || !name) {
        alert('Please enter information for all fields');
        return;
    }
    
    let payload = {today, yesterday, blockers, team, name};
    sendUpdate(payload);
}

const showSettings = () => {
    getById('settingsDialog').style.display='block';
    getById('settingsBtn').disabled = true;
    getById('team').value = localStorage.getItem('team');
    getById('name').value = localStorage.getItem('name');
}

const sendUpdate = async (payload) => {
    //success
    clearFields();
    getById('updateBtn').style.display = 'block';
    getById('updateDialog').style.display = 'none';
}

const cancelUpdate = () => {
    clearFields();
    getById('updateDialog').style.display = 'none';
    getById('updateBtn').style.display = 'block';
}

const clearFields = () => {
    getById('yesterday').value = '';
    getById('today').value = '';
    getById('blockers').value = '';
}

const showAddUpdate = () => {
    let dialog = getById('updateDialog');
    let yesterday = getById('yesterday');
    getById('updateBtn').style.display = 'none';
    dialog.style.display = 'block';
    yesterday.focus();
    if (localStorage.getItem('team')) {
        getById('team').value = localStorage.getItem('team');
    }
    if (localStorage.getItem('team')) {
        getById('name').value = localStorage.getItem('name');
    }
}

const pullStatus = async () => {
    const url = "/status/" + localStorage.getItem('team');
    console.log('pulling status: ' + url);
    try {
        const resp = await fetch(url, {'method':'GET'});
        if (!resp.ok) {
            alert('A problem has occurred pulling status. Try refreshing the page in a few minutes.');
            return;
        }
    } catch(error) {

    }
}

const saveSettings = () => {
    let team = getById('team').value;
    let name = getById('name').value;
    if (!team || !name) {
        alert('Please enter a team and name');
        return;
    }
    localStorage.setItem('team', team);
    localStorage.setItem('name', name);
    updateTitle(team, name);
    getById('settingsDialog').style.display = 'none';
    getById('updateBtn').disabled = false;
    getById('settingsBtn').disabled = false;
    pullStatus();
}

const updateTitle = (team, name) => {
    getById('titleDiv').innerHTML = "Jester :: " + team + " :: " + name;
}


if (!localStorage.getItem('team') || !localStorage.getItem('name')) {
    getById('updateBtn').disabled = true;
    showSettings();
} else {
    updateTitle(localStorage.getItem('team'), localStorage.getItem('name'));
    pullStatus();
}