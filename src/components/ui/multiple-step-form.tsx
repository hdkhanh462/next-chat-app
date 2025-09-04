/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { ReactNode, useState } from "react";
import {
  ControllerRenderProps,
  useForm,
  type FieldValues,
} from "react-hook-form";
import { ZodType } from "zod";

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

export interface StepField<TSchema extends FieldValues = any> {
  // render: (options: {
  //   control: UseFormReturn<TSchema>["control"];
  // }) => ReactNode;
  key: keyof TSchema;
  label: string;
  description?: string;
  render: (options: { field: ControllerRenderProps<TSchema> }) => ReactNode;
}

export interface StepConfig<TSchema extends FieldValues = any> {
  title: string;
  description?: string;
  fields: StepField<TSchema>[];
  schema: ZodType<TSchema, any>;
}

export type MultipleStepFormProps<TSchema> = {
  steps: StepConfig[];
  schema: ZodType<TSchema, any>;
  className?: string;
  initialValues: Partial<TSchema>;
  onSubmit?: (data: TSchema) => void;
  stepIndicator?: (props: { step: number; progress: number }) => ReactNode;
};

export function MultipleStepForm<TSchema>({
  steps,
  className,
  schema,
  initialValues,
  onSubmit,
  stepIndicator,
}: MultipleStepFormProps<TSchema>) {
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialValues);

  // Use react-hook-form for the current step
  const currentStep = steps[step];
  const currentSchema = currentStep.schema;
  const form = useForm<any>({
    resolver: zodResolver(currentSchema),
    defaultValues: formData,
  });

  const progress = ((step + 1) / steps.length) * 100;

  const handleNextStep = (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    if (step < steps.length - 1) {
      setStep(step + 1);
      // Reset form with the updated data for the next step
      form.reset(updatedData);
    } else {
      // Final step submission
      setIsSubmitting(true);
      setTimeout(() => {
        if (onSubmit) {
          const parsed = schema.safeParse(updatedData);
          if (!parsed.success) {
            // Handle final validation errors if needed
            console.log("Final validation errors:", parsed.error.message);
            setIsSubmitting(false);
            return;
          }

          onSubmit(parsed.data);
        }
        setIsComplete(true);
        setIsSubmitting(false);
      }, 1500);
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
                className="space-y-4"
              >
                {currentStep.fields.map((stepField) => (
                  <FormField
                    key={stepField.key as string}
                    control={form.control}
                    name={stepField.key as string}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{stepField.label}</FormLabel>
                        {stepField.render({
                          field: formField,
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
                    className={step === 0 ? "invisible" : ""}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {step === steps.length - 1 ? (
                      isSubmitting ? (
                        "Submitting..."
                      ) : (
                        "Submit"
                      )
                    ) : (
                      <>
                        <span>Next</span>{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-primary/10 inline-flex h-16 w-16 items-center justify-center rounded-full">
              <CheckCircle2 className="text-primary h-8 w-8" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Form Submitted!</h2>
            <p className="text-muted-foreground">
              Thank you for completing the form. We&apos;ll be in touch soon.
            </p>
            <Button
              onClick={() => {
                setStep(0);
                setIsComplete(false);
                setIsSubmitting(false);
                setFormData(initialValues);
                form.reset(initialValues);
              }}
            >
              Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
