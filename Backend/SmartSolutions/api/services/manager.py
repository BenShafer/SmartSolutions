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

def get_kwh_costs(start_date, end_date): # Ex resp: [{"billing":"Winter Off Peak","total_kwh":26905.0,"total_cost":1523.63015},{"billing":"Winter On Peak","total_kwh":46006.0,"total_cost":3437.10826}]
	# TODO Validate date range util
	if ((pd.Timestamp(start_date) > pd.Timestamp(DATA_END)) or (pd.Timestamp(end_date) < pd.Timestamp(DATA_START))):
		return pd.DataFrame()
	billing, total_kwh, total_cost = [], [], []
	total_kwhs, total_costs = 0, 0
	df = dl.get_main_wh()
	df_cal = dl.get_calendar()
	df = df.merge(df_cal, on='datetime')
	df = df.query(f'datetime >= "{start_date}" and datetime < "{end_date}"')
	print(df['datetime'].min(), df['datetime'].max())
	for bill in df.groupby('billing')['Main_kwh']:
		billing.append(bill[0])
		total_kwh.append(bill[1].sum())
		total_cost.append(round(bill[1].sum() * TOU_COSTS.get(bill[0]), 2))
		total_kwhs += bill[1].sum()
		total_costs += bill[1].sum() * TOU_COSTS.get(bill[0])
		print("{}: {:.2f}kWh, ${:.2f}".format(bill[0], bill[1].sum(), bill[1].sum() * TOU_COSTS.get(bill[0])))
	return pd.DataFrame({'billing': billing, 'total_kwh': total_kwh, 'total_cost': total_cost, 'total_kwhs': total_kwhs, 'total_costs': round(total_costs, 2)})

def get_demand_cost(date):
	# TODO Validate date range util
	if ((pd.Timestamp(date) > pd.Timestamp(DATA_END)) or (pd.Timestamp(date) < pd.Timestamp(DATA_START))):
		return {"date": "No data", "cost": "No data"}
	month = pd.Timestamp(date).month
	year = pd.Timestamp(date).year
	df = dl.get_main_watts()
	demand = {"date": df.iloc[df.query('datetime.dt.month == {} and datetime.dt.year == {}'.format(month, year))['Main_kw'].idxmax()]['datetime'].isoformat(),
		   "cost": round(df.iloc[df.query('datetime.dt.month == {} and datetime.dt.year == {}'.format(month, year))['Main_kw'].idxmax()]['Main_kw'] * DEMAND_COST, 2)}
	return demand