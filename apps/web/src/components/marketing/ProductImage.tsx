import { m, useReducedMotion } from 'motion/react';

import { productImages, type ProductImageName } from './product-images';

export function ProductImage({ name, priority = false, animated = false }: { name: ProductImageName; priority?: boolean; animated?: boolean }) {
  const image = productImages[name];
  const reduced = useReducedMotion();
  return (
    <div className="product-image" style={{ aspectRatio: image.ratio }}>
      <m.img key={image.src} src={image.src} alt={image.alt} width={1680} height={1000}
        loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async"
        initial={animated && !reduced ? { opacity: 0, x: 24 } : false}
        animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : .4, ease: [.22, 1, .36, 1] }} />
    </div>
  );
}
