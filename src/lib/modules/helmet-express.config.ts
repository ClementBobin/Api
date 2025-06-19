import helmet from 'helmet';

export const configureHelmet = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': ['\'self\'', 'https://cdn.jsdelivr.net'],
      },
    },
  });
};