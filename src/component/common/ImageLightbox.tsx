import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export type ImageLightboxProps = {
  open: boolean;
  onClose: () => void;
  images: string[];
};

const ImageLightbox = ({ open, images, onClose }: ImageLightboxProps) => {
  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={images.map((src) => ({ src }))}
      styles={{
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
        },
        container: {
          maxWidth: '60vw',
          maxHeight: '70vh',
          margin: 'auto',
          borderRadius: '16px',
          overflow: 'hidden',
        },
      }}
    />
  );
};

export default ImageLightbox;
