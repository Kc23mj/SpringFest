
let currentSong = new Audio();
let songs;
function formatTime(seconds) {
    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
} 

async function getSongs() {
    let a = await fetch('http://127.0.0.1:3000/SF/musicPlayer/songs/');
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }

    }


    return songs;

}
let playMusic = (track, pause = false) => {
    // let audio = new Audio("/SF/musicPlayer/songs/" + track);
    currentSong.src = "/SF/musicPlayer/songs/" + track;
    if(!pause){
        currentSong.play();
        play.src ="pause.svg";
    }
    document.querySelector(".songInfo").innerHTML=decodeURI(track);
    document.querySelector(".songTime").innerHTML="00:00 / 00:00"
}

async function main() {
    songs = await getSongs();
    playMusic(songs[0], true)
    // console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
       
        <img src="music.svg" alt="">
        <div class="info">
            <div class="songName">${song.replaceAll("%20", " ")}</div>
            <div>Kunal Chandola</div>
        </div>
        <div class="playNow">
            <span>PlayNow</span>
            <img src="play.svg" alt="">
        </div>
        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            

        })

    })

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src ="./pause.svg";
        }
        else{
            currentSong.pause()
            play.src ="./play.svg";
        }
    })

    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";

    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=  percent + "%";
        currentSong.currentTime=(currentSong.duration * percent)/100;

    })
    
    document.querySelector(".hamburger").addEventListener("click",e=>{
        document.querySelector(".left").style.left="0";
    })
    document.querySelector(".close").addEventListener("click",e=>{
        document.querySelector(".left").style.left="-100%"
    })


    previous.addEventListener("click",()=>{
        console.log("prevclicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1)>= 0){
            playMusic(songs[index-1]);
        }
    })

    next.addEventListener("click",()=>{
        console.log("next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index+1) < songs.length){
            playMusic(songs[index+1]);
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",
    (e)=>{
        currentSong.volume = parseInt(e.target.value)/100; 
    })
}

main()
