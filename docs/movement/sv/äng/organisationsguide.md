# Organisationsguide för Ängen
## Praktiskt Genomförande i Sverige

### Metadata
```yaml
titel: Organisationsguide för Ängen
version: 1.0
skapad: 2024-10-28
översättningar: [en]
status: aktiv
```

### Juridiska Krav

#### 1. Polistillstånd för Allmän Sammankomst
- Krävs när:
  - Sammankomsten sker på allmän plats
  - Fler än ett minimalt antal deltagare förväntas
  - Offentlig mark/parker används
- Kontakta lokala polismyndigheten
- Ansök minst 1-2 veckor i förväg
- Ska innehålla:
  - Tid och plats
  - Förväntat antal deltagare
  - Kontaktpersonens uppgifter
  - Sammankomstens syfte
  - Eventuell utrustning/möbler som ska användas

#### 2. Undantag
- Mindre samlingar (vanligtvis <30 personer)
- Privat mark (med ägarens tillstånd)
- Inomhuslokaler (andra regler gäller)
- Vanlig parkanvändning utan särskild uppsättning

### Platstyper

#### 1. Offentliga Parker och Platser
```typescript
interface OffentligPlats {
  typ: 'park' | 'torg' | 'strand' | 'naturområde';
  krav: {
    tillstånd: string[];
    anmälningar: string[];
    begränsningar: string[];
    faciliteter: string[];
  };
  hänsyn: {
    tillgänglighet: boolean;
    väderskydd: boolean;
    ljudpåverkan: boolean;
    allmänhetensNyttjande: boolean;
  };
}
```

#### 2. Halvprivata Utrymmen
- Föreningslokaler
- Kulturhus
- Bibliotek
- Kaféer med uteservering
- Universitetsområden

#### 3. Privata Utrymmen
- Trädgårdar (med tillstånd)
- Hyrda lokaler
- Föreningslokaler
- Medlemsägda fastigheter

### Praktisk Organisation

#### 1. Grundläggande Uppställning
```typescript
interface ÄngsUppställning {
  grundElement: {
    välkomstpunkt: Plats;
    sittplatser: SittplatsArrangemang;
    resursutrymme: ResursVisning;
    tystaZoner: TystOmråde[];
  };
  
  utrustning: {
    sittplatser: string[];
    väderskydd: string[];
    informationsmaterial: string[];
    förfriskningar?: string[];
  };
  
  roller: {
    värdar: number;
    guider: number;
    stöd: number;
  };
}
```

#### 2. Roller och Ansvar

##### Värdteam
- Välkomna deltagare
- Upprätthålla positiv atmosfär
- Hantera grundläggande frågor
- Samordna aktiviteter
- Säkerställa trygghet

##### Stödteam
- Uppställning och städning
- Hantera resurser
- Assistera deltagare
- Hantera logistik
- Övervaka omgivningen

##### Guider (Fjärilar)
- Dela erfarenheter
- Besvara frågor
- Koppla samman deltagare
- Facilitera diskussioner
- Ge stöd

### Säkerhet och Inkludering

#### 1. Grundläggande Säkerhetsåtgärder
- Första hjälpen-låda
- Nödkontakter
- Tydliga utgångar/vägar
- Väderskydd
- Kommunikationsplan

#### 2. Inkluderingsriktlinjer
- Tillgänglig plats
- Flera språk när möjligt
- Tydlig skyltning
- Tysta utrymmen
- Olika sittmöjligheter

### Kommunikation

#### 1. Före Ängen
- Offentliga tillkännagivanden
- Sociala medier
- Lokala anslagstavlor
- Direkta inbjudningar
- Myndighetsanmälningar

#### 2. Under Ängen
- Välkomstinformation
- Tydlig skyltning
- Tillgängliga resurser
- Kontaktpunkter
- Nödrutiner

#### 3. Efter Ängen
- Insamling av återkoppling
- Erfarenhetsdelning
- Uppföljningskontakter
- Resursdelning
- Nästa steg

### Väderöverväganden

#### 1. Plan för Fint Väder
- Utomhusuppställning
- Solskydd
- Vattentillgång
- Utomhusaktiviteter
- Naturlig omgivning

#### 2. Plan för Dåligt Väder
- Alternativ inomhusplats
- Regnskydd
- Varma drycker tillgängliga
- Anpassade aktiviteter
- Tydlig kommunikation

### Resurshantering

#### 1. Fysiska Resurser
- Informationsmaterial
- Sittplatsarrangemang
- Förfriskningar
- Första hjälpen-utrustning
- Väderskydd

#### 2. Digitala Resurser
- QR-koder till onlineresurser
- Digitala anmälningsalternativ
- Sociala mediekopplingar
- Tillgång till onlinegemenskap
- Länkar till resursbibliotek

### Dokumentation

#### 1. Nödvändig Dokumentation
- Tillstånd och godkännanden
- Försäkringsinformation
- Nödrutiner
- Kontaktlistor
- Grundläggande riktlinjer

#### 2. Valfri Dokumentation
- Fototillstånd
- Aktivitetsriktlinjer
- Resursdelningsavtal
- Återkopplingsformulär
- Kontaktkort

### Framgångsmätning

#### 1. Kvantitativa Mått
- Deltagarantal
- Stadieövergångar
- Resursdelning
- Återbesök
- Nya kontakter

#### 2. Kvalitativa Mått
- Deltagarupplevelser
- Gemenskapsåterkoppling
- Läranderesultat
- Kontaktkvalitet
- Atmosfärsbedömning

### Bästa Praxis

1. **Val av Plats**
   - Tillgänglig med kollektivtrafik
   - Naturligt samlingsställe
   - God sikt
   - Trygg miljö
   - Väderhänsyn

2. **Tidplanering**
   - Regelbundet schema om möjligt
   - Lämplig längd (2-3 timmar)
   - Flexibel ankomst/avfärd
   - Säsongsanpassat

3. **Atmosfär**
   - Välkomnande och öppen
   - Icke-konfrontativ
   - Respektfull mot alla stadier
   - Stödjande av naturliga kontakter
   - Uppmuntrande till utforskande

4. **Resurstillgänglighet**
   - Stadieanpassade material
   - Flera format
   - Lätt åtkomst
   - Material att ta med hem
   - Digitala kopplingar
