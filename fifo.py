# Gregary C. Zweigle, 2020

import collections


class Fifo:

    def __init__(self, fifo_length):
        self.fifo = collections.deque(maxlen=fifo_length)
        self.fifo_length = fifo_length
        print("Initialized the FIFO.")

    def get_fifo_length(self):
        return self.fifo_length

    def put(self, data):
        if len(self.fifo) < self.fifo_length:
            self.fifo.append(data)
        else:
            print("Sorry, FIFO is full. Client probably is not running.")

    def get(self):
        try:
            data = self.fifo.popleft()
            data_valid = True
        except IndexError:
            data = 0
            data_valid = False
        return data, data_valid
