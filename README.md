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

1. Pura tämä repositorio sekä front endin repositorio koneellesi: https://github.com/mannals/takkatuli-rn-client

2. Avaa repositoriot koneellasi, ja muista 'npm install'

3. Lataa kännykällesi Expo Go -sovellus.

4. Back endin kansiossa

5. Avaa front endin kansio IDE:ssäsi, ja suorita terminaalissa komento "npx expo start". Terminaaliin ilmestyy QR-koodi, jonka voit skannata joko Expo Golla jos olet Android-käyttäjä, tai kännykkäsi kameralla jos olet iPhone-käyttäjä.

6. profit

## Back end

On tämä repositorio.

## Apidoc

## Tietokanta 

## Bugit ja ongelmat

Tämä sovellus täytyi pistää purkkiin jossain vaiheessa enkä voinut jatkaa tätä loputtomiin. Jos minulla olisi kaikki aika käytettävissä tähän, tekisin tällaisia muutoksia:

- geneeristen lankaikonien sijaan laittaisin alakategoriasivun postauslaatikoihin thumbnailin mahdollisesta aloituspostaukseen liitetystä kuvasta.
- lisäisin toiminnallisuuden lisätä tiedostoja myös vastauksiin
- mahdollistaisin myös vastauksiin vastaamisen
- lisäisin administraattorinäkymän, jossa voisi mm. poistaa muiden käyttäjien postauksia, tai bannata käyttäjiä. Jossain kohtaa esim. käyttäjäprofiilissa olisi näppäin, josta voisi joko asettaa itsensä suoraan administraattoriksi, tai pyytää admin-oikeuksia.
- tekisin chat-ominaisuuden.

## Referenssit ja käytetyt kirjastot

Referensseinä olen käyttänyt Hybridisovellukset-kurssin materiaaleja, Monikanavajulkaiseminen-kurssin ryhmätyöni koodia, Github Copilotia ja eri käyttämieni kirjastojen dokumentaatioita.

