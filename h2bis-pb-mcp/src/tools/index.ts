import { projectTools } from '../modules/project/index.js';
import { useCaseTools } from '../modules/use-case/index.js';
import { authTools } from '../modules/auth/index.js';

export const tools = [
    ...projectTools,
    ...useCaseTools,
    ...authTools,
];

