-- Frudex Pravasi Petti — development seed data.
-- Safe to re-run: every insert is keyed by its unique slug via ON CONFLICT.

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
insert into categories (id, name, slug, is_active, display_order) values
  ('10000000-0000-0000-0000-000000000001', 'Dates',       'dates',       true, 0),
  ('10000000-0000-0000-0000-000000000002', 'Nuts',        'nuts',        true, 1),
  ('10000000-0000-0000-0000-000000000003', 'Dry Fruits',  'dry-fruits',  true, 2),
  ('10000000-0000-0000-0000-000000000004', 'Chocolates',  'chocolates',  true, 3),
  ('10000000-0000-0000-0000-000000000005', 'Munchies',    'munchies',    true, 4),
  ('10000000-0000-0000-0000-000000000006', 'Others',      'others',      true, 5)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
insert into products (id, category_id, name, slug, description, image_url, is_active, is_featured, display_order) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
    'Madina Ajwa Dates', 'madina-ajwa-dates',
    'Soft, revered sun-cured black dates with natural caramel depth.',
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    true, true, 0),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001',
    'Medjool Dates', 'medjool-dates',
    'Large, honey-sweet Medjool dates prized for their soft, chewy texture.',
    'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&q=80',
    true, false, 1),

  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002',
    'California Almonds', 'california-almonds',
    'Naturally rich in vitamin E, extra-crunch slow roasted almonds.',
    'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
    true, true, 0),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002',
    'W240 Jumbo Cashews', 'w240-jumbo-cashews',
    'Naturally sweet, buttery whole cashews hand-graded for purity.',
    'https://images.unsplash.com/photo-1509912760195-4f6cfd8cce2c?auto=format&fit=crop&w=600&q=80',
    true, false, 1),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002',
    'Roasted & Salted Pistachios', 'roasted-salted-pistachios',
    'Naturally opened in-shell pistachios with light sea-salt roasting.',
    'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=600&q=80',
    true, false, 2),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002',
    'Kashmiri Snow Walnuts', 'kashmiri-snow-walnuts',
    'Cold-pressed freshness, extra-light walnut kernels with zero bitterness.',
    'https://images.unsplash.com/photo-1524593000379-d4729b2c4f99?auto=format&fit=crop&w=600&q=80',
    true, false, 3),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002',
    'Mixed Nuts', 'mixed-nuts',
    'A hand-blended assortment of almonds, cashews, pistachios and walnuts.',
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
    true, false, 4),

  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003',
    'Afghan Anjeer (Dried Figs)', 'afghan-anjeer-dried-figs',
    'Naturally dried round figs loaded with high dietary fiber and iron.',
    'https://images.unsplash.com/photo-1606851094655-b2593a9af63f?auto=format&fit=crop&w=600&q=80',
    true, false, 0),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000003',
    'Mixed Dry Fruits', 'mixed-dry-fruits',
    'A festive blend of apricots, figs, raisins and dried berries.',
    'https://images.unsplash.com/photo-1641291361624-38b69b86b1cf?auto=format&fit=crop&w=600&q=80',
    true, false, 1),

  ('2000000a-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000004',
    'Artisan Chocolate Collection', 'artisan-chocolate-collection',
    'Handcrafted pralines, date-infused dark squares, and pistachio pods.',
    'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    true, true, 0),
  ('2000000a-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000004',
    'Belgian Dark Truffles', 'belgian-dark-truffles',
    'Velvety ganache center dusted with pure cocoa & wrapped in golden foil.',
    'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=80',
    true, false, 1),
  ('2000000a-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000004',
    'Classic Dark Chocolate Bar', 'classic-dark-chocolate-bar',
    'Single bean roasted cocoa bar with Kerala sea salt and organic raw cane sugar.',
    'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=600&q=80',
    true, false, 2),

  ('2000000a-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000005',
    'Signature Trail Munchies', 'signature-trail-munchies',
    'Cranberries, chia clusters, pumpkin seeds and roasted almond bits.',
    'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80',
    true, false, 0),
  ('2000000a-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000005',
    'Kadal Muttayi', 'kadal-muttayi',
    'Kozhikode''s beloved sesame-peanut sweet, slow-cooked to a chewy bite.',
    'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80',
    true, false, 1),
  ('2000000a-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000005',
    'Then Muttayi', 'then-muttayi',
    'Golden honey-jaggery coated peanut candy, a Malabar coast classic.',
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80',
    true, false, 2),

  ('2000000a-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000006',
    'Kerala Spice Trail Sampler', 'kerala-spice-trail-sampler',
    'A curated sampler of Malabar coast whole spices — cardamom, clove and pepper.',
    'https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?auto=format&fit=crop&w=600&q=80',
    true, false, 0)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- product_variants
-- ---------------------------------------------------------------------------
insert into product_variants (product_id, variant_type, variant_value, price, is_available, display_order) values
  -- Madina Ajwa Dates
  ('20000000-0000-0000-0000-000000000001', 'weight', '250g', 650,  true, 0),
  ('20000000-0000-0000-0000-000000000001', 'weight', '500g', 1200, true, 1),
  ('20000000-0000-0000-0000-000000000001', 'weight', '1kg',  2300, true, 2),
  -- Medjool Dates
  ('20000000-0000-0000-0000-000000000002', 'weight', '250g', 550,  true, 0),
  ('20000000-0000-0000-0000-000000000002', 'weight', '500g', 1000, true, 1),
  ('20000000-0000-0000-0000-000000000002', 'weight', '1kg',  1900, true, 2),

  -- California Almonds
  ('20000000-0000-0000-0000-000000000003', 'weight', '100g', 190,  true, 0),
  ('20000000-0000-0000-0000-000000000003', 'weight', '250g', 450,  true, 1),
  ('20000000-0000-0000-0000-000000000003', 'weight', '500g', 850,  true, 2),
  ('20000000-0000-0000-0000-000000000003', 'weight', '1kg',  1600, true, 3),
  -- W240 Jumbo Cashews
  ('20000000-0000-0000-0000-000000000004', 'weight', '100g', 210,  true, 0),
  ('20000000-0000-0000-0000-000000000004', 'weight', '250g', 490,  true, 1),
  ('20000000-0000-0000-0000-000000000004', 'weight', '500g', 950,  true, 2),
  ('20000000-0000-0000-0000-000000000004', 'weight', '1kg',  1800, true, 3),
  -- Roasted & Salted Pistachios
  ('20000000-0000-0000-0000-000000000005', 'weight', '100g', 240,  true, 0),
  ('20000000-0000-0000-0000-000000000005', 'weight', '250g', 550,  true, 1),
  ('20000000-0000-0000-0000-000000000005', 'weight', '500g', 1050, true, 2),
  ('20000000-0000-0000-0000-000000000005', 'weight', '1kg',  2000, true, 3),
  -- Kashmiri Snow Walnuts (500g intentionally out of stock, demonstrates the UI state)
  ('20000000-0000-0000-0000-000000000006', 'weight', '250g', 480,  true,  0),
  ('20000000-0000-0000-0000-000000000006', 'weight', '500g', 900,  false, 1),
  ('20000000-0000-0000-0000-000000000006', 'weight', '1kg',  1750, true,  2),
  -- Mixed Nuts
  ('20000000-0000-0000-0000-000000000007', 'weight', '250g', 520,  true, 0),
  ('20000000-0000-0000-0000-000000000007', 'weight', '500g', 980,  true, 1),
  ('20000000-0000-0000-0000-000000000007', 'weight', '1kg',  1850, true, 2),

  -- Afghan Anjeer
  ('20000000-0000-0000-0000-000000000008', 'weight', '250g', 420,  true, 0),
  ('20000000-0000-0000-0000-000000000008', 'weight', '500g', 800,  true, 1),
  ('20000000-0000-0000-0000-000000000008', 'weight', '1kg',  1550, true, 2),
  -- Mixed Dry Fruits
  ('20000000-0000-0000-0000-000000000009', 'weight', '250g', 450,  true, 0),
  ('20000000-0000-0000-0000-000000000009', 'weight', '500g', 850,  true, 1),
  ('20000000-0000-0000-0000-000000000009', 'weight', '1kg',  1600, true, 2),

  -- Artisan Chocolate Collection
  ('2000000a-0000-0000-0000-000000000010', 'pieces', '6',  350,  true, 0),
  ('2000000a-0000-0000-0000-000000000010', 'pieces', '12', 650,  true, 1),
  ('2000000a-0000-0000-0000-000000000010', 'pieces', '24', 1250, true, 2),
  -- Belgian Dark Truffles
  ('2000000a-0000-0000-0000-000000000011', 'pieces', '6',  420,  true, 0),
  ('2000000a-0000-0000-0000-000000000011', 'pieces', '12', 790,  true, 1),
  ('2000000a-0000-0000-0000-000000000011', 'pieces', '24', 1490, true, 2),
  -- Classic Dark Chocolate Bar (single-variant product)
  ('2000000a-0000-0000-0000-000000000012', 'pack', 'Single 80g Bar', 250, true, 0),

  -- Signature Trail Munchies
  ('2000000a-0000-0000-0000-000000000013', 'weight', '150g', 220, true, 0),
  ('2000000a-0000-0000-0000-000000000013', 'weight', '300g', 420, true, 1),
  ('2000000a-0000-0000-0000-000000000013', 'weight', '500g', 680, true, 2),
  -- Kadal Muttayi
  ('2000000a-0000-0000-0000-000000000014', 'weight', '200g', 180, true, 0),
  ('2000000a-0000-0000-0000-000000000014', 'weight', '400g', 340, true, 1),
  -- Then Muttayi
  ('2000000a-0000-0000-0000-000000000015', 'weight', '200g', 190, true, 0),
  ('2000000a-0000-0000-0000-000000000015', 'weight', '400g', 360, true, 1),

  -- Kerala Spice Trail Sampler (single-variant product)
  ('2000000a-0000-0000-0000-000000000016', 'pack', 'Standard 300g', 280, true, 0)
on conflict (product_id, variant_value) do nothing;
