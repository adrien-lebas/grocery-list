-- Seed Ingredients (Proteins)
insert into ingredients (name, category, "defaultUnit", "defaultPortion") values
('Poulet (Filet)', 'PROTEIN', 'g', 150),
('Saumon', 'PROTEIN', 'g', 150),
('Tofu', 'PROTEIN', 'g', 125),
('Steak Haché', 'PROTEIN', 'unit', 1),
('Oeufs', 'PROTEIN', 'unit', 2),
('Lentilles', 'PROTEIN', 'g', 80),
('Cabillaud', 'PROTEIN', 'g', 150),
('Porc (Côte)', 'PROTEIN', 'unit', 1),
('Dinde (Escalope)', 'PROTEIN', 'unit', 1),
('Thon (Boîte)', 'PROTEIN', 'g', 100),
('Crevettes', 'PROTEIN', 'g', 150),
('Jambon Blanc', 'PROTEIN', 'unit', 2),
('Saucisses', 'PROTEIN', 'unit', 2),
('Pois Chiches', 'PROTEIN', 'g', 100),
('Omelette', 'PROTEIN', 'unit', 2);

-- Seed Ingredients (Vegetables)
insert into ingredients (name, category, "defaultUnit", "defaultPortion") values
('Haricots Verts', 'VEGETABLE', 'g', 200),
('Brocolis', 'VEGETABLE', 'unit', 0.5),
('Carottes', 'VEGETABLE', 'g', 150),
('Courgettes', 'VEGETABLE', 'unit', 1),
('Salade', 'VEGETABLE', 'unit', 0.3),
('Tomates', 'VEGETABLE', 'unit', 2),
('Poivrons', 'VEGETABLE', 'unit', 1),
('Champignons', 'VEGETABLE', 'g', 150),
('Épinards', 'VEGETABLE', 'g', 200),
('Chou-fleur', 'VEGETABLE', 'unit', 0.25),
('Aubergines', 'VEGETABLE', 'unit', 0.5),
('Poireaux', 'VEGETABLE', 'unit', 1),
('Petits Pois', 'VEGETABLE', 'g', 150),
('Asperges', 'VEGETABLE', 'g', 200),
('Avocat', 'VEGETABLE', 'unit', 0.5);

-- Seed Ingredients (Starches)
insert into ingredients (name, category, "defaultUnit", "defaultPortion") values
('Riz', 'STARCH', 'g', 80),
('Pâtes', 'STARCH', 'g', 100),
('Pommes de terre', 'STARCH', 'g', 250),
('Quinoa', 'STARCH', 'g', 80),
('Semoule', 'STARCH', 'g', 80),
('Boulgour', 'STARCH', 'g', 80),
('Patate Douce', 'STARCH', 'g', 250),
('Gnocchis', 'STARCH', 'g', 200),
('Polenta', 'STARCH', 'g', 80),
('Lentilles Corail', 'STARCH', 'g', 80),
('Riz Complet', 'STARCH', 'g', 80),
('Pâtes Complètes', 'STARCH', 'g', 100),
('Purée', 'STARCH', 'g', 200),
('Frites', 'STARCH', 'g', 200),
('Blé', 'STARCH', 'g', 80);

-- Seed Recurring Items
insert into recurring_items (name, category, "isSelected") values
('Oeufs', 'Frais', false),
('Lait', 'Frais', false),
('Beurre', 'Frais', false),
('Crème Fraîche', 'Frais', false),
('Yaourts', 'Frais', false),
('Fromage Rapé', 'Frais', false),
('Parmesan', 'Frais', false),
('Mozzarella', 'Frais', false),
('Bananes', 'Fruits', false),
('Pommes', 'Fruits', false),
('Citrons', 'Fruits', false),
('Oranges', 'Fruits', false),
('Pain', 'Boulangerie', false),
('Brioche', 'Boulangerie', false),
('Jambon', 'Charcuterie', false),
('Lardons', 'Charcuterie', false);

-- Seed Stock Items
insert into stock_items (name, category, status) values
('Tablettes Lave-vaisselle', 'Entretien', 'IN_STOCK'),
('Lessive', 'Entretien', 'IN_STOCK'),
('Éponge', 'Entretien', 'IN_STOCK'),
('Sac Poubelle 30L', 'Entretien', 'IN_STOCK'),
('Sac Poubelle 50L', 'Entretien', 'IN_STOCK'),
('Essuie-tout', 'Entretien', 'IN_STOCK'),
('Produit Sol', 'Entretien', 'IN_STOCK'),
('Vinaigre Blanc', 'Entretien', 'IN_STOCK'),
('Papier Toilette', 'Hygiène', 'IN_STOCK'),
('Dentifrice', 'Hygiène', 'IN_STOCK'),
('Savon Corps', 'Hygiène', 'IN_STOCK'),
('Shampoing', 'Hygiène', 'IN_STOCK'),
('Déodorant', 'Hygiène', 'IN_STOCK'),
('Coton', 'Hygiène', 'IN_STOCK'),
('Huile d''Olive', 'Épices/Condiments', 'IN_STOCK'),
('Huile de Tournesol', 'Épices/Condiments', 'IN_STOCK'),
('Sel', 'Épices/Condiments', 'IN_STOCK'),
('Poivre', 'Épices/Condiments', 'IN_STOCK'),
('Moutarde', 'Épices/Condiments', 'IN_STOCK'),
('Ketchup', 'Épices/Condiments', 'IN_STOCK'),
('Mayonnaise', 'Épices/Condiments', 'IN_STOCK'),
('Sauce Soja', 'Épices/Condiments', 'IN_STOCK'),
('Farine', 'Épices/Condiments', 'IN_STOCK'),
('Sucre', 'Épices/Condiments', 'IN_STOCK'),
('Café', 'Épices/Condiments', 'IN_STOCK'),
('Thé', 'Épices/Condiments', 'IN_STOCK');

-- Seed Menus (Important for UI to render)
insert into menus (id, name, quantities) values
('menu-1', 'Menu 1', '{}'),
('menu-2', 'Menu 2', '{}'),
('menu-3', 'Menu 3', '{}'),
('menu-4', 'Menu 4', '{}'),
('menu-5', 'Menu 5', '{}');
