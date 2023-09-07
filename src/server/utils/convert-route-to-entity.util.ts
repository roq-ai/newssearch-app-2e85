const mapping: Record<string, string> = {
  companies: 'company',
  'educational-resources': 'educational_resource',
  'fact-checks': 'fact_check',
  feedbacks: 'feedback',
  searches: 'search',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
