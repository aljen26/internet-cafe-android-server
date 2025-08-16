const pcList = [1, 2, 3];
const SERVER = 'http://localhost:3000';

// Converts a number of seconds into a
// readable time format
function secondsToTimeString(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

async function fetchStatus(pcID) {
    try {

        const res = await fetch(`${SERVER}/status/${pcID}`); //fetching status from the server of a specific pc
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        const timerEl = document.getElementById(`pc${pcID}-timer`); //getting the correct element by ID
        timerEl.textContent = secondsToTimeString(data.seconds);    //and modifying the textcontent from seconds using secondsToTimeString function

    } catch (err) {
        console.error(`Error fetching PC${pcId} status:`, err);
    }
}

// Polling loop to update timers every second
function startPolling() {
    setInterval(() => {
        pcList.forEach(fetchStatus);
    }, 1000);
}


// Handle button clicks
async function handleButtonClick(e) {
    const btn = e.target;
    const pcId = btn.getAttribute('data-pc');
    const action = btn.getAttribute('data-action');
    const value = btn.getAttribute('data-value');

    if(!pcId || !action) return;

    let endpoint = '';
    let payload = { pc: parseInt(pcId) };

    if(action === 'add') {
        endpoint = 'add';
        payload.minutes = parseInt(value) * 5;
    } else if(action === 'sub') {
        endpoint = 'sub';
        payload.minutes = parseInt(value) * 5;
    }

    try {
        await fetch(`${SERVER}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        fetchStatus(pcId);
    } catch (err) {
        console.error(`Failed to send ${action} for PC${pcId}`, err);
    }
}

// Setup
function init() {

    document.querySelectorAll('button').forEach(btn=> {
        btn.addEventListener('click', handleButtonClick);
    });

    // Start polling every second
    startPolling();
}

document.addEventListener('DOMContentLoaded', init);