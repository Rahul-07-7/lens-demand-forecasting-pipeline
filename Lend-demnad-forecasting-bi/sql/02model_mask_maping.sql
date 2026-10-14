CREATE TABLE model_mask_mapping (
    real_model VARCHAR(100) PRIMARY KEY,
    anonymized_model VARCHAR(100)
);

INSERT INTO model_mask_mapping (real_model, anonymized_model) VALUES
('AOS 43',  'OptiFlex-100'),
('AOS 44',  'OptiFlex-200'),
('AOS 45',  'OptiFlex-300'),
('AOS 46',  'OptiFlex-400'),
('AOS 47T', 'OptiFlex-Toric-10'),
('AOS 50',  'OptiFlex-500'),
('AOS 52',  'OptiFlex-600'),
('AOS 53',  'OptiFlex-700'),
('AOS 54',  'OptiFlex-800'),
('AOS 56',  'OptiFlex-900'),
('AOS 57',  'OptiFlex-Toric-20'),
('AOS 59',  'OptiFlex-Toric-30');