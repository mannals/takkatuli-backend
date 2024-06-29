# Takkatuli-foorumi

![Logo](takkatuli-logo-2.png)

Takkatuli on kotitalouteen keskittyvä foorumi, jossa voi keskustella vaikkapa remontoinnista, ruuanlaitosta tai puutarhahommista: eri kategorioita sivulta löytyy viisi alakategorioineen.

## Sovelluksen toiminnallisuudet kuvakaappauksineen päivineen

Kun sovelluksen avaa, etusivunäkymä näyttää tältä:

![Etusivu](./screenshots/Etusivu.jpg)

Eri alakategorioita ja postauksia niiden sisällä pystyy selaamaan, vaikka et kirjautuisi sisään. Eri alakategorioiden postauksia voit selailla klikkaamalla niitä:

![Alakategorian sivu](./screenshots/Alakategorian%20sivu.jpg)

Foorumille osallistuminen sen sijaan vaatii käyttäjätiliä. Yläpalkin kirjautumisnäppäintä painamalla pääsee kirjautumissivulle:

![Sisäänkirjautuminen](./screenshots/Sisäänkirjautuminen.jpg)

Sisäänkirjautumissivun alaosassa on näppäin, josta voit siirtyä rekisteröintisivulle, mikäli et ole vielä luonut tiliä.

![Rekisteröityminen](./screenshots/Rekisteröinti.jpg)

Kirjautuneena käyttäjänä voit osallistua foorumin keskusteluihin, muokata profiiliasi, tai vaikkapa ylä- tai alapeukuttaa muiden jäsenten postauksia.

Uuden postauksen tekeminen on helppoa: haluamasi alakategorian sivun yläosassa on Uusi lanka -näppäin, jota klikkaamalla pääset postauksen julkaisemiseen.

![Alakategorian sivu](./screenshots/Alakategorian%20sivu.jpg)

Postauksella on pakko olla otsikko ja tekstisisältöä, mutta halutessaan siihen voi myös liittää kuvan tai videon.

![Uusi postaus](./screenshots/Uuden%20postauksen%20tekeminen.jpg)

Julkaistu postaus näyttää tältä:

![Postaussivu](./screenshots/Postaussivu.jpg)

Julkaistuun postaukseen voit joko vastata painamalla sivun alaosan Vastaa-näppäintä...

![Vastaaminen](./screenshots/Vastaaminen.jpg)

...tai lisätä ala- tai yläpeukun ilmaistaksesi mieltäsi. Jos muutat mieltäsi, voit joko poistaa peukkusi painamalla samaa peukkua, jonka olet jo valinnut, tai muuttaa sitä painamalla toista peukkua.

![Peukuttaminen](./screenshots/Ylä-%20ja%20alapeukut.jpg)

Jos et ole omaan postaukseesi tyytyväinen, pääset muokkaamaan sitä helposti postauksen oikeassa yläkulmassa olevasta muokkausnäppäimestä. Voit muuttaa otsikkoa, tekstisisältöä tai liitettyä tiedostoa.

![Postauksen muokkaaminen](./screenshots/Oman%20postauksen%20muokkaaminen.jpg)

Tarvittaessa voit myös poistaa oman postauksesi.

![Postauksen poistaminen](./screenshots/Postauksen%20poistaminen.jpg)

Kirjautuneena käyttäjänä voit muokata omaa käyttäjäprofiiliasi klikkaamalla yläpalkkiin ilmestynyttä profiilikuvaketta. Profiilisivullasi pääset lataamaan itsellesi profiilikuvan, kirjoittamaan kuvauksen itsestäsi ja vaihtamaan käyttäjänimesi/sähköpostiosoitteesi tarvittaessa.

![Käyttäjäprofiili](./screenshots/Käyttäjäprofiili.jpg)

Kun vierität sivua vähän alaspäin, löytyy myös näppäimet salasanan vaihtamiselle, tilisi poistamiselle ja uloskirjautumiselle.

![Käyttäjäprofiili-2](./screenshots/Käyttäjäprofiili-2.jpg)

