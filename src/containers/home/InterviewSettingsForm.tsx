import { Button, Flex, Box } from "@chakra-ui/react";
import React from "react";
import FormSelect from "../../components/formComponents/FormSelect";
import { useFormik } from "formik";
import { PageNumbers } from "../../interface/home";
import { IInterViewSettings } from "../../interface/forms";
import {
  interviewDurationOptions,
  interviewLanguageOptions,
  interviewModeOptions,
} from "./constants";
import { useData } from "./DataProvider"; // Adjust the import path as necessary

const initialInterviewSettings = {
  interviewMode: "",
  interviewDuration: "",
  interviewLanguage: "",
};

const InterviewDetailsForm: React.FC<{
  handleTab: (n: PageNumbers) => void;
}> = ({ handleTab }) => {
  const dataContext = useData(); // Access context values
  if (!dataContext) {
    throw new Error("useData must be used within a DataProvider");
  }

  const { state, setState } = dataContext;

  const {
    errors,
    touched,
    handleSubmit,
    values,
    setFieldTouched,
    setFieldValue,
  } = useFormik<IInterViewSettings>({
    initialValues: {
      interviewMode: state.interviewSettings.interviewMode,
      interviewDuration: state.interviewSettings.interviewDuration,
      interviewLanguage: state.interviewSettings.interviewLanguage,
    },
    onSubmit: (values) => {
      console.log({ values });
      // Update context state with form values on submit
      setState((prevState) => ({
        ...prevState,
        interviewSettings: {
          ...prevState.interviewSettings,
          ...values,
        },
      }));
      alert("Form successfully submitted");

      // Reset the context state to initial values
      // setState((prevState) => ({
      //   ...prevState,
      //   interviewSettings: initialInterviewSettings,
      // }));
      window.location.reload();
    },
  });

  // Updated handleFieldChange function to log values correctly
  const handleFieldChange = (name: string, value: string) => {
    setFieldValue(name, value);
    setState((prevState) => ({
      ...prevState,
      interviewSettings: {
        ...prevState.interviewSettings,
        [name]: value,
      },
    }));

    // Log updated values of interview settings
    console.log(`Updated ${name}:`, value);
  };

  return (
    <Box width="100%" as="form" onSubmit={handleSubmit as any}>
      <Box width="100%">
        <FormSelect
          label="Interview Mode"
          placeholder="Select interview mode"
          name="interviewMode"
          options={interviewModeOptions}
          onChange={(value: string) => handleFieldChange("interviewMode", value)}
          onBlur={() => setFieldTouched("interviewMode")}
          value={values.interviewMode}
          error={errors.interviewMode}
          touched={touched.interviewMode}
        />
        <FormSelect
          label="Interview Duration"
          placeholder="Select interview duration"
          name="interviewDuration"
          options={interviewDurationOptions}
          onChange={(value: string) => handleFieldChange("interviewDuration", value)}
          onBlur={() => setFieldTouched("interviewDuration")}
          value={values.interviewDuration}
          error={errors.interviewDuration}
          touched={touched.interviewDuration}
        />
        <FormSelect
          label="Interview Language"
          name="interviewLanguage"
          placeholder="Select interview language"
          options={interviewLanguageOptions}
          onChange={(value: string) => handleFieldChange("interviewLanguage", value)}
          onBlur={() => setFieldTouched("interviewLanguage")}
          value={values.interviewLanguage}
          error={errors.interviewLanguage}
          touched={touched.interviewLanguage}
        />
        <Flex w="100%" justify="flex-end" mt="4rem" gap="20px">
          <Button colorScheme="gray" type="button" onClick={() => handleTab(1)}>
            Previous
          </Button>
          <Button colorScheme="red" type="submit">
            Submit
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default InterviewDetailsForm;
