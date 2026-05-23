import React, { useMemo, useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  Linking,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Avatar, Button, Card, Divider, Text, TextInput } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/MaterialIcons";

import { colorList, elevationCard } from "styles/global.styles";
import { CustomContentLoader } from "components/CustomContentLoader";
import { NoDataAvailable } from "components/NoDataAvailable";
import { getQrPaymentListService } from "../service/qrPayment.service";
import { QrPaymentItemType } from "../types";
import isArray from "lodash/isArray";

const openUrl = async (url: string, label: string) => {
  if (!url) {
    Alert.alert("Warning", `${label} is not available.`);
    return;
  }
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Error", `Unable to open ${label}.`);
  }
};

function QrPaymentListItem({ item }: { item: QrPaymentItemType }) {
  return (
    <Card style={styles.card} mode="elevated" elevation={4}>
      <Card.Content>
        <View style={styles.row}>
          {/* <Avatar.Text
            size={44}
            label={item.name?.[0]?.toUpperCase() || "?"}
            color={colorList.white}
            style={{ backgroundColor: colorList.palette.primary.main }}
          /> */}
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.age} yrs · {item.gender}
            </Text>
            <Text style={styles.meta}>Mobile : {item.mobile}</Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.amountRow}>
          <View>
            <Text style={styles.label}>Invoice #</Text>
            <Text style={styles.value}>{item.inv_number}</Text>
          </View>
          <View>
            <Text style={styles.label}>Balance</Text>
            <Text style={[styles.value, styles.balance]}>₹ {item.balance}</Text>
          </View>
          <View>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.value}>₹ {item.total}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            mode="outlined"
            icon={() => (
              <Icon name="qrcode" size={18} color={colorList.primary} />
            )}
            textColor={colorList.primary}
            style={styles.actionBtn}
            onPress={() => openUrl(item.qr_url, "QR payment")}
          >
            View QR
          </Button>
          <Button
            mode="contained"
            icon={() => (
              <Icon name="credit-card-outline" size={18} color={colorList.white} />
            )}
            buttonColor={colorList.socondary}
            style={styles.actionBtn}
            onPress={() => openUrl(item.pay_url, "payment link")}
          >
            Pay
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
}

function QrPaymentList() {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch, isFetching } = useQuery(
    ["qrPaymentList"],
    getQrPaymentListService,
    {
      staleTime: 2 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnMount: false,
      onSettled: () => setRefreshing(false),
    }
  );

  const qrList = data ?? [];

  const filteredList = useMemo(() => {
    const term = search.trim().toLowerCase();
    if(isArray(qrList[0])) {
      return [];
    }
    if (!term) {
      return qrList;
    }
    return qrList.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.mobile?.toLowerCase().includes(term) ||
        item.inv_number?.toLowerCase().includes(term)
    );
  }, [qrList, search]);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
  };

  const clearSearch = () => setSearch("");

  if (isLoading && !refreshing) {
    return <CustomContentLoader listSize={8} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput
          mode="outlined"
          placeholder="Search by name, mobile or invoice..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colorList.Grey4}
          left={
            <TextInput.Icon
              icon={() => (
                <Icons name="search" color={colorList.dark} size={25} />
              )}
            />
          }
          right={
            search ? (
              <TextInput.Icon
                onPress={clearSearch}
                icon={() => (
                  <Icons name="close" color={colorList.dark} size={25} />
                )}
              />
            ) : null
          }
          style={styles.searchInput}
        />
      </View>
      {Boolean(filteredList.length) ? (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => `${item.inv_number}-${item.mobile}`}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isFetching}
              onRefresh={onRefresh}
            />
          }
          renderItem={({ item }) => <QrPaymentListItem item={item} />}
        />
      ) : (
        !isLoading && (
          <NoDataAvailable refresh={search ? clearSearch : onRefresh} />
        )
      )}
    </View>
  );
}

export default QrPaymentList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.white,
  },
  searchWrapper: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 4,
  },
  searchInput: {
    backgroundColor: colorList.white,
    color: colorList.Grey1,
  },
  listContent: {
    padding: 10,
    paddingBottom: 16,
  },
  card: {
    marginBottom: 10,
    borderRadius: 12,
    ...elevationCard,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 13,
    fontWeight: "bold",
    color: colorList.dark,
  },
  meta: {
    fontSize: 11,
    color: colorList.Grey1,
    marginTop: 2,
  },
  divider: {
    marginVertical: 10,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 10,
    color: colorList.Grey1,
  },
  value: {
    fontSize: 12,
    fontWeight: "600",
    color: colorList.dark,
    marginTop: 2,
  },
  balance: {
    color: colorList.socondary,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
});
