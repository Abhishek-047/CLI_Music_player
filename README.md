# 🎵 CLI Music Player

A lightweight, keyboard-driven music player that runs right in your terminal. Built with **Node.js**, it lets you browse your song library, play tracks, and control playback — all without leaving the command line.

> 📚 **Class Project** — Built as part of an Application Development course.

---

## 📸 Preview

```
  0 : ./songs/the_mountain-short-intro-159129.mp3
> 1 : ./songs/white_records-dramatic-background-short-music.mp3
  2 : ./songs/white_records-dramatic-background-music.mp3

↑ ↓ Select | Enter Play | n Next | b Back | p Pause/Play | s Stop | q Quit
Elapsed / total : 12 / 30
```

---

## ✨ Features

- 🎶 **Browse songs** using arrow keys directly in the terminal
- ▶️ **Play / Pause** music on the fly
- ⏭️ **Next & Previous** track navigation
- ⏹️ **Stop** playback at any time
- 📊 **Elapsed time tracker** shown live in the UI
- ⌨️ **Keyboard-first** — no mouse needed
- 🔁 **Circular navigation** — wraps around at the end of the list

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js    | Runtime environment |
| VLC (CLI)  | Audio playback engine |
| `afinfo`   | Reading song duration metadata |
| Raw stdin  | Real-time keyboard input (no Enter required) |
| ANSI escape codes | Terminal UI rendering |

---

## 📋 Prerequisites

Make sure the following are installed on your system:

- **Node.js** (v14 or above) — [Download](https://nodejs.org/)
- **VLC Media Player** — [Download](https://www.videolan.org/vlc/)

> **Note:** This project currently runs on **macOS** only, as it relies on `afinfo` (a macOS utility) for reading song duration metadata.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Abhishek-047/CLI_Music_player.git
cd CLI_Music_player
```

### 2. Add your songs

Drop your `.mp3` files into the `songs/` folder, then update the `songMenu` array inside `music_player.js`:

```js
const songMenu = [
    "./songs/your-song-1.mp3",
    "./songs/your-song-2.mp3",
    "./songs/your-song-3.mp3"
]
```

### 3. Run the player

```bash
node music_player.js
```

---

## ⌨️ Keyboard Controls

| Key              | Action                  |
|------------------|-------------------------|
| `↑` / `↓`       | Navigate the song list  |
| `Enter`          | Play selected song      |
| `n`              | Next track              |
| `b`              | Previous track          |
| `p`              | Toggle Play / Pause     |
| `s`              | Stop playback           |
| `q` / `Ctrl+C`   | Quit the player         |

---

## 📁 Project Structure

```
CLI_Music_player/
├── music_player.js   # Main application logic
├── songs/            # Your MP3 files go here
│   ├── song1.mp3
│   └── song2.mp3
└── README.md
```

---

## ⚙️ How It Works

1. **Terminal UI** — The screen is cleared and re-rendered every 50ms using ANSI escape codes, giving the feel of a live TUI (Text User Interface).
2. **Raw Mode Input** — `process.stdin.setRawMode(true)` allows capturing each keypress instantly without waiting for Enter.
3. **VLC Backend** — Songs are played by spawning a `vlc --intf dummy` child process. Pause/Resume is handled via OS-level signals (`SIGSTOP` / `SIGCONT`).
4. **Duration Tracking** — `afinfo` is used to read the total duration of each song, while elapsed time is incremented with a `setInterval`.

---

## 🤝 Contributing

This is a class project, but suggestions and improvements are always welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ as a class project
</div>
