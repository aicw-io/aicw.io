export interface OgImageOptions {
  type: 'blog' | 'guide';
  title: string;
  description?: string;
  // Blog-specific
  author?: string;
  date?: Date;
  // Guide-specific
  collection?: string;
}

// Truncate text to a maximum length with ellipsis
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Format date for display
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Get collection display name
function getCollectionLabel(collection: string): string {
  const labels: Record<string, string> = {
    'blog': 'Blog',
    'ai-search-engine': 'AI Search Engine',
    'ai-crawler-bot': 'AI Crawler Bot',
    'ai-chat-bot': 'AI Chat Bot',
  };
  return labels[collection] || collection;
}

// Blog post template
export function blogTemplate(options: OgImageOptions) {
  const title = truncate(options.title, 80);
  const description = options.description ? truncate(options.description, 140) : '';
  const author = options.author || 'AICW Team';
  const date = options.date ? formatDate(options.date) : '';

  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #4a2c6a 50%, #6b2d5c 100%)',
      },
      children: [
        // Top: Blog badge
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: '8px',
                  },
                  children: 'BLOG',
                },
              },
            ],
          },
        },
        // Middle: Title and description
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: 1,
              justifyContent: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    color: 'white',
                    fontSize: '52px',
                    fontWeight: 700,
                    lineHeight: 1.2,
                  },
                  children: title,
                },
              },
              description ? {
                type: 'div',
                props: {
                  style: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '24px',
                    lineHeight: 1.4,
                  },
                  children: description,
                },
              } : null,
            ].filter(Boolean),
          },
        },
        // Bottom: Author, date, and branding
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          color: 'white',
                          fontSize: '20px',
                          fontWeight: 700,
                        },
                        children: author,
                      },
                    },
                    date ? {
                      type: 'div',
                      props: {
                        style: {
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '18px',
                        },
                        children: date,
                      },
                    } : null,
                  ].filter(Boolean),
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 700,
                  },
                  children: 'AICW.io',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// Guide template
export function guideTemplate(options: OgImageOptions) {
  const title = truncate(options.title, 80);
  const description = options.description ? truncate(options.description, 140) : '';
  const collectionLabel = getCollectionLabel(options.collection || 'guide');

  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #4a2c6a 50%, #6b2d5c 100%)',
      },
      children: [
        // Top: Collection badge
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                  },
                  children: `${collectionLabel} Guide`,
                },
              },
            ],
          },
        },
        // Middle: Title and description
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: 1,
              justifyContent: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    color: 'white',
                    fontSize: '52px',
                    fontWeight: 700,
                    lineHeight: 1.2,
                  },
                  children: title,
                },
              },
              description ? {
                type: 'div',
                props: {
                  style: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '24px',
                    lineHeight: 1.4,
                  },
                  children: description,
                },
              } : null,
            ].filter(Boolean),
          },
        },
        // Bottom: Branding
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 700,
                  },
                  children: 'AICW.io',
                },
              },
            ],
          },
        },
      ],
    },
  };
}
