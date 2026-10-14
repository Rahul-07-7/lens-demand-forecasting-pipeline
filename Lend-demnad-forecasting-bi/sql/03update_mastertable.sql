UPDATE monthly_sales_forecast f
SET lens_model = m.anonymized_model
FROM model_mask_mapping m
WHERE f.lens_model = m.real_model;

UPDATE power_allocation_forecast a
SET lens_model = m.anonymized_model
FROM model_mask_mapping m
WHERE a.lens_model = m.real_model;

UPDATE lensdata d
SET "ModelNo" = m.anonymized_model
FROM model_mask_mapping m
WHERE REPLACE(d."ModelNo", ' ', '') = REPLACE(m.real_model, ' ', '');