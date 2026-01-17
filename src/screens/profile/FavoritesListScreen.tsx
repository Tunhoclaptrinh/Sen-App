import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SafeAreaView from "@/src/components/common/SafeAreaView";
import { COLORS } from "@/src/styles/colors";
import EmptyState from "@/src/components/common/EmptyState/EmptyState";

const FavoritesListScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon="heart-outline"
        title="Yêu thích"
        subtitle="Danh sách di sản và bài viết yêu thích của bạn đang trống."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
});

export default FavoritesListScreen;
