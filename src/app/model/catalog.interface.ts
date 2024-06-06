import { Section } from './section.interfaces';

export interface Catalog {
  id: string;
  sections: Section[];
  isActive?: boolean | null;
  Location?: Location | null;
}