Voit myös tutkia muiden käyttäjien profiileja halutessasi. Pääset tarkastelemaan toisen käyttäjän profiilia klikkaamalla hänen nimeään jossain hänen julkaisemassa postauksessa.

![Toisen käyttäjän profiili](./screenshots/Toisen%20käyttäjän%20profiili.jpg)




## Front end

Sovellus on toteutettu React Nativella.

1. Pura front endin repositorio koneellesi: https://github.com/mannals/takkatuli-rn-client

2. Avaa repositoriot koneellasi, ja muista 'npm install'

3. Lataa kännykällesi Expo Go -sovellus.

4. Avaa front endin kansio IDE:ssäsi, ja suorita terminaalissa komento "npx expo start". Terminaaliin ilmestyy QR-koodi, jonka voit skannata joko Expo Golla jos olet Android-käyttäjä, tai kännykkäsi kameralla jos olet iPhone-käyttäjä.

5. profit

## Back end

Sovelluksen back end perustuu kurssilla opetettuun serveriarkkitehtuuriin. Media-API on toteutettu perinteiseen REST API -tapaan.

## Apidoc

Auth-serverin apidoc on osoitteessa 10.120.32.61:300.
Media-APIn ja upload-serverin apidoc-sivujen näkymisen kanssa ilmeni ongelmia joita en osannut korjata, mutta jos tämän repositorion purkaa koneelleen ja avaa niiden public-kansiosta index.html-tiedoston, näkee niiden API-dokumentaation. 

## Tietokanta 

Tietokannan luontiskriptiä pääsee tarkastelemaan tämän repositorion database-kansiosta. Sen pohjana käytin kurssilla annettua esimerkkitietokantaa, ja lähdin miettimään, mitä tarvitsen omaa sovellustani varten. 

Olin vähällä tehdä postauksille ja niiden vastauksille eri taulut, mutta päädyin lopulta lisäämään Posts-tauluun reply_to-kentän, jonka voi jättää tyhjäksi, jos julkaisee uuden alkuperäisen postauksen, ja joka vastausten tapauksessa viittaa toisen postauksen post_id-kenttään.

Profiilikuville tein erillisen taulun, joka viittaa käyttäjän user_id-kenttään, jotta Users-taulu ei menisi liian pitkäksi ja käyttäjätietoja voisi hakea ensisijaisesti ilman profiilikuvaa.

Jos mulla olisi ollut enenmmän aikaa, olisin laajentanut tietokantaa lisäämällä sinne taulut Polls, PollOptions ja PollOptionVotes. Näitä polleja olisi voinut myös tehdä ja niihin olisi voinut vastata sovelluksessa.

## Bugit ja ongelmat

Bugeja:

- En saanut apidoc-sivua aukeamaan media-apissa tai upload-serverissä. Sivuille kuitenkin pääsee, jos tämän repositorion purkaa koneelleen ja avaa kunkin serverin public-kansion index.html-tiedoston selaimessa.
- Ylä- tai alapeukkuja annettaessa peukutusten määränumerot näppäinten vieressä päivittyvät vähän viiveellä. 

Miten jatkaisin sovellustani:

- geneeristen lankaikonien sijaan laittaisin alakategoriasivun postauslaatikoihin thumbnailin mahdollisesta aloituspostaukseen liitetystä kuvasta.
- lisäisin toiminnallisuuden lisätä tiedostoja myös vastauksiin
- mahdollistaisin myös vastauksiin vastaamisen
- lisäisin administraattorinäkymän, jossa voisi mm. poistaa muiden käyttäjien postauksia, tai bannata käyttäjiä. Jossain kohtaa esim. käyttäjäprofiilissa olisi näppäin, josta voisi joko asettaa itsensä suoraan administraattoriksi, tai pyytää admin-oikeuksia.
- tekisin chat-ominaisuuden.

## Referenssit ja käytetyt kirjastot

Referensseinä olen käyttänyt Hybridisovellukset-kurssin materiaaleja, Monialustaprojekti-kurssin ryhmätyöni koodia, Github Copilotia ja eri käyttämieni kirjastojen dokumentaatioita.

