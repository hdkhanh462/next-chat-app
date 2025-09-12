"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import SearchInput from "@/components/search-input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import React from "react";

const formSchema = z.object({
  search: z.string().min(2, {
    message: "Search term must be at least 2 characters.",
  }),
});

export type SearchFormInput = z.infer<typeof formSchema>;

type Props = React.ComponentProps<"input"> & {
  onSearch: (value: SearchFormInput) => void;
};

export default function SearchForm({
  onSearch,
  placeholder = "Type to search...",
  ...props
}: Props) {
  const form = useForm<SearchFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSearch)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            form.handleSubmit(onSearch)();
          }
        }}
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SearchInput placeholder={placeholder} {...props} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
