import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";

const C = { bg:"#FDF8F4",card:"#FFFFFF",rose:"#C4826A",roseLight:"#F9EDE8",gold:"#C9A96E",goldLight:"#FAF3E7",brown:"#5C3317",brownMid:"#8B5E3C",muted:"#A08070",border:"#EDD9D0" };

const MONDPHASEN = [
  { name:"Neumond",symbol:"🌑",energie:"Neubeginn",ritual:"Setze neue Intentionen. Schreibe 3 Wünsche auf Papier und vergrabe es in der Erde.",heilstein:"Obsidian",raeucherwerk:"Weihrauch",affirmation:"Ich öffne mich für neue Möglichkeiten." },
  { name:"Zunehmende Sichel",symbol:"🌒",energie:"Aufbau",ritual:"Pflanze einen Samen – buchstäblich oder symbolisch. Gieße ihn täglich mit Intention.",heilstein:"Mondstein",raeucherwerk:"Rosenblüten",affirmation:"Ich wachse mit jedem Tag." },
  { name:"Erstes Viertel",symbol:"🌓",energie:"Handeln",ritual:"Schreibe 3 konkrete Schritte für dein Ziel. Handle heute noch bei einem davon.",heilstein:"Tigerauge",raeucherwerk:"Zimt",affirmation:"Ich handle mit Mut und Klarheit." },
  { name:"Zunehmender Mond",symbol:"🌔",energie:"Manifestation",ritual:"Visualisiere dein Ziel 10 Minuten lang. Spüre wie es sich anfühlt, es bereits zu haben.",heilstein:"Citrin",raeucherwerk:"Orangenschale",affirmation:"Meine Wünsche manifestieren sich jetzt." },
  { name:"Vollmond",symbol:"🌕",energie:"Fülle & Loslassen",ritual:"Lege deine Kristalle ins Mondlicht. Schreibe was du loslassen möchtest und verbrenne es.",heilstein:"Bergkristall",raeucherwerk:"Salbei",affirmation:"Ich lasse los was mich nicht mehr dient." },
  { name:"Abnehmender Mond",symbol:"🌖",energie:"Reflexion",ritual:"Führe ein Dankbarkeits-Journal. Schreibe 5 Dinge für die du heute dankbar bist.",heilstein:"Amethyst",raeucherwerk:"Lavendel",affirmation:"Ich bin dankbar für alles in meinem Leben." },
  { name:"Letztes Viertel",symbol:"🌗",energie:"Reinigung",ritual:"Räuchere dein Zuhause mit Salbei. Öffne alle Fenster und bitte um Reinigung.",heilstein:"Schwarzer Turmalin",raeucherwerk:"Palo Santo",affirmation:"Ich reinige meinen Raum und meinen Geist." },
  { name:"Abnehmende Sichel",symbol:"🌘",energie:"Ruhe & Einkehr",ritual:"Nimm ein Salzbad. Gib Meersalz und Lavendelöl ins Wasser. Lass alles los.",heilstein:"Rosenquarz",raeucherwerk:"Lavendel",affirmation:"Ich ruhe in mir selbst." },
];

