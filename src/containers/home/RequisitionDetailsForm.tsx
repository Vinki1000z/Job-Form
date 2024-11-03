import { Button, Flex, Box } from "@chakra-ui/react";
import React from "react";
import FormInput from "../../components/formComponents/FormInput";
import FormSelect from "../../components/formComponents/FormSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PageNumbers } from "../../interface/home";
import { IRequisitionDetails } from "../../interface/forms";
import { genderOptions, urgencyOptions } from "./constants";
import { useData } from "./DataProvider"; // Adjust the import path as necessary

const RequisitionDetailsForm: React.FC<{
  handleTab: (n: PageNumbers) => void;
}> = ({ handleTab }) => {
  const dataContext = useData(); // Access context values
  if (!dataContext) {
    throw new Error("useData must be used within a DataProvider");
  }

  const { state, setState } = dataContext;

  const {
    handleChange,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    values,
    setFieldTouched,
    setFieldValue,
  } = useFormik<IRequisitionDetails>({
    initialValues: {
      requisitionTitle: state.requisitionDetails.requisitionTitle,
      noOfOpenings: state.requisitionDetails.noOfOpenings,
      urgency: state.requisitionDetails.urgency,
      gender: state.requisitionDetails.gender,
    },
    validationSchema: Yup.object().shape({
      requisitionTitle: Yup.string().required("Requisition title is required"),
      noOfOpenings: Yup.number()
        .typeError("Enter a valid number")
        .required("Number of openings is required")
        .positive("Enter a valid number")
        .min(1, "Enter a valid number"),
      urgency: Yup.string().required("Urgency is required"),
      gender: Yup.string().required("Gender is required"),
    }),
    onSubmit: (values) => {
      console.log("Gender:", values.gender);
      console.log("Urgency:", values.urgency);

      // Update context state with form values on submit
      setState((prevState) => ({
        ...prevState,
        requisitionDetails: {
          ...prevState.requisitionDetails,
          ...values,
        },
      }));
      handleTab(1);
    },
  });

  // Updated handleFieldChange function to log values correctly
  const handleFieldChange = (name: string, value: string | number) => {
    setFieldValue(name, value);
    setState((prevState) => ({
      ...prevState,
      requisitionDetails: {
        ...prevState.requisitionDetails,
        [name]: value,
      },
    }));

    // Log updated values of gender and urgency
    if (name === "gender") {
      console.log("Updated Gender:", value);
    } else if (name === "urgency") {
      console.log("Updated Urgency:", value);
    }
  };

  return (
    <Box width="100%" as="form" onSubmit={handleSubmit as any}>
      <Box width="100%">
        <FormInput
          label="Requisition Title"
          placeholder="Enter requisition title"
          name="requisitionTitle"
          onChange={(e) => handleFieldChange("requisitionTitle", e.target.value)}
          onBlur={handleBlur}
          value={values.requisitionTitle}
          error={errors.requisitionTitle}
          touched={touched.requisitionTitle}
        />
        <FormInput
          label="Number of openings"
          placeholder="Enter number of openings"
          name="noOfOpenings"
          onChange={(e) => {
            const value = e.target.value;
            // Only update if it's a number or an empty string
            if (/^\d*$/.test(value)) {
              handleFieldChange("noOfOpenings", value === "" ? "" : Number(value));
            }
          }}
          onBlur={handleBlur}
          value={values.noOfOpenings}
          error={errors.noOfOpenings}
          touched={touched.noOfOpenings}
        />

        <FormSelect
          label="Gender"
          name="gender"
          placeholder="Select gender"
          options={genderOptions}
          onChange={(value: string) => handleFieldChange("gender", value)}
          onBlur={() => setFieldTouched("gender")}
          error={errors.gender}
          touched={touched.gender}
          value={values.gender}
        />
        <FormSelect
          label="Urgency"
          name="urgency"
          placeholder="Select urgency"
          options={urgencyOptions}
          onChange={(value: string) => handleFieldChange("urgency", value)}
          onBlur={() => setFieldTouched("urgency")}
          error={errors.urgency}
          touched={touched.urgency}
          value={values.urgency}
        />

        <Flex w="100%" justify="flex-end" mt="4rem">
          <Button colorScheme="red" type="submit">
            Next
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default RequisitionDetailsForm;
