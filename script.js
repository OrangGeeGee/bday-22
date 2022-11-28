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
        const answers = data.get("q1") + "_" + data.get("q2") + "_" + data.get("q3")
        // for traceability, should always return 404, but I can scour the httpd logs afterwards
        return [await sha256(answers), await sha256(answers + " peppers"), answers]
    }

    function chillBro() {
        if (!isTimerSet()) {
            setTimer(Date.now())
        }
        setTimer(readTimer() + failDelayInSeconds * 1000)
    }

    // logik
    setInterval(refreshTimerForTheNotSoGifted, 100)

    function exposeHumans(answers, suffix) {
        fetch("answers-submitted_" + answers + "_" + suffix).then(r => console.log(r))
    }

    form.addEventListener("submit", function (evt) {
        evt.preventDefault();

        calcutateIntelectualAndKnowledgeProwess().then(([hash, pepperedHash, answers]) => {
            console.log(hash, pepperedHash)
            if (isTimerSet()) {
                exposeHumans(answers, "premature")
                chillBro()
                alert("Kantrybė vienintelis kelias į pilnatvę. Nespausk mygtuko, kol nepraėjo laikas. O pamokai dar +" + failDelayInSeconds + " s")
            } else {
                if (hash === "0acefe50ce24f5029e24993a31f24143156dd3e68b2a4e31e7e92f5b3f8d99ae") {
                    exposeHumans(answers, "success")
                    window.location = pepperedHash + ".html"
                } else {
                    exposeHumans(answers, "incorrect")
                    chillBro()
                }
            }
        })
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