const RITUALE = [
  { id:"1",titel:"Morgenritual für Klarheit",kategorie:"Morgen",dauer:"15 Min",emoji:"☀️",beschreibung:"Beginne deinen Tag mit Intention. Entzünde eine Kerze, atme 3x tief durch und setze deine Intention für den Tag.",tags:["Morgen","Klarheit","Intention"] },
  { id:"2",titel:"Vollmond-Reinigungsritual",kategorie:"Vollmond",dauer:"30 Min",emoji:"🌕",beschreibung:"Lege alle deine Kristalle ins Mondlicht. Schreibe auf Papier was du loslassen möchtest und verbrenne es.",tags:["Vollmond","Loslassen","Reinigung"] },
  { id:"3",titel:"Neumond-Intentions-Ritual",kategorie:"Neumond",dauer:"20 Min",emoji:"🌑",beschreibung:"Der Neumond ist die kraftvollste Zeit für neue Anfänge. Schreibe 3 Wünsche auf und lege sie unter eine schwarze Kerze.",tags:["Neumond","Intention","Manifestation"] },
  { id:"4",titel:"Aura-Reinigung mit Räucherwerk",kategorie:"Schutz",dauer:"10 Min",emoji:"🌿",beschreibung:"Räuchere deinen Körper von unten nach oben mit Palo Santo oder Salbei. Visualisiere goldenes Licht das dich umhüllt.",tags:["Schutz","Reinigung","Aura"] },
  { id:"5",titel:"Heilstein-Meditation",kategorie:"Meditation",dauer:"20 Min",emoji:"💎",beschreibung:"Lege dich hin und platziere Kristalle auf deinen Chakren. Atme tief und spüre die Energie der Steine.",tags:["Meditation","Heilsteine","Chakren"] },
  { id:"6",titel:"Dankbarkeits-Ritual am Abend",kategorie:"Abend",dauer:"10 Min",emoji:"🕯️",beschreibung:"Zünde eine Kerze an und schreibe 5 Dinge auf für die du heute dankbar bist. Sprich sie laut aus.",tags:["Abend","Dankbarkeit","Reflexion"] },
  { id:"7",titel:"Salzbad zur Energiereinigung",kategorie:"Reinigung",dauer:"30 Min",emoji:"🛁",beschreibung:"Fülle die Wanne mit warmem Wasser, gib Meersalz, Lavendelöl und Rosenblüten hinzu. Lass alles Negative sich auflösen.",tags:["Reinigung","Entspannung","Energie"] },
  { id:"8",titel:"Schutzritual für dein Zuhause",kategorie:"Schutz",dauer:"20 Min",emoji:"🏠",beschreibung:"Gehe durch alle Räume mit brennendem Salbei. Platziere schwarzen Turmalin an der Eingangstür.",tags:["Schutz","Zuhause","Reinigung"] },
];

const FILTER = ["Alle","Morgen","Abend","Vollmond","Neumond","Schutz","Meditation","Reinigung"];

