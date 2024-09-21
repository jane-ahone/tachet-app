export const createHandleInputChange = <T extends Record<string, any>>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  transform?: (name: string, value: string) => any
) => {
  return (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: transform ? transform(name, value) : value,
    }));
  };
};
