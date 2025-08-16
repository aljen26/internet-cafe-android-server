const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname + '/public'));

//Stored In-memory
const timerState = {
    1: { seconds: 60, paused: false },
    2: { seconds: 90, paused: false },
    3: { seconds: 3000, paused: false }
};

//Countdown loop
setInterval(() => {
    //Itirating through timerState property names;
    Object.keys(timerState).forEach(pc => {
        const timer = timerState[pc];

        if (!timer.paused && timer.seconds > 0){
            timer.seconds--;

            if(timer.seconds === 0){
                console.log(`⏰ PC${pc} has run out of time.`);
            }
        }
    });
}, 1000);

// === API Endpoints ===

// Get timer status for a PC
app.get('/status/:pc', (req, res) => {
    const pc = req.params.pc;
    const timer = timerState[pc];

    if(!timer) return res.status(404).json({ error: 'PC not found.'});

    res.json({ seconds: timer.seconds, paused: timer.paused});
});

// Add time (in minutes)
app.post('/add', (req, res) => {
    const { pc, minutes } = req.body;
    if(!timerState[pc]) return res.status(400).json({ error: "Invalid PC"});

    timerState[pc].seconds += minutes * 60;
    console.log(`🟢 Added ${minutes} minutes to PC${pc}`);
    res.sendStatus(200);
});

// Subtract time (in minutes)
app.post('/sub', (req, res) => {
    const { pc, minutes } = req.body;
    if (!timerState[pc]) return res.status(400).json({ error: 'Invalid PC' });

    timerState[pc].seconds = Math.max(0, timerState[pc].seconds - minutes * 60);
    console.log(`🔻 Subtracted ${minutes} minutes from PC${pc}`);
    res.sendStatus(200);
});


app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
});
