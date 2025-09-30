/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { ReactNode, useState } from "react";
import {
  ControllerRenderProps,
  useForm,
  type FieldValues,
} from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/utils/shadcn";

export interface StepField<
  TStepSchema extends FieldValues = any,
  TMainSchema extends FieldValues = any
> {
  key: keyof TStepSchema;
  label?: string;
  description?: string;
  render: (options: {
    field: ControllerRenderProps<TStepSchema>;
    formData: TMainSchema;
  }) => ReactNode;
}

export interface StepConfig<
  TStepSchema extends FieldValues = any,
  TMainSchema extends FieldValues = any
> {
  title: string;
  description?: string;
  fields: StepField<TStepSchema, TMainSchema>[];
  schema: z.ZodType<TStepSchema, any>;
  disableBackAction?: boolean;
  onSubmit?: (stepData: TStepSchema, data: TMainSchema) => Promise<void>;
}

export type MultipleStepFormProps<TMainSchema> = {
  steps: StepConfig[];
  schema: z.ZodType<TMainSchema, any>;
  initialValues: Partial<TMainSchema>;
  initialStep?: number;
  submitLabel?: string;
  className?: string;
  children: ReactNode;
  onSubmit?: (data: TMainSchema) => Promise<void>;
  stepHeader?: (props: { step: number; progress: number }) => ReactNode;
  stepIndicator?: (props: { step: number; progress: number }) => ReactNode;
};

export function MultipleStepForm<TMainSchema>({
  steps,
  schema,
  initialValues,
  initialStep,
  submitLabel,
  className,
  children,
  onSubmit,
  stepIndicator,
}: MultipleStepFormProps<TMainSchema>) {
  const [step, setStep] = useState(initialStep ?? 0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialValues);

  // Use react-hook-form for the current step
  const currentStep = steps[step];
  const currentSchema = currentStep.schema;
  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: formData,
  });

  const progress = ((step + 1) / steps.length) * 100;

  const handleNextStep = async (data: z.infer<typeof currentSchema>) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    if (step < steps.length - 1) {
      let isContinue = true;
      if (currentStep.onSubmit) {
        try {
          setIsSubmitting(true);
          await currentStep.onSubmit(data, updatedData);
        } catch (error) {
          console.error("Error in step submit:", error);
          isContinue = false;
        } finally {
          setIsSubmitting(false);
        }
      }
      if (!isContinue) return;
      setStep(step + 1);
      // Reset form with the updated data for the next step
      form.reset(updatedData);
    } else if (onSubmit) {
      try {
        setIsSubmitting(true);
        const parsedData = schema.parse(updatedData);
        await onSubmit(parsedData);
        setIsComplete(true);
      } catch (error) {
        console.log("Error in final submit:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <Card className={cn(className, "overflow-hidden")}>
      {!isComplete && (
        <CardHeader>
          <CardTitle>{currentStep.title}</CardTitle>
          {currentStep.description && (
            <CardDescription>{currentStep.description}</CardDescription>
          )}
        </CardHeader>
      )}

      <CardContent>
        {!isComplete ? (
          <div className="space-y-6">
            {stepIndicator && stepIndicator({ step, progress })}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleNextStep)}
                className="space-y-6"
              >
                {currentStep.fields.map((stepField) => (
                  <FormField
                    key={stepField.key as string}
                    control={form.control}
                    name={stepField.key as string}
                    render={({ field: formField }) => (
                      <FormItem>
                        {stepField.label && (
                          <FormLabel>{stepField.label}</FormLabel>
                        )}
                        {stepField.render({
                          field: formField,
                          formData: formData,
                        })}
                        {stepField.description && (
                          <FormDescription>
                            {stepField.description}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={step === 0}
                    className={
                      step === 0 || currentStep.disableBackAction
                        ? "invisible"
                        : ""
                    }
                  >
                    <ArrowLeft className="mr-1 size-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !form.formState.isDirty}
                  >
                    {step === steps.length - 1 ? (
                      <>
                        {isSubmitting && (
                          <Loader2 className="mr-1 animate-spin" />
                        )}
                        {submitLabel || "Submit"}
                      </>
                    ) : (
                      <>
                        {isSubmitting && (
                          <Loader2 className="mr-1 animate-spin" />
                        )}
                        <span>Next</span> <ArrowRight className="ml-1 size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
