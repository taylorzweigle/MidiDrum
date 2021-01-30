# Test-Midi

Simple project to learn how MIDI works with Python and Javascript and to get the basic client/server architecture in place.

There are four independent things happening:
1. MIDI Callback - On the server, the MIDI callback function is called for every MIDI event. The callback function takes that MIDI data and places it in a FIFO.
2. Audio Callback - On the server, the PyAudio callback function is called at an average interval of T seconds.  T = (chunks/sample_rate).  chunks = 1024.  sample_rate = 44100 Hz.  So, T is 23 milliseconds.  The callback takes the chunk of audio samples, downsamples it by 128, and places it in a FIFO.
2. Server Python - Also on the server, every time the Python code is run it pulls all of the data out of the MIDI and Audio FIFOs and sends it to the client in 2D arrays.
3. Client Javascript - Display the most recent data from the server and then let the server know it is time to send new data.

## MIDI data from Server to Client.

The 2D array of MIDI data from the server has the following format:
| ROW #   |  Column 0   |  Column 1   |  Column 2  |  Column 3  |
|---------|-------------|-------------|------------|------------|
| row 0:  |  timestamp  |  MIDI code  |  Key       |  velocity  |
| row 1:  |  timestamp  |  MIDI code  |  Key       |  velocity  |
|         |             |             |            |            |
| row 29: |  timestamp  |  MIDI code  |  Key       |  velocity  |

The server always sends a MIDI array of size [30][4].  Only the first N rows contain data and the remaining rows contain all 0 values. The N rows of data represent data from the N MIDI events since the last time the server ran.

## Audio data from Server to Client.

The data is separated into a left and right channel.  There are 10 rows. Each row contains 1024 / 128 = 8 data samples.  The effective sample rate is 44100 / 128 = 5512.8 Hz.  So, this is ok data for graphics displays but not useful for playback.

## Screenshots

![midi-drum-01](https://github.com/taylorzweigle/MidiDrum/blob/master/img/midi-drum-01.PNG)