/*

process.stdin.setRawMode(true)
const{spawn} = require('child_process')
let isPaused=true
let playerProcess = undefined
let userChoice=0

process.stdin.on('data',(data)=>{

    console.log(data)

    if (data[0] === 0x6e){
        console.log('next')

        userChoice+=1;
        playerProcess.kill('SIGKILL')
        playerProcess = spawn('afplay',[songMenu[userChoice]])
        console.log('Song started Playing')
        isPaused = false

        return

    }
    if (data[0]=== 0x62){
        console.log('back')


        userChoice-=1
        playerProcess.kill('SIGKILL')
        playerProcess = spawn('afplay',[songMenu[userChoice]])
        console.log('Song started Playing')
        isPaused = false

        return

    }

    if(data[1]=== 0x5b){ 

        if (data[2]===0x41){
            console.log("Up Arrow Key")
            userChoice-=1
            listSongs()

        }else if (data[2]==0x42){
            console.log("Down Arrow Key")
            userChoice+=1
            listSongs()
        }

    }if (data[0]=== 0x03){
        process.exit(0)

    }if (data[0] === 0x0d){

        console.log(`USER SELECTED ${songMenu[userChoice]}`)
        playerProcess = spawn('vlc',[songMenu[userChoice]])
        console.log('Song started Playing')
        isPaused = false

    }if (data[0]===0x70){

        console.log('User it Play/Pause')

        if(isPaused){
            console.log('songp paused')
            playerProcess.kill('SIGSTOP')

        }else{
            console.log('song started')
            playerProcess.kill('SIGCONT')
        }

        isPaused = !isPaused

    }
    
})

const songMenu = [
    "./songs/the_mountain-short-intro-159129.mp3",
    "./songs/white_records-dramatic-background-short-music-29-sec-hip-hop-violin-orchestral-148927.mp3",
    "./songs/white_records-dramatic-background-music-for-short-videos-1-minute-little-alicia-155718.mp3"]

function listSongs(){
        process.stdout.write('\x1b[2J')
        process.stdout.write('\x1b[10;0H')

        
    songMenu.forEach((song,ind)=>{



        if (ind === userChoice){

            process.stdout.write( `${ind} : ${song}\n`)

        }else{
            process.stdout.write(`${ind} : ${song}\n`)
        }
    })
}

listSongs()


*/

/*

// implementing progress bar
// state variables: 
//      - elapsedDuration 
//      - totalDuration

// listSongs:-
    - fit inside a setinterval to refresh periodically
    - if song is playing,increment elapsedDuration

// playSong:-
    - reset elapsedDuration to 0
    - set totalDuration to duration of selected song

*/



process.stdin.setRawMode(true)
process.stdin.resume()

const { spawn } = require('child_process')

let isPaused = false
let playerProcess = undefined
let userChoice = 0

let elapsedDuration = 0
let totalDuration = 0
let manualStop = false
let repeatMode = false
let shuffleMode = false
let favorites = new Set()
let searchMode = false
let searchQuery = ''
let nowPlaying = ''

const fs = require('fs')
const songMenu = fs.readdirSync('./songs')
    .filter(f => f.endsWith('.mp3'))
    .map(f => './songs/' + f)


// ==========================
// PLAY SELECTED SONG
// ==========================

function playSong() {

    if (playerProcess) {
        manualStop = true
        playerProcess.kill('SIGKILL')
    }

    manualStop = false
    playerProcess = spawn('vlc', [
        '--intf', 'dummy',
        songMenu[userChoice]
    ])

    playerProcess.on('close', () => {
        if (!manualStop) {
            if (!repeatMode) {
                if (shuffleMode) {
                    userChoice = Math.floor(Math.random() * songMenu.length)
                } else {
                    userChoice = (userChoice + 1) % songMenu.length
                }
            }
            playSong()
            listSongs()
        }
    })

    isPaused = false
    elapsedDuration = 0
    nowPlaying = songMenu[userChoice].split('/').pop()
    getTotalDurationofsong(songMenu[userChoice])
}


// ==========================
// SHOW SONG LIST
// ==========================

function listSongs() {

    // Clear terminal
    process.stdout.write('\x1b[2J')
    process.stdout.write('\x1b[H')

    if (nowPlaying) {
        console.log(`♪ Now Playing: ${nowPlaying}\n`)
    } else {
        console.log('♪ No song playing\n')
    }
    songMenu.forEach((song, ind) => {
        
        const cleanName = song.split('/').pop()
        const favStar = favorites.has(song) ? '⭐ ' : '   '

        if (ind === userChoice) {
            console.log(`> ${ind + 1} : ${favStar}${cleanName}`)
        } else {
            console.log(`  ${ind + 1} : ${favStar}${cleanName}`)
        }

    })

    console.log('\n↑ ↓ Select | Enter Play | n Next | b Back | p Pause/Play | s Stop | q Quit | r Repeat | h Shuffle | f Fav')
    console.log('+ / - Volume')
    const repeatIcon = repeatMode ? '🔁 ON' : 'OFF'
    const shuffleIcon = shuffleMode ? '🔀 ON' : 'OFF'
    console.log(`Track: ${userChoice + 1} / ${songMenu.length} | Repeat: ${repeatIcon} | Shuffle: ${shuffleIcon}`)
    
    const pct = totalDuration > 0 ? (elapsedDuration / totalDuration) : 0
    const filled = Math.min(20, Math.floor(pct * 20))
    const empty = Math.max(0, 20 - filled)
    const bar = '[' + '='.repeat(filled) + (empty > 0 ? '>' : '') + ' '.repeat(Math.max(0, empty - 1)) + ']'
    
    console.log(`Time: ${Math.floor(elapsedDuration)}s / ${totalDuration}s  ${bar}`)

    if (searchMode) {
        console.log(`\n🔍 Search: ${searchQuery}_`)
    } else {
        console.log('\nType / to search')
    }
}


