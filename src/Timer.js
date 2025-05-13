export default class Timer {

    constructor() {
        this.isRunning = false;
        this.startTime = 2;
        this.remainingTime = 0;
        this.timerId = null;
        this.isExpired = false;
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.remainingTime = this.startTime * 60; // převod na sekundy
        this.startTime = Date.now();

        this.timerId = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();

            if (this.remainingTime <= 0) {
                this.isExpired = true;
                this.stop();
            }
        }, 1000);

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
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;

        const display = document.getElementById('homeTeamPenalties');
        display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    getExpired() {
        return this.isExpired;
    }

}

