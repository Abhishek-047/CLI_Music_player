# UI & UX Design

## 1. Design Philosophy
The application is built around a **Text User Interface (TUI)** that is entirely keyboard-driven. The core design philosophy is to provide a seamless, distraction-free environment that allows developers and terminal users to control their music without ever needing to touch a mouse or switch to a GUI application.

## 2. Screen Layout

The interface is structured vertically into three distinct sections to ensure visual clarity:

1. **The Playlist (Top):** 
   A list of all loaded `.mp3` files. The currently selected track is highlighted with a `>` cursor. If a track is marked as a favorite, a `⭐` is displayed next to its name. Clean names are used (stripping away directory paths) to keep the list readable.
2. **The Control Legend (Middle):** 
   A static, single-line legend indicating all available hotkeys (Play, Pause, Shuffle, Repeat, etc.). This ensures the user never has to memorize commands or read a manual to operate the core functions.
3. **The Status Bar (Bottom):** 
   Displays real-time application state:
   - Track number (e.g., `Track: 2 / 5`)
   - Active modes (e.g., `Repeat: 🔁 ON | Shuffle: OFF`)
   - An ASCII progress bar (`[======>    ]`) alongside the elapsed time.

## 3. Terminal Rendering Technique

To achieve a flicker-free, "app-like" experience inside a standard terminal window, the application utilizes **ANSI escape codes**:
- `\x1b[2J` - Clears the entire terminal screen.
- `\x1b[H`  - Moves the cursor back to the top-left (home) coordinate.

Instead of scrolling infinitely downward every time a new action occurs (which is standard CLI behavior), the application clears and repaints the exact same grid 20 times a second. This simulates a fixed window frame.

## 4. User Interaction (Control Mapping)

Hotkeys were chosen based on standard Unix and software conventions for maximum intuition:

| Action | Key Bind | UX Rationale |
|--------|----------|--------------|
| **Navigate** | `Up` / `Down` | Natural directional mapping for list selection. |
| **Play/Pause** | `p` | Standard mnemonic for playback control. |
| **Search** | `/` | Follows the standard Unix / Vim convention for entering search mode. |
| **Volume** | `+` / `-` | Direct, universally recognized volume indicators. |
| **Favorite** | `f` | Simple one-hand mnemonic. |
| **Shuffle/Repeat**| `h` / `r` | Mnemonics (`s` is reserved for Stop). |
| **Quit** | `q` | Standard exit bind (alongside `Ctrl+C`). |

## 5. Future Design Considerations
- **Dynamic Resizing:** Currently, the progress bar is hardcoded to 20 characters. Future iterations could read `process.stdout.columns` to make the progress bar dynamically stretch to fill the user's terminal window.
- **Color Coding:** Integrating ANSI color codes (e.g., making the `>` cursor green or the progress bar cyan) to improve visual hierarchy and make the playing track stand out more.
