CREATE TABLE cidades_vizinhas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cidade VARCHAR(100) NOT NULL,
    distancia_km VARCHAR(20) NOT NULL,
    populacao VARCHAR(30) NOT NULL,
    economia_principal VARCHAR(150) NOT NULL,
    principal_acesso VARCHAR(50) NOT NULL,
    bioma VARCHAR(50) DEFAULT 'Mata Atlântica'
);

INSERT INTO cidades_vizinhas (cidade, distancia_km, populacao, economia_principal, principal_acesso) VALUES
('Virmond', '25 km', 'Aprox. 4.000 hab.', 'Agropecuária / Produção de Milho', 'BR-277'),
('Porto Barreiro', '30 km', 'Aprox. 3.500 hab.', 'Agricultura Familiar e Bacia Leiteira', 'PR-565'),
('Nova Laranjeiras', '33 km', 'Aprox. 11.500 hab.', 'Agropecuária / Presença de Terras Indígenas', 'BR-277'),
('Rio Bonito do Iguaçu', '35 km', 'Aprox. 13.500 hab.', 'Agroindústria / Grandes Assentamentos Rurais', 'BR-158'),
('Cantagalo', '38 km', 'Aprox. 13.000 hab.', 'Agricultura Extensiva (Soja e Trigo)', 'BR-277');
select * from cidades_vizinhas;