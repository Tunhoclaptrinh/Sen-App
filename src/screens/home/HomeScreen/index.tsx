import React, {useCallback, useEffect, useState} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {fetchHeritageSites} from "@/src/store/slices/heritageSlice";
import {getImageUrl} from "@/src/utils/formatters";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/src/styles/colors";
import Input from "@/src/components/common/Input/Input";
import SearchBar from "@/src/components/common/SearchBar";
import EmptyState from "@/src/components/common/EmptyState/EmptyState";
import { HeritageSite } from "@/src/types/heritage.types";
import { ROUTE_NAMES } from "@/src/config/routes.config";

const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch<any>();
  const {items, loading, error} = useSelector((state: RootState) => state.heritage);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const loadData = async () => {
    try {
      await dispatch(fetchHeritageSites({}));
    } catch (err) {
      console.error(err);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [dispatch]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement search logic here or in slice
  };

  const filteredItems = items.filter((site) =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({item}: {item: HeritageSite}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate(ROUTE_NAMES.HOME.HERITAGE_DETAIL, {id: item.id})}
    >
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image source={{uri: getImageUrl(item.images[0])}} style={styles.image} resizeMode="cover" />
        ) : (
             <View style={[styles.image, styles.placeholder]}>
                <Ionicons name="image-outline" size={48} color={COLORS.GRAY} />
             </View>
        )}
        <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category || "Di tích"}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={COLORS.GRAY} />
          <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
            <Text style={styles.headerTitle}>Khám Phá Di Sản</Text>
            <Text style={styles.headerSubtitle}>Tìm hiểu văn hóa & lịch sử Việt Nam</Text>
        </View>
         <TouchableOpacity 
            style={styles.iconBtn}
            onPress={() => navigation.navigate(ROUTE_NAMES.COMMON.NOTIFICATIONS)}
         >
            <Ionicons name="notifications-outline" size={24} color={COLORS.PRIMARY} />
         </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Tìm kiếm di sản, địa điểm..."
        />
      </View>

      {loading && !refreshing && items.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading || refreshing} onRefresh={onRefresh} colors={[COLORS.PRIMARY]} />
          }
          ListEmptyComponent={
            <EmptyState 
                icon="search" 
                title="Không tìm thấy di sản" 
                subtitle="Thử tìm kiếm với từ khóa khác" 
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.DARK,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginTop: 4,
  },
  iconBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: '#FFF0F0',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Space for tab bar
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
      height: 180,
      backgroundColor: '#EEE',
      position: 'relative',
  },
  image: {
      width: '100%',
      height: '100%',
  },
  placeholder: {
      justifyContent: 'center',
      alignItems: 'center',
  },
  categoryBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
  },
  categoryText: {
      color: COLORS.WHITE,
      fontSize: 12,
      fontWeight: '600',
  },
  cardContent: {
      padding: 16,
  },
  title: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.DARK,
      marginBottom: 6,
  },
  locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
  },
  locationText: {
      fontSize: 13,
      color: COLORS.GRAY,
      marginLeft: 4,
      flex: 1,
  },
  description: {
      fontSize: 14,
      color: COLORS.DARK_GRAY,
      lineHeight: 20,
  },
});

export default HomeScreen;
