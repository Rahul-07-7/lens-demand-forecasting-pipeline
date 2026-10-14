SELECT DISTINCT lens_model FROM monthly_sales_forecast
UNION
SELECT DISTINCT lens_model FROM power_allocation_forecast
ORDER BY 1;