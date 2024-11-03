import { Button, Flex, Box } from "@chakra-ui/react";
import React from "react";
import FormInput from "../../components/formComponents/FormInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PageNumbers } from "../../interface/home";
import { IJobDetails } from "../../interface/forms";
import { useData } from "./DataProvider"; // Adjust the import path as necessary

const JobDetailsForm: React.FC<{
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
  } = useFormik<IJobDetails>({
    initialValues: {
      jobTitle: state.jobDetails.jobTitle,
      jobDetails: state.jobDetails.jobDetails,
      jobLocation: state.jobDetails.jobLocation,
    },
    validationSchema: Yup.object().shape({
      jobTitle: Yup.string().required("Job Title is required"),
      jobDetails: Yup.string().required("Job Details are required"),
      jobLocation: Yup.string().required("Job Location is required"),
    }),
    onSubmit: (values) => {
      console.log({ values });

      // Update context state with form values on submit
      setState((prevState) => ({
        ...prevState,
        jobDetails: {
          ...prevState.jobDetails,
          ...values,
        },
      }));

      handleTab(2);
    },
  });

  const handleFieldChange = (name: keyof IJobDetails, value: string) => {
    setFieldValue(name, value);
    setState((prevState) => ({
      ...prevState,
      jobDetails: {
        ...prevState.jobDetails,
        [name]: value,
      },
    }));
  };

  return (
    <Box width="100%" as="form" onSubmit={handleSubmit as any}>
      <Box width="100%">
        <FormInput
          label="Job Title"
          placeholder="Enter job title"
          name="jobTitle"
          onChange={(e) => handleFieldChange("jobTitle", e.target.value)}
          onBlur={handleBlur}
          value={values.jobTitle}
          error={errors.jobTitle}
          touched={touched.jobTitle}
        />
        <FormInput
          label="Job Details"
          placeholder="Enter job details"
          name="jobDetails"
          onChange={(e) => handleFieldChange("jobDetails", e.target.value)}
          onBlur={handleBlur}
          value={values.jobDetails}
          error={errors.jobDetails}
          touched={touched.jobDetails}
        />
        <FormInput
          label="Job Location"
          name="jobLocation"
          placeholder="Enter job location"
          onChange={(e) => handleFieldChange("jobLocation", e.target.value)}
          onBlur={handleBlur}
          value={values.jobLocation}
          error={errors.jobLocation}
          touched={touched.jobLocation}
        />
        <Flex w="100%" justify="flex-end" mt="4rem" gap="20px">
          <Button colorScheme="gray" type="button" onClick={() => handleTab(0)}>
            Previous
          </Button>
          <Button colorScheme="red" type="submit">
            Next
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default JobDetailsForm;
