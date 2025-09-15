"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateMessageInput,
  createMessageSchema,
} from "@/schemas/message.schema";
import { useAction } from "next-safe-action/hooks";
import { createMessageAction } from "@/actions/message.action";
import { toast } from "sonner";
import { useConversationQuery } from "@/data/conversation.client";

type Props = {
  conversationId: string;
};

export default function ConversationFooter({ conversationId }: Props) {
  const { execute, isExecuting } = useAction(createMessageAction, {
    onSuccess() {
      form.reset();
    },
    onError({ error }) {
      console.log("Create conversation error:", error);
      toast.error("Failed to send message, please try again");
    },
  });
  const form = useForm<CreateMessageInput>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      conversationId: conversationId,
      content: "",
      images: [],
    },
  });

  function onSubmit(values: CreateMessageInput) {
    console.log(values);
    execute({
      ...values,
      content: values.content.trim(),
    });
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
            name="content"
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
          <Button
            type="submit"
            size="icon"
            className="rounded-full"
            disabled={!form.formState.isDirty || isExecuting}
          >
            <HiPaperAirplane className="size-5" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