// ==========================
// KEYBOARD INPUT
// ==========================

process.stdin.on('data', (data) => {

    if (searchMode) {
        if (data[0] === 0x0d) { // Enter
            searchMode = false
            const idx = songMenu.findIndex(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
            if (idx !== -1) {
                userChoice = idx
                playSong()
            }
            listSongs()
            return
        } else if (data[0] === 0x1b) { // Escape
            searchMode = false
            listSongs()
            return
        } else if (data[0] === 0x7f) { // Backspace
            searchQuery = searchQuery.slice(0, -1)
            listSongs()
            return
        } else {
            searchQuery += data.toString()
            listSongs()
            return
        }
    }

    if (data[0] === 0x2f) { // Slash '/'
        searchMode = true
        searchQuery = ''
        listSongs()
        return
    }

    // ==========================
    // UP ARROW
    // ==========================

    if (
        data[0] === 0x1b &&
        data[1] === 0x5b &&
        data[2] === 0x41
    ) {

        userChoice--

        if (userChoice < 0) {
            userChoice = songMenu.length - 1
        }

        listSongs()

        return
    }


    // ==========================
    // DOWN ARROW
    // ==========================

    if (
        data[0] === 0x1b &&
        data[1] === 0x5b &&
        data[2] === 0x42
    ) {

        userChoice++

        if (userChoice >= songMenu.length) {
            userChoice = 0
        }

        listSongs()

        return
    }


    // ==========================
    // REPEAT - r
    // ==========================
    if (data[0] === 0x72) {
        repeatMode = !repeatMode
        listSongs()
        return
    }

    // ==========================
    // SHUFFLE - h
    // ==========================
    if (data[0] === 0x68) {
        shuffleMode = !shuffleMode
        listSongs()
        return
    }

    // ==========================
    // VOLUME UP - + or =
    // ==========================
    if (data[0] === 0x2b || data[0] === 0x3d) {
        spawn('osascript', ['-e', 'set volume output volume (output volume of (get volume settings) + 10)'])
        return
    }

    // ==========================
    // VOLUME DOWN - -
    // ==========================
    if (data[0] === 0x2d) {
        spawn('osascript', ['-e', 'set volume output volume (output volume of (get volume settings) - 10)'])
        return
    }

    // ==========================
    // FAVORITE - f
    // ==========================
    if (data[0] === 0x66) {
        const song = songMenu[userChoice]
        if (favorites.has(song)) {
            favorites.delete(song)
        } else {
            favorites.add(song)
        }
        listSongs()
        return
    }

    // ==========================
    // NEXT - n
    // ==========================

    if (data[0] === 0x6e) {

        userChoice++

        if (userChoice >= songMenu.length) {
            userChoice = 0
        }

        playSong()
        listSongs()

        return
    }


    // ==========================
    // BACK - b
    // ==========================

    if (data[0] === 0x62) {

        userChoice--

        if (userChoice < 0) {
            userChoice = songMenu.length - 1
        }

        playSong()
        listSongs()

        return
    }


    // ==========================
    // ENTER
    // ==========================

    if (data[0] === 0x0d) {

        playSong()

        return
    }


    // ==========================
    // PLAY / PAUSE - p
    // ==========================

    if (data[0] === 0x70) {

        if (!playerProcess) {
            return
        }

        if (isPaused) {

            playerProcess.kill('SIGCONT')
            console.log('\nSong resumed')

        } else {

            playerProcess.kill('SIGSTOP')
            console.log('\nSong paused')
        }

        isPaused = !isPaused

        return
    }


    // ==========================
    // STOP - s
    // ==========================

    if (data[0] === 0x73) {

        if (playerProcess) {

            manualStop = true
            playerProcess.kill('SIGKILL')
            playerProcess = undefined

        }

        isPaused = false

        console.log('\nSong stopped')

        return
    }


    // ==========================
    // QUIT - q
    // ==========================

    if (data[0] === 0x71) {

        quit()

        return
    }


    // ==========================
    // CTRL + C
    // ==========================

    if (data[0] === 0x03) {

        quit()

        return
    }

})


// ==========================
// QUIT
// ==========================

function quit() {

    if (playerProcess) {
        manualStop = true
        playerProcess.kill('SIGKILL')
    }

    process.stdin.setRawMode(false)
    process.exit(0)
}


// ==========================
// START
// ==========================



setInterval(() => {
    listSongs()
    if (playerProcess !== undefined && isPaused === false) {
        elapsedDuration += 0.05
    }
}, 50)

function getTotalDurationofsong(songPath) {
    const afInfoProcess = spawn('afinfo', [songPath])
    afInfoProcess.stdout.on('data', (data) => {
        const rawOutput = data.toString()
        totalDuration = Number(
            rawOutput.match('estimated duration: ')[1].split('.')[0]
        )
    })
}




