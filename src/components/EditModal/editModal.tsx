import React, { useState, useEffect, FormEvent } from "react";
import styles from "./editModal.module.css";
import Button from "@/components/Button/button";
import { X } from "lucide-react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { FieldConfig } from "@/lib/types/interface";
import { createHandleInputChange } from "@/lib/helpers/tableHelpers";

type HandleSubmit = (event: FormEvent<HTMLFormElement>) => void;

interface EditModalProps<T> {
  initialData: T;
  fields: FieldConfig[];
  handleSubmit: HandleSubmit;
  updateModal: boolean;
  setUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal = <T extends Record<string, any>>({
  initialData,
  fields,
  handleSubmit,
  updateModal,
  setUpdateModal,
}: EditModalProps<T>) => {
  const [formData, setFormData] = useState<T>(initialData);

  const handleInputChange = createHandleInputChange(setFormData);

  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  return (
    <div>
      <section className={styles.updateModal}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <X
            onClick={() => {
              setUpdateModal(false);
            }}
            className={styles.CloseButton}
          ></X>
          <section className={styles.formFields}>
            {fields.map((field, index) => (
              <FormControl key={index} isRequired={field.required}>
                <FormLabel>{field.label}</FormLabel>
                {field.type == "select" ? (
                  <Select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                ) : field.type == "number" ? (
                  <NumberInput
                    min={1}
                    value={formData[field.name]}
                    onChange={(value) => handleNumberChange(field.name, value)}
                  >
                    <NumberInputField name={field.name} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                ) : (
                  <Input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                  />
                )}
              </FormControl>
            ))}
          </section>

          <Button className={styles.submitButton}>Submit</Button>
        </form>
      </section>
    </div>
  );
};

export default EditModal;
