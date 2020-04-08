# Gregary C. Zweigle, 2020

import fifo
import numpy as np
import pyaudio
import time

class AudioInOut:

    def __init__(self, rate, chunk, downwsample_ratio, fifo_length):
        #self.last_time = time.time()
        #self.get_last_time = time.time()
        self.fifo = fifo.Fifo(fifo_length)
        self.width = 2
        self.channels = 2
        self.rate = rate
        self.chunk = chunk
        self.downsample_ratio = downwsample_ratio
        print("Initialized the PyAudio class.")

    def start_audio_driver(self):
        self.fifo.clear()
        self.pa = pyaudio.PyAudio()
        self.stream = self.pa.open(
            format = self.pa.get_format_from_width(self.width),
            channels = self.channels,
            rate = self.rate,
            input = True,
            output = True,
            frames_per_buffer = self.chunk,
            stream_callback = self.callback)
        self.stream.start_stream()
        print("Started the PyAudio driver.")

    def end_audio_driver(self):
        max_wait_tries = 0
        while self.stream.is_active() == True and max_wait_tries < 50:
            max_wait_tries += 1
            time.sleep(0.1)
        if max_wait_tries == 50:
            print('DEBUG - Stopping the driver timed out.')
        self.stream.stop_stream()
        self.stream.close()
        self.pa.terminate()
        print("Ended the PyAudio driver.")

    def get_data_from_audio_driver(self):
        audio_left_list = []
        audio_right_list = []
        for i in range(self.fifo.get_fifo_length()):
            data, valid = self.fifo.get()
            if not valid:
                break
            else:
                for k in range(0, 2*self.chunk, 2*self.downsample_ratio):
                    audio_left_list.append(data[k])
                    audio_right_list.append(data[k+1])
        audio_left = np.asarray(audio_left_list).astype(float)
        audio_right = np.asarray(audio_right_list).astype(float)
        #print("Got {0} data: delta_t = {1}".format(len(audio_left_list),
        #time.time() - self.get_last_time))
        #self.get_last_time = time.time()
        return audio_left, audio_right

    def callback(self, in_data, frame_count, time_info, status):

        audio_data = np.fromstring(in_data, dtype=np.int16)
        if audio_data.shape[0] != 2*self.chunk: # Fix annoying startup transient.
            audio_data = np.zeros((2*self.chunk,)).astype('int16')
        self.fifo.put(audio_data)

        # audio_data are int16 but numpy converted to float64.
        audio_data = np.zeros((2*self.chunk,)).astype('int16')
        audio_data.astype('int16')

        #print("\t\t\t\t\t\tPut {0} data: delta_t = {1}".format(audio_data.size,
        #time.time() - self.last_time))
        #self.last_time = time.time()

        return audio_data, pyaudio.paContinue

