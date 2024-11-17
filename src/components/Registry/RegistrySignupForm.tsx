"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { MultiSelect } from "../ui/multi-select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useToast } from "../ui/use-toast";

type FormValues = z.infer<typeof formSchema>;

const STATUSES = ["Studying", "Seeking Employment", "Employed"] as const;
const SECTORS = [
  { label: "Private", value: "private" },
  { label: "Public", value: "public" },
] as const;
const CONTACT_METHODS = ["email", "phone"] as const;

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
  { label: "简体中文", value: "zh" },
  { label: "Tiếng Việt", value: "vn" },
  { label: "ᜆᜄᜎᜓᜄ᜔", value: "tl" },
  { label: "ភាសាខ្មែរ", value: "km" },
  { label: "日本語", value: "ja" },
  { label: "한국어", value: "ko" },
  { label: "Other", value: "other" },
];

const PROFESSIONS = [
  { label: "Acupuncturist", value: "acupuncturist" },
  { label: "Anesthesiologist", value: "anesthesiologist" },
  { label: "Audiologist", value: "audiologist" },
  { label: "Chiropractor", value: "chiropractor" },
  { label: "Clinical Psychologist", value: "clinical_psychologist" },
  { label: "Dentist", value: "dentist" },
  { label: "Dermatologist", value: "dermatologist" },
  { label: "Dietitian", value: "dietitian" },
  {
    label: "Emergency Medicine Physician",
    value: "emergency_medicine_physician",
  },
  { label: "Endocrinologist", value: "endocrinologist" },
  { label: "Family Medicine Physician", value: "family_medicine_physician" },
  { label: "Gastroenterologist", value: "gastroenterologist" },
  { label: "General Practitioner", value: "general_practitioner" },
  { label: "Gynecologist", value: "gynecologist" },
  { label: "Hearing Specialist", value: "hearing_specialist" },
  { label: "Homeopath", value: "homeopath" },
  {
    label: "Internal Medicine Physician",
    value: "internal_medicine_physician",
  },
  { label: "Massage Therapist", value: "massage_therapist" },
  { label: "Naturopath", value: "naturopath" },
  { label: "Neurologist", value: "neurologist" },
  { label: "Nurse Practitioner", value: "nurse_practitioner" },
  { label: "Obstetrician", value: "obstetrician" },
  { label: "Occupational Therapist", value: "occupational_therapist" },
  { label: "Oncologist", value: "oncologist" },
  { label: "Ophthalmologist", value: "ophthalmologist" },
  { label: "Optometrist", value: "optometrist" },
  { label: "Orthopedic Surgeon", value: "orthopedic_surgeon" },
  { label: "Osteopath", value: "osteopath" },
  { label: "Pain Management Specialist", value: "pain_management_specialist" },
  { label: "Pediatrician", value: "pediatrician" },
  { label: "Podiatrist", value: "podiatrist" },
  { label: "Plastic Surgeon", value: "plastic_surgeon" },
  { label: "Podiatric Surgeon", value: "podiatric_surgeon" },
  { label: "Psychiatrist", value: "psychiatrist" },
  { label: "Psychologist", value: "psychologist" },
  { label: "Pulmonologist", value: "pulmonologist" },
  { label: "Radiologist", value: "radiologist" },
  {
    label: "Reproductive Endocrinologist",
    value: "reproductive_endocrinologist",
  },
  { label: "Rheumatologist", value: "rheumatologist" },
  { label: "Sleep Specialist", value: "sleep_specialist" },
  {
    label: "Speech-Language Pathologist",
    value: "speech_language_pathologist",
  },
  { label: "Sports Medicine Physician", value: "sports_medicine_physician" },
  { label: "Surgical Specialist", value: "surgical_specialist" },
  { label: "Urologist", value: "urologist" },
  { label: "Vascular Surgeon", value: "vascular_surgeon" },
  { label: "Wound Care Specialist", value: "wound_care_specialist" },
  { label: "Wellness Coach", value: "wellness_coach" },
  { label: "Yoga Therapist", value: "yoga_therapist" },
  { label: "Orthodontist", value: "orthodontist" },
  { label: "Palliative Care Specialist", value: "palliative_care_specialist" },
  { label: "Chronic Pain Specialist", value: "chronic_pain_specialist" },
  { label: "Biofeedback Specialist", value: "biofeedback_specialist" },
  { label: "Nutritionist", value: "nutritionist" },
  { label: "Other (please specify)", value: "other" },
] as const;

