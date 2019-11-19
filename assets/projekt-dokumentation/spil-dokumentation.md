# **Pseudokode** Enarmet Tyveknægt spil logik

```
opret "mønter" variabel der får sit indhold fra input felt der fungere som møntIndkast

opret en Json data variabel af objekter med image, value og rarity.

for hver objekt i Json data variablen
	tilføj et objekt til temp object array variabel det antal gange som rarity propertien's tal er

shuffle objekter i temp object variabel.

opret Ruller array med 3 tomme arrays i.

for hver gang I er mindre end 5
	skub hvert objekt i Temp object array til index 0 i Ruller arrayet

for hver gang I er mindre end 5
	skub hvert objekt i Temp object array til index 1 i Ruller arrayet

for hver gang I er mindre end 5
	skub hvert objekt i Temp object array til index 2 i Ruller arrayet

for hvert objekt der er i Ruller arrayets Index 0
	lav et billede element

for hvert objekt der er i Ruller arrayets Index 1
	lav et billede element

for hvert objekt der er i Ruller arrayets Index 2
	lav et billede element

opret reference til element der viser antal mønter

opret reference til element der viser om du vandt eller tabte

Eventlistener click på knap der starter maskinen

er "mønter" variablens værdi over 10?
hvis ja:
træk 10 fra "mønter" variablen

	find højde for elementet figur

	udregn tilfældigt tal ved hjælp af math random mellem 0 og temp object længde + forskydning for rulle1

	udregn tilfældigt tal ved hjælp af math random mellem 0 og temp object længde + forskydning for rulle2

	udregn tilfældigt tal ved hjælp af math random mellem 0 og temp object længde + forskydning for rulle3

	brug margin til at skubbe rulle elementerne så det ligner at de drejer omkring X aksen så det fremstår som om at den ruller enten op eller ned.

	lyt på når rulle 3 stopper med at rulle.
	er de 3 tilfældigt valgte billeder ens?
	sammenlign rulle index med Math random + forskydning
	hvis ja:
		tilføj vundet gevinst til "mønter" variablen baseret på valuen af valgte objekt
		udskriv vundet gevinst baseret på valuen af valgte objekt

	ellers:
		udskriv ingen gevinst
		

ellers:
vis fejlbesked om for lav eller ingen sum indkastet
```

# **Pseudokode** Enarmet Tyveknægt Præsentations logik

```
opret reference til gevinst værdi container element.

for hver figur i mit Json object.
	udskriv figuren og dens værdi.



opret reference til rulle content wrapper element.

definer højde og bredde på rulle content wrapper element.

opret reference til rulle element 1, 2 og 3

opret reference til rulle-overflowing element.

definer højde på rulle-overflowing element som 1/3 af rulle content wrapper element, gange antal billede elementer på rullen.

for hver objekt i en rulle
	opret et billede element

giv enkelt billede element 1/3 af containerens højde.


```

