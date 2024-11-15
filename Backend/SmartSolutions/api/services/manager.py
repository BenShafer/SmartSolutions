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

def get_battery_savings(start_date, end_date, battery_size):
	# TODO Validate date range util
	if ((pd.Timestamp(start_date) > pd.Timestamp(DATA_END)) or (pd.Timestamp(end_date) < pd.Timestamp(DATA_START))):
		return {'savings': "No data"}
	df = dl.get_main_watts()
	df = slice_data_by_date(df, start_date, end_date)
	original_cost, reduced_cost = 0, 0
	if less_than_one_month(pd.Timestamp(start_date), pd.Timestamp(end_date)):
		original_cost = calc_demand_cost(df)['cost']
		reduced_cost = calc_demand_cost(reduce_watts(df, battery_size))['cost']
		return {"before":round(original_cost, 2), "after":round(reduced_cost, 2), "savings": round(original_cost - reduced_cost, 2)}
	for month_start in pd.date_range(df['datetime'].min(), df['datetime'].max(), freq='MS'):
		month_end = month_start + pd.offsets.DateOffset(months=1)
		month_df = df[(df['datetime'] >= month_start) & (df['datetime'] <= month_end)]
		original_cost += calc_demand_cost(month_df)['cost']
		reduced_cost += calc_demand_cost(reduce_watts(month_df, battery_size))['cost']
	return {"before":round(original_cost, 2), "after":round(reduced_cost, 2), "savings": round(original_cost - reduced_cost, 2)}



################################ UTILS #######################################
def slice_data_by_date(data, start_date, end_date):
	if ((pd.Timestamp(start_date) > pd.Timestamp(DATA_END)) or (pd.Timestamp(end_date) < pd.Timestamp(DATA_START))):
		return pd.DataFrame({'datetime': pd.date_range(start_date, end_date, freq='D')})
	if (pd.Timestamp(start_date) < pd.Timestamp(DATA_START)):
		start_date = DATA_START
		empty_df = pd.DataFrame({'datetime': pd.date_range(start_date, DATA_START, freq='D')})
		return pd.concat([empty_df, data[data['datetime'].between(DATA_START, end_date)]])
	if (pd.Timestamp(end_date) > pd.Timestamp(DATA_END)):
		end_date = DATA_END
		empty_df = pd.DataFrame({'datetime': pd.date_range(DATA_END, end_date, freq='D')})
		return pd.concat([data[data['datetime'].between(start_date, DATA_END)], empty_df])
	return data.query(f'datetime >= "{start_date}" and datetime < "{end_date}"')

def calc_demand_cost(df):
	demand = {"date": df.loc[df['Main_kw'].idxmax()]['datetime'].isoformat(),
		"cost": round(df.loc[df['Main_kw'].idxmax()]['Main_kw'] * DEMAND_COST, 2)}
	return demand

def less_than_one_month(start, end):
	# Calculate the difference between the two timestamps in months
	diff_months = (end.year - start.year) * 12 + (end.month - start.month)
	return diff_months < 1
	
def reduce_watts(df, battery_size):
	battery_size = int(battery_size)
	# Group the dataframe by date
	df['date'] = df['datetime'].dt.date
	def get_dec_size(charge):
		if charge > 35:
			return round(pow(charge, 1.1)/20)
		else:
			return 1
	def get_inc_size(max, current):
		if (max - current) > 35:
			return round(pow((max - current), 1.1)/20)
		else:
			return 1
	def process_group(group):
		nonlocal battery_size
		battery_charge = battery_size
		inc_size = get_dec_size(battery_charge)
		# Calculate the maximum and minimum kW values for the day
		max_kw = group['Main_kw'].max()
		min_kw = group['Main_kw'].min()
		while battery_charge > 0 and max_kw > min_kw:
			# Find the index of the row with the max 'Main_kw' value where the hour is between 8 and 23
			idxmax = group[group['datetime'].dt.hour.between(8, 23)]['Main_kw'].idxmax()
			# If there is no such row, break the loop
			if pd.isna(idxmax):
				break
			inc_size = get_dec_size(battery_charge)
			# Otherwise, decrease the 'Main_kw' value at this index
			group.loc[idxmax, 'Main_kw'] -= inc_size
			battery_charge -= inc_size
			max_kw = group['Main_kw'].max()
			min_kw = group['Main_kw'].min()
		max_kw = group['Main_kw'].max()
		min_kw = group['Main_kw'].min()
		inc_size = get_inc_size(battery_size, battery_charge)
		while battery_charge < battery_size and min_kw < max_kw:
			# Find the index of the row with the min 'Main_kw' value where the hour is not between 8 and 23
			idxmin = group[~group['datetime'].dt.hour.between(8, 23)]['Main_kw'].idxmin()
			# If there is no such row, break the loop
			if pd.isna(idxmin):
				break
			inc_size = get_inc_size(battery_size, battery_charge)
			# Otherwise, increase the 'Main_kw' value at this index
			group.loc[idxmin, 'Main_kw'] += inc_size
			battery_charge += inc_size
			max_kw = group['Main_kw'].max()
			min_kw = group['Main_kw'].min()
		return group
	df = df.groupby('date').apply(process_group)
	# Remove the 'date' column
	df.drop('date', axis=1, inplace=True)
	return df
