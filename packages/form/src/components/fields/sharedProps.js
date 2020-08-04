export const getUsageDocs = fieldTag => `### Usage

${fieldTag} is a component that's registered for you; alongside EasyForm and EasyField.
You can use it like:
- \`<${fieldTag} />\` as standalone
- \`<EasyField component="${fieldTag}" />\` inside a field (with label & sublabel)
- in an EasyForm "schema" like so: \`component: '${fieldTag}'\``
