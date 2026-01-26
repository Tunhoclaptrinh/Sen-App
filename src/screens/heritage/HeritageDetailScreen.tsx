import React, {useEffect, useState} from "react";
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import RenderHtml from 'react-native-render-html';
import {fetchHeritageDetail, fetchArtifacts} from "@/src/store/slices/heritageSlice";
import {getImageUrl} from "@/src/utils/formatters";
import {ROUTE_NAMES} from "@/src/config/routes.config";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/src/styles/colors";

const {width} = Dimensions.get("window");

const HeritageDetailScreen = ({route, navigation}: any) => {
  const {id} = route.params || {};
  const dispatch = useDispatch<any>();

  const {currentItem, artifacts, loading, error} = useSelector((state: RootState) => state.heritage);
  const [isExpanded, setIsExpanded] = useState(false);


  useEffect(() => {
    if (id) {
      dispatch(fetchHeritageDetail(id));
      dispatch(fetchArtifacts(id));
    }
  }, [id, dispatch]);

  if (loading || !currentItem) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  // Handle back navigation properly
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          {currentItem.imageUrl ? (
            <Image source={{uri: getImageUrl(currentItem.imageUrl)}} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={[styles.coverImage, styles.placeholder]}>
               <Ionicons name="image-outline" size={64} color={COLORS.WHITE} />
            </View>
          )}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
             <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
          <View style={styles.overlay} />
          <View style={styles.headerContent}>
             <Text style={styles.title}>{currentItem.name}</Text>
             <View style={styles.locationTag}>
                <Ionicons name="location" size={14} color={COLORS.WHITE} />
                <Text style={styles.locationText}>{currentItem.location}</Text>
             </View>
             
             {/* Interaction Row */}
             <View style={styles.interactionRow}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert("Thông báo", "Đã lưu vào danh sách yêu thích!")}>
                   <Ionicons name="heart-outline" size={24} color={COLORS.WHITE} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert("Thông báo", "Đã sao chép liên kết!")}>
                   <Ionicons name="share-social-outline" size={24} color={COLORS.WHITE} />
                </TouchableOpacity>
             </View>
          </View>
        </View>

        <View style={styles.content}>
           {/* Info Grid Section - Polished */}
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>Thông tin tham quan</Text>
             <View style={styles.infoGrid}>
                {/* Row 1 */}
                <View style={styles.infoRow}>
                   <View style={styles.infoItem}>
                      <Ionicons name="time-outline" size={20} color={COLORS.PRIMARY} />
                      <View style={{marginLeft: 8}}>
                         <Text style={styles.infoLabel}>Giờ mở cửa</Text>
                         <Text style={styles.infoValue}>{currentItem.visit_hours || "8:00 - 17:00"}</Text>
                      </View>
                   </View>
                   <View style={styles.infoItem}>
                      <Ionicons name="ticket-outline" size={20} color={COLORS.PRIMARY} />
                      <View style={{marginLeft: 8}}>
                         <Text style={styles.infoLabel}>Vé tham quan</Text>
                         <Text style={styles.infoValue}>
                           {currentItem.entrance_fee ? `${currentItem.entrance_fee.toLocaleString()} đ` : "Miễn phí"}
                         </Text>
                      </View>
                   </View>
                </View>

                {/* Row 2 */}
                <View style={styles.infoRow}>
                   <View style={styles.infoItem}>
                      <Ionicons name="calendar-outline" size={20} color={COLORS.PRIMARY} />
                      <View style={{marginLeft: 8}}>
                         <Text style={styles.infoLabel}>Thành lập</Text>
                         <Text style={styles.infoValue}>{currentItem.year_established || "Đang cập nhật"}</Text>
                      </View>
                   </View>
                   <View style={styles.infoItem}>
                      <Ionicons name="star-outline" size={20} color={COLORS.PRIMARY} />
                      <View style={{marginLeft: 8}}>
                         <Text style={styles.infoLabel}>Đánh giá</Text>
                         <Text style={styles.infoValue}>
                            {currentItem.rating || "4.5"}/5 ({currentItem.total_reviews || 100})
                         </Text>
                      </View>
                   </View>
                </View>
             </View>
           </View>

           {/* Info Section - Description */}
           <View style={styles.section}>
              <Text style={styles.sectionTitle}>Giới thiệu</Text>
              <View style={[styles.htmlContainer, !isExpanded && {maxHeight: 150}]}>
                 <RenderHtml
                     contentWidth={width - 40}
                     source={{html: currentItem.description || "<p>Đang cập nhật...</p>"}}
                     enableExperimentalMarginCollapsing={true}
                     tagsStyles={{
                         p: { fontSize: 15, lineHeight: 24, color: COLORS.DARK_GRAY, marginBottom: 10 },
                         strong: { fontWeight: 'bold', color: COLORS.DARK },
                         li: { fontSize: 15, lineHeight: 24, color: COLORS.DARK_GRAY },
                     }}
                 />
                 {!isExpanded && (
                     <LinearGradient
                        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                        style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 50}}
                     />
                 )}
              </View>
              <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={{alignItems: 'center', paddingVertical: 8}}>
                  <Text style={{color: COLORS.PRIMARY, fontWeight: '600'}}>
                      {isExpanded ? "Thu gọn" : "Xem thêm"}
                  </Text>
                  <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color={COLORS.PRIMARY} />
              </TouchableOpacity>
           </View>

           {/* Gallery Preview */}
           {currentItem.gallery && currentItem.gallery.length > 0 && (
               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Hình ảnh</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
                      {currentItem.gallery.map((img, index) => (
                          <Image
                            key={index}
                            source={{uri: getImageUrl(img)}}
                            style={styles.galleryImage}
                          />
                      ))}
                  </ScrollView>
               </View>
           )}

           {/* Related Artifacts */}
           <View style={styles.section}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                  <Text style={[styles.sectionTitle, {marginBottom: 0}]}>Hiện vật nổi bật</Text>
                  {artifacts && artifacts.length > 5 && (
                      <TouchableOpacity>
                          <Text style={{color: COLORS.PRIMARY, fontWeight: '600'}}>Xem tất cả</Text>
                      </TouchableOpacity>
                  )}
              </View>

              {artifacts && artifacts.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 20}}>
                      {artifacts.map((artifact, index) => (
                          <TouchableOpacity 
                            key={artifact.id || index} 
                            style={styles.artifactCard}
                            onPress={() => navigation.navigate(ROUTE_NAMES.HOME.ARTIFACT_DETAIL, {artifact})}
                          >
                              <Image 
                                source={{uri: getImageUrl(artifact.imageUrl)}} 
                                style={styles.artifactImage} 
                                resizeMode="cover"
                              />
                              <View style={styles.artifactOverlay}>
                                  <Text style={styles.artifactName} numberOfLines={2}>{artifact.name}</Text>
                              </View>
                          </TouchableOpacity>
                      ))}
                  </ScrollView>
              ) : (
                  <Text style={{color: COLORS.GRAY, fontStyle: 'italic'}}>Chưa có thông tin hiện vật.</Text>
              )}
           </View>
           
           {/* Discovery Section - Related Games [Mock] */}
           <View style={styles.section}>
              <Text style={styles.sectionTitle}>Khám phá & Trải nghiệm</Text>
              <TouchableOpacity 
                style={styles.gameCard}
                onPress={() => Alert.alert("Thông báo", "Game khám phá đang được phát triển!")}
              >
                  <View style={styles.gameContent}>
                     <Ionicons name="game-controller-outline" size={32} color={COLORS.WHITE} />
                     <View style={{marginLeft: 12, flex: 1}}>
                        <Text style={styles.gameTitle}>Giải mã lịch sử</Text>
                        <Text style={styles.gameSubtitle}>Tham gia thử thách tương tác ngay tại địa điểm này</Text>
                     </View>
                     <View style={styles.gameBtn}>
                        <Text style={styles.gameBtnText}>Chơi ngay</Text>
                     </View>
                  </View>
              </TouchableOpacity>
           </View>
        </View>
      </ScrollView>

      {/* Action Footer (e.g. Map, Audio Guide) */}
      <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert("Thông báo", "Tính năng Bản đồ đang được phát triển")}
          >
              <Ionicons name="map-outline" size={20} color={COLORS.WHITE} />
              <Text style={styles.actionText}>Bản đồ</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => Alert.alert("Thông báo", "Tính năng Audio Guide đang được phát triển")}
          >
              <Ionicons name="headset-outline" size={20} color={COLORS.PRIMARY} />
              <Text style={[styles.actionText, {color: COLORS.PRIMARY}]}>Audio Guide</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  coverContainer: {
      height: 300,
      position: 'relative',
  },
  coverImage: {
      width: '100%',
      height: '100%',
  },
  placeholder: {
      backgroundColor: '#CCC',
      justifyContent: 'center',
      alignItems: 'center',
  },
  backButton: {
      position: 'absolute',
      top: 40,
      left: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
  },
  overlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 120,    
      backgroundColor: 'rgba(0,0,0,0.4)',  // Gradient effect simplified
  },
  headerContent: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
  },
  title: {
      fontSize: 26,
      fontWeight: '800',
      color: COLORS.WHITE,
      marginBottom: 8,
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 4,
  },
  locationTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: 'flex-start',
  },
  locationText: {
      color: COLORS.WHITE,
      fontSize: 13,
      fontWeight: '600',
      marginLeft: 4,
  },
  content: {
      padding: 20,
      paddingBottom: 100,
  },
  section: {
      marginBottom: 24,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.DARK,
      marginBottom: 12,
  },
  description: {
      fontSize: 15,
      lineHeight: 24,
      color: COLORS.DARK_GRAY,
  },
  contextText: {
     fontSize: 14,
     lineHeight: 22,
     color: COLORS.DARK_GRAY,
     fontStyle: 'italic',
  },
  htmlContainer: {
     overflow: 'hidden',
  },
  // New Styles Polish
  infoGrid: {
     backgroundColor: '#F8F9FA',
     padding: 16,
     borderRadius: 12,
  },
  infoRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     marginBottom: 16,
  },
  infoItem: {
     flexDirection: 'row',
     alignItems: 'center',
     flex: 1,
  },
  infoLabel: {
     fontSize: 12,
     color: COLORS.GRAY,
     marginBottom: 2,
  },
  infoValue: {
     fontSize: 14,
     fontWeight: '600',
     color: COLORS.DARK,
  },
  interactionRow: {
     flexDirection: 'row', 
     marginTop: 12,
     gap: 12,
  },
  iconBtn: {
     width: 40,
     height: 40,
     borderRadius: 20,
     backgroundColor: 'rgba(255,255,255,0.2)',
     justifyContent: 'center',
     alignItems: 'center',
  },
  gameCard: {
     backgroundColor: COLORS.SECONDARY, // Use secondary or a specific gradient color
     borderRadius: 16,
     overflow: 'hidden',
     elevation: 4,
     shadowColor: "#000",
     shadowOffset: {width: 0, height: 2},
     shadowOpacity: 0.1,
     shadowRadius: 4,
  },
  gameContent: {
     padding: 16,
     flexDirection: 'row',
     alignItems: 'center',
  },
  gameTitle: {
     color: COLORS.WHITE,
     fontSize: 16,
     fontWeight: '700',
     marginBottom: 4,
  },
  gameSubtitle: {
     color: 'rgba(255,255,255,0.8)',
     fontSize: 12,
  },
  gameBtn: {
     backgroundColor: COLORS.WHITE,
     paddingHorizontal: 12,
     paddingVertical: 6,
     borderRadius: 20,
  },
  gameBtnText: {
     color: COLORS.SECONDARY,
     fontWeight: '700',
     fontSize: 12,
  },
  gallery: {
      flexDirection: 'row',
  },
  galleryImage: {
      width: 120,
      height: 120,
      borderRadius: 12,
      marginRight: 10,
  },
  artifactBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#FFF0F0',
      borderRadius: 12,
  },
  artifactBtnText: {
      fontSize: 15,
      fontWeight: '600',
      color: COLORS.PRIMARY,
  },
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      padding: 16,
      backgroundColor: COLORS.WHITE,
      borderTopWidth: 1,
      borderTopColor: '#F0F0F0',
      gap: 12,
  },
  actionButton: {
      flex: 1,
      height: 50,
      backgroundColor: COLORS.PRIMARY,
      borderRadius: 25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
  },
  secondaryAction: {
      backgroundColor: '#FFF0F0',
  },
  actionText: {
      fontSize: 15,
      fontWeight: '700',
      color: COLORS.WHITE,
  },
  artifactCard: {
      width: 140,
      height: 180,
      borderRadius: 12,
      marginRight: 12,
      backgroundColor: 'white',
      shadowColor: "#000",
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      position: 'relative',
      overflow: 'hidden'
  },
  artifactImage: {
      width: '100%',
      height: '100%',
  },
  artifactOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      padding: 8,
  },
  artifactName: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center'
  },
});

export default HeritageDetailScreen;
