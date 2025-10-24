# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a POC (proof of concept) for rendering dynamic forms in React using TanStack Form and JSON Schema. The project demonstrates how to automatically generate form fields from JSON Schema definitions.

## Common Commands

```bash
# Development
npm run dev              # Start Vite dev server

# Build
npm run build           # Compile TypeScript and build with Vite

# Linting
npm run lint            # Run ESLint

# Preview
npm run preview         # Preview production build
```

## Architecture

### Core Concepts

The project uses a custom TanStack Form integration to dynamically render form fields based on JSON Schema definitions. The architecture centers around three key concepts:

1. **JSON Schema to Form Field Mapping**: JSON schemas are parsed and converted into form field configurations
2. **Custom Form Hook (`createFormHook`)**: TanStack Form's `createFormHook` API is used to create typed form utilities with custom field components
3. **Field Component Registry**: Field components (TextField, TextareaField) are registered in [form-base.ts](src/components/form/form-base.ts) and dynamically resolved based on schema metadata

### Key Files

- **[src/components/form/form-base.ts](src/components/form/form-base.ts)**: Exports the custom form hook (`useAppForm`, `withForm`, `withFieldGroup`) created via `createFormHook` with registered field components
- **[src/components/form/render-json-schema.tsx](src/components/form/render-json-schema.tsx)**: Core renderer that walks the JSON Schema tree and generates field configurations using `collectFieldConfigs()`
- **[src/components/form/form-utils.ts](src/components/form/form-utils.ts)**: Contains TypeScript types for JSON Schema and utilities like `createFieldProps()` to map schema properties to field props
- **[src/components/base-form.tsx](src/components/base-form.tsx)**: Wrapper component that uses `useAppForm` and `RenderJsonSchema` to create the complete form UI
- **[src/lib/schemas.ts](src/lib/schemas.ts)**: Example Zod schemas that can be converted to JSON Schema using `z.toJSONSchema()`

### JSON Schema Extensions

The project uses custom `x-*` annotations in JSON schemas to control rendering:

- `x-field-type`: Specifies which field component to use (e.g., "TextareaField" instead of default "TextField")
- `x-field-options`: Object containing additional props to pass to the field component (e.g., `{ placeholder: "..." }`)

These are defined in the Zod schema's `.meta()` method and preserved when converted to JSON Schema.

### Field Collection Algorithm

The `collectFieldConfigs()` function in [render-json-schema.tsx](src/components/form/render-json-schema.tsx:33-73) recursively walks the JSON Schema:

1. Checks for `x-field-type` annotation - if present, creates a field config immediately
2. For `type: "object"`, recursively processes each property, building nested field names with dot notation
3. For `type: "string"`, defaults to TextField component
4. Returns flattened array of field configurations

### Adding New Field Components

To add a new field component:

1. Create the component in `src/components/fields/` implementing the `IFieldProps` interface
2. Register it in the `fieldComponents` object in [form-base.ts](src/components/form/form-base.ts:9-12)
3. Reference it via `x-field-type` in your JSON Schema or let it be selected automatically based on schema type

### Project Structure

- `src/components/fields/`: Custom field components (TextField, TextareaField)
- `src/components/form/`: Form rendering logic and TanStack Form integration
- `src/components/ui/`: Radix UI-based UI components (shadcn/ui style)
- `src/lib/`: Utility functions and example schemas
- `src/App.tsx`: Main playground with Monaco editor for live schema editing

### Playground Features

The app includes a three-panel playground:

1. **Schema Panel**: Monaco editor to edit JSON Schema in real-time
2. **Form Preview**: Live-rendered form based on the schema
3. **Form State Panel**: JSON view of current form values

The playground uses Zod's `z.toJSONSchema()` to convert Zod schemas to JSON Schema format.

## TypeScript Configuration

The project uses path aliases: `@/*` maps to `./src/*` (configured in [tsconfig.json](tsconfig.json) and [vite.config.ts](vite.config.ts)).
