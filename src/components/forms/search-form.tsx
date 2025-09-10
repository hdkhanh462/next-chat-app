import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import SearchInput from "@/components/search-input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const formSchema = z.object({
  search: z.string().min(2, {
    message: "Search term must be at least 2 characters.",
  }),
});

type Props = {
  onSearch: (value: z.infer<typeof formSchema>) => void;
};

export default function SearchForm({ onSearch }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSearch)}>
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SearchInput placeholder="Type to search..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
