import React, { useState, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Animated, Dimensions, Platform,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  RUNEN_QUIZ_INTRO, RUNEN_QUESTIONS, RunenCategory,
  berechneSchutzrune, KATEGORIE_TO_SETS,
} from "@/lib/quiz-data";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

type Phase = "intro" | "birthdate" | "questions" | "result";

export default function RunenQuizScreen() {
  const colors = useColors();
  const [phase, setPhase] = useState<Phase>("intro");
  const [birthdate, setBirthdate] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<RunenCategory[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeTransition = (cb: () => void) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      cb();
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const handleSelectOption = (category: RunenCategory, optionId: string) => {
    setSelectedOption(optionId);
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      const newAnswers = [...answers, category];
      if (currentQ < RUNEN_QUESTIONS.length - 1) {
        fadeTransition(() => {
          setAnswers(newAnswers);
          setCurrentQ(currentQ + 1);
          setSelectedOption(null);
        });
      } else {
        setAnswers(newAnswers);
        fadeTransition(() => setPhase("result"));
      }
    }, 400);
  };

  const getTopCategory = (): RunenCategory => {
    const counts: Record<string, number> = {};
    answers.forEach((a) => { counts[a] = (counts[a] || 0) + 1; });
    return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as RunenCategory) ?? "liebe";
  };

  const schutzrune = birthdate ? berechneSchutzrune(birthdate) : null;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, flexDirection: "row", alignItems: "center" },
    backBtn: { padding: 8 },
    backText: { fontSize: 24, color: colors.primary },
    progress: { flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2, marginHorizontal: 12 },
    progressFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
    progressText: { fontSize: 12, color: colors.muted },
    scroll: { flex: 1 },
    content: { padding: 24, paddingBottom: 40 },
    runeSymbol: { fontSize: 72, textAlign: "center", marginBottom: 8 },
    title: { fontSize: 28, fontWeight: "700", color: "#3D2B1F", textAlign: "center", marginBottom: 8 },
    subtitle: { fontSize: 16, color: "#C4826A", textAlign: "center", marginBottom: 16, fontStyle: "italic" },
    desc: { fontSize: 15, color: "#9C7B6E", textAlign: "center", lineHeight: 24, marginBottom: 32 },
    primaryBtn: {
      backgroundColor: "#C4826A", borderRadius: 16, paddingVertical: 16,
      paddingHorizontal: 32, alignItems: "center", marginBottom: 12,
    },
    primaryBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
    card: { backgroundColor: "#FFF0EB", borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: "#EDD9D0" },
    questionTitle: { fontSize: 13, color: colors.primary, fontWeight: "600", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
    questionText: { fontSize: 20, fontWeight: "700", color: colors.foreground, lineHeight: 28, marginBottom: 24 },
    option: {
      flexDirection: "row", alignItems: "center", padding: 16,
      borderRadius: 14, borderWidth: 1.5, borderColor: colors.border,
      marginBottom: 10, backgroundColor: colors.surface,
    },
    optionSelected: { borderColor: colors.primary, backgroundColor: colors.primary + "15" },
    optionLetter: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.border, alignItems: "center", justifyContent: "center", marginRight: 12 },
    optionLetterSelected: { backgroundColor: colors.primary },
    optionLetterText: { fontSize: 14, fontWeight: "700", color: colors.muted },
    optionLetterTextSelected: { color: "#fff" },
    optionText: { flex: 1, fontSize: 15, color: colors.foreground, lineHeight: 22 },
    input: {
      borderWidth: 1.5, borderColor: colors.border, borderRadius: 14,
      padding: 16, fontSize: 18, color: colors.foreground,
      backgroundColor: colors.surface, textAlign: "center", marginBottom: 8,
    },
    inputHint: { fontSize: 13, color: colors.muted, textAlign: "center", marginBottom: 24 },
    resultRune: { fontSize: 80, textAlign: "center", marginBottom: 4 },
    resultTitle: { fontSize: 24, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 4 },
    resultSubtitle: { fontSize: 15, color: colors.primary, textAlign: "center", marginBottom: 20, fontStyle: "italic" },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: 12, marginTop: 8 },
    setCard: {
      backgroundColor: colors.surface, borderRadius: 16, padding: 16,
      marginBottom: 10, borderWidth: 1, borderColor: colors.border,
    },
    setName: { fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: 4 },
    setRunes: { fontSize: 22, letterSpacing: 4, color: colors.primary, marginBottom: 4 },
    setWirkung: { fontSize: 13, color: colors.muted, fontStyle: "italic" },
    shopBtn: {
      backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16,
      alignItems: "center", marginTop: 16, marginBottom: 8,
    },
    shopBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
    restartBtn: { alignItems: "center", paddingVertical: 12 },
    restartText: { color: colors.muted, fontSize: 15 },
  });

  if (phase === "intro") {
    return (
      <ScreenContainer>
        <ScrollView style={s.scroll} contentContainerStyle={s.content}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>←</Text>
          </TouchableOpacity>
          <Text style={s.runeSymbol}>ᚱ</Text>
          <Text style={s.title}>{RUNEN_QUIZ_INTRO.title}</Text>
          <Text style={s.subtitle}>{RUNEN_QUIZ_INTRO.subtitle}</Text>
          <Text style={s.desc}>{RUNEN_QUIZ_INTRO.description}</Text>
          <TouchableOpacity style={s.primaryBtn} onPress={() => setPhase("birthdate")}>
            <Text style={s.primaryBtnText}>Quiz starten ✨</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (phase === "birthdate") {
    return (
      <ScreenContainer>
        <ScrollView style={s.scroll} contentContainerStyle={s.content}>
          <TouchableOpacity style={s.backBtn} onPress={() => setPhase("intro")}>
            <Text style={s.backText}>←</Text>
          </TouchableOpacity>
          <Text style={[s.runeSymbol, { marginTop: 20 }]}>✦</Text>
          <Text style={s.title}>Deine Schutzrune</Text>
          <Text style={s.desc}>
            Jede Frau trägt eine persönliche Schutzrune, die anhand ihres Geburtsdatums ermittelt wird. Sie begleitet dich ein Leben lang.
          </Text>
          <TextInput
            style={s.input}
            placeholder="TT.MM.JJJJ"
            placeholderTextColor={colors.muted}
            value={birthdate}
            onChangeText={setBirthdate}
            keyboardType="numeric"
            maxLength={10}
            returnKeyType="done"
          />
          <Text style={s.inputHint}>z. B. 15.03.1990</Text>
          {schutzrune && (
            <View style={[s.card, { alignItems: "center", marginBottom: 24 }]}>
              <Text style={{ fontSize: 48, marginBottom: 8 }}>{schutzrune.symbol}</Text>
              <Text style={[s.title, { fontSize: 20 }]}>{schutzrune.name}</Text>
              <Text style={[s.subtitle, { marginBottom: 8 }]}>{schutzrune.bedeutung}</Text>
              <Text style={[s.desc, { marginBottom: 0, fontSize: 14 }]}>{schutzrune.beschreibung}</Text>
            </View>
          )}
          <TouchableOpacity
            style={[s.primaryBtn, !birthdate && { opacity: 0.5 }]}
            onPress={() => birthdate && setPhase("questions")}
            disabled={!birthdate}
          >
            <Text style={s.primaryBtnText}>Weiter zu den Fragen →</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (phase === "questions") {
    const q = RUNEN_QUESTIONS[currentQ];
    const progress = (currentQ / RUNEN_QUESTIONS.length) * width;
    return (
      <ScreenContainer>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => {
            if (currentQ === 0) { setPhase("birthdate"); } else {
              setAnswers(answers.slice(0, -1));
              setCurrentQ(currentQ - 1);
              setSelectedOption(null);
            }
          }}>
            <Text style={s.backText}>←</Text>
          </TouchableOpacity>
          <View style={s.progress}>
            <View style={[s.progressFill, { width: progress }]} />
          </View>
          <Text style={s.progressText}>{currentQ + 1}/{RUNEN_QUESTIONS.length}</Text>
        </View>
        <Animated.ScrollView style={[s.scroll, { opacity: fadeAnim }]} contentContainerStyle={s.content}>
          <View style={s.card}>
            <Text style={s.questionTitle}>{q.title}</Text>
            <Text style={s.questionText}>{q.question}</Text>
            {q.options.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[s.option, selectedOption === opt.id && s.optionSelected]}
                onPress={() => handleSelectOption(opt.category, opt.id)}
                activeOpacity={0.7}
              >
                <View style={[s.optionLetter, selectedOption === opt.id && s.optionLetterSelected]}>
                  <Text style={[s.optionLetterText, selectedOption === opt.id && s.optionLetterTextSelected]}>{opt.id}</Text>
                </View>
                <Text style={s.optionText}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.ScrollView>
      </ScreenContainer>
    );
  }

  // RESULT
  const topCategory = getTopCategory();
  const katInfo = KATEGORIE_TO_SETS[topCategory];
  const { getSetsByKategorie } = require("@/lib/runen-sets");
  const sets = getSetsByKategorie(topCategory).slice(0, 3);

  return (
    <ScreenContainer>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <Text style={[s.runeSymbol, { marginTop: 8 }]}>{katInfo.emoji}</Text>
        <Text style={s.title}>Dein Runen-Set</Text>
        <Text style={s.subtitle}>{katInfo.label}</Text>

        {schutzrune && (
          <View style={[s.card, { alignItems: "center", marginBottom: 20 }]}>
            <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Deine persönliche Schutzrune</Text>
            <Text style={{ fontSize: 48 }}>{schutzrune.symbol}</Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>{schutzrune.name}</Text>
            <Text style={{ fontSize: 14, color: colors.primary, fontStyle: "italic" }}>{schutzrune.bedeutung}</Text>
          </View>
        )}

        <Text style={s.sectionTitle}>Passende Runen-Sets für dich:</Text>
        {sets.map((set: any) => (
          <TouchableOpacity
            key={set.id}
            style={s.setCard}
            onPress={() => router.push({ pathname: "/runen/set/[id]", params: { id: set.id } } as any)}
            activeOpacity={0.8}
          >
            <Text style={s.setName}>{set.name}</Text>
            <Text style={s.setRunes}>{schutzrune?.symbol ?? "✦"} + {set.runenSymbole[1]} + {set.runenSymbole[2]}</Text>
            <Text style={s.setWirkung}>{set.wirkung}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={s.shopBtn} onPress={() => router.push("/shop" as any)}>
          <Text style={s.shopBtnText}>Alle Sets im Shop ansehen →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.restartBtn} onPress={() => {
          setPhase("intro"); setAnswers([]); setCurrentQ(0); setBirthdate(""); setSelectedOption(null);
        }}>
          <Text style={s.restartText}>Quiz wiederholen</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
