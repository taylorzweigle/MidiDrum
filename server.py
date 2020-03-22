# Gregary C. Zweigle, 2020

import midi_driver
import numpy as np
import os


class Server:

    def __init__(self):
        # Set to the maximum number of MIDI values expect to per server call.
        self.fifo_length = 30
        if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
            # During development, and restarting things often, I was getting
            # multiple drivers sometimes and then things don't work. So, this
            # code makes sure to only instantiate a driver once.
            self.mdw = midi_driver.MidiDriver(self.fifo_length)
        print("Initialized the Server.")

    def server(self, socket_io):
        midi_data = self.get_next_set_to_send()
        self.build_and_send_data(socket_io, midi_data)

    def get_next_set_to_send(self):
        midi_data = np.zeros((self.fifo_length, self.mdw.fifo_num_data()))
        for ind in range(self.fifo_length):
            data, valid = self.mdw.get_data_from_fifo()
            if not valid:
                break
            else:
                midi_data[ind, :] = data
        return midi_data

    def build_and_send_data(self, socket_io, send_data):
        transmit_dictionary = {'data': send_data.tolist()}
        socket_io.emit('data_from_server', transmit_dictionary)
