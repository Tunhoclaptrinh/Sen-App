import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {fetchHeritageDetail} from "@/src/store/slices/heritageSlice";
import {getImageUrl} from "@/src/utils/formatters";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/src/styles/colors";

const {width} = Dimensions.get("window");

const HeritageDetailScreen = ({route, navigation}: any) => {
  const {id} = route.params || {};
  const dispatch = useDispatch<any>();

  const {currentItem, loading, error} = useSelector((state: RootState) => state.heritage);


  useEffect(() => {
    if (id) {
      dispatch(fetchHeritageDetail(id));
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
          {currentItem.images && currentItem.images.length > 0 ? (
            <Image source={{uri: getImageUrl(currentItem.images[0])}} style={styles.coverImage} resizeMode="cover" />
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
          </View>
        </View>

        <View style={styles.content}>
           {/* Info Section */}
           <View style={styles.section}>
              <Text style={styles.sectionTitle}>Giới thiệu</Text>
              <Text style={styles.description}>{currentItem.description}</Text>
           </View>

           {/* Gallery Preview (Optional) */}
           {currentItem.images && currentItem.images.length > 1 && (
               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Hình ảnh</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
                      {currentItem.images.slice(1).map((img, index) => (
                          <Image 
                            key={index} 
                            source={{uri: getImageUrl(img)}} 
                            style={styles.galleryImage} 
                          />
                      ))}
                  </ScrollView>
               </View>
           )}

           {/* Related Artifacts Placeholder */}
           <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hiện vật nổi bật</Text>
              <TouchableOpacity style={styles.artifactBtn}>
                  <Text style={styles.artifactBtnText}>Xem bộ sưu tập hiện vật</Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORS.PRIMARY} />
              </TouchableOpacity>
           </View>
        </View>
      </ScrollView>

      {/* Action Footer (e.g. Map, Audio Guide) */}
      <View style={styles.footer}>
          <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="map-outline" size={20} color={COLORS.WHITE} />
              <Text style={styles.actionText}>Bản đồ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
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
});

export default HeritageDetailScreen;
