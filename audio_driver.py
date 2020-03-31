# Gregary C. Zweigle, 2020

import fifo
import numpy as np
import pyaudio
import time

class AudioInOut:

    def __init__(self, rate, chunk, downwsample_ratio, fifo_length):
        self.last_time = time.time()
        self.get_last_time = time.time()
        self.fifo = fifo.Fifo(fifo_length)
        self.width = 2
        self.channels = 2
        self.rate = rate
        self.chunk = chunk
        self.downsample_ratio = downwsample_ratio
        print("Initialized the PyAudio class.")

    def start_audio_driver(self):
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

    def get_data_from_audio_driver(self):
        chunk_downsampled = round(self.chunk / self.downsample_ratio)
        audio_left = np.zeros((self.fifo.get_fifo_length(), chunk_downsampled))
        audio_right = np.zeros((self.fifo.get_fifo_length(), chunk_downsampled))
        count = 0
        for ind in range(self.fifo.get_fifo_length()):
            data, valid = self.fifo.get()
            if not valid:
                break
            else:
                audio_left[ind, :] = data[::2*self.downsample_ratio]
                audio_right[ind, :] = data[1::2*self.downsample_ratio]
                count = count + 1
        audio_left = audio_left.astype(float)
        audio_right = audio_right.astype(float)
        #print("Got {0} data sets of Audio: delta_t = {1}".format(count,
        #time.time() - self.get_last_time))
        self.get_last_time = time.time()
        return count, audio_left, audio_right

    def callback(self, in_data, frame_count, time_info, status):

        audio_data = np.fromstring(in_data, dtype=np.int16)
        if audio_data.shape[0] != 2*self.chunk: # Fix annoying startup transient.
            audio_data = np.zeros((2*self.chunk,)).astype('int16')
        self.fifo.put(audio_data)

        # audio_data are int16 but numpy converted to float64.
        audio_data = audio_data.astype('int16')

        #print("\t\tAudio: delta_t = {0} size = {1}".format(time.time() - self.last_time, audio_data.size))
        self.last_time = time.time()

        return audio_data, pyaudio.paContinue

