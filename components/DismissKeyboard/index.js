import { Keyboard, TouchableWithoutFeedback } from "react-native";

// Esconder o teclado quando apertar fora da caixa

export const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );