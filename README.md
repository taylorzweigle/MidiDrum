# Test-Midi

Simple project to learn how MIDI works with Python and Javascript and to get the basic client/server architecture in place.

There are three independent things happening:
1. MIDI Callback - On the server, the MIDI callback function is called for every MIDI event. The callback function takes that MIDI data and places it in a FIFO.
2. Server Python - Also on the server, every time the Python code is run it pulls all of the data out of the MIDI fifo and sends it to the client in a 2D array.
3. Client Javascript - Display the most recent data from the server and then let the server know it is time to send new data.

The 2D array of data from the server has the following format:
| ROW #   |  Column 0   |  Column 1   |  Column 2  |  Column 3  |
|---------|-------------|-------------|------------|------------|
| row 0:  |  timestamp  |  MIDI code  |  Key       |  velocity  |
| row 1:  |  timestamp  |  MIDI code  |  Key       |  velocity  |
|         |             |             |            |            |
| row 29: |  timestamp  |  MIDI code  |  Key       |  velocity  |

The server always sends an array of size [30][4].  Only the first N rows contain data and the remaining rows contain all 0 values. The N rows of data represent data from the N MIDI events since the last time the server ran.