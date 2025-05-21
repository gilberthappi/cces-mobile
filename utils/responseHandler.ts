import { Dispatch, SetStateAction } from "react";
import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info" | "warning";

interface HandleResponseProps {
  response: any;
  successMessage?: string;
  errorMessage?: string;
  setToastMessage?: Dispatch<SetStateAction<string | null>>;
  setToastType?: Dispatch<SetStateAction<ToastType>>;
  successConfig?: Partial<ToastConfig>;
  errorConfig?: Partial<ToastConfig>;
}

interface ToastConfig {
  type: ToastType;
  text1: string;
  text2?: string;
  position: 'top' | 'bottom';
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
  props?: any;
}

export const handleResponse = ({
  response,
  successMessage = '',
  errorMessage = '',
  setToastMessage,
  setToastType,
  successConfig = {},
  errorConfig = {}
}: HandleResponseProps) => {
  const isSuccess = response?.status_code === 200 || response?.status_code === 201 || response?.status === 200 || response?.status === 201;
  const message = isSuccess 
    ? successMessage || response?.successMessage || response?.data?.message || 'Operation successful'
    : errorMessage || response?.errorMessage || response?.data?.message || 'Something went wrong';

  const type = isSuccess ? 'success' : 'error';
  

  setToastMessage?.(message);
  setToastType?.(type);

  const defaultPosition = isSuccess ? 'top' : 'top';

  Toast.show({
    type,
    text1: message,
    position: defaultPosition,
    visibilityTime: isSuccess ? 3000 : 3000,
    ...(isSuccess ? {
      topOffset: 50,
      ...successConfig
    } : {
      bottomOffset: 80,
      ...errorConfig
    })
  });

  return isSuccess;
};