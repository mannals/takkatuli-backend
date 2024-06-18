DROP DATABASE IF EXISTS ForumApp;
CREATE DATABASE ForumApp;
USE ForumApp;

-- Table creation

CREATE TABLE UserLevels (
    level_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL
);

CREATE TABLE Users (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_level_id INT NOT NULL DEFAULT 2, 
    bio_text TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP,
    FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id)
);

CREATE TABLE ProfilePictures (
    picture_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    filesize INT NOT NULL,
    media_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Categories (
    category_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Subcategories (
    subcategory_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Posts (
    post_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subcategory_id INT NOT NULL,
    filename VARCHAR(255),
    filesize INT,
    thumbnail VARCHAR(255),
    media_type VARCHAR(255),
    reply_to INT DEFAULT NULL,
    title VARCHAR(255),
    text_content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (subcategory_id) REFERENCES Subcategories(subcategory_id)
);

CREATE TABLE PostVotes (
    vote_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    approve BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

INSERT INTO UserLevels (level_name) VALUES ('Admin'), ('User'), ('Guest');

INSERT INTO Users (username, password, email, user_level_id) VALUES 
    ('TakkatuliAdmin', 'adminpass', 'admin@takkatuli.com', 1),
    ('Jonna95', 'marttila123', 'jonnamarttila@luukku.com', 2),
    ('WioletWizard', 'Turv4ll1nenS4l4S4n4', 'lumikki.unihiutale@gmail.com', 2),
    ('bakemonochan', 'kawaii123', 'elina.makkonen@madeupperson.com', 2),
    ('ellavaanXD', 'ebinvidsiDDD', 'ellaaaaaah@mail.com', 2),
    ('puppetmaster89', 'kukkaketo123', 'jarkko.huovinen@madeupperson.com', 2),
    ('uwu_owo', 'kawaii123', 'ossi.ossinen@ossimail.com', 2),
    ('kukkaketo', 'kukkaketo123', 'kukkamaaria.k@mail.com', 2),
    ('reino-remppaaja', 'remppa123', 'reino@nordin.com', 2);

INSERT INTO Categories (title) VALUES 
    ('Yleinen'), ('Kodinhoito'), ('Kokkaus & Leivonta'), ('Puutarha'), ('Käsityöt & DIY');

INSERT INTO Subcategories (category_id, title, description) VALUES 
    (1, 'Tiedotteet', 'Sivuja koskevat ilmoitusluontoiset asiat'),
    (1, 'Palaute', 'Kehitysideat ja vikailmoitukset'),
    (1, 'Esittelyt', 'Kerrothan täällä itsestäsi muille käyttäjille'),
    (2, 'Sisustus', 'Keskustelus kodin sommittelusta ja somistuksista'), 
    (2, 'Siivous', 'Love it or hate it, välillä pitää vaan siivota.'), 
    (2,'Remontointi', 'Niksejä ynnä muuta arjen nikkarointiin'),
    (3, 'Arkiruoka', 'Mitä tänään syötäisiin?'),
    (3, 'Leivonta', 'Herkut juhlapöytään & mässynhimoon'),
    (3, 'Erityisruokavaliot', 'Etkö voi syödä kaikkea? Keskustelua eri ruokavalioista!'),
    (4, 'Kasvien hoito ja viljely', 'Keskustelua kasvien kasvatuksesta'),
    (4, 'Hyönteisten torjunta', 'Tuholaisten tuhoamiseen'),
    (5, 'Tekstiilityöt', 'Kudontaa, neulontaa, ompelua, askartelua'),
    (5, 'Puutyö ja metallityöt', 'Nikkarointifoorumi'),
    (5, 'DIY-projektit', 'Oman elämänsä keksijä-insinööri-suunnittelijoille');


INSERT INTO Posts (user_id, subcategory_id, title, text_content) VALUES 
    (1, 1, 'Uusi,hienompi ulkoasu!', 'Jättäkää kommenttia, mitä tykkäätte uudesta ulkoasusta :) -admin'),
    (1, 1, 'Käyttökatko 12.5.2021', 'Sivusto on pois käytöstä huomenna 12.5.2021 klo 12-16. Pahoittelemme häiriötä! -admin'),
    (1, 1, 'Käyttökatko 15.5.2021', 'Sivusto on pois käytöstä lauantaina 15.5.2021 klo 8-12. Pahoittelemme häiriötä! -admin'),
    (1, 2, 'Kehitysideat', 'Jättäkää kommenttia, mitä haluaisitte sivustolle lisättävän tai muutettavan'),
    (1, 2, 'Vikailmoitukset', 'Ilmoittakaa täällä sivuston toimimattomuudesta tai muista ongelmista'),
    (1, 3, 'Tervetuloa!', 'Hei kaikki! Olen TakkatuliAdmin ja toivotan teidät tervetulleeksi Takkatuliin!'),
    (3, 3, 'Moi!', 'Hei kaikki! Olen WioletWizard ja olen uusi täällä. Kiva tutustua!'),
    (4, 3, 'Moi!', 'Hei kaikki! Olen bakemonochan ja olen uusi täällä. Kiva tutustua!'),
    (5, 3, 'Moi!', 'Hei kaikki! Olen ellavaanXD ja olen uusi täällä. Kiva tutustua!'),
    (6, 3, 'Moi!', 'Hei kaikki! Olen puppetmaster89 ja olen uusi täällä. Kiva tutustua!'),
    (7, 3, 'Moi!', 'Hei kaikki! Olen uwu_owo ja olen uusi täällä. Kiva tutustua!'),
    (2, 3, 'Moi kaikille :)', 'Heippa! Oon uusi täällä. Mun nimi on Jonna ja oon lurkannut täällä jo pari kk. Halusin vihdoin tehdä tilin ja liittyä mukaan keskusteluihin :) Hauska tavata!'),
    (3, 4, 'Väriteoriaa sisustus-n00beille ;)', 
    'Perusväriteoria perustuu väripyörään, jossa päävärit ovat punainen, keltainen ja sininen. Värien harmoninen yhdistäminen voi perustua kolmeen pääperiaatteeseen:
Analogiset värit:
Lähellä toisiaan olevat värit väripyörällä (esim. keltainen, oranssi, punainen) luovat harmonisen yhdistelmän.
Kontrasti:
Värien vastakkaiset puolet väripyörällä (esim. punainen ja vihreä) tarjoavat kontrastisen yhdistelmän, luoden visuaalista kiinnostavuutta.
Komplementtivärit:
Suoraan toistensa vastapäätä olevat värit väripyörällä (esim. punainen ja vihreä) ovat komplementtivärejä, ja niiden yhdistelmä voi olla dramaattinen.
Neutraalit värit, kuten musta, valkoinen ja harmaa, voivat tasapainottaa voimakkaampia värejä. Valitsemalla värit omien mieltymysten ja tilan tunnelman mukaan voidaan luoda haluttu visuaalinen vaikutelma.'),
    (2, 4, 'Miten valitaan oikea sohva?', 'Sohvan valintaan vaikuttaa monta asiaa. Ensinnäkin, mieti, mihin tilaan sohva tulee. Onko kyseessä olohuone, makuuhuone, lastenhuone vai vaikkapa työhuone? Minkä kokoinen sohva tilaan mahtuu? Minkä väriset huonekalut ja seinät tilassa ovat? Minkä väriset verhot ja matot tilassa ovat? Minkä väriset tyynyt ja muut tekstiilit tilassa ovat? Minkä väriset koriste-esineet tilassa ovat? Minkä väriset lattiat tilassa ovat? Minkä väriset valaisimet tilassa ovat? Minkä väriset taulut ja julisteet tilassa ovat? Minkä väriset kasvit ja kukat tilassa ovat? Minkä väriset lelut ja pelit tilassa ovat? Minkä väriset kirjat ja lehdet tilassa ovat? Minkä väriset astiat ja ruokailuvälineet tilassa ovat? Minkä väriset vaatteet ja kengät tilassa ovat? Minkä väriset laukut ja reput tilassa ovat? Minkä väriset käsityöt ja askartelut tilassa ovat? Minkä väriset lemmikit ja niiden tarvikkeet tilassa ovat? Minkä väriset elektroniikka ja sen tarvikkeet tilassa ovat? Minkä väriset työkalut ja niiden tarvikkeet tilassa ovat? Minkä väriset autot ja niiden tarvikkeet tilassa ovat? Minkä väriset polkupyörät ja niiden tarvikkeet tilassa ovat? Minkä väriset urheiluvälineet ja niiden tarvikkeet tilassa ovat? Minkä väriset retkeilyvälineet ja niiden tarvikkeet tilassa ovat? Minkä väriset kalastusvälineet ja niiden tarvikkeet tilassa ovat? Lista jatkuu loputtomiin...'),
    (4, 4, 'Parhaat Ikea-tuotteet?', 'Mikä on sun mielestä paras Ikea-tuote?'),
    (5, 4, 'Miks modernit kämpät on niin rumii...', 'Siis kaikki on sellasii harmaanvalkosii ja tylsii. Miks ei voi olla värei ja persoonallisuutta?'),
    (6, 4, 'Roast my room osa 5', 'Jatkoa suositulle ketjulle! Postaa kuva huoneestasi ja anna muiden arvostella!'),
    (3, 5, 'Miten ootte saanu uunista pinttymät irti', 'Siis mulla on sellanen uuni, jossa on sellanen pinta, johon on jääny tollasii mustii pinttymiä. Ei oo siis mun jäljiltä, tän kämpän edellinen asukas oli jättäny noi. Oon kokeillu uuninpesuainetta, puhdistuskivee, ja sellasta raaputinta, mut noi ei vaan lähe!! Miten ne saa irti?'),
    (6, 5, 'Aliarvostetut siivousvälineet', 'Fairy on niin hyvä puhdistusaine, sitä voi oikeesti käyttää monien eri asioiden puhdistukseen. Mä oon jopa pessy ikkunoitaki sillä! Ilmiantakaa teidän lempparit aliarvostetut tuotteet :3'),
    (8, 6, 'auto talli uuteen uskoon', 'mie ja miun poika päätettiin lähteä auto tallin laajennus toimiin. tuli 10 neljö metriä lisää. nikkaroitiin sinne myös pöytä ja pari tuolia.'),
    (2, 6, 'Oman elämäni putkimies (putkinainen...?)', 'Tein sitte ite meidän putkiremontin. Pitää vaan toivoa, ettei mikään ala vuotamaan, LOL! Katoin vaan tutoriaaleja youtubesta. Hyvin se sujui silleen!'),
    (4, 7, 'budget bytes', 'Tässä on mun lemppari ruokablogi. Sieltä löytyy paljon hyviä reseptejä ja kaikki on tosi helppoja tehdä! Lämmin suositus! <3'),
    (2, 7, 'oon kyllästyny nistipataan!!!!!!!', 'mitä helkuttia vois muuten näin köyhänä opiskelijana tehdä? heittäkää jotain tosi halpoja ohjeita pls'),
    (5, 7, 'Mikä on sun lemppari ruoka?', 'Mikä on sun lemppari ruoka?'),
    (5, 8, 'Mikä on sun lemppari leivonnainen?', 'Mikä on sun lemppari leivonnainen?'),
    (9, 8, 'Iki-ihana omenapiirakka', 
    'Ainesosat: 

    200 g 	margariinia
    1,5 dl 	sokeria
    3 dl 	jauhoja
    1 	muna
    0,75 dl 	maitoa, huom. ei litroja.
    1 tl 	leivinjauhetta
    1 tl 	vaniljasokeria
    3-4 	omenaa
	kanelia ja sokeria
    
    Ohje:   
    
    Sulata rasva tai käytä pullomargariinia.
    Sekoita kulhossa sokerin kanssa.
    Lisää jauhot (ei vielä leivinjauhetta). Jauhoja kannattaa lisätä hiljalleen, sillä taikinasta ei tulisi tulla kovin kuivaa tässä vaiheessa. Ota tässä kohtaa sivuun kahvikupillinen taikinaa; se ripotellaan valmiin piirakan päälle.
    Lisää nyt taikinakulhoon muna, maito, leivinjauhe ja vaniljasokeri. Sekoita puulusikalla kovaa tasaiseksi. Taikina on valuvaa tässä vaiheessa, eli ei esim. pysy vuoan reunoilla, muttei myöskään ole litkua.
    Kaada taikina voideltuun tavalliseen piirakkavuokaan ja ripottele päälle omenapalat. Itse käytän mitä tahansa omenalajia, jota kotona sattuu olemaan. Jos omena on hapanta, pinnalle kannattaa laittaa vähän runsaammin sokeria. Tällä taikinalla on tehty onnistuneita piirakoita kaikista hedelmistä, joten kokeilla voi.
    Ripottele pinnalle kanelia ja sokeria sekä sivuun alussa jätetty taikina.
    Paista 200 asteessa n. 30 min.
    Parasta tarjoiltuna lyhyen vetäytymisen jälkeen kylmän vaniljakastikkeen tai -jäätelön kanssa.
    '),
    (7, 9, 'en jaksa tätä ketoo enää', 'oon koko ajan niin ärtyisä ja väsyny. mikä auttais?'),
    (9, 9, 'vekanismi', 'mikä tässä on se idea . mie en ainakaa mittää pupun ruokaaa halua vetää .');
    


INSERT INTO Posts (user_id, subcategory_id, text_content, reply_to) VALUES 
    (3, 1, 'Älä laita tällästä', 1),
    (2, 3, 'sun mutsis ei toimi', 5),
    (1, 4, 'Kiitos vinkistä! Oon aina ollu ihan pihalla näistä väreistä, mutta nyt tuli vähän valaistusta :D', 13),
    (2, 4, 'Mä tykkään Ikean kahvista', 15),
    (3, 4, 'Mä tykkään Ikean lihapullista', 15),
    (4, 4, 'Mä tykkään Ikean hotdogeista', 15),
    (5, 4, 'Mä tykkään Ikean jäätelöstä', 15),
    (6, 4, 'Mä tykkään Ikean kuulokkeista', 15),
    (3, 5, 'Mä tykkään Ikean sohvista', 15),
    (2, 5, 'Mä tykkään Ikean sängyistä', 15),
    (1, 5, 'Mä tykkään Ikean peitoista', 15),
    (2, 5, 'Mä tykkään Ikean tyynyistä', 15),
    (3, 5, 'Mä tykkään Ikean matosta', 15),
    (4, 5, 'Mä tykkään Ikean verhoista', 15),
    (5, 5, 'Mä tykkään Ikean tauluista', 15),
    (8, 5, 'mun mielestä ne on a e s t h e t i c', 16),
    (7, 7, 'yikes tää ei tuu päättyy hyvin', 21),
    (8, 9, 'mä oon ollu vegaani kohta 5 vuotta ja en todellakaan vedä mitään pupunruokaa. sipsit ja kalja on vegaanista tiedoks vaan :D', 28);