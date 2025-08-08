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

// Setup
function init() {

    // Start polling every second
    startPolling();
}

document.addEventListener('DOMContentLoaded', init);