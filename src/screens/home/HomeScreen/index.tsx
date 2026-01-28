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
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {fetchHeritageSites, fetchAllArtifacts, fetchHistory} from "@/src/store/slices/heritageSlice";
import {getImageUrl} from "@/src/utils/formatters";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/src/styles/colors";
import Input from "@/src/components/common/Input/Input";
import SearchBar from "@/src/components/common/SearchBar";
import EmptyState from "@/src/components/common/EmptyState/EmptyState";
import { HeritageSite } from "@/src/types/heritage.types";
import { ROUTE_NAMES } from "@/src/config/routes.config";
import { useAuth } from "@/src/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: 'grid-outline' },
  { id: 'Di tích', name: 'Di tích', icon: 'business-outline' },
  { id: 'Hiện vật', name: 'Hiện vật', icon: 'cube-outline' },
  { id: 'Bài viết', name: 'Bài viết', icon: 'newspaper-outline' },
  { id: 'Lễ hội', name: 'Lễ hội', icon: 'flag-outline' },
  { id: 'Bảo tàng', name: 'Bảo tàng', icon: 'library-outline' },
];

const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch<any>();
  const {user} = useAuth();
  const {items, filteredArtifacts = [], historyArticles = [], loading, error} = useSelector((state: RootState) => state.heritage);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadData();
  }, [dispatch]);

  // Fetch data when category changes
  useEffect(() => {
      if (selectedCategory === 'Hiện vật' && filteredArtifacts.length === 0) {
          dispatch(fetchAllArtifacts({}));
      } else if (selectedCategory === 'Bài viết' && historyArticles.length === 0) {
          dispatch(fetchHistory({}));
      }
  }, [selectedCategory, dispatch, filteredArtifacts, historyArticles]);

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
    // Refresh specific category data
    if (selectedCategory === 'Hiện vật') dispatch(fetchAllArtifacts({}));
    if (selectedCategory === 'Bài viết') dispatch(fetchHistory({}));
    
    setRefreshing(false);
  }, [dispatch, selectedCategory]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Filter items
  const filteredItems = items.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = false;
    if (selectedCategory === 'all') {
        matchesCategory = true;
    } else if (selectedCategory === 'Di tích') {
        matchesCategory = ['historic_building', 'monument', 'archaeological_site'].includes(site.type);
    } else if (selectedCategory === 'Bảo tàng') {
        matchesCategory = site.type === 'museum';
    } else if (selectedCategory === 'Lễ hội') {
         matchesCategory = site.type === 'festival';
    } 
    // Note: Hiện vật (Artifacts) and Bài viết (Articles) are handled separately
    else if (selectedCategory === 'Hiện vật' || selectedCategory === 'Bài viết') {
        return false; 
    } else {
        // Fallback to string match if category field exists
        matchesCategory = site.category?.includes(selectedCategory);
    }

    return matchesSearch && matchesCategory;
  });

  // Featured items (Mock logic: first 3 items or those with images)
  const featuredItems = items.slice(0, 5);

  const renderCategoryItem = ({item}: any) => (
      <TouchableOpacity 
        style={[styles.categoryItem, selectedCategory === item.id && styles.categoryItemActive]}
        onPress={() => setSelectedCategory(item.id)}
      >
          <View style={[styles.categoryIcon, selectedCategory === item.id && styles.categoryIconActive]}>
             <Ionicons name={item.icon} size={20} color={selectedCategory === item.id ? COLORS.WHITE : COLORS.PRIMARY} />
          </View>
          <Text style={[styles.categoryText, selectedCategory === item.id && styles.categoryTextActive]}>{item.name}</Text>
      </TouchableOpacity>
  );

  const renderFeaturedItem = ({item}: {item: HeritageSite}) => (
    <TouchableOpacity
      style={styles.featuredCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate(ROUTE_NAMES.HOME.HERITAGE_DETAIL, {id: item.id})}
    >
      <Image 
        source={{uri: getImageUrl(item.image)}} 
        style={styles.featuredImage} 
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}
      >
          <Text style={styles.featuredTitle} numberOfLines={1}>{item.name}</Text>
          <View style={styles.featuredLocation}>
             <Ionicons name="location" size={12} color={COLORS.WHITE} />
             <Text style={styles.featuredLocationText} numberOfLines={1}>{item.address || item.location}</Text>
          </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderArticleItem = (item: any) => (
      <TouchableOpacity 
        key={item.id}
        style={[styles.card, {marginBottom: 16}]}
        onPress={() => Alert.alert("Thông báo", "Chi tiết bài viết đang được phát triển")}
      >
         <View style={styles.imageContainer}>
             {/* Use conditional image source for articles from API vs backend */}
             <Image 
                source={{uri: item.image ? getImageUrl(item.image) : "https://via.placeholder.com/300"}} 
                style={styles.image} 
                resizeMode="cover" 
             />
             <View style={[styles.categoryBadge, { backgroundColor: '#E0F7FA' }]}>
                 <Text style={[styles.categoryBadgeText, { color: '#006064' }]}>{item.category || "Bài viết"}</Text>
             </View>
         </View>
         <View style={styles.cardContent}>
             <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
             <Text style={{color: COLORS.GRAY, fontSize: 12, marginTop: 4}} numberOfLines={2}>{item.description}</Text>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
                 <Text style={{fontSize: 11, color: COLORS.PRIMARY, fontWeight: '600'}}>{item.year}</Text>
                 <Text style={{fontSize: 11, color: COLORS.DARK_GRAY}}>{item.period || ""}</Text>
             </View>
         </View>
      </TouchableOpacity>
  );

  const renderRecommendationItem = ({item}: {item: HeritageSite}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate(ROUTE_NAMES.HOME.HERITAGE_DETAIL, {id: item.id})}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{uri: getImageUrl(item.image)}} style={styles.image} resizeMode="cover" />
        ) : (
             <View style={[styles.image, styles.placeholder]}>
                <Ionicons name="image-outline" size={48} color={COLORS.GRAY} />
             </View>
        )}
        <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category || "Di tích"}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
            <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
            <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
            </View>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={COLORS.GRAY} />
          <Text style={styles.locationText} numberOfLines={1}>{item.address || item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
            <Text style={styles.greeting}>Xin chào, {user?.fullName?.split(" ").pop() || "Bạn"}</Text>
            <Text style={styles.headerTitle}>Khám Phá Di Sản</Text>
        </View>
         <TouchableOpacity 
            style={styles.iconBtn}
            onPress={() => navigation.navigate(ROUTE_NAMES.COMMON.NOTIFICATIONS)}
         >
            <Ionicons name="notifications-outline" size={24} color={COLORS.PRIMARY} />
            <View style={styles.badge} />
         </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Tìm kiếm di sản, địa điểm..."
        />
      </View>

      <ScrollView 
         showsVerticalScrollIndicator={false}
         refreshControl={
            <RefreshControl refreshing={loading || refreshing} onRefresh={onRefresh} colors={[COLORS.PRIMARY]} />
         }
         contentContainerStyle={{paddingBottom: 20}}
      >
          {/* Categories */}
          <View style={styles.sectionHeader}>
             <FlatList 
                data={CATEGORIES}
                renderItem={renderCategoryItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
             />
          </View>

          {loading && !refreshing && items.length === 0 ? (
             <View style={styles.center}>
               <ActivityIndicator size="large" color={COLORS.PRIMARY} />
             </View>
          ) : (
             <>
                 {/* Featured Section */}
                 {searchQuery === "" && selectedCategory === 'all' && (
                     <View style={styles.section}>
                        <View style={styles.sectionTitleRow}>
                            <Text style={styles.sectionTitle}>Nổi bật</Text>
                            <TouchableOpacity><Text style={styles.seeAllText}>Xem tất cả</Text></TouchableOpacity>
                        </View>
                        <FlatList 
                            data={featuredItems}
                            renderItem={renderFeaturedItem}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.featuredList}
                            snapToInterval={width * 0.75 + 16}
                            decelerationRate="fast"
                        />
                     </View>
                 )}

                 {/* Recommendations / Main List */}
                 {/* Recommendations / Main List */}
                 <View style={styles.section}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionTitle}>
                            {searchQuery ? "Kết quả tìm kiếm" : 
                             (selectedCategory === 'Hiện vật' ? "Kho tàng Hiện vật" : 
                             (selectedCategory === 'Bài viết' ? "Bài viết & Tin tức" : "Gợi ý cho bạn"))}
                        </Text>
                    </View>
                    
                    {selectedCategory === 'Bài viết' ? (
                        <View style={styles.listContent}>
                           {historyArticles && historyArticles.length > 0 ? historyArticles.map(renderArticleItem) : (
                                <EmptyState 
                                    icon="newspaper-outline" 
                                    title="Chưa có bài viết" 
                                    subtitle="Đang cập nhật dữ liệu..." 
                                />
                           )}
                        </View>
                    ) : selectedCategory === 'Hiện vật' ? (
                        // ARTIFACTS LIST
                        filteredArtifacts.length === 0 ? (
                            <EmptyState 
                                icon="cube-outline" 
                                title="Chưa có hiện vật" 
                                subtitle="Đang cập nhật dữ liệu..." 
                            />
                        ) : (
                            <View style={styles.listContent}>
                                {filteredArtifacts.map((item: any) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.card, { marginBottom: 16 }]}
                                        activeOpacity={0.9}
                                        onPress={() => navigation.navigate(ROUTE_NAMES.HOME.ARTIFACT_DETAIL, {artifact: item})}
                                    >
                                        <View style={styles.imageContainer}>
                                            {item.image ? (
                                                <Image source={{uri: getImageUrl(item.image)}} style={styles.image} resizeMode="cover" />
                                            ) : (
                                                <View style={[styles.image, styles.placeholder]}>
                                                    <Ionicons name="image-outline" size={48} color={COLORS.GRAY} />
                                                </View>
                                            )}
                                            <View style={[styles.categoryBadge, { backgroundColor: '#FFF3E0' }]}>
                                                <Text style={[styles.categoryBadgeText, { color: '#E65100' }]}>Hiện vật</Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardContent}>
                                            <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                                            <View style={styles.locationRow}>
                                                <Ionicons name="location-outline" size={14} color={COLORS.GRAY} />
                                                <Text style={styles.locationText} numberOfLines={1}>
                                                    {item.location_in_site || item.location || "Đang cập nhật"}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )
                    ) : (
                        // HERITAGE SITES LIST
                        filteredItems.length === 0 ? (
                            <EmptyState 
                                icon="search" 
                                title="Không tìm thấy di sản" 
                                subtitle="Thử tìm kiếm với từ khóa khác" 
                            />
                        ) : (
                            <View style={styles.listContent}>
                               {filteredItems.map(item => (
                                   <View key={item.id} style={{marginBottom: 16}}>
                                       {renderRecommendationItem({item})}
                                   </View>
                               ))}
                            </View>
                        )
                    )}
                 </View>
             </>
          )}
      </ScrollView>
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
  greeting: {
      fontSize: 14, color: COLORS.GRAY, marginBottom: 2
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.DARK,
  },
  iconBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: '#FFF0F0',
      position: 'relative',
  },
  badge: {
      position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red', borderWidth: 1, borderColor: '#FFF'
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  center: {
    padding: 20,
    alignItems: "center",
  },
  
  // Categories
  categoryList: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
  },
  categoryItem: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: COLORS.WHITE, paddingHorizontal: 12, paddingVertical: 8,
      borderRadius: 20, borderWidth: 1, borderColor: '#F0F0F0',
      gap: 6,
  },
  categoryItemActive: {
      backgroundColor: COLORS.PRIMARY, borderColor: COLORS.PRIMARY,
  },
  categoryIcon: {
      width: 28, height: 28, borderRadius: 14, backgroundColor: '#F5F5F5',
      justifyContent: 'center', alignItems: 'center',
  },
  categoryIconActive: {
      backgroundColor: 'rgba(255,255,255,0.2)',
  },
  categoryText: {
      fontSize: 13, fontWeight: '600', color: COLORS.DARK,
  },
  categoryTextActive: {
      color: COLORS.WHITE,
  },

  // Sections
  section: {
      marginBottom: 24,
  },
  sectionHeader: {
      // backgroundColor: COLORS.WHITE,
  },
  sectionTitleRow: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: {
      fontSize: 18, fontWeight: '700', color: COLORS.DARK,
  },
  seeAllText: {
      fontSize: 13, color: COLORS.PRIMARY, fontWeight: '600',
  },

  // Featured
  featuredList: {
      paddingHorizontal: 20, gap: 16, paddingRight: 20,
  },
  featuredCard: {
      width: width * 0.75, height: 180, borderRadius: 16, overflow: 'hidden',
      backgroundColor: COLORS.GRAY, position: 'relative',
  },
  featuredImage: {
      width: '100%', height: '100%',
  },
  featuredGradient: {
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
      justifyContent: 'flex-end', padding: 16,
  },
  featuredTitle: {
      color: COLORS.WHITE, fontSize: 16, fontWeight: 'bold', marginBottom: 4,
  },
  featuredLocation: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  featuredLocationText: {
      color: 'rgba(255,255,255,0.9)', fontSize: 12,
  },

  // Recommendations / List
  listContent: {
      paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    marginBottom: 0, // Handled by list container
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
      height: 160,
      backgroundColor: '#F5F5F5',
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
      top: 10,
      left: 10,
      backgroundColor: 'rgba(255,255,255,0.9)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
  },
  categoryBadgeText: {
      color: COLORS.DARK,
      fontSize: 11,
      fontWeight: '700',
  },
  cardContent: {
      padding: 12,
  },
  cardHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
      marginBottom: 6,
  },
  ratingBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 3, 
      backgroundColor: '#FFF9C4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  ratingText: {
      fontSize: 11, fontWeight: '700', color: COLORS.DARK,
  },
  title: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.DARK,
      flex: 1, marginRight: 8,
  },
  locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  locationText: {
      fontSize: 12,
      color: COLORS.GRAY,
      marginLeft: 4,
      flex: 1,
  },
});

export default HomeScreen;
