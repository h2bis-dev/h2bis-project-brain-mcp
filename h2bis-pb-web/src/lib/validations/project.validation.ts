import { z } from 'zod';

/**
 * Validation schema for creating a new project
 */
export const createProjectSchema = z.object({
    _id: z.string()
        .min(3, "Project ID must be at least 3 characters")
        .max(50, "Project ID must be less than 50 characters")
        .regex(/^[a-z0-9-]+$/, "ID must contain only lowercase letters, numbers, and hyphens")
        .transform(val => val.toLowerCase().trim()),

    name: z.string()
        .min(1, "Project name is required")
        .max(100, "Project name must be less than 100 characters")
        .trim(),

    description: z.string()
        .max(500, "Description must be less than 500 characters")
        .optional(),

    metadata: z.object({
        repository: z.string().optional(),
        techStack: z.array(z.string()).optional(),
        language: z.string().optional(),
        framework: z.string().optional(),
    }).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/**
 * Common tech stack options
 */
export const TECH_STACK_OPTIONS = [
    'React',
    'Next.js',
    'Node.js',
    'Express',
    'MongoDB',
    'PostgreSQL',
    'TypeScript',
    'JavaScript',
    'Python',
    'Django',
    'FastAPI',
    'Vue.js',
    'Angular',
    'Tailwind CSS',
    'Docker',
    'Kubernetes',
] as const;

/**
 * Common programming languages
 */
export const LANGUAGE_OPTIONS = [
    'TypeScript',
    'JavaScript',
    'Python',
    'Java',
    'C#',
    'Go',
    'Rust',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
] as const;

/**
 * Common frameworks
 */
export const FRAMEWORK_OPTIONS = [
    'Next.js',
    'Express',
    'NestJS',
    'Django',
    'FastAPI',
    'Spring Boot',
    'ASP.NET Core',
    'Laravel',
    'Ruby on Rails',
    'Flutter',
    'React Native',
] as const;
