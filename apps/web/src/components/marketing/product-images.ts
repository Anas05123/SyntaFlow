// Replace a source here to update every marketing use of that view.
export const productImages = {
  home: { src: '/product-screens/current/home-attention.png', alt: 'Desktop Home showing work and reviews that need attention.', ratio: '47 / 30' },
  project: { src: '/product-screens/current/project-crop.png', alt: 'Brand identity system project in the Syntaflow desktop preview.', ratio: '1.68' },
  review: { src: '/product-screens/current/review-detail-crop.png', alt: 'Review of Brand guidelines version three in Syntaflow.', ratio: '1.68' },
  delivery: { src: '/product-screens/current/delivery-crop.png', alt: 'Syntaflow delivery gate with pending approvals.', ratio: '1.68' },
} as const;

export type ProductImageName = keyof typeof productImages;
