import { useToast } from "@chakra-ui/react";

export const useSuccessToast = () => {
  const toast = useToast();

  return (description: string) => {
    toast({
      title: "Success",
      description: description,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
};
export const useErrorToast = () => {
  const toast = useToast();

  return (description: string) => {
    toast({
      title: "Error",
      description: description,
      status: "error",
      duration: 1000,
      isClosable: true,
    });
  };
};
