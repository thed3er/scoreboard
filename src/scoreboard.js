
let prevTime, stopwatchInterval, elapsedTime = 0;
let countToTime = 420000; // 1000 = 1 second
let homeTeamScore = 0;
let awayTeamScore = 0;
let homeTeamName = "Home Team";
let awayTeamName = "Away Team";
let period = 1;

let homePenalties = [];
let awayPenalties = [];

const audio = new Audio('./static/buzzer.mp3');

window.onload = function() {
    updateTime();
    document.getElementById("period").innerHTML = period + '.';
    document.getElementById("homeTeamName").innerHTML = homeTeamName;
    document.getElementById("awayTeamName").innerHTML = awayTeamName;
    document.getElementById("timerInput").value = elapsedTime;
    document.getElementById("countToTimeInput").value = (countToTime / 1000).toString();

}

function updateTime() {
    let tempTime = elapsedTime;
    tempTime = Math.floor(tempTime / 1000);
    let seconds = checkTime(tempTime % 60);
    tempTime = Math.floor(tempTime / 60);
    let minutes = checkTime(tempTime % 60);

    document.getElementById("timer").innerHTML = minutes + ":" + seconds // update the element where the timer will appear
}

function startTimeCounter() {
    if (!stopwatchInterval) {
        stopwatchInterval = setInterval(function () {
            if (!prevTime) {
                prevTime = Date.now();
            }
            let diffTime = Date.now() - prevTime;
            elapsedTime += diffTime;
            prevTime = Date.now();

            updateTime();

            let tempTime = diffTime / 1000;
            if (homePenalties.length > 0) {
                if (!homePenalties[0].isTimesUp()) {
                    homePenalties[0].setRemainingTime(tempTime);
                } else {
                    homePenalties.shift();
                }
            }
            if (awayPenalties.length > 0) {
                if (!awayPenalties[0].isTimesUp()) {
                    awayPenalties[0].setRemainingTime(tempTime);
                } else {
                    awayPenalties.shift();
                }
            }

            if (elapsedTime >= countToTime) {
                audio.play().then(r => {
                    console.log("Time's up!");
                    setPeriod(period++);
                    pauseTimeCounter();
                    // alert("Time's up!");
                });
            }
        }, 100);
    }
}

function pauseTimeCounter() {
    clearInterval(stopwatchInterval);
    homePenalties.forEach(penalty => {
        penalty.stop();
    });
    awayPenalties.forEach(penalty => {
        penalty.stop();
    });
    console.log(homePenalties);
    stopwatchInterval = null;
    prevTime = null;
}

function resetTimeCounter() {
    pauseTimeCounter();
    setPeriod(1);
    homePenalties.forEach(penalty => {
        document.getElementById(penalty.timerId).remove();
    });
    awayPenalties.forEach(penalty => {
        document.getElementById(penalty.timerId).remove();
    });
    document.getElementById("timerInput").value = 0;
    homePenalties = [];
    awayPenalties = [];
    elapsedTime = 0;

    while (homeTeamScore > 0) {
        removeGoal("homeTeamScore");
    }
    while (awayTeamScore > 0) {
        removeGoal("awayTeamScore");
    }

    updateTime();
}

function toggleControls() {
    const controls = document.getElementById('controls');
    if (controls.style.display === 'none' || controls.style.display === '') {
        controls.style.display = 'block';
    } else {
        controls.style.display = 'none';
    }
}

function checkTime(i) {
    if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
    return i;
}

function addHomePenalty(timeInSeconds) {
    homePenalties.push(new Timer('home', timeInSeconds));
    console.log(homePenalties);
}

function addAwayPenalty(timeInSeconds) {
    awayPenalties.push(new Timer('away', timeInSeconds));
    console.log(awayPenalties);
}

function removeFirstHomePenalty() {
    let penalty = homePenalties.shift();
    document.getElementById(penalty.timerId).remove();
}

function removeFirstAwayPenalty() {
    let penalty = awayPenalties.shift();
    document.getElementById(penalty.timerId).remove();
}

