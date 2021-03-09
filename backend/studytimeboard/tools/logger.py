import logging


class APPLogHandler(logging.FileHandler):

    def __init__(self, filename):

        # set filehandler
        logging.FileHandler.__init__(self, filename)

        # set formatter
        fmt = '%(asctime)s %(name)-18s  \n\t %(levelname)-8s: %(message)s \n\n\n'
        fmt_date = '%m/%d/%Y %I:%M:%S %p'
        formatter = logging.Formatter(fmt, fmt_date)
        self.setFormatter(formatter)
