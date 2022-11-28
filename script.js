document.addEventListener('DOMContentLoaded', function () {
    // constants
    const failDelayInSeconds = 20
    const timerKey = "timer"
    const form = document.getElementById("tehtest")

    // functions
    const readTimer = () => isTimerSet() ? parseInt(localStorage.getItem(timerKey)) : undefined
    const isTimerSet = () => localStorage.getItem(timerKey) !== null
    const setTimer = (time) => localStorage.setItem(timerKey, time)
    const clearTimer = () => localStorage.removeItem(timerKey)

    function refreshTimerForTheNotSoGifted() {
        const warning = document.getElementById("missionfaild")

        if (isTimerSet()) {
            if (readTimer() < Date.now()) {
                clearTimer()
            } else {
                warning.style.display = "block"
                const msRemaining = readTimer() - Date.now()
                const secRemaining = Math.floor(msRemaining / 1000)
                const minRemaining = Math.floor(secRemaining / 60)
                document.getElementById("timer").innerHTML = minRemaining + " min " + secRemaining % 60 + " s " + msRemaining % 1000 + " ms"
            }
        } else {
            warning.style.display = 'none'
        }
    }

    async function calcutateIntelectualAndKnowledgeProwess() {
        const data = new FormData(form)
        const answers = data.get("q1") + data.get("q2") + data.get("q3")
        return [await sha256(answers), await sha256(answers + " peppers")]
    }

    function chillBro() {
        if (!isTimerSet()) {
            setTimer(Date.now())
        }
        setTimer(readTimer() + failDelayInSeconds * 1000)
    }

    // logik
    setInterval(refreshTimerForTheNotSoGifted, 100)

    form.addEventListener("submit", function (evt) {
        evt.preventDefault();

        if (isTimerSet()) {
            chillBro()
            alert("Kantrybė vienintelis kelias į pilnatvę. Nespausk mygtuko, kol nepraėjo laikas. O pamokai - dar +" + failDelayInSeconds + " s")
        } else {
            calcutateIntelectualAndKnowledgeProwess().then(([hash, pepperedHash]) => {
                if (hash === "e245b6ed7d27a61bcb9e8557a3b1bfd95f0cf74f012d8466331d754270b0869d") {
                    window.location = pepperedHash + ".html"
                } else {
                    chillBro()
                }
            })
        }
    }, false)
})

/**
 * source https://stackoverflow.com/a/48161723
 */
async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
