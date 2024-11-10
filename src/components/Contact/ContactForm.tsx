"use client";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

type FormValues = z.infer<typeof formSchema>;

const REASONS = [
  "General Information",
  "Contact Information",
  "Sponsorship, partnership or collaboration",
] as const;

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please let us know how to address you." })
    .max(50),
  email: z
    .string()
    .min(1, { message: "Your email is required to send our reply." })
    .email("This is not a valid email."),
  reason: z.enum(REASONS),
  message: z
    .string()
    .min(1, {
      message: "Could you tell us more about what your inquiry is about?",
    })
    .max(500),
});

export function ContactForm() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      reason: undefined,
    },
  });

  async function onSubmit(values: FormValues) {
    console.log("emailForm values", values);
    toast({
      title: "Your email as been sent!",
      description: new Date().toUTCString(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="max-w-md">
          <h3 className="font-medium">
            Please tell us more about yourself and how we can help you by
            filling out the form below
          </h3>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your name?</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Jimmy Choo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your email?</FormLabel>
              <FormControl>
                <Input type="text" placeholder="example@yahpa.org" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What can we help you with?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>I have a request for:</SelectLabel>
                    {REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Can you tells us more about your inquiry?</FormLabel>
              <FormDescription>
                The content of your message can be up to 500 characters.
              </FormDescription>
              <FormControl>
                <Textarea placeholder="Type your message here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={!form.formState.isDirty}>
            Send Message
          </Button>
        </div>
      </form>
    </Form>
  );
}
