const image=id=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=72`;
const catalog=groups=>groups.flatMap(([category,photoId,basePrice,names])=>names.map((name,index)=>[
  category,name,basePrice+index*1000,`${name}, prepared in the house style for this development menu.`,image(photoId)
]));

export const DEVELOPMENT_MENUS={
  'kusina-manila':catalog([
    ['Mains','photo-1547592180-85f173990554',18000,['Chicken adobo','Sinigang na baboy','Crispy pork sisig','Beef caldereta','Pork binagoongan']],
    ['Rice Meals','photo-1603133872878-684f208fb84b',15500,['Tapsilog','Longsilog','Tocilog','Bangsilog','Cornsilog']],
    ['Noodles','photo-1559314809-0d155014e29e',14500,['Pancit canton','Pancit bihon','Palabok','Sotanghon guisado','Batangas lomi']],
    ['Soups','photo-1547592166-23ac45744acd',22500,['Bulalo','Tinolang manok','Nilagang baka','Molo soup','Sinampalukang manok']],
    ['Vegetables','photo-1512621776951-a57141f2eefd',13500,['Pinakbet','Laing','Gising-gising','Chopsuey','Ensaladang talong']],
    ['Sides','photo-1563245372-f21724e3856d',4500,['Garlic fried rice','Lumpiang shanghai','Atchara','Tokwa’t baboy','Salted egg tomato']],
    ['Grilled','photo-1544025162-d76694265947',18500,['Chicken inasal','Inihaw na liempo','Grilled pusit','Pork barbecue','Inihaw na bangus']],
    ['Platters','photo-1504674900247-0877df9cc836',59500,['Barkada boodle','Pancit party tray','Inihaw sampler','Family adobo tray','Fiesta bilao']],
    ['Desserts','photo-1551024601-bec78aea704b',8000,['Leche flan','Turon','Ube halaya','Buko pandan','Halo-halo']],
    ['Drinks','photo-1513558161293-cdaf765ed2fd',6500,['Calamansi iced tea','Sago at gulaman','Fresh buko juice','Mango shake','Kapeng barako']]
  ]),
  salamat:catalog([
    ['Appetizers','photo-1563245372-f21724e3856d',14500,['Lumpiang sariwa','Kinilaw na tuna','Ukoy','Crispy kangkong','Tokwa’t baboy']],
    ['Soups','photo-1547592180-85f173990554',26500,['Bulalo','Sinigang na hipon','Tinolang manok','Molo soup','Nilagang baka']],
    ['Grilled','photo-1544025162-d76694265947',19500,['Chicken inasal','Inihaw na liempo','Grilled pusit','Pork barbecue','Inihaw na bangus']],
    ['Seafood','photo-1559847844-5315695dadae',27500,['Garlic butter shrimp','Crispy tilapia','Baked tahong','Sweet chili crab','Daing na bangus']],
    ['Mains','photo-1547592166-23ac45744acd',25500,['Beef caldereta','Pork binagoongan','Chicken adobo','Kare-kare','Bistek Tagalog']],
    ['Rice & Noodles','photo-1603133872878-684f208fb84b',5500,['Garlic rice','Pancit bihon','Palabok','Pancit canton','Seafood fried rice']],
    ['Vegetables','photo-1540420773420-3366772f4999',17500,['Ginataang gulay','Pinakbet','Laing','Gising-gising','Chopsuey']],
    ['Desserts','photo-1571877227200-a0d98ea607e9',11500,['Halo-halo','Bibingka','Buko pandan','Leche flan','Turon à la mode']],
    ['Drinks','photo-1513558161293-cdaf765ed2fd',7000,['Sago at gulaman','Calamansi juice','Kapeng barako','Fresh buko','House iced tea']],
    ['Chef Specials','photo-1504674900247-0877df9cc836',34500,['Salamat seafood platter','Crispy pata','Stuffed squid','Family kare-kare','Fiesta chicken']]
  ]),
  'salo-table':catalog([
    ['Pulutan','photo-1529193591184-b1d58069ecdd',24500,['Sisig platter','Tokwa’t baboy','Calamares','Crispy tenga','Chicharong bulaklak']],
    ['Shared Plates','photo-1504674900247-0877df9cc836',39500,['Crispy pata','Kare-kare','Lechon kawali','Chicken adobo sa gata','Beef salpicao']],
    ['Soups','photo-1547592180-85f173990554',28500,['Sinigang na salmon','Bulalo for sharing','Molo soup','Sinigang na hipon','Tinolang native']],
    ['Rice & Noodles','photo-1603133872878-684f208fb84b',18500,['Salo garlic rice','Pancit canton bilao','Seafood palabok','Bihon guisado','Adobo fried rice']],
    ['Vegetables','photo-1512621776951-a57141f2eefd',19500,['Pinakbet','Gising-gising','Ensaladang talong','Laing','Garlic kangkong']],
    ['Grill','photo-1544025162-d76694265947',23500,['Chicken inasal','Liempo barbecue','Grilled squid','Pork barbecue platter','Inihaw na bangus']],
    ['Seafood','photo-1559847844-5315695dadae',29500,['Garlic butter shrimp','Crispy tilapia','Baked scallops','Chili crab','Kinilaw na tuna']],
    ['Desserts','photo-1551024601-bec78aea704b',14500,['Turon à la mode','Leche flan','Mais con yelo','Buko pandan','Ube cheesecake']],
    ['Drinks','photo-1513558161293-cdaf765ed2fd',9000,['Fresh buko','House iced tea pitcher','Calamansi soda','Mango shake','Kapeng barako']],
    ['Celebration Trays','photo-1504674900247-0877df9cc836',59500,['Salo fiesta bilao','Family grill tray','Pancit celebration tray','Seafood salu-salo','Barkada pulutan tray']]
  ]),
  'tambay-tab':catalog([
    ['Espresso','photo-1495474472287-4d71bcdd2085',11000,['Americano','Flat white','Café mocha','Cappuccino','Caramel macchiato']],
    ['Iced Coffee','photo-1517701604599-bb29b565090c',15000,['Spanish latte','Cold brew','Sea salt latte','Iced americano','Brown sugar latte']],
    ['Non-Coffee','photo-1513558161293-cdaf765ed2fd',14500,['Matcha latte','Tablea chocolate','Mango tea','Strawberry milk','Calamansi cooler']],
    ['Breakfast','photo-1533089860892-a7c6f0a88666',18500,['Tocino breakfast plate','Mushroom omelette','Ube overnight oats','Chicken longganisa plate','French toast']],
    ['Sandwiches','photo-1528735602780-2552fd46c7af',18500,['Chicken pesto panini','Tuna melt','Grilled cheese','Clubhouse sandwich','Egg salad croissant']],
    ['Pasta','photo-1473093295043-cdd812d0e601',21500,['Truffle cream pasta','Spicy tuna aglio olio','Chicken pesto pasta','Beef bolognese','Mushroom carbonara']],
    ['Rice Bowls','photo-1603133872878-684f208fb84b',19500,['Beef tapa bowl','Chicken teriyaki bowl','Sisig rice bowl','Garlic mushroom bowl','Crispy pork bowl']],
    ['Snacks','photo-1550547660-d9450f859349',17500,['Truffle fries','Nachos barkada','Crispy chicken bites','Mozzarella sticks','Loaded potato wedges']],
    ['Pastries','photo-1555507036-ab1f4038808a',9500,['Butter croissant','Ube cheese roll','Banana bread','Chocolate muffin','Cinnamon roll']],
    ['Desserts','photo-1571877227200-a0d98ea607e9',12500,['Basque cheesecake','Tablea brownie','Mango panna cotta','Affogato','Ube tiramisu']]
  ]),
  'ihaw-buffet':catalog([
    ['Packages','photo-1504674900247-0877df9cc836',44900,['Lunch grill buffet','Classic buffet','Premium buffet','Family grill package','Celebration buffet']],
    ['Pork Grill','photo-1529193591184-b1d58069ecdd',0,['Pork barbecue','Inihaw na liempo','Isaw baboy','Pork belly strips','Grilled pork tocino']],
    ['Chicken Grill','photo-1544025162-d76694265947',0,['Chicken inasal','Chicken barbecue','Isaw manok','Grilled chicken wings','Chicken skin skewers']],
    ['Beef Grill','photo-1558030006-450675393462',0,['Beef yakiniku','Beef short plate','Peppered beef cubes','Beef barbecue','Garlic beef strips']],
    ['Seafood Grill','photo-1559847844-5315695dadae',0,['Grilled bangus','Garlic butter shrimp','Grilled squid','Baked mussels','Chili lime tilapia']],
    ['Vegetables','photo-1540420773420-3366772f4999',0,['Grilled eggplant','Garlic kangkong','Ensaladang pipino','Buttered corn','Grilled mushrooms']],
    ['Rice & Noodles','photo-1603133872878-684f208fb84b',0,['Steamed rice','Garlic rice','Pancit canton','Kimchi fried rice','Sotanghon guisado']],
    ['Street Food','photo-1529193591184-b1d58069ecdd',0,['Kwek-kwek','Fish balls','Chicken balls','Cheese sticks','Dynamite rolls']],
    ['Sauces & Sides','photo-1563245372-f21724e3856d',3500,['Cheese dip','Kimchi','Atchara','Spiced vinegar','Garlic soy sauce']],
    ['Drinks & Desserts','photo-1551024601-bec78aea704b',6500,['Unlimited iced tea','Sago at gulaman','Halo-halo cup','Leche flan','Fresh buko juice']]
  ])
};
