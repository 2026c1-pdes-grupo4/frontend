/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies make the module graph hard to reason about.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'views-must-go-through-controllers',
      severity: 'error',
      comment: 'Views must fetch data via controllers/*, not services/* directly.',
      from: { path: '^src/views' },
      to: { path: '^src/services' },
    },
    {
      name: 'components-stay-presentational',
      severity: 'error',
      comment: 'Components must not depend on services, views or controllers.',
      from: { path: '^src/components' },
      to: { path: '^src/(services|views|controllers)' },
    },
    {
      name: 'services-no-upward-deps',
      severity: 'error',
      comment: 'Services must not depend on controllers, views, components or context.',
      from: { path: '^src/services' },
      to: { path: '^src/(controllers|views|components|context)' },
    },
    {
      name: 'models-are-leaf',
      severity: 'error',
      comment: 'Models must be pure data/types, not depend on any other layer.',
      from: { path: '^src/models' },
      to: { path: '^src/(controllers|views|components|context|services)' },
    },
  ],
  options: {
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.app.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
  },
}
