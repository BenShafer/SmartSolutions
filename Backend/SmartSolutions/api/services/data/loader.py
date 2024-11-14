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

def get_calendar():
    # Columns: datetime,weekday,hour,holiday,month,billing
    return pd.read_csv(DATA_DIR + 'Calendar.csv', parse_dates=['datetime']).astype(np.float32, errors='ignore')

def get_sub_data():
    # Columns: datetime,A2_watts,A2_wh,A2_amps,A2_VAR,A2_pwr_fctr,A4_watts,A4_wh,A4_amps,A4_VAR,A4_pwr_fctr,A5_watts,A5_wh,A5_amps,A5_VAR,A5_pwr_fctr,A6_watts,A6_wh,A6_amps,A6_VAR,A6_pwr_fctr,A7_watts,A7_wh,A7_amps,A7_VAR,A7_pwr_fctr,A9_watts,A9_wh,A9_amps,A9_VAR,A9_pwr_fctr,A10_watts,A10_wh,A10_amps,A10_VAR,A10_pwr_fctr,A11_watts,A11_wh,A11_amps,A11_VAR,A11_pwr_fctr,A12_watts,A12_wh,A12_amps,A12_VAR,A12_pwr_fctr,A13_watts,A13_wh,A13_amps,A13_VAR,A13_pwr_fctr,A14_watts,A14_wh,A14_amps,A14_VAR,A14_pwr_fctr,A15_watts,A15_wh,A15_amps,A15_VAR,A15_pwr_fctr,A16_watts,A16_wh,A16_amps,A16_VAR,A16_pwr_fctr,A17_watts,A17_wh,A17_amps,A17_VAR,A17_pwr_fctr,A18_watts,A18_wh,A18_amps,A18_VAR,A18_pwr_fctr,A19_watts,A19_wh,A19_amps,A19_VAR,A19_pwr_fctr
    return pd.read_csv(DATA_DIR + 'sub_data.csv', parse_dates=['datetime']).astype(np.float32, errors='ignore')

def get_weather():
    # Columns: datetime,temp,dew,humidity,precip,precipprob,windgust,windspeed,winddir,sealevelpressure,cloudcover,visibility,solarradiation,solarenergy,uvindex,severerisk,conditions,conditions_encoded
    return pd.read_csv(DATA_DIR + 'weather.csv', parse_dates=['datetime']).astype(np.float32, errors='ignore')