function setHomeTeamName() {
    homeTeamName = document.getElementById("homeTeamNameInput").value;
    document.getElementById("homeTeamName").innerHTML = homeTeamName;
    for (let button of document.getElementsByClassName("home-team-penalty-button")) {
        button.innerHTML = homeTeamName;
        if (button.className.includes('+2')) {
            button.innerHTML += ' +2';
        } else if (button.className.includes('+1')) {
            button.innerHTML += ' +1';
        } else {
            button.innerHTML += ' (odstranit první penaltu)';
        }
    }
}

function setAwayTeamName() {
    awayTeamName = document.getElementById("awayTeamNameInput").value;
    document.getElementById("awayTeamName").innerHTML = awayTeamName;
    for (let button of document.getElementsByClassName("away-team-penalty-button")) {
        button.innerHTML = awayTeamName;
        if (button.className.includes('+2')) {
            button.innerHTML += ' +2';
        } else if (button.className.includes('+1')) {
            button.innerHTML += ' +1';
        } else {
            button.innerHTML += ' (odstranit první penaltu)';
        }
    }
}

function setTimer() {
    let timerValue = document.getElementById("timerInput").value;
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    prevTime = null;
    elapsedTime = timerValue * 1000;
    updateTime();
}

function addGoal(team) {
    if (team === "homeTeamScore") {
        homeTeamScore++;
        document.getElementById("homeTeamScore").textContent = homeTeamScore.toString();
    } else {
        awayTeamScore++;
        document.getElementById("awayTeamScore").textContent = awayTeamScore.toString();
    }
}

function removeGoal(team) {
    if (team === "homeTeamScore") {
        if (homeTeamScore === 0) {
            return;
        }
        homeTeamScore--;
        document.getElementById("homeTeamScore").textContent = homeTeamScore.toString();
    } else {
        if (awayTeamScore === 0) {
            return;
        }
        awayTeamScore--;
        document.getElementById("awayTeamScore").textContent = awayTeamScore.toString();
    }
}

function setCountToTime() {
    countToTime = document.getElementById("countToTimeInput").value * 1000;
    console.log(countToTime);
}

function setPeriod(periodSet) {
    period = periodSet;
    document.getElementById("period").innerHTML = period + '.';
}

class Timer {

    constructor(team, timeInSeconds) {
        this.isRunning = false;
        this.startTime = timeInSeconds;
        this.remainingTime = timeInSeconds;
        this.timerId = Date.now();

        let parentDiv;
        if (team === "home") {
            // vytvorit DOM element ≤div≥ pro zobrazení času
            parentDiv = document.getElementById('homeTeamPenalties');
        } else {
            parentDiv = document.getElementById('awayTeamPenalties');
        }
        let newTimerElement = document.createElement('h3');
        newTimerElement.id = this.timerId;
        newTimerElement.className = 'penalties';
        parentDiv.appendChild(newTimerElement);
        this.updateDisplay()
    }

    setRemainingTime(elapsedTime){
        this.remainingTime -= elapsedTime;

        // console.log('Remaining time: ' + this.remainingTime);
        if (this.remainingTime <= 0) {
            console.log('Time is up penalty!');
            this.remainingTime = 0;
            let timerElement = document.getElementById(this.timerId);
            console.log(timerElement);

            timerElement.remove();
            return;
        }

        this.updateDisplay();
    }

    stop() {
        if (!this.isRunning) return;

        clearInterval(this.timerId);
        this.isRunning = false;
        this.timerId = null;
    }

    reset() {
        this.stop();
        this.remainingTime = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        let tempTime = this.remainingTime;
        let seconds = checkTime(Math.ceil(tempTime % 60));
        tempTime = Math.floor(tempTime / 60);
        let minutes = checkTime(tempTime % 60);

        if (seconds === 60 && minutes === '2') {
            minutes = '02';
            seconds = '00';
        }
        const display = document.getElementById(this.timerId);
        display.textContent = minutes + ":" + seconds;
    }

    isTimesUp() {
        return this.remainingTime <= 0;
    }

}

