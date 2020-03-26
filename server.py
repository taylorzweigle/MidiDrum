# Gregary C. Zweigle, 2020

import audio_driver
import midi_driver
import numpy as np
import os


class Server:

    def __init__(self):
        # Set to the maximum number of MIDI values expect to per server call.
        if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
            # During development, and restarting things often, I was getting
            # multiple drivers sometimes and then things don't work. So, this
            # code makes sure to only instantiate a driver once.
            fifo_length = 30
            self.mdw = midi_driver.MidiDriver(fifo_length)
        sample_rate = 44100
        bytes_per_channel_per_callback = 1024
        downsample_ratio = 128
        fifo_length = 10
        self.aio = audio_driver.AudioInOut(sample_rate,
        bytes_per_channel_per_callback, downsample_ratio, fifo_length)
        self.downsample_rate = 128
        print("Initialized the Server.")

    def server(self, socket_io, start_audio_driver):
        if start_audio_driver:
            self.aio.start_audio_driver()
        midi_data = self.mdw.get_data_from_midi_driver()
        audio_left, audio_right = self.aio.get_data_from_audio_driver()
        self.build_and_send_data(socket_io, midi_data, audio_left, audio_right)

    @staticmethod
    def build_and_send_data(socket_io, midi_data, audio_left, audio_right):
        transmit_dictionary = {'midi_data': midi_data.tolist(),
                               'audio_left' : audio_left.tolist(),
                               'audio_right' : audio_right.tolist()}
        socket_io.emit('data_from_server', transmit_dictionary)
