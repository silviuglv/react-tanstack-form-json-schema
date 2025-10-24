import z from "zod";

export const bugReport = z
  .object({
    title: z
      .string()
      .min(5, "Bug title must be at least 5 characters.")
      .max(32, "Bug title must be at most 32 characters.")
      .meta({
        title: "Bug Title",
        examples: ["Login button not working on mobile"],
      }),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters.")
      .max(100, "Description must be at most 100 characters.")
      .meta({
        title: "Description",
        description: "Include steps to reproduce, expected behavior, and what actually happened.",
        "x-field-type": "TextareaField",
        "x-field-options": { placeholder: "I'm having an issue with the login button on mobile." },
      }),
    points: z.number().meta({
      title: "Points",
    }),
  })
  .meta({
    title: "Bug Report",
    description: "Help us improve by reporting bugs you encounter.",
  });
