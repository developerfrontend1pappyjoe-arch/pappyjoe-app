import React, { PropsWithChildren, createContext, FC } from "react";
import { Card, Divider, Modal, Portal } from "react-native-paper";
import { CustomModalType } from "./types";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { colorList } from "styles/global.styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
export const MoadalContext = createContext<{
  CustomModal: React.FC<React.PropsWithChildren<CustomModalType>>;
}>({
  CustomModal: ({ open = false }) => <></>,
});

const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const CustomModal: FC<PropsWithChildren<CustomModalType>> = ({
    children,
    title,
    open,
    setOpen,
    handleCloseModal,
  }) => {
    const dimention = useWindowDimensions();
    const handleDismiss = () => {
      if (setOpen) {
        setOpen(false);
      }
      if (handleCloseModal) {
        handleCloseModal();
      }
    };
    return (
      <>
        {Boolean(open) ? (
          <Portal>
            <Modal visible={Boolean(open)} onDismiss={handleDismiss}>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Card
                  style={[style.container, { width: dimention.width - 18 }]}
                >
                  <View style={style.titleContainer}>
                    {typeof title == "string" ? (
                      <Text style={{ fontWeight: "bold" }}>{title}</Text>
                    ) : (
                      title
                    )}
                    <TouchableOpacity onPress={handleDismiss}>
                      <Icon
                        name="close-circle"
                        color={colorList.red}
                        size={26}
                      />
                    </TouchableOpacity>
                  </View>
                  <Divider />
                  {children}
                </Card>
              </View>
            </Modal>
          </Portal>
        ) : (
          <></>
        )}
      </>
    );
  };
  return (
    <MoadalContext.Provider value={{ CustomModal }}>
      {children}
    </MoadalContext.Provider>
  );
};

export default ModalProvider;

const style = StyleSheet.create({
  container: {
    backgroundColor: colorList.white,
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
});
