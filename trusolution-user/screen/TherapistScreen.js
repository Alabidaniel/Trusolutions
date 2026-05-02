import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const filters = ["All", "Anxiety", "Trauma", "Relationships", "Focus"];

const therapists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Stress",
    rating: 4.9,
    sessions: 150,
    nextSlot: "Today, 4:30 PM",
    price: "$45/session",
    availability: "Available now",
    tone: "Calm, practical support",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Depression & Mood",
    rating: 4.8,
    sessions: 200,
    nextSlot: "Tomorrow, 10:00 AM",
    price: "$50/session",
    availability: "Next opening soon",
    tone: "Warm, structured sessions",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Relationship Issues",
    rating: 5.0,
    sessions: 120,
    nextSlot: "Today, 6:00 PM",
    price: "$55/session",
    availability: "Available today",
    tone: "Empathetic communication coach",
  },
  {
    id: "4",
    name: "Dr. David Kim",
    specialty: "Trauma & PTSD",
    rating: 4.7,
    sessions: 180,
    nextSlot: "Tomorrow, 2:15 PM",
    price: "$60/session",
    availability: "Limited slots",
    tone: "Grounding, trauma-informed care",
  },
  {
    id: "5",
    name: "Dr. Lisa Patel",
    specialty: "ADHD & Focus",
    rating: 4.9,
    sessions: 95,
    nextSlot: "Today, 5:15 PM",
    price: "$48/session",
    availability: "Available today",
    tone: "Action-oriented and supportive",
  },
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const TherapistScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredTherapists = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return therapists.filter((therapist) => {
      const matchesSearch =
        !query ||
        therapist.name.toLowerCase().includes(query) ||
        therapist.specialty.toLowerCase().includes(query) ||
        therapist.tone.toLowerCase().includes(query);

      const matchesFilter =
        selectedFilter === "All" ||
        therapist.specialty.toLowerCase().includes(selectedFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  const renderHeader = () => (
    <View>
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#14532D" />
            <Text style={styles.heroBadgeText}>Verified professionals</Text>
          </View>
          <View style={styles.heroMiniStat}>
            <Text style={styles.heroMiniStatValue}>5</Text>
            <Text style={styles.heroMiniStatLabel}>Top matches</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Find support that feels right</Text>
        <Text style={styles.heroSubtitle}>
          Browse trusted therapists by specialty, availability, and fit so it
          feels easier to take the next step.
        </Text>

        <View style={styles.heroMetricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>4.9</Text>
            <Text style={styles.metricLabel}>Avg. rating</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>Today</Text>
            <Text style={styles.metricLabel}>Fastest slot</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>1:1</Text>
            <Text style={styles.metricLabel}>Private sessions</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchPanel}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#7C6757"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, specialty, or care style"
            placeholderTextColor="#8F7B6D"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color="#8F7B6D" />
            </Pressable>
          ) : null}
        </View>

        <FlatList
          data={filters}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
          renderItem={({ item }) => {
            const isActive = item === selectedFilter;

            return (
              <Pressable
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedFilter(item)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <View style={styles.resultsHeader}>
        <View>
          <Text style={styles.sectionTitle}>Recommended therapists</Text>
          <Text style={styles.resultsText}>
            {filteredTherapists.length} match
            {filteredTherapists.length === 1 ? "" : "es"} for you
          </Text>
        </View>
        <View style={styles.resultsPill}>
          <Ionicons name="sparkles" size={14} color="#7A4B2F" />
          <Text style={styles.resultsPillText}>Best fit first</Text>
        </View>
      </View>
    </View>
  );

  const renderTherapist = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.92}
      style={[styles.therapistCard, index === 0 && styles.featuredCard]}
      onPress={() => navigation.navigate("TherapistProfile", { therapist: item })}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
          </View>
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {index === 0 ? (
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>Top match</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <Text style={styles.tone}>{item.tone}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Ionicons name="star" size={14} color="#B7791F" />
          <Text style={styles.metaText}>{item.rating}</Text>
        </View>
        <View style={styles.metaPill}>
          <Ionicons name="people" size={14} color="#7A4B2F" />
          <Text style={styles.metaText}>{item.sessions} sessions</Text>
        </View>
        <View style={styles.metaPill}>
          <Ionicons name="wallet" size={14} color="#7A4B2F" />
          <Text style={styles.metaText}>{item.price}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{item.availability}</Text>
          </View>
          <Text style={styles.nextSlotText}>Next slot: {item.nextSlot}</Text>
        </View>

        <View style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>View profile</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFF9F3" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-circle" size={52} color="#A67C5B" />
      <Text style={styles.emptyTitle}>No therapists match that search</Text>
      <Text style={styles.emptyText}>
        Try a broader specialty or clear the search to explore all available
        professionals.
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => {
          setSearchQuery("");
          setSelectedFilter("All");
        }}
      >
        <Text style={styles.emptyButtonText}>Reset filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find a Therapist</Text>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="options-outline" size={20} color="#3D2B1F" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTherapists}
        keyExtractor={(item) => item.id}
        renderItem={renderTherapist}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 24 + insets.bottom },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6CB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF8EE",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "800",
    color: "#3D2B1F",
  },
  headerAction: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF8EE",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    paddingHorizontal: 18,
  },
  heroCard: {
    backgroundColor: "#7A4B2F",
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E4F3DB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroBadgeText: {
    color: "#14532D",
    fontSize: 12,
    fontWeight: "700",
  },
  heroMiniStat: {
    alignItems: "flex-end",
  },
  heroMiniStatValue: {
    color: "#FFF9F3",
    fontSize: 22,
    fontWeight: "800",
  },
  heroMiniStatLabel: {
    color: "#E8CCBC",
    fontSize: 12,
  },
  heroTitle: {
    color: "#FFF9F3",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    marginBottom: 10,
    maxWidth: "90%",
  },
  heroSubtitle: {
    color: "#F7E2D6",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  heroMetricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#7A4B2F",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  metricValue: {
    color: "#FFF9F3",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  metricLabel: {
    color: "#E7C9B7",
    fontSize: 12,
  },
  searchPanel: {
    backgroundColor: "#F9F1E5",
    borderRadius: 24,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8EE",
    borderRadius: 18,
    paddingHorizontal: 14,
    minHeight: 54,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#3D2B1F",
    fontSize: 15,
  },
  filtersRow: {
    paddingTop: 14,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F0E1CF",
  },
  filterChipActive: {
    backgroundColor: "#7A4B2F",
  },
  filterChipText: {
    color: "#6E5444",
    fontSize: 13,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#FFF9F3",
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 2,
  },
  resultsText: {
    fontSize: 13,
    color: "#8A6A57",
  },
  resultsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F2DDCF",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  resultsPillText: {
    color: "#7A4B2F",
    fontSize: 12,
    fontWeight: "700",
  },
  therapistCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  featuredCard: {
    borderColor: "#D79B71",
    shadowColor: "#7A4B2F",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  avatarWrap: {
    marginRight: 14,
    position: "relative",
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EFD4C2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#7A4B2F",
    fontSize: 20,
    fontWeight: "800",
  },
  onlineDot: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#3FAE5A",
    borderWidth: 2,
    borderColor: "#FFF8EE",
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    color: "#3D2B1F",
  },
  matchBadge: {
    backgroundColor: "#E7F4E1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  matchBadgeText: {
    color: "#256D3C",
    fontSize: 11,
    fontWeight: "700",
  },
  specialty: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7A4B2F",
    marginBottom: 4,
  },
  tone: {
    fontSize: 13,
    lineHeight: 20,
    color: "#8A6A57",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F7EBDD",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
  },
  metaText: {
    color: "#5F4637",
    fontSize: 12,
    fontWeight: "700",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3FAE5A",
    marginRight: 8,
  },
  statusText: {
    color: "#256D3C",
    fontSize: 13,
    fontWeight: "700",
  },
  nextSlotText: {
    color: "#8A6A57",
    fontSize: 12,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#7A4B2F",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
  },
  ctaButtonText: {
    color: "#FFF9F3",
    fontSize: 13,
    fontWeight: "800",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 30,
    backgroundColor: "#FFF8EE",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3D2B1F",
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#8A6A57",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: "#7A4B2F",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyButtonText: {
    color: "#FFF9F3",
    fontWeight: "800",
  },
});

export default TherapistScreen;
