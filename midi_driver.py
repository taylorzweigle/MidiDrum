# Gregary C. Zweigle, 2020

import fifo
import rtmidi.midiutil as rtmu
import rtmidi as rtm
import time


class MidiCallback:
    def __init__(self, port, driver_fifo):
        self.port = port
        self.driver_fifo = driver_fifo
        print("Initialized the MIDICallback class.")

    def __call__(self, event, data=None):
        # midi_data[0:2] = MIDI control value, note, velocity.
        midi_data, midi_time = event
        self.timestamp = time.time()
        print("MIDI Callback [{0}] {1} {2} {3}".format(
            self.port, self.timestamp, midi_time, midi_data
        ))
        fifo_data = [self.timestamp, midi_data[0], midi_data[1], midi_data[2]]
        self.driver_fifo.put(fifo_data)


class MidiDriver:

    def __init__(self, fifo_length):
        port = 1  # Change this to select associated MIDI device.
        self.fifo = fifo.Fifo(fifo_length)
        self.midi_in, port_name = rtmu.open_midiinput(port)
        self.midi_in.set_callback(MidiCallback(port_name, self.fifo))
        self.tell_me_everything(port_name)

    def __del__(self):
        self.midi_in.cancel_callback()
        self.midi_in.close_port()
        print("Deleted the MIDI Driver.")

    # Four values are written to the fifo for every MIDI event.
    @staticmethod
    def fifo_num_data():
        return 4

    # Point for server to get the MIDI data.
    def get_data_from_fifo(self):
        data, valid = self.fifo.get()
        return data, valid

    # This info was helpful for debugging the physical MIDI connections.
    def tell_me_everything(self, port_name):
        print("##### Driver and MIDI IO Details #####")
        if self.midi_in.get_current_api() == rtm.API_UNSPECIFIED:
            print("\tAPI = Unspecified")
        elif self.midi_in.get_current_api() == rtm.API_WINDOWS_MM:
            print("\tAPI = Windows MultiMedia")
        elif self.midi_in.get_current_api() == rtm.API_RTMIDI_DUMMY:
            print("\tAPI = RtMidi Dummy")
        else:
            print("\tAPI = Other")
        print("\tPort Count = {}".format(self.midi_in.get_port_count()))
        print("\tPorts = {}".format(self.midi_in.get_ports()))
        print("\tPort Name = {}".format(port_name))
        print("\tIs Port open? = {}".format(self.midi_in.is_port_open()))
        print("######################################")
