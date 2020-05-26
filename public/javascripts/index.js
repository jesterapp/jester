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

    try {
        const resp = await fetch('/status', {
            'method':'POST',
            'headers': {
                'Content-Type':'application/json'
            },
            'body': JSON.stringify(payload)
        })
        clearFields();
        getById('updateBtn').style.display = 'block';
        getById('updateDialog').style.display = 'none';
        pullStatus();
    } catch(error) {
        alert(error);
    }
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
    let uri = "/status/" + localStorage.getItem('team') + '/' + localStorage.getItem('name');
    try {
        const resp = await fetch(uri, {'method':'GET'});
        if (!resp.ok) {
            alert('A problem has occurred pulling status. Try refreshing the page in a few minutes.');
            return;
        }
        const json = await resp.json();
        updateLocalStatus(json.status);
    } catch(error) {
        alert(error);
    }
}

const updateLocalStatus = (status) => {
    let statusHtml = `
        <div class="card" style="width: 18rem;">
        <div class="card-header" id="statusName">{NAME}<br/>{TEAM}</div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item" id="statusYesterday">{YESTERDAY}</li>
        <li class="list-group-item" id="statusToday">{TODAY}</li>
        <li class="list-group-item" id="statusBlockers">{BLOCKERS}</li>
    </ul>
</div>
    `;
    statusHtml = statusHtml.replace('{NAME}', status.name);
    statusHtml = statusHtml.replace('{TEAM}', status.team);
    statusHtml = statusHtml.replace('{YESTERDAY}', '<b>Yesterday</b><hr/>' + status.yesterday);
    statusHtml = statusHtml.replace('{TODAY}', '<b>Today</b><hr/>' + status.today);
    statusHtml = statusHtml.replace('{BLOCKERS}', '<b>Blockers</b><hr/>' + status.blockers);
    getById('localStatus').innerHTML = statusHtml;
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

const pollOthers = async () => {
    console.log('polling: ' + new Date());
    try {
        const resp = await fetch('/status/others', {
            'method':'GET',
            'headers': {
                'Content-Type':'application/json'
            }
        });
        if (!resp.ok) { 
            alert('error ' + resp.status);
            return;
        }
    } catch (error) {
        alert(error);
    }
}


if (!localStorage.getItem('team') || !localStorage.getItem('name')) {
    getById('updateBtn').disabled = true;
    showSettings();
} else {
    updateTitle(localStorage.getItem('team'), localStorage.getItem('name'));
    pullStatus();
}

pollOthers();
setInterval(() => {
    pollOthers();
}, 60000);