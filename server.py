# Gregary C. Zweigle, 2020

import audio_driver
import midi_driver
import numpy as np
import os


class Server:

    def __init__(self):
        fifo_length = 3
        sample_rate = 44100
        bytes_per_channel_per_callback = 2048
        if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
            # During development, and restarting things often, I was getting
            # multiple drivers sometimes and then things don't work. So, this
            # code makes sure to only instantiate a driver once.
            self.mdw = midi_driver.MidiDriver(fifo_length)
            self.downsample_ratio = 128
            self.aio = audio_driver.AudioInOut(sample_rate,
            bytes_per_channel_per_callback, self.downsample_ratio, fifo_length)
        print("Initialized the Server.")

    def server(self, socket_io, start_audio_driver):
        if start_audio_driver:
            self.aio.start_audio_driver()
        midi_rows, midi_data = self.mdw.get_data_from_midi_driver()
        audio_left, audio_right = self.aio.get_data_from_audio_driver()
        transmit_dictionary = {'midi_rows': midi_rows,
                               'midi_data': midi_data.tolist(),
                               'audio_left': audio_left.tolist(),
                               'audio_right': audio_right.tolist()
                               }
        socket_io.emit('data_from_server', transmit_dictionary)