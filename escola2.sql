CREATE TABLE escolas_vizinhanca (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    cidade VARCHAR(100) NOT NULL,
    nome_escola VARCHAR(150) NOT NULL,
    rede_ensino VARCHAR(50) NOT NULL, -- Ex: Estadual, Municipal
    localizacao VARCHAR(50) NOT NULL  -- Ex: Urbana, Rural
);

INSERT INTO escolas_vizinhanca (cidade, nome_escola, rede_ensino, localizacao) VALUES
('Virmond', 'C. E. General Eurico Gaspar Dutra', 'Estadual', 'Urbana'),
('Porto Barreiro', 'Colégio Estadual do Campo de Porto Barreiro', 'Estadual', 'Rural'),
('Nova Laranjeiras', 'Colégio Estadual Rui Barbosa', 'Estadual', 'Urbana'),
('Rio Bonito do Iguaçu', 'C. E. do Campo Arapongas', 'Estadual', 'Rural'),
('Cantagalo', 'Escola Rural Municipal de Cavaco', 'Municipal', 'Rural'),
('Laranjeiras do Sul', 'Escola Municipal Aluísio Maier', 'Municipal', 'Urbana');
select * from escolas_vizinhanca;