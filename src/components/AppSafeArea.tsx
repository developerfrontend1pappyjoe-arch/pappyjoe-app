import React, { ComponentType } from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  Edge,
  SafeAreaView,
} from "react-native-safe-area-context";

type AppSafeAreaProps = {
  children: React.ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
};

export const DEFAULT_SAFE_AREA_EDGES: Edge[] = [
  "top",
  "right",
  "bottom",
  "left",
];

export const HEADER_SAFE_AREA_EDGES: Edge[] = ["bottom", "left", "right"];

/** Tab content below a native header; bottom inset is handled by the tab bar. */
export const TAB_SCREEN_HEADER_EDGES: Edge[] = ["left", "right"];

/** Home tab has no stack header; bottom inset is handled by the tab bar. */
export const TAB_HOME_SCREEN_EDGES: Edge[] = ["top", "left", "right"];

export const AppSafeArea = ({
  children,
  edges = DEFAULT_SAFE_AREA_EDGES,
  style,
}: AppSafeAreaProps) => (
  <SafeAreaView style={[{ flex: 1 }, style]} edges={edges}>
    {children}
  </SafeAreaView>
);

export function withAppSafeArea<P extends object>(
  ScreenComponent: ComponentType<P>,
  edges: Edge[] = DEFAULT_SAFE_AREA_EDGES
) {
  const WrappedScreen = (props: P) => (
    <AppSafeArea edges={edges}>
      <ScreenComponent {...props} />
    </AppSafeArea>
  );

  WrappedScreen.displayName = `withAppSafeArea(${
    ScreenComponent.displayName || ScreenComponent.name || "Screen"
  })`;

  return WrappedScreen;
}
