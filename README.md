# Intraocular Lens Demand Forecasting & Capacity Planning Pipeline

## 📌 Project Overview
Developed an end-to-end data pipeline and BI dashboard to forecast manufacturing demand for intraocular lenses. The project ingests 3 years of historical sales data, applies machine learning predictive forecasting, and translates the output into a production floor allocation matrix.

## 🛠️ Tech Stack
* **Data Engineering (ETL):** Python (Pandas, SQLAlchemy)
* **Database Management:** PostgreSQL (Data anonymization, masking, and schema structuring)
* **Business Intelligence:** Power BI (DAX, Time-Intelligence, Data Modeling)

## 🏗️ Pipeline Architecture
1. **Data Ingestion:** Automated Python scripts extract granular Excel sales logs, clean null values, and load the data into a PostgreSQL database.
2. **Data Governance:** Implemented a SQL `VIEW` and mapping table to anonymize proprietary lens models (e.g., "AOS 43" masked as "OptiFlex-100") for data security.
3. **Data Modeling:** Established a Star Schema in Power BI using a unified `MasterCalendar` and `MasterModel` dimension table to seamlessly link historical actuals with future predictive data.
4. **Visualization:** Built an executive dashboard featuring YoY/MoM growth calculations, seasonality trend lines, and a dynamic manufacturing heatmap.

## 📊 Dashboard Previews
* **Page 1:** Predictive Demand Forecast (Actuals vs. ML Predictions)
* **Page 2:** Growth & Variance Analysis Matrix
* **Page 3:** Manufacturing Power Allocation Heatmap# lens-demand-forecasting-pipeline
