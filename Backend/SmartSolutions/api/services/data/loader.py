import re
import numpy as np
import pandas as pd
from darts import TimeSeries
from django.conf import settings

# This file is used to load and supply the data from various sources

# Constants
BASE_DIR = str(settings.BASE_DIR)
DATA_DIR = BASE_DIR + '/api/services/data/'

# Global DataFrames
main_watts_df = None

def load_global_data():
	global main_watts_df
	main_watts_df = pd.read_csv(DATA_DIR + 'Watts_Main.csv', parse_dates=['datetime']).astype(np.float32, errors='ignore')


def get_main_watts():
    # Columns: datetime,Main_kw
    if not main_watts_df.empty:
        return main_watts_df.copy()
    return pd.read_csv(DATA_DIR + 'Watts_Main.csv', parse_dates=['datetime']).astype(np.float32, errors='ignore')

def get_main_wh():
    # Columns: datetime,Main_kwh
    return pd.read_csv(DATA_DIR + 'Wh_Main.csv', parse_dates=['datetime']).astype(np.float32, errors='ignore')