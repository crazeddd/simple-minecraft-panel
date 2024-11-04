import { useState } from "react";

const useForm = () => {
  const [form, setForm] = useState({});

  const handleChange = (e: any) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm((values: string[]) => ({ ...values, [name]: value }));
  };
  return { form, handleChange };
};

export { useForm };