export default function RitualeScreen() {
  const [aktiveFilter, setAktiveFilter] = useState("Alle");
  const [aktiveMond, setAktiveMond] = useState<typeof MONDPHASEN[0]|null>(null);
  const gefiltert = aktiveFilter==="Alle" ? RITUALE : RITUALE.filter(r=>r.tags.includes(aktiveFilter));
  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{flex:1,backgroundColor:C.bg}} showsVerticalScrollIndicator={false}>
        <View style={{backgroundColor:C.roseLight,padding:20,paddingTop:24}}>
          <Text style={{fontSize:26,fontWeight:"700",color:C.brown}}>Rituale & Mondenergie</Text>
          <Text style={{fontSize:14,color:C.muted,marginTop:4}}>Heilige Handlungen für deine Seele</Text>
        </View>
        <Text style={s.sec}>🌙 Mondphasen-Rituale</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16,gap:10,paddingBottom:4}}>
          {MONDPHASEN.map(p=>(
            <TouchableOpacity key={p.name} style={[s.mCard,aktiveMond?.name===p.name&&{borderColor:C.rose,backgroundColor:C.roseLight}]} onPress={()=>setAktiveMond(aktiveMond?.name===p.name?null:p)} activeOpacity={0.85}>
              <Text style={{fontSize:28,marginBottom:4}}>{p.symbol}</Text>
              <Text style={{fontSize:10,fontWeight:"700",color:C.brown,textAlign:"center",marginBottom:2}}>{p.name}</Text>
              <Text style={{fontSize:9,color:C.muted,textAlign:"center"}}>{p.energie}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {aktiveMond&&(
          <View style={{marginHorizontal:16,marginTop:12,backgroundColor:C.card,borderRadius:20,padding:20,borderWidth:1,borderColor:C.border}}>
            <Text style={{fontSize:20,fontWeight:"700",color:C.brown,marginBottom:4}}>{aktiveMond.symbol} {aktiveMond.name}</Text>
            <Text style={{fontSize:13,color:C.gold,fontWeight:"600",marginBottom:12}}>Energie: {aktiveMond.energie}</Text>
            <Text style={{fontSize:13,fontWeight:"700",color:C.brown,marginBottom:6}}>🕯️ Ritual</Text>
            <Text style={{fontSize:14,color:C.brownMid,lineHeight:22,marginBottom:12}}>{aktiveMond.ritual}</Text>
            <View style={{flexDirection:"row",gap:10,marginBottom:12}}>
              <View style={{flex:1,backgroundColor:C.goldLight,borderRadius:12,padding:12}}>
                <Text style={{fontSize:11,color:C.gold,fontWeight:"700",marginBottom:3}}>💎 Heilstein</Text>
                <Text style={{fontSize:14,color:C.brown,fontWeight:"600"}}>{aktiveMond.heilstein}</Text>
              </View>
              <View style={{flex:1,backgroundColor:C.goldLight,borderRadius:12,padding:12}}>
                <Text style={{fontSize:11,color:C.gold,fontWeight:"700",marginBottom:3}}>🌿 Räucherwerk</Text>
                <Text style={{fontSize:14,color:C.brown,fontWeight:"600"}}>{aktiveMond.raeucherwerk}</Text>
              </View>
            </View>
            <View style={{backgroundColor:C.roseLight,borderRadius:12,padding:14,marginBottom:12}}>
              <Text style={{fontSize:14,color:C.brown,fontStyle:"italic",textAlign:"center",lineHeight:20}}>"{aktiveMond.affirmation}"</Text>
            </View>
            <TouchableOpacity style={{backgroundColor:C.gold,borderRadius:12,paddingVertical:12,alignItems:"center"}} onPress={()=>router.push("/shop" as any)} activeOpacity={0.85}>
              <Text style={{color:"#FFF",fontSize:14,fontWeight:"700"}}>🛍️ Passende Produkte im Shop</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={{marginHorizontal:16,marginTop:16,backgroundColor:C.brown,borderRadius:16,padding:16,flexDirection:"row",alignItems:"center"}} onPress={()=>router.push("/(tabs)/runen" as any)} activeOpacity={0.85}>
          <Text style={{fontSize:32,color:C.gold,marginRight:14}}>ᚱ</Text>
          <View style={{flex:1}}>
            <Text style={{fontSize:16,fontWeight:"700",color:"#FFF",marginBottom:3}}>Deine Schutzrune</Text>
            <Text style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>Berechne deine persönliche Runenenergie →</Text>
          </View>
        </TouchableOpacity>
        <Text style={s.sec}>🕯️ Alle Rituale</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16,gap:8,paddingBottom:4}}>
          {FILTER.map(f=>(
            <TouchableOpacity key={f} style={[s.fBtn,aktiveFilter===f&&{backgroundColor:C.rose,borderColor:C.rose}]} onPress={()=>setAktiveFilter(f)} activeOpacity={0.8}>
              <Text style={[{fontSize:13,color:C.muted,fontWeight:"600"},aktiveFilter===f&&{color:"#FFF"}]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {gefiltert.map(r=>(
          <TouchableOpacity key={r.id} style={s.rCard} onPress={()=>router.push(`/content/${r.id}` as any)} activeOpacity={0.85}>
            <View style={{flexDirection:"row",alignItems:"flex-start",marginBottom:8}}>
              <Text style={{fontSize:26,marginRight:12,marginTop:2}}>{r.emoji}</Text>
              <View style={{flex:1}}>
                <Text style={{fontSize:11,color:C.muted,fontWeight:"600",marginBottom:2}}>{r.kategorie} · {r.dauer}</Text>
                <Text style={{fontSize:16,fontWeight:"700",color:C.brown}}>{r.titel}</Text>
              </View>
            </View>
            <Text style={{fontSize:13,color:C.brownMid,lineHeight:19,marginBottom:8}} numberOfLines={2}>{r.beschreibung}</Text>
            <View style={{flexDirection:"row",flexWrap:"wrap",gap:6}}>
              {r.tags.map(t=><View key={t} style={{backgroundColor:C.roseLight,borderRadius:8,paddingHorizontal:8,paddingVertical:3}}><Text style={{fontSize:11,color:C.rose,fontWeight:"600"}}>{t}</Text></View>)}
            </View>
          </TouchableOpacity>
        ))}
        <View style={{height:32}}/>
      </ScrollView>
    </ScreenContainer>
  );
}
const s = StyleSheet.create({
  sec:{fontSize:17,fontWeight:"700",color:C.brown,marginHorizontal:16,marginTop:20,marginBottom:10},
  mCard:{backgroundColor:C.card,borderRadius:16,padding:12,alignItems:"center",width:100,borderWidth:1.5,borderColor:C.border},
  fBtn:{paddingHorizontal:14,paddingVertical:7,borderRadius:20,backgroundColor:C.card,borderWidth:1,borderColor:C.border},
  rCard:{marginHorizontal:16,marginBottom:12,backgroundColor:C.card,borderRadius:18,padding:16,borderWidth:1,borderColor:C.border},
});