const formSchema = z.object({
  // Contact info
  first_name: z
    .string()
    .min(1, { message: "Please let us know how to address you." })
    .max(50),
  last_name: z
    .string()
    .min(1, { message: "Please let us know how to address you." })
    .max(50),

  email: z
    .string()
    .min(1, { message: "Your email is required to send our reply." })
    .email("This is not a valid email."),

  //TODO: validate phone number
  primary_phone_number: z.string(),
  preferred_contact_method: z.enum(CONTACT_METHODS),
  // secondary_phone_number: z.string(),
  languages: z.array(z.string()).min(1, {
    message: "You have to select at least one language.",
  }),
  other_languages: z.string().optional(),

  // Professional info
  status: z.enum(STATUSES),
  estimated_graduation_data: z.date().optional(),
  profession: z.string({ required_error: "Please choose a profession." }),
  other_profession: z.string().optional(),
  sectors: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function RegistrySignupForm() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sectors: [],
      languages: [],
    },
  });

  const isOtherProfession = form.watch("profession") === "other";
  const isOtherLanguage = form.watch("languages")?.includes("other");
  const isStudent = form.watch("status") === "Studying";

  async function onSubmit(values: FormValues) {
    console.log("registry form values", values);
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          first_name: values.first_name,
          last_name: values.last_name,
        },
      },
    });

    toast({
      variant: error ? "destructive" : "default",
      title: error
        ? "There was an error with your registration"
        : "Registration complete!",
      description: new Date().toUTCString(),
    });
  }

  // Conditionally check if the other profession is chosen
  useEffect(() => {
    if (isOtherProfession) {
      form.register("other_profession");
    } else {
      form.unregister("other_profession");
    }
  }, [isOtherProfession, form]);

  // Conditionally check if the applicant is a student
  useEffect(() => {
    if (isStudent) {
      form.register("estimated_graduation_data");
    } else {
      form.unregister("profession");
    }
  }, [isStudent, form]);

  // Conditionally check if the applicant speaks another language not listed
  useEffect(() => {
    if (isOtherLanguage) {
      form.register("other_languages");
    }
  }, [isOtherLanguage, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onError={(e) => console.log(e)}
        className="space-y-8"
      >
        <div className="max-w-md">
          <h3 className="font-medium">
            Please tell us more about yourself and your current status by
            filling out the form below
          </h3>
        </div>

        <div>
          <h4 className="font-medium text-xl p-0 m-0">Contact Information</h4>
          <p className="text-sm">
            Please provide us with your contact information
          </p>
        </div>
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your first name?</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Jimmy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your last name?</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Choo" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormDescription>
                This will also be the email associated to your account for
                authentication.
              </FormDescription>
              <FormControl>
                <Input type="text" placeholder="example@yahpa.org" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="primary_phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(514) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferred_contact_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Contact Method</FormLabel>
              <FormDescription>
                Please let us know how you would like to be contacted.
              </FormDescription>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value}>
                  {CONTACT_METHODS.map((status) => (
                    <FormItem
                      key={status}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={status} />
                      </FormControl>
                      <FormLabel>{status}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages</FormLabel>
              <FormDescription>
                Please let us know which languages you are fluent in.
              </FormDescription>
              <FormControl>
                <MultiSelect
                  options={LANGUAGES}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select languages"
                  className="w-[350px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isOtherLanguage && (
          <FormField
            control={form.control}
            name="other_languages"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Can you tell us which languages we are missing?
                </FormDescription>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Please enter other languages that are not listed..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div>
          <h4 className="font-medium text-xl p-0 m-0">
            Professional Information
          </h4>
          <p className="text-sm">
            Tell us more about your current professional status
          </p>
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your current job status?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value}>
                  {STATUSES.map((status) => (
                    <FormItem
                      key={status}
                      className="flex items-center space-x-3 space-y-0 my-1"
                    >
                      <FormControl>
                        <RadioGroupItem value={status} />
                      </FormControl>
                      <FormLabel>{status}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isStudent && (
          <FormField
            control={form.control}
            name="estimated_graduation_data"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Estimated graduation date</FormLabel>
                <FormDescription>
                  Please let us know when you plan on graduating.
                </FormDescription>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>What is your profession?</FormLabel>
              <FormDescription>
                Please specify your current specialty or your field of study if
                applicable.
              </FormDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[350px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? PROFESSIONS.find(
                            (profession) => profession.value === field.value
                          )?.label
                        : "Select profession"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0">
                  <Command>
                    <CommandInput placeholder="Search profession..." />
                    <CommandList className="px-4">
                      <CommandEmpty>
                        Sorry, we don't have that profession on our list. Please
                        select "other" and let us know.
                      </CommandEmpty>
                      <CommandGroup>
                        {PROFESSIONS.map((profession) => (
                          <CommandItem
                            value={profession.label}
                            key={profession.value}
                            onSelect={() => {
                              form.setValue("profession", profession.value);
                            }}
                          >
                            {profession.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                profession.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {isOtherProfession && (
          <FormField
            control={form.control}
            name="other_profession"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Can you tell us more about your profession?
                </FormDescription>
                <FormControl>
                  <Input type="text" placeholder="Choo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="sectors"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Practice Area</FormLabel>
                <FormDescription>
                  Which sector are you currently practicing in? Please select
                  all that apply.
                </FormDescription>
              </div>
              {SECTORS.map((sector) => (
                <FormField
                  key={sector.value}
                  control={form.control}
                  name="sectors"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={sector.value}
                        className="flex flex-row items-start space-x-3 space-y-0 py-1"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(sector.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, sector.value])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== sector.value
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {sector.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormMessage />
        <div className="flex gap-2">
          <Button type="submit" disabled={!form.formState.isDirty}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
