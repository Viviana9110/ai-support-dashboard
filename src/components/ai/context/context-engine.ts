import { buildContext } from './context-builder';

export class ContextEngine {
  async create() {
    return buildContext({
      knowledge: [],
      history: [],
    });
  }
}