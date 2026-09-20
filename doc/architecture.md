# System Architecture

## 1. Overview
The CLI Music Player is a Node.js-based terminal application that leverages child processes to interface with native system utilities (`vlc`, `osascript`). It operates on an **event-driven architecture**, primarily reacting to standard input (stdin) keystrokes and system process lifecycle events.

## 2. Core Components

The system is broken down into four logical subsystems:

### A. Input Controller (Event Listener)
Reads raw bytes from `process.stdin`. By enabling `setRawMode(true)`, the application bypasses standard terminal line-buffering (which usually requires pressing Enter). This allows the application to capture and react to keystrokes (like `p`, `n`, `+`, `/`) instantly in real time.

### B. State Manager
Maintains the global variables that define the current state of the application.
- **Playback State:** `isPaused`, `elapsedDuration`, `totalDuration`
- **User Selections:** `userChoice`, `favorites` (Set structure)
- **Toggles/Modes:** `repeatMode`, `shuffleMode`, `searchMode`

### C. Audio Subsystem
Uses Node's native `child_process.spawn` to instantiate an external VLC media player process.
- Runs VLC in dummy interface mode (`--intf dummy`) to prevent VLC from opening its own GUI or printing text into our terminal.
- Controls playback by sending POSIX signals (`SIGSTOP` to pause, `SIGCONT` to resume, `SIGKILL` to stop/switch).

### D. Rendering Engine
Periodically repaints the screen via a 50ms `setInterval` loop. This loop reads from the State Manager and outputs text to `process.stdout`.

## 3. Data Flow

Here is the lifecycle of how a user action translates into music:

1. **Initialization:** The app uses `fs.readdirSync` to read the `./songs` directory and builds the internal `songMenu` array.
2. **Main Loop:** The render loop continuously redraws the UI and increments the `elapsedDuration`.
3. **Event Trigger:** The user presses the `n` (Next) key.
4. **Event Handling:** The Input Controller captures the hex code (`0x6e`), calculates the next track index, and updates `userChoice`.
5. **Process Management:** The Audio Subsystem is instructed to kill the current VLC process (`SIGKILL`) and spawn a new one pointing to the new `.mp3` file.
6. **Auto-Progression:** When the VLC process naturally finishes (emits a `'close'` event), the application automatically checks the `repeatMode` and `shuffleMode` flags to decide which song to spawn next.

## 4. Tech Stack & Dependencies
- **Runtime:** Node.js
- **Audio Engine:** VLC CLI (`vlc`)
- **System Integration:** macOS AppleScript (`osascript`) for native volume control
- **File System:** Node `fs` module for synchronous directory reading
- **No external NPM packages** are required, making the application extremely lightweight.
