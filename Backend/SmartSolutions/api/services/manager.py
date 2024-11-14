import re
import numpy as np
import pandas as pd
import json
from darts import TimeSeries
from darts.models import TFTModel
from darts.dataprocessing.transformers import Scaler
from .data import loader as dl
from django.conf import settings


# This file is used to get and manage the data used in API calls to the server

# Constants
TOU_COSTS = {
	"Summer On Peak": 0.11336,
	"Summer Partial Peak": 0.08731,
	"Summer Off Peak": 0.05663,
	"Winter On Peak": 0.07471,
	"Winter Off Peak": 0.05663,
	}
DEMAND_COST = 19.28 # per kW
BASE_DIR = str(settings.BASE_DIR)

# Sample data start and end dates
DATA_START = '2022-09-06 00:00'
DATA_END = '2023-11-03 23:45:00'

################################ ACCESS POINTS #######################################
def get_main_data(span):
	df = dl.get_main_watts()
	if ((span == 'all' or span == 'year') and (len(df) > 4000)):
		df = df.resample('6h', on='datetime').sum().reset_index()
	return df
