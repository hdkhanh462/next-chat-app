"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HiPhoto } from "react-icons/hi2";
import { HiPaperAirplane } from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  message: z.string().min(1, {
    message: "Message must be at least 1 character.",
  }),
});

export default function ConversationFooter() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="border-t p-4 flex items-center gap-2 w-full">
      <Button type="button" variant="ghost" size="icon">
        <HiPhoto className="size-6" />
      </Button>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full gap-2"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="sr-only">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here"
                    className="resize-none min-h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" className="rounded-full">
            <HiPaperAirplane className="size-5" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
