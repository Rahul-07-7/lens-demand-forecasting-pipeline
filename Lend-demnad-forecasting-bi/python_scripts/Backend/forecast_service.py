import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from statsmodels.tsa.statespace.sarimax import SARIMAX
import warnings
warnings.filterwarnings("ignore")

class AdvancedForecaster:
    def __init__(self, horizon=12):
        self.horizon = horizon

    def calculate_accuracy(self, actual, fitted):
        mask = actual > 0
        mape = np.mean(np.abs((actual[mask] - fitted[mask]) / actual[mask]))
        return round(max(0, min(100, (1 - mape) * 100)), 2)

    def train_and_forecast(self, raw_data):
        df = pd.DataFrame(raw_data)
        df["date"] = pd.to_datetime(df["date"])
        df = df.sort_values("date").drop_duplicates("date")
        series = df.set_index("date")["sales"].asfreq("MS").fillna(method="ffill").fillna(0)

        n = len(series)
        use_seasonal = n >= 24

        hw = ExponentialSmoothing(
            series,
            trend="add",
            seasonal="add" if use_seasonal else None,
            seasonal_periods=12 if use_seasonal else None
            ).fit()

        sarima = SARIMAX(
            series,
            order=(1,1,0),
            seasonal_order=(0,1,1,12) if use_seasonal else None,
            enforce_stationarity=False
            ).fit(disp=False)

        combined_fitted = (hw.fittedvalues + sarima.fittedvalues) / 2
        acc = self.calculate_accuracy(series, combined_fitted)

        hw_f = hw.forecast(self.horizon)
        sarima_f = sarima.get_forecast(steps=self.horizon).predicted_mean
        combined_f = (hw_f + sarima_f) / 2

        rmse = np.sqrt(np.mean((series - hw.fittedvalues)**2))

        forecast_output = []
        last_date = series.index[-1]

        for i, val in enumerate(combined_f):
            next_date = last_date + pd.DateOffset(months=i + 1)

            pred = max(0, float(val))
            spread = rmse * (1 + (i * 0.1))

            forecast_output.append({
                "date": next_date.strftime("%Y-%m-%d"),
                "forecast_sales": round(pred, 2),
                "min_sales": round(max(0, pred - spread), 2),
                "max_sales": round(pred + spread, 2)
            })

        return {
            "model_name": "Ensemble (SARIMA + HW)",
            "accuracy_percent": acc,
            "forecast": forecast_output,
            "historical": [
                {"date": d.strftime("%Y-%m-%d"), "sales": float(v)}
                for d, v in series.items()
            ]
        }

def run_forecast(data_list, horizon=12):
    return AdvancedForecaster(horizon).train_and_forecast(data_list)



