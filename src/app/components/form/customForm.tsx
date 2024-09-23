import React from "react";

interface FormField {
  label: string;
  name: string;
  type: string;
}

interface CustomFormProps {
  title: string;
  fields: FormField[];
  buttonText: string;
  onSubmit: (formData: Record<string, string>) => void;
}

const CustomForm: React.FC<CustomFormProps> = ({
  title,
  fields,
  buttonText,
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full flex">
      {/* Formulário */}
      <div className="w-full h-auto p-8">
        <h2 className="text-2xl font-bold mb-4 flex justify-center">{title}</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col justify-center items-center"
        >
          {fields.map((field, index) => (
            <div key={index} className="flex flex-col">
              <label
                htmlFor={field.name}
                className="mb-1 text-lg font-semibold"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                className="px-4 py-2 border-2 border-blue-700 rounded-lg focus:outline-none focus:border-blue-600 w-60"
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomForm;
