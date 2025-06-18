import React from "react";
import { Form } from "react-bootstrap";

// Custom Input Component
export const CustomInput = ({ label, name, type = "text", formik, ...props }) => (
  <Form.Group>
    {label && <Form.Label>{label}</Form.Label>}
    <Form.Control type={type} name={name} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} isInvalid={formik.touched[name] && !!formik.errors[name]} {...props} />
    <Form.Control.Feedback type="invalid">{formik.errors[name]}</Form.Control.Feedback>
  </Form.Group>
);

// Custom Select Component
// export const CustomSelect = ({ label, name, options, formik, ...props }) => (
//   <Form.Group>
//     {label && <Form.Label>{label}</Form.Label>}
//     <Form.Control
//       as="select"
//       name={name}
//       value={formik.values[name]}
//       onChange={formik.handleChange}
//       onBlur={formik.handleBlur}
//       isInvalid={formik.touched[name] && !!formik.errors[name]}
//       {...props}
//     >
//       <option value="">Select</option>
//       {options.map((option, idx) => (
//         <option key={idx} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </Form.Control>
//     <Form.Control.Feedback type="invalid">
//       {formik.errors[name]}
//     </Form.Control.Feedback>
//   </Form.Group>
// );
export const CustomSelect = ({ label, name, options, formik, ...props }) => (
  <Form.Group>
    {label && <Form.Label>{label}</Form.Label>}
    <Form.Select
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      isInvalid={formik.touched[name] && !!formik.errors[name]} // Apply isInvalid to Form.Select
      {...props}
    >
      <option value="">Select</option>
      {options.map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
    <Form.Control.Feedback type="invalid">{formik.errors[name]}</Form.Control.Feedback>
  </Form.Group>
);

// Custom Number Input Component
export const CustomNumberInput = ({ label, name, formik, placeholder, ...props }) => {
  // Function to handle valid numeric input
  const handleNumberInput = (e) => {
    // Allow: Backspace, Delete, Tab, Escape, Enter, Arrows, and Numbers
    if (["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight"].includes(e.key) || (e.key >= "0" && e.key <= "9")) {
      return; // Allow the key
    }
    e.preventDefault(); // Block invalid keys
  };

  return (
    <Form.Group>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type="text"
        name={name}
        value={formik.values[name] || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        onKeyDown={handleNumberInput}
        placeholder={placeholder}
        isInvalid={formik.touched[name] && !!formik.errors[name]}
        {...props}
      />
      <Form.Control.Feedback type="invalid">{formik.errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );
};
// Default Export
export default {
  CustomInput,
  CustomSelect,
  CustomNumberInput,
};
